<template>
	<div class="section output-section">
		<h3>输出参数</h3>
		<div class="card-grid">
			<div class="card">
				<span class="output-label">电压</span>
				<div class="value-container">
					<span class="value-display">
						{{ formatNumber(outputVoltage, 2) }}
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
						{{ formatNumber(outputCurrent, 2) }}
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
	import { ref } from 'vue';
	import { formatNumber, formatValue } from '@/utils/tools';

	const oldVoltage = ref<number>(24.0);
	const oldCurrent = ref<number>(5.0);
	const efficiency = ref<number>(0.0);
	const power = ref<number>(0.0);
	const voltageAnimation = ref<HTMLElement>();
	const currentAnimation = ref<HTMLElement>();

	const props = defineProps<{
		inputVoltage: number;
		inputCurrent: number;
		outputVoltage: number;
		outputCurrent: number;
	}>();

	const updateOutputVoltage = (newValue: number): void => {
		const old = oldVoltage;
		if (old.value !== newValue) {
			old.value = newValue;
			updatePowerAndEfficiency();
			animateValue('voltage');
		}
	};

	const updateOutputCurrent = (newValue: number): void => {
		const old = oldCurrent;
		if (old.value !== newValue) {
			old.value = newValue;
			updatePowerAndEfficiency();
			animateValue('current');
		}
	};

	const updatePowerAndEfficiency = (): void => {
		power.value = props.outputVoltage * props.outputCurrent;
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

	defineExpose({ updateOutputVoltage, updateOutputCurrent });
</script>
