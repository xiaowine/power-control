<template>
	<div class="section target-settings">
		<h3>目标设定</h3>
		<div class="target-controls">
			<div class="target-group">
				<div class="target-card" @click="showSettingDialog('voltage')">
					<div class="target-value">{{ targetVoltage }}V</div>
					<div class="target-label">设置电压</div>
				</div>

				<div class="target-card" @click="showSettingDialog('current')">
					<div class="target-value">{{ targetCurrent }}A</div>
					<div class="target-label">设置电流</div>
				</div>
			</div>

			<div class="control-group">
				<div class="power-controls">
					<button class="power-btn" :class="{ active: false }" @click="powerOn">
						<img src="@/assets/power.svg" alt="power" class="power-icon" />
						开机
					</button>
					<button class="power-btn off" @click="powerOff">关机</button>
				</div>
				<div class="mode-controls">
					<button :class="{ active: !runMode }" @click="toggleMode(0)">CV</button>
					<button :class="{ active: runMode }" @click="toggleMode(1)">CC</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
	import { showDialog } from '@/utils/dialog';
	import { h, ref } from 'vue';

	const targetVoltage = ref<number>(20.0);
	const targetCurrent = ref<number>(4.0);
	const props = defineProps<{
		runMode: number;
	}>();

	const toggleMode = (newMode: number): void => {
		if (props.runMode !== newMode) {
			// deviceStatus.value.sendData(FunctionType.OUT_MODE, newMode === 'CV' ? 0 : 1, '模式');
		}
	};
	const powerOn = (): void => {
		// deviceStatus.value.sendData(FunctionType.EN, 1, '开机');
	};
	const powerOff = (): void => {
		// deviceStatus.value.sendData(FunctionType.EN, 0, '关机');
	};
	const showSettingDialog = (type: 'voltage' | 'current') => {
		const isVoltage = type === 'voltage';
		const tempValue = ref(isVoltage ? targetVoltage.value : targetCurrent.value);
		const maxValue = isVoltage ? 80 : 5;
		const unit = isVoltage ? 'V' : 'A';

		const dialog = showDialog({
			title: `设置${isVoltage ? '电压' : '电流'}`,
			content: {
				setup() {
					return () =>
						h('div', { class: 'dialog-input-container' }, [
							h('input', {
								type: 'number',
								value: tempValue.value,
								onInput: (e: Event) => {
									const value = (e.target as HTMLInputElement).value;
									const num = parseFloat(value);
									if (num > maxValue) tempValue.value = maxValue;
									else if (num < 0) tempValue.value = 0;
									else tempValue.value = num;
								},
								class: 'dialog-input',
								placeholder: `请输入${isVoltage ? '电压' : '电流'}值`,
							}),
							h('span', { class: 'dialog-unit' }, unit),
						]);
				},
			},
			footer: {
				setup() {
					return () =>
						h('div', { class: 'dialog-footer' }, [
							h('button', { onClick: () => dialog.close(), class: 'cancel-btn' }, '取消'),
							h(
								'button',
								{
									onClick: () => {
										if (isVoltage) {
											targetVoltage.value = tempValue.value;
											// sendVoltageData();
										} else {
											targetCurrent.value = tempValue.value;
											// sendCurrentData();
										}
										dialog.close();
									},
									class: 'confirm-btn',
								},
								'确定'
							),
						]);
				},
			},
		});
	};
</script>
