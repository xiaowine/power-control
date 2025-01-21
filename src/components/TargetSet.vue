<template>
  <div class="section target-settings">
    <h3>目标设定</h3>
    <div class="target-controls">
      <div class="target-group">
        <div class="target-card" @click="showSettingDialog('voltage')">
          <div class="target-value">{{ formatNumber(targetVoltage, 2) }}V</div>
          <div class="target-label">设置电压</div>
        </div>

        <div class="target-card" @click="showSettingDialog('current')">
          <div class="target-value">{{ formatNumber(targetCurrent, 2) }}A</div>
          <div class="target-label">设置电流</div>
        </div>
      </div>

      <div class="control-group">
        <div class="power-controls">
          <button
            class="power-btn"
            :class="{ active: workStatus }"
            @click="toggleWorkStatus(1)"
          >
            <img src="@/assets/power.svg" alt="power" class="power-icon" />
            开机
          </button>
          <button class="power-btn off" @click="toggleWorkStatus(0)">
            关机
          </button>
        </div>
        <div class="mode-controls">
          <button :class="{ active: !outMode }" @click="toggleOutMode(0)">
            CV
          </button>
          <button :class="{ active: outMode }" @click="toggleOutMode(1)">
            CC
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ADC_I, ADC_V, FunctionType } from "@/types";
import { hintDialog, showDialog } from "@/utils/dialog";
import { formatNumber } from "@/utils/tools";
import { h, ref } from "vue";

const props = defineProps<{
  workStatus: number;
  outMode: number;
  targetVoltage: number;
  targetCurrent: number;
}>();
const emit = defineEmits();

const toggleWorkStatus = (newStatus: number): void => {
  if (!newStatus) {
    emit("sendDataEvent", FunctionType.EN, 0);
  } else {
    hintDialog(
      "电源开关",
      `确定要${newStatus ? "开启" : "关闭"}电源吗？`,
      () => {
        if (!props.workStatus || !newStatus) {
          emit("sendDataEvent", FunctionType.EN, !props.workStatus);
        }
      }
    );
  }
};

const toggleOutMode = (newMode: number): void => {
  hintDialog(
    "切换模式",
    `确定要切换到${newMode === 0 ? "CV" : "CC"}模式吗？`,
    () => {
      if (props.outMode !== newMode) {
        emit("sendDataEvent", FunctionType.OUT_MODE, props.outMode);
      }
    }
  );
};

const showSettingDialog = (type: "voltage" | "current") => {
  const isVoltage = type === "voltage";
  const tempValue = ref(isVoltage ? props.targetVoltage : props.targetCurrent);
  const value = formatNumber(tempValue.value, 2);
  const maxValue = isVoltage ? 80 : 5;
  const unit = isVoltage ? "V" : "A";
  const isChecking = ref(true);

  const dialog = showDialog({
    title: `设置${isVoltage ? "电压" : "电流"}`,
    content: {
      setup() {
        return () =>
          h("div", { class: "dialog-input-container" }, [
            h("input", {
              type: "number",
              value: value,
              class: "dialog-input",
              placeholder: `请输入${isVoltage ? "电压" : "电流"}值`,
              onInput: (e: Event) => {
                const value = (e.target as HTMLInputElement).value;
                const num = parseFloat(value);
                tempValue.value = num;
              },
            }),
            h("span", { class: "dialog-unit" }, unit),
          ]);
      },
    },
    footer: {
      setup() {
        return () =>
          h("div", { class: "dialog-footer" }, [
            h(
              "button",
              { onClick: () => dialog.close(), class: "cancel-btn" },
              "取消"
            ),
            h(
              "button",
              {
                onClick: () => {
                  if (isChecking.value) {
                    if (tempValue.value > maxValue || tempValue.value < 0) {
                      alert(`请输入有效的${isVoltage ? "电压" : "电流"}值！`);
                    } else {
                      isChecking.value = false;
                    }
                  } else {
                    if (isVoltage) {
                      emit(
                        "sendDataEvent",
                        FunctionType.VREF,
                        tempValue.value * ADC_V
                      );
                    } else {
                      emit(
                        "sendDataEvent",
                        FunctionType.IREF,
                        tempValue.value * ADC_I
                      );
                    }
                    dialog.close();
                  }
                },
                class: "confirm-btn",
              },
              isChecking.value ? "检查" : "确定"
            ),
          ]);
      },
    },
  });
};
</script>
<style scoped>
/* 目标设定部分的样式 */
.target-settings {
  padding: 20px;
}

.target-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.target-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.target-card {
  background: var(--primary-color);
  border: none;
  border-radius: var(--border-radius);
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s var(--animate-timing);
  color: white;
}

.target-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  background: var(--primary-dark);
}

.target-value {
  font-size: 2em;
  font-weight: bold;
  color: white;
  margin-bottom: 8px;
}

.target-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9em;
}

/* 对话框样式 */
.dialog-input-container {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-primary);
  border-radius: var(--border-radius);
}

.dialog-input {
  width: 100%;
  padding: 12px;
  border-radius: 4px;
  font-size: 1.2em;
  background: var(--bg-secondary);
  color: var(--text-primary);
  text-align: center;
}

/* 控制组样式 */
.control-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 电源控制按钮组 */
.power-controls {
  display: flex;
  gap: 12px;
}

.power-btn {
  flex: 1;
  padding: 12px 24px;
  border-radius: var(--border-radius);
  font-size: 1em;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  transition: all 0.3s var(--animate-timing);
}

.power-btn.active {
  background: var(--success-color);
  color: white;
  border-color: var(--success-color);
}

.power-btn.off {
  background: var(--error-color);
  color: white;
  border-color: var(--error-color);
}

.power-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* 模式控制按钮组 */
.mode-controls {
  display: flex;
  gap: 2px;
  background: var(--bg-secondary);
  padding: 4px;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

.mode-controls button {
  flex: 1;
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-weight: 500;
  transition: all 0.3s var(--animate-timing);
  border-radius: calc(var(--border-radius) - 4px);
  margin: 0;
}

.mode-controls button.active {
  background: var(--primary-color);
  color: white;
}

.mode-controls button:hover:not(.active) {
  background: rgba(var(--primary-color-rgb), 0.1);
  color: var(--primary-color);
}

.power-icon {
  width: 20px; /* 根据需要调整大小 */
  height: 20px;
  vertical-align: middle;
  margin-right: 5px;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .power-btn {
    background: rgba(var(--bg-secondary-rgb), 0.3);
  }

  .mode-controls {
    background: rgba(var(--bg-secondary-rgb), 0.3);
  }
  .power-icon {
    filter: brightness(0) invert(1); /* 将黑色图标转换为白色 */
  }
}
</style>
