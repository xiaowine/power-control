<template>
  <div class="section">
    <h3>发送/接收数据</h3>
    <div class="info-container">
      <ul class="info">
        <li
          v-for="(item, index) in dataHistory"
          :key="index"
          :class="[item.type, 'clickable']"
          @click="showDataDetail(item)"
        >
          <span class="type"
            >{{ item.type === "sent" ? "发送" : "接收" }}:</span
          >
          <span class="message">{{ item.message }}</span>
        </li>
      </ul>
      <button
        class="clear-btn"
        @click="clearDataHistory"
        title="清除历史记录"
      ></button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  ADC_I,
  ADC_V,
  FunctionType,
  REALITY_I,
  REALITY_V,
  ReportType,
  type DataHistoryItem,
} from "@/types";
import { showDialog } from "@/utils/dialog";
import { dataParse, formatNumber } from "@/utils/tools";
import { h } from "vue";
defineProps<{
  dataHistory: DataHistoryItem[];
}>();
const emit = defineEmits();

// const addDataHistory = (value: Uint8Array, type: 'sent' | 'received' = 'received') => {
// 	emit('addDataHistoryEvent', value, type);
// };

const showDataDetail = (item: DataHistoryItem): void => {
  const dialog = showDialog({
    title: "数据详情",
    content: {
      setup() {
        return () =>
          h("div", { class: "data-detail" }, [
            h("div", { class: "detail-item" }, [
              h("span", { class: "detail-label" }, "类型:"),
              h(
                "span",
                { class: "detail-value" },
                item.type === "sent" ? "发送" : "接收"
              ),
            ]),
            h("div", { class: "detail-item" }, [
              h("span", { class: "detail-label" }, "时间:"),
              h("span", { class: "detail-value" }, item.timestamp),
            ]),
            h("div", { class: "detail-item" }, [
              h("span", { class: "detail-label" }, "数据:"),
              h("span", { class: "detail-value" }, item.message),
            ]),
            h("div", { class: "detail-item" }, [
              h("span", { class: "detail-label" }, "解释:"),
              h(
                "span",
                { class: "detail-value" },
                parseDataFrame(item.message, item.type === "sent")
              ),
            ]),
          ]);
      },
    },
    footer: {
      setup() {
        return () =>
          h(
            "button",
            {
              onClick: () => dialog.close(),
            },
            "关闭"
          );
      },
    },
  });
};
function parseDataFrame(hexString: string, isSend: boolean): string {
  try {
    const data = new Uint8Array(
      hexString.split(" ").map((byte) => parseInt(byte, 16))
    );
    const frameData = dataParse(data);

    // 解析发送的数据
    const sendExplanations: Record<number, string> = {
      [FunctionType.VREF]: `设置电压: ${formatNumber(
        frameData.Value * ADC_V,
        2
      )} V`,
      [FunctionType.IREF]: `设置电流: ${formatNumber(
        frameData.Value * ADC_I,
        2
      )} A`,
      [FunctionType.EN]: `${frameData.Value ? "开机" : "关机"}`,
      [FunctionType.OUT_MODE]: `设置模式: ${frameData.Value ? "CC" : "CV"}`,
      [FunctionType.CLEAR_ERROR]: "清楚故障",
    };
    // 解析接收的数据
    const receiveExplanations: Record<number, string> = {
      [ReportType.VIN]: `输入电压: ${formatNumber(
        frameData.Value * REALITY_V,
        2
      )} V`,
      [ReportType.IIN]: `输入电流: ${formatNumber(
        frameData.Value * REALITY_I,
        2
      )} A`,
      [ReportType.VOUT]: `输出电压: ${formatNumber(
        frameData.Value * REALITY_V,
        2
      )} V`,
      [ReportType.IOUT]: `输出电流: ${formatNumber(
        frameData.Value * REALITY_I,
        2
      )} A`,
      [ReportType.RUN_ERROR_TYPE]: "错误类型: ",
      [ReportType.RUN_MODE]: `运行模式:${
        frameData.Value == 2 ? "MIX" : frameData.Value ? "BOOST" : "BUCK"
      }`,
      [ReportType.OUT_MODE]: `输出模式: ${frameData.Value ? "CC" : "CV"}`,
      [ReportType.EN]: `工作状态: ${frameData.Value ? "工作中" : "未工作"}`,
      [ReportType.TargetV]: `设定电压: ${formatNumber(
        frameData.Value * REALITY_V,
        2
      )}`,
      [ReportType.TargetI]: `设定电流: ${formatNumber(
        frameData.Value * REALITY_I,
        2
      )}`,
    };
    if (isSend) {
      return sendExplanations[frameData.FunctionCode];
    } else {
      return receiveExplanations[frameData.FunctionCode];
    }
  } catch (error) {
    console.error("解析数据帧错误:", error);
    return "数据解析错误";
  }
}
const clearDataHistory = (): void => {
  emit("clearDataHistoryEvent");
};
</script>
<style>
/* 数据详情面板 */
.data-detail {
  padding: 10px 20px 10px 10px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
  padding-left: 10px;
}

