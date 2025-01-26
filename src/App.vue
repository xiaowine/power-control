<template>
  <div class="power-control-system fade-in">
    <Device
      ref="device"
      :inputCurrent="inputCurrent"
      :inputVoltage="inputVoltage"
      :deviceName="deviceName"
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
      @updateDeviceName="updateDeviceName"
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
  <div id="version">{{ config.version }}</div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { type DataHistoryItem, type FunctionType } from "@/types";
import Device from "@/components/Device.vue";
import Output from "@/components/Output.vue";
import TargetSet from "@/components/TargetSet.vue";
import PowerStatus from "@/components/PowerStatus.vue";
import Historical from "@/components/Historical.vue";
import About from "@/components/About.vue";
import { calculateChecksum } from "./utils/tools";
import config from "../package.json";

const device = ref();
const output = ref();
const deviceName = ref<string>("");

const inputVoltage = ref<number>(0);
const inputCurrent = ref<number>(0);
const outputVoltage = ref<number>(0);
const outputCurrent = ref<number>(0);
const targetVoltage = ref<number>(0);
const targetCurrent = ref<number>(0);

const workStatus = ref<number>(0);
const runMode = ref<number>(0); //buck boost mix
const outMode = ref<number>(0); // cc cv
const runErrorType = ref<number>(0);
const dataHistory = ref<DataHistoryItem[]>([]);

onBeforeUnmount(() => {
  device.value.disconnectDevice();
});

const updateDeviceName = (name: string): void => {
  deviceName.value = name;
};

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
/* 重置和基础变量 */
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
  --success-dark: #1e7e34;
  --error-dark: #bd2130;
  --warning-dark: #d39e00;
  --cancel-dark: #5a6268;

  /* RGB值 */
  --success-color-rgb: 40, 167, 69;
  --error-color-rgb: 220, 53, 69;
  --warning-color-rgb: 255, 193, 7;
  --cancel-color-rgb: 108, 117, 125;

  /* 文本和背景色 */
  --text-primary: #212529;
  --text-secondary: #6c757d;
  --text-light: #adb5bd;
  --text-secondary-rgb: 108, 117, 125;
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-tertiary: #e9ecef;
  --bg-primary-rgb: 255, 255, 255;
  --bg-secondary-rgb: 248, 249, 250;

  /* 布局和动画 */
  --border-color: #dee2e6;
  --border-radius: 12px;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15);
  --container-padding: 24px;
  --grid-gap: 24px;
  --section-padding: 20px;
  --animate-duration: 0.3s;
  --transition: all 0.3s ease;
}

/* 基础样式 */
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  display: flex;
  justify-content: center;
  align-items: flex-start; /* 改为顶部对齐 */
  overflow-x: hidden;
  scroll-behavior: smooth;
}

body {
  display: flex;
  flex-direction: column;
  padding-top: 20px; /* 添加顶部间距 */
  padding-bottom: 20px; /* 添加底部间距 */
}

/* 输入控件样式 */
input[type="number"] {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  font-size: 0.95em;
  margin: 0 10px;
  transition: border-color 0.3s ease;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  -moz-appearance: textfield;
  appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"]:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* 按钮样式 */
button {
  display: inline-block;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  background-color: var(--primary-color);
  color: white;
  font-size: 1em;
  cursor: pointer;
  margin: 10px 5px;
  transition: background-color 0.3s ease, transform 0.2s ease;
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
/* 标题和文本样式 */
h3 {
  margin: 0 0 15px;
  font-size: 1.2em;
  font-weight: bold;
  color: var(--text-primary);
  padding-bottom: 8px;
}

/* 布局容器样式 */
.section {
  border-radius: 10px;
  background: var(--bg-primary);
  background: rgba(var(--bg-primary-rgb), 0.8);
  backdrop-filter: blur(10px);
  padding: var(--section-padding);
  box-shadow: var(--shadow-sm);
}

.power-control-system {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
  grid-auto-flow: dense;
  animation: fadeIn 0.5s ease-out;
}

/* 卡片样式 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

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

/* 数值显示样式 */
.value-container {
  position: relative;
  height: 2.6em;
}

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

#version {
  position: fixed; /* 改为固定定位 */
  bottom: 10px;
  right: 10px;
  font-size: 0.8em;
  color: var(--text-secondary);
  z-index: 1000; /* 添加z-index确保显示在其他内容之上 */
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  :root {
    --primary-color: #007bff;
    --primary-dark: #0056b3;
    --primary-light: #0d6efd;
    --bg-primary: #1e1e1e;
    --bg-secondary: #252525;
    --bg-tertiary: #2d2d2d;
    --bg-elevated: #333333;
    --bg-primary-rgb: 30, 30, 30;
    --bg-secondary-rgb: 37, 37, 37;
    --text-primary: #ffffff;
    --text-secondary: #a0a0a0;
    --text-light: #808080;
    --border-color: rgba(255, 255, 255, 0.1);
    --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.2);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.25);
    --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.3);
    --cancel-color: #495057;
    --cancel-dark: #343a40;
  }

  html,
  body {
    background-color: #121212;
    color: #e0e0e0;
  }

  .section {
    background-color: #2c2c2c;
    border-color: #3c3c3c;
  }

  .power-control-system {
    background-color: #1e1e1e;
    color: #e0e0e0;
  }

  input[type="number"],
  select,
  textarea {
    background-color: #3c3c3c;
    color: #e0e0e0;
    border-color: #4c4c4c;
  }

  textarea::placeholder {
    color: #adb5bd;
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
  h3 {
    color: var(--text-secondary);
  }
}

@media (max-width: 1200px) {
  .power-control-system {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .power-control-system {
    grid-template-columns: 1fr;
  }
}

/* 页面淡入动画 */
.fade-in {
  animation: fadeIn 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  animation-fill-mode: both;
  will-change: transform, opacity;
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes fadeIn {
  0% {
    transform: translate3d(0, 30px, 0) scale(0.98);
  }

  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
}
</style>
