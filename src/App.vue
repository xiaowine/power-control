<template>
  <div class="power-control-system">
    <Device
      ref="device"
      :inputCurrent="inputCurrent"
      :inputVoltage="inputVoltage"
      @updateOutputVoltageEvent="updateOutputVoltage"
      @updateOutputCurrentEvent="updateOutputCurrent"
      @updateInputVoltageEvent="updateInputVoltage"
      @updateInputCurrentEvent="updateInputCurrent"
      @addDataHistoryEvent="addDataHistory"
      @updateRunErrorTypeEvent="updateRunErrorType"
      @updateRunModeEvent="updateRunMode"
      @updateOutModeEvent="updateOutMode"
      @updateEnEvent="updateEn"
      @updateTargetVEvent="updateTargetV"
      @updateTargetIEvent="updateTargetI"
    />
    <Output
      ref="output"
      :inputCurrent="inputCurrent"
      :inputVoltage="inputVoltage"
      :outputVoltage="outputVoltage"
      :outputCurrent="outputCurrent"
    />
    <TargetSet
      :outMode="outMode"
      :workStatus="workStatus"
      @sendDataEvent="sendData"
      :targetVoltage="targetVoltage"
      :targetCurrent="targetCurrent"
    />
    <PowerStatus
      :workStatus="workStatus"
      :runMode="runMode"
      :outMode="outMode"
      :faultType="runErrorType"
      @sendDataEvent="sendData"
    />
    <Historical
      :dataHistory="dataHistory"
      @clearDataHistoryEvent="clearDataHistory"
    />
    <About />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { type DataHistoryItem, type FunctionType } from "@/types";
import Device from "@/components/Device.vue";
import Output from "@/components/Output.vue";
import TargetSet from "@/components/TargetSet.vue";
import PowerStatus from "@/components/PowerStatus.vue";
import Historical from "@/components/Historical.vue";
import About from "@/components/About.vue";
import { calculateChecksum } from "./utils/tools";

const device = ref();
const output = ref();

const inputVoltage = ref<number>(24.0);
const inputCurrent = ref<number>(5.0);
const outputVoltage = ref<number>(24.0);
const outputCurrent = ref<number>(5.0);
const targetVoltage = ref<number>(20.0);
const targetCurrent = ref<number>(4.0);

const workStatus = ref<number>(0);
const runMode = ref<number>(0); //buck boost mix
const outMode = ref<number>(0); // cc cv
const runErrorType = ref<number>(0);
const dataHistory = ref<DataHistoryItem[]>([]);

// ===== 生命周期钩子 =====
onMounted(() => {});

onBeforeUnmount(() => {
  device.value.disconnectDevice();
});
const clearDataHistory = (): void => {
  dataHistory.value = [];
};
const sendData = (type: FunctionType, value: number) => {
  const data = new Uint8Array([
    type & 0xff,
    (type >> 8) & 0xff,
    value & 0xff,
    (value >> 8) & 0xff,
    0,
    0,
  ]);

  const checksum = calculateChecksum(data);
  data[4] = checksum & 0xff;
  data[5] = (checksum >> 8) & 0xff;

  if (device.value.sendData(data, value)) {
    addDataHistory(data, "sent");
  }
};

const addDataHistory = (
  value: Uint8Array,
  type: "sent" | "received" = "received"
) => {
  const hexValue = Array.from(value)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join(" ");
  const timestamp = new Date().toLocaleString();

  if (dataHistory.value.length >= 100) {
    dataHistory.value.pop();
  }
  dataHistory.value.unshift({
    message: hexValue,
    type,
    timestamp,
  });
};

const updateOutputVoltage = (newValue: number): void => {
  outputVoltage.value = newValue;
  output.value.updateOutputVoltage(newValue);
};

const updateOutputCurrent = (newValue: number): void => {
  outputCurrent.value = newValue;
  output.value.updateOutputCurrent(newValue);
};
const updateInputVoltage = (newValue: number): void => {
  inputVoltage.value = newValue;
};
const updateInputCurrent = (newValue: number): void => {
  inputCurrent.value = newValue;
};
const updateRunErrorType = (newValue: number): void => {
  runErrorType.value = newValue;
};
const updateRunMode = (newValue: number): void => {
  runMode.value = newValue;
};
const updateOutMode = (newValue: number): void => {
  outMode.value = newValue;
};
const updateEn = (newValue: number): void => {
  workStatus.value = newValue;
};
const updateTargetV = (newValue: number): void => {
  targetVoltage.value = newValue;
};
const updateTargetI = (newValue: number): void => {
  targetCurrent.value = newValue;
};
</script>

<style>
@import url("./css/app.css");
/* 在 :root 中添加文本色的 RGB 值 */

.section {
  transition: all 0.3s var(--animate-timing);
}
/* 模块容器样式 */
.section {
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-primary);
  background: rgba(var(--bg-primary-rgb), 0.8);
  backdrop-filter: blur(10px);
  padding: var(--section-padding);
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s var(--animate-timing),
    box-shadow 0.3s var(--animate-timing);
}
.section:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
/* 响应式设计 */
@media (max-width: 768px) {
  .section {
    padding: 10px; /* 缩小模块内边距 */
  }
  .power-control-system {
    grid-template-columns: 1fr; /* 小屏幕单列布局 */
    padding: 10px;
    gap: 10px; /* 减少模块间距 */
  }
}
@media (max-width: 1200px) {
  .power-control-system {
    grid-template-columns: 1fr 1fr; /* 中等屏幕双列布局 */
  }
}
@media (min-width: 1400px) {
  .power-control-system {
    gap: 25px; /* 增加模块间距 */
  }
}
@media (prefers-color-scheme: dark) {
  .section {
    background-color: #2c2c2c; /* 背景色 */
    border-color: #3c3c3c; /* 边框颜色 */
  }
  :root {
    /* ... 其他深色模式变量 ... */
    --cancel-color: #495057;
    --cancel-dark: #343a40;
  }
  .power-control-system {
    background-color: #1e1e1e; /* 背景色 */
    color: #e0e0e0; /* 字体颜色 */
  }
}
/* 响应式布局优化 */
@media (max-width: 1440px) {
  .power-control-system {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .power-control-system {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .power-control-system {
    grid-template-columns: 1fr;
  }

  /* .section {
    padding: 16px;
  } */

  .output-grid {
    grid-template-columns: 1fr;
  }
}
.power-control-system {
  font-family: Arial, sans-serif;
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 默认三列布局 */
  gap: var(--grid-gap);
  padding: var(--container-padding);
  width: 100%;
  max-width: 1440px;
  margin: 20px auto;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  box-sizing: border-box;
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  grid-auto-flow: dense; /* 自动填充空白区域 */
  animation: fadeIn 0.5s ease-out;
}
/* 标题样式 */
h3 {
  margin: 0 0 15px;
  font-size: 1.2em;
  font-weight: bold;
  color: var(--text-primary);
  padding-bottom: 8px;
}
/* 全局样式 */
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
}

body {
  display: flex;
  flex-direction: column;
}
</style>
