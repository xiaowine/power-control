<template>
  <div class="section power-status">
    <h3>电源状态</h3>
    <div class="status-tabs">
      <div class="status-tab">
        <div class="status-label">工作状态</div>
        <div class="status-options">
          <span
            v-for="status in workStatusLists"
            :key="status"
            :class="[
              'status-option',
              { active: workStatus === workStatusLists.indexOf(status) },
            ]"
          >
            {{ status }}
          </span>
        </div>
      </div>

      <div class="status-tab">
        <div class="status-label">工作模式</div>
        <div class="status-options">
          <span
            v-for="mode in runModeLists"
            :key="mode"
            :class="[
              'status-option',
              { active: runMode === runModeLists.indexOf(mode) },
            ]"
          >
            {{ mode }}
          </span>
        </div>
      </div>

      <div class="status-tab" @click="clearError">
        <div class="status-label">故障类型</div>
        <div class="status-options error-options">
          <span
            v-for="(error, index) in Array.from(errorMaps.values())"
            :key="index"
            :class="[
              'status-option',
              { active: error === errorMaps.get(faultType) },
            ]"
          >
            {{ error }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { FunctionType } from "@/types";
import { hintDialog } from "@/utils/dialog";

const emit = defineEmits();
const workStatusLists = ["未工作", "工作中"];
const runModeLists = ["BUCK", "BOOST", "MIXED"];
const errorMaps: Map<number, string> = new Map<number, string>([
  [1, "输入欠压"],
  [2, "输入过压"],
  [3, "输出欠压"],
  [4, "输出过压"],
  [5, "输入过流"],
  [6, "输出过流"],
  [7, "输出短路"],
  [8, "温度过高"],
  [0, "正常"],
]);

defineProps<{
  runMode: number;
  faultType: number;
  workStatus: number;
}>();
const clearError = () => {
  hintDialog("消除故障", `确定要消除故障吗？`, () => {
    emit("sendDataEvent", FunctionType.CLEAR_ERROR, 0);
  });
};
</script>
<style scoped>
.output-label {
  display: block;
  font-size: 1.1em;
  color: var(--text-secondary);
  margin-bottom: 8px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 电源状态新样式 */
.status-tabs {
  display: flex;
  flex-direction: row; /* 改为横向 */
  gap: 8px;
  /* padding: 8px; */
  flex-wrap: wrap; /* 允许换行 */
}

.status-tab {
  flex: 1;
  min-width: 200px;
  background: linear-gradient(
    145deg,
    rgba(var(--bg-primary-rgb), 0.6),
    rgba(var(--bg-secondary-rgb), 0.8)
  );
  border-radius: 8px;
  transition: all 0.3s var(--animate-timing);
  padding: 14px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  backdrop-filter: blur(8px);
}

.status-tab:hover {
  background: linear-gradient(
    145deg,
    rgba(var(--bg-primary-rgb), 0.7),
    rgba(var(--bg-secondary-rgb), 0.9)
  );
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.status-label {
  font-size: 0.9em;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-options {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.status-option {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85em;
  background: var(--bg-primary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  transition: all 0.2s var(--animate-timing);
  cursor: default;
  flex: 1; /* 让选项平均分配间 */
  text-align: center;
  min-width: 50px; /* 设置最小宽度 */
}

.status-option.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(var(--primary-color-rgb), 0.2);
}

/* 错误状态特殊样式 */
.error-options .status-option.active {
  background: var(--error-color);
  border-color: var(--error-color);
  box-shadow: 0 2px 4px rgba(var(--error-color-rgb), 0.2);
}

.error-options .status-option:last-child.active {
  background: var(--success-color);
  border-color: var(--success-color);
  box-shadow: 0 2px 4px rgba(var(--success-color-rgb), 0.2);
}

/* 电源状态样式 */
.power-status > div {
  margin: 0 auto;
  text-align: left;
  min-height: 100px; /* 给一个合适的最小高度 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 1em;
  transition: color 0.3s var(--animate-timing);
}
</style>
