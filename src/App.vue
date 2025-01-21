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
  scroll-behavior: smooth;
}

body {
  display: flex;
  flex-direction: column;
}
input[type="number"] {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  font-size: 0.95em;
  margin-left: 10px;
  margin-right: 10px; /* 增加两侧间距 */
  transition: border-color 0.3s ease;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

input[type="number"]:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* 隐藏input输入数字调节大小的按钮 */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
/* 按钮样式 */
button {
  display: inline-block;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  background-color: var(--primary-color);
  font-size: 1em;
  cursor: pointer;
  margin: 10px 5px; /* 优化按钮间距 */
  transition: background-color 0.3s ease, transform 0.2s ease;
  transition: transform 0.15s var(--animate-timing),
    background-color 0.3s var(--animate-timing);
}

button:hover {
  background-color: var(--primary-dark);
  transform: scale(1.05);
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

button:active {
  transform: scale(0.95);
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

/* 添加取消按钮样式 */
.cancel-btn {
  background-color: var(--cancel-color);
  /* color: var(--bg-primary); */
}

.cancel-btn:hover {
  background-color: var(--cancel-dark);
  transform: scale(1.05);
}

.cancel-btn:active {
  transform: scale(0.95);
} /* 响应式设计 */
@media (max-width: 768px) {
  .section {
    padding: 10px; /* 缩小模块内边距 */
  }
  .power-control-system {
    grid-template-columns: 1fr; /* 小屏幕单列布局 */
    padding: 10px;
    gap: 10px; /* 减少模块间距 */
  }
  .power-control-system {
    grid-template-columns: 1fr;
  }

  .output-grid {
    grid-template-columns: 1fr;
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
} /* 响应式设计 */
@media (max-width: 768px) {
  button {
    padding: 10px 15px; /* 缩小按钮内边距 */
    font-size: 0.9em; /* 缩小按钮字体 */
  }

  input[type="number"],
  select {
    padding: 8px 10px; /* 缩小输入框内边距 */
    font-size: 0.9em; /* 缩小输入框字体 */
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  html,
  body {
    background-color: #121212; /* 背景色 */
    color: #e0e0e0; /* 字体颜色 */
  }

  h3 {
    color: #e0e0e0; /* 标题颜色 */
  }

  input[type="number"],
  select {
    background-color: #3c3c3c; /* 背景色 */
    color: #e0e0e0; /* 字体颜色 */
    border-color: #4c4c4c; /* 边框颜色 */
  }

  input[type="number"]:focus,
  select:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }

  button {
    background-color: #007bff;
    color: white;
  }

  button:hover {
    background-color: #0056b3;
  }

  .status-dot {
    background-color: red;
  }

  .status-dot.connected {
    background-color: green;
  }

  .output-parameters .value {
    color: #007bff;
  }

  .error {
    color: red;
  }

  textarea {
    background-color: #3c3c3c; /* 背景色 */
    color: #e0e0e0; /* 字体颜色 */
    border-color: #4c4c4c; /* 边框颜色 */
  }

  textarea::placeholder {
    color: #adb5bd; /* 提示文字颜色 */
  }
}

/* 重置和基础样式 */
:root {
  --animate-timing: cubic-bezier(0.4, 0, 0.2, 1);
  /* 主题色 */
  --primary-color: #007bff;
  --primary-dark: #0056b3;
  --primary-light: #e6f3ff;
  --primary-color-rgb: 0, 123, 255;

  /* 功能色 */
  --success-color: #28a745;
  --error-color: #dc3545;
  --warning-color: #ffc107;
  --cancel-color: #6c757d;

  /* 功能色的���色版本 */
  --success-dark: #1e7e34;
  --error-dark: #bd2130;
  --warning-dark: #d39e00;
  --cancel-dark: #5a6268;

  /* RGB值用于透明度计算 */
  --success-color-rgb: 40, 167, 69;
  --error-color-rgb: 220, 53, 69;
  --warning-color-rgb: 255, 193, 7;
  --cancel-color-rgb: 108, 117, 125;

  /* 文本色 */
  --text-primary: #212529;
  --text-secondary: #6c757d;
  --text-light: #adb5bd;
  --text-secondary-rgb: 108, 117, 125;

  /* 背景色 */
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-tertiary: #e9ecef;
  --bg-primary-rgb: 255, 255, 255;
  --bg-secondary-rgb: 248, 249, 250;

  /* 边框和阴影 */
  --border-color: #dee2e6;
  --border-radius: 12px;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15);

  /* 布局和动画 */
  --container-padding: 24px;
  --grid-gap: 24px;
  --section-padding: 20px;
  --animate-duration: 0.3s;
  --animate-timing: cubic-bezier(0.4, 0, 0.2, 1);
  --transition: all 0.3s ease;
}

/* 深色模式变量 - 保持主题色不变 */
@media (prefers-color-scheme: dark) {
  :root {
    /* 保持主题色不变 */
    --primary-color: #007bff;
    --primary-dark: #0056b3;
    --primary-light: #0d6efd;

    /* 调整背景色 */
    --bg-primary: #1e1e1e;
    --bg-secondary: #252525;
    --bg-tertiary: #2d2d2d;
    --bg-elevated: #333333;
    --bg-primary-rgb: 30, 30, 30;
    --bg-secondary-rgb: 37, 37, 37;

    /* 调整文本色 */
    --text-primary: #ffffff;
    --text-secondary: #a0a0a0;
    --text-light: #808080;

    /* 调整边框和阴影 */
    --border-color: rgba(255, 255, 255, 0.1);
    --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.2);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.25);
    --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .status-section .port-config {
    padding: 15px;
    flex-direction: column;
    gap: 15px;
  }

  .connection-status {
    width: 100%;
    justify-content: center;
    padding: 8px 0;
  }

  .connect-btn {
    width: 100%;
    min-width: unset; /* 移动端取消最小宽度限制 */
  }
}

/* 输出参数卡片样式 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

/* 统一过渡效果 */
.output-card,
.status-tab,
.port-config,
.info,
.status-option {
  transition: all 0.3s var(--animate-timing);
}

/* 输入参数样式 */
.input-parameters {
  margin-top: 30px;
}

.input-parameters h4 {
  font-size: 1em;
  color: var(--text-secondary);
  margin: 0 0 12px;
  font-weight: 500;
}

/* 统一卡片样式 */
.card {
  background: linear-gradient(145deg, var(--bg-primary), var(--bg-secondary));
  padding: 20px;
  border-radius: var(--border-radius);
  text-align: center;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  border: 1px solid var(--border-color);
  min-height: 100px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* 统一数值容器样式 */
.value-container {
  position: relative;
  height: 2.6em;
}

/* 统一数值显示样式 */
.value-display {
  font-size: 2.2em;
  font-weight: 700;
  color: var(--primary-color);
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 2px;
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}

.value-display small {
  font-size: 0.45em;
  font-weight: 500;
  opacity: 0.8;
  margin-left: 2px;
  color: var(--text-secondary);
}

/* 动画相关样式 */
.value-animation {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translateY(-50%);
  opacity: 0;
  pointer-events: none;
}

.value-animation.fade-in {
  animation: fadeInOut 0.4s ease-in-out forwards;
}
</style>
