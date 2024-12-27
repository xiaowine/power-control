<template>
	<div class="section output-section">
		<h3>输出参数</h3>
		<div class="card-grid">
			<div class="card">
				<span class="output-label">电压</span>
				<div class="value-container">
					<span class="value-display">
						{{ formatNumber(nowVoltage, 2) }}
						<small>V</small>
					</span>
					<span class="value-display value-animation" ref="voltageAnimation">
						{{ formatNumber(oldVoltage, 2) }}
						<small>V</small>
					</span>
				</div>
			</div>
			<div class="card">
				<span class="output-label">电流</span>
				<div class="value-container">
					<span class="value-display">
						{{ formatNumber(nowCurrent, 2) }}
						<small>A</small>
					</span>
					<span class="value-display value-animation" ref="currentAnimation">
						{{ formatNumber(oldCurrent, 2) }}
						<small>A</small>
					</span>
				</div>
			</div>
			<div class="card">
				<span class="output-label">效率</span>
				<div class="value-container">
					<span class="value-display">
						{{ formatValue('efficiency', efficiency) }}
						<small>%</small>
					</span>
				</div>
			</div>
			<div class="card">
				<span class="output-label">功耗</span>
				<div class="value-container">
					<span class="value-display">
						{{ formatValue('power', power) }}
						<small>W</small>
					</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
	import { ref, inject, Ref } from 'vue';
	import { formatNumber, formatValue } from '@/utils/tools';

	// const inputVoltage = inject<Ref<number>>('inputVoltage');
	// const inputCurrent = inject<Ref<number>>('inputCurrent');
	const nowVoltage = ref<number>(24.0);
	const nowCurrent = ref<number>(5.0);
	const oldVoltage = ref<number>(24.0);
	const oldCurrent = ref<number>(5.0);
	const efficiency = ref<number>(0.0);
	const power = ref<number>(0.0);
	const voltageAnimation = ref<HTMLElement>();
	const currentAnimation = ref<HTMLElement>();
	const props = defineProps<{
		inputVoltage: number;
		inputCurrent: number;
	}>();

	const updateVoltage = (newValue: number): void => {
		const current = nowVoltage.value;
		const old = oldVoltage;
		if (current !== newValue) {
			old.value = current;
			nowVoltage.value = newValue;
			updatePowerAndEfficiency();
			animateValue('voltage');
		}
	};

	const updateCurrent = (newValue: number): void => {
		const current = nowCurrent.value;
		const old = oldCurrent;

		if (current !== newValue) {
			old.value = current;
			nowCurrent.value = newValue;
			updatePowerAndEfficiency();
			animateValue('current');
		}
	};

	const updatePowerAndEfficiency = (): void => {
		power.value = nowVoltage.value * nowCurrent.value;
		const inputPower = props.inputVoltage * props.inputCurrent;
		if (inputPower > 0) {
			efficiency.value = Math.min((power.value / inputPower) * 100, 100);
		}
	};

	const animateValue = (type: string): void => {
		const animationRef = type === 'voltage' ? voltageAnimation : currentAnimation;

		if (animationRef?.value) {
			animationRef.value.classList.remove('fade-in');
			void animationRef.value.offsetWidth;
			animationRef.value.classList.add('fade-in');
		}
	};
</script>
