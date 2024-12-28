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
					<button class="power-btn" :class="{ active: false }" @click="toggleWorkStatus(1)">
						<img src="@/assets/power.svg" alt="power" class="power-icon" />
						开机
					</button>
					<button class="power-btn off" @click="toggleWorkStatus(0)">关机</button>
				</div>
				<div class="mode-controls">
					<button :class="{ active: !outMode }" @click="toggleOutMode(0)">CV</button>
					<button :class="{ active: outMode }" @click="toggleOutMode(1)">CC</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
	import { ADC_I, ADC_V, FunctionType } from '@/types';
	import { showDialog } from '@/utils/dialog';
	import { formatNumber } from '@/utils/tools';
	import { h, ref } from 'vue';

	const props = defineProps<{
		workStatus: number;
		outMode: number;
		targetVoltage: number;
		targetCurrent: number;
	}>();
	const emit = defineEmits();

	const toggleWorkStatus = (newStatus: number): void => {
		if (!newStatus) {
			emit('sendDataEvent', FunctionType.EN, 0);
		} else {
			hintDialog('电源开关', `确定要${newStatus ? '开启' : '关闭'}电源吗？`, () => {
				if (!props.workStatus || !newStatus) {
					emit('sendDataEvent', FunctionType.EN, !props.workStatus);
				}
			});
		}
	};

	const toggleOutMode = (newMode: number): void => {
		hintDialog('切换模式', `确定要切换到${newMode === 0 ? 'CV' : 'CC'}模式吗？`, () => {
			if (props.outMode !== newMode) {
				emit('sendDataEvent', FunctionType.OUT_MODE, props.outMode);
			}
		});
	};

	const showSettingDialog = (type: 'voltage' | 'current') => {
		const isVoltage = type === 'voltage';
		const tempValue = ref(isVoltage ? props.targetVoltage : props.targetCurrent);
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
								value: formatNumber(tempValue.value, 2),
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
											emit('sendDataEvent', FunctionType.VREF, tempValue.value * ADC_V);
										} else {
											emit('sendDataEvent', FunctionType.IREF, tempValue.value * ADC_I);
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

	const hintDialog = (title: string, message: string, callback: () => void) => {
		const dialog = showDialog({
			title: title,
			content: {
				setup() {
					return () => h('div', { class: 'dialog-content' }, [h('p', null, message)]);
				},
			},
			footer: {
				setup() {
					return () =>
						h('div', { class: 'dialog-footer' }, [
							h(
								'button',
								{
									onClick: () => dialog.close(),
									class: 'cancel-btn',
								},
								'取消'
							),
							h(
								'button',
								{
									onClick: () => {
										callback();
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