.detail-label {
  min-width: 80px;
  color: var(--text-secondary);
  font-weight: bold;
}

.detail-value {
  flex: 1;
  line-height: 1.5;
  word-break: break-all;
}

.detail-value span {
  display: block;
  color: var(--primary-color);
  font-size: 0.95em;
}

/* 数据列表容器 */
.info {
  height: 21rem;
  max-height: 21rem;
  margin: 0;
  padding: 12px 16px;
  list-style-type: none;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  background: linear-gradient(
    145deg,
    rgba(var(--bg-primary-rgb), 0.6),
    rgba(var(--bg-secondary-rgb), 0.8)
  );
  border: 1px solid var(--border-color);
  border-radius: 8px;
  backdrop-filter: blur(8px);
  box-shadow: var(--shadow-sm);
}

/* 列表项样式 */
.info li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: rgba(var(--bg-primary-rgb), 0.4);
  cursor: pointer;
  animation: slideIn 0.3s ease-out;
  transform-origin: top;
  transition: all 0.2s var(--animate-timing);
}

.info li:last-child {
  margin-bottom: 0;
}

.info li:hover {
  background: rgba(var(--bg-primary-rgb), 0.6);
  transform: translateX(4px);
  box-shadow: var(--shadow-sm);
}

/* 发送/接收标签 */
.info li .type {
  min-width: 40px;
  margin-right: 12px;
  padding: 2px 8px;
  font-size: 0.85em;
  font-weight: 500;
  text-align: center;
  border-radius: 4px;
}

.info li.sent .type {
  color: var(--success-color);
  background: rgba(var(--success-color-rgb), 0.1);
}

.info li.received .type {
  color: var(--primary-color);
  background: rgba(var(--primary-color-rgb), 0.1);
}

/* 消息内容 */
.info li .message {
  flex: 1;
  color: var(--text-primary);
  font-family: monospace;
  font-size: 1.1em;
  font-weight: 600;
  line-height: 1.4;
}

/* 清除按钮 */
.clear-btn {
  position: absolute;
  right: 30px;
  bottom: 10px;
  z-index: 10;
  width: 46px;
  height: 46px;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: all 0.3s var(--animate-timing);
}

.clear-btn:hover {
  background: var(--primary-dark);
  transform: scale(1.1) rotate(90deg);
  box-shadow: var(--shadow-lg);
}

.clear-btn:active {
  transform: scale(0.95);
}

.clear-btn::before {
  content: "×";
  font-size: 28px;
  font-weight: bold;
  line-height: 1;
}

/* 滚动条 */
.info::-webkit-scrollbar {
  width: 6px;
}

.info::-webkit-scrollbar-track {
  margin: 4px;
  background: transparent;
}

.info::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: rgba(var(--text-secondary-rgb), 0.3);
}

.info::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--text-secondary-rgb), 0.5);
}

/* 动画 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .clear-btn {
    background: var(--primary-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .clear-btn:hover {
    background: var(--primary-dark);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }
}

/* 响应式布局 */
@media (max-width: 768px) {
  .clear-btn {
    right: 16px;
    bottom: 16px;
    width: 40px;
    height: 40px;
  }

  .clear-btn::before {
    font-size: 24px;
  }
}
</style>
