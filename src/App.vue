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
		/>
		<Historical :dataHistory="dataHistory" @clearDataHistoryEvent="clearDataHistory" />
		<About />
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted, onBeforeUnmount } from 'vue';
	import { type DataHistoryItem, type FunctionType } from '@/types';
	import Device from '@/components/Device.vue';
	import Output from '@/components/Output.vue';
	import TargetSet from '@/components/TargetSet.vue';
	import PowerStatus from '@/components/PowerStatus.vue';
	import Historical from '@/components/Historical.vue';
	import About from '@/components/About.vue';
	import { calculateChecksum } from './utils/tools';

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
			addDataHistory(data, 'sent');
		}
	};

	const addDataHistory = (value: Uint8Array, type: 'sent' | 'received' = 'received') => {
		const hexValue = Array.from(value)
			.map((byte) => byte.toString(16).padStart(2, '0'))
			.join(' ');
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
	@import url('./css/app.css');
</style>
