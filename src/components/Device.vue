<template>
  <div class="section status-section">
    <h3>设备状态</h3>
    <div class="port-config">
      <div class="connection-status">
        <i class="status-icon" :class="{ connected: isConnected }"></i>
        <span>{{ device === undefined ? "未连接" : "已连接" }}</span>
      </div>
      <button class="connect-btn" @click="toggleConnection">
        {{ isConnected ? "断开连接" : "选择设备" }}
      </button>
    </div>
    <div class="input-parameters">
      <!-- <h4>输入参数</h4> -->
      <div class="card-grid">
        <div class="card">
          <span class="output-label">电压</span>
          <div class="value-container">
            <span class="value-display">
              {{ formatNumber(inputVoltage, 2) }}
              <small>V</small>
            </span>
            <span
              class="value-display value-animation"
              ref="inputVoltageAnimation"
            >
              {{ formatNumber(oldInputVoltage, 2) }}
              <small>V</small>
            </span>
          </div>
        </div>
        <div class="card">
          <span class="output-label">电流</span>
          <div class="value-container">
            <span class="value-display">
              {{ formatNumber(inputCurrent, 2) }}
              <small>A</small>
            </span>
            <span
              class="value-display value-animation"
              ref="inputCurrentAnimation"
            >
              {{ formatNumber(oldInputCurrent, 2) }}
              <small>A</small>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SerialPort } from "@/types/serial";

import { ref } from "vue";
import { showAlert } from "@/utils/dialog";
import { formatNumber, dataParse, calculateChecksum } from "@/utils/tools";
import { REALITY_I, REALITY_V, ReportType } from "@/types";

const props = defineProps<{
  inputVoltage: number;
  inputCurrent: number;
}>();

const emit = defineEmits();

const oldInputVoltage = ref<number>(props.inputVoltage);
const oldInputCurrent = ref<number>(props.inputCurrent);

// 设备连接状态
const device = ref<SerialPort>();
const isConnected = ref<boolean>(false);

// 串口通信相关变量
let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
let buffer: number[] = [];
let serialTimer = 0;

const toggleConnection = async (): Promise<void> => {
  if (!("serial" in navigator)) {
    showAlert("浏览器不支持串口通信");
    return;
  }
  if (isConnected.value) {
    await disconnectDevice();
  } else {
    await connectDevice();
  }
};

const connectDevice = async (): Promise<void> => {
  try {
    device.value = await navigator.serial.requestPort();
    await device.value.open({ baudRate: 115200 });
    isConnected.value = true;
    startReading();
  } catch (error) {
    console.error("未选择设备或者串口连接失败:", error);
    showAlert("未选择设备或者串口连接失败");
    await disconnectDevice();
  }
};

const disconnectDevice = async (): Promise<void> => {
  try {
    if (reader) {
      await reader.cancel();
      reader.releaseLock();
    }
    if (device.value) {
      await device.value.close();
    }
  } catch (error) {
    console.error("断开连接错误:", error);
  } finally {
    device.value = undefined;
    isConnected.value = false;
    clearTimeout(serialTimer);
    serialTimer = 0;
    buffer = [];
  }
};

const startReading = async (): Promise<void> => {
  if (!device.value?.readable) return;
  reader = device.value.readable.getReader();
  if (!reader) return;

  try {
    while (isConnected.value) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        buffer.push(...Array.from(value));
        if (serialTimer === 0) {
          serialTimer = window.setTimeout(processBuffer, 50);
        }
      }
    }
  } catch (error) {
    console.error("读取数据错误:", error);
    showAlert("数据读取错误，连接已断开");
    disconnectDevice();
  } finally {
    reader?.releaseLock();
  }
};

const processBuffer = (): void => {
  clearTimeout(serialTimer);
  serialTimer = 0;

  if (buffer.length === 6) {
    const data = new Uint8Array(buffer);
    const frame_data = dataParse(data);
    if (calculateChecksum(data) !== frame_data.CheckValue) {
      console.warn("校验和错误:", data);
      buffer = [];
      return;
    }
    const newValue = frame_data.Value;
    const handlers: Record<number, () => void> = {
      [ReportType.VIN]: () => {
        emit("updateInputVoltageEvent", newValue * REALITY_V);
      },
      [ReportType.IIN]: () => {
        emit("updateInputCurrentEvent", newValue * REALITY_I);
      },
      [ReportType.VOUT]: () => {
        emit("updateOutputVoltageEvent", newValue * REALITY_V);
      },
      [ReportType.IOUT]: () => {
        emit("updateOutputCurrentEvent", newValue * REALITY_I);
      },
      [ReportType.RUN_ERROR_TYPE]: () => {
        emit("updateRunErrorTypeEvent", newValue);
      },
      [ReportType.RUN_MODE]: () => {
        emit("updateRunModeEvent", newValue);
      },
      [ReportType.OUT_MODE]: () => {
        emit("updateOutModeEvent", newValue);
      },
      [ReportType.EN]: () => {
        emit("updateEnEvent", newValue);
      },
      [ReportType.TargetV]: () => {
        emit("updateTargetVEvent", newValue * REALITY_V);
      },
      [ReportType.TargetI]: () => {
        emit("updateTargetIEvent", newValue * REALITY_I);
      },
    };

    handlers[frame_data.FunctionCode]?.();
    emit("addDataHistoryEvent", data, "received");
  }
  buffer = [];
};

// ===== 控制命令相关方法 =====
const sendData = (
  data: Uint8Array,
  value: number,
  label: string = "未知"
): boolean => {
  if (!device.value?.writable) {
    showAlert("请先连接设备");
    return false;
  }
  const writer = device!.value.writable.getWriter();
  writer.write(data);
  writer.releaseLock();
  // addDataHistory(data, 'sent');
  console.log(`发送${label}数据:`, value);
  return true;
};

defineExpose({ disconnectDevice, sendData });
</script>
<style scoped>
/* 设备状态样式优化 */
.status-section .port-config {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(145deg, var(--bg-primary), var(--bg-secondary));
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  transition: var(--transition);
  gap: 16px; /* 增加间距 */
  margin-bottom: 20px; /* 增加下边距 */
}
.connection-status {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px; /* 增加边距 */
  flex: 1; /* 允许占据 */
  min-width: 0; /* 防止内容溢出 */
  transition: background-color 0.3s var(--animate-timing);
}

.connection-status span {
  font-size: 1.1em;
  color: var(--text-primary);
  white-space: nowrap; /* 防止文字换行 */
}

/* 状态��标样式优化 */
.status-icon {
  position: relative;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--error-color);
  transition: var(--transition);
  flex-shrink: 0;
  display: inline-block;
  animation: breathe 2s infinite;
}

/* 添加连接状态样式 */
.status-icon.connected {
  background: var(--success-color);
}

.status-icon::after {
  content: "";
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  background: var(--error-color);
  opacity: 0.2;
  animation: pulse 2s ease-in-out infinite;
}

/* 连接状态的光晕效果 */
.status-icon.connected::after {
  background: var(--success-color);
}

/* 添加脉冲动画 */
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.1;
  }
  100% {
    transform: scale(1);
    opacity: 0.2;
  }
}

/* 连接按钮样式 */
.connect-btn {
  padding: 10px 20px;
  min-width: 120px; /* 增加最小宽度 */
  white-space: nowrap;
  flex-shrink: 0; /* 止 */
}
</style>
