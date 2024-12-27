<template>
	<div class="power-control-system">
		<Device ref="device" />
		<Output :input-current="inputCurrent" :input-voltage="inputVoltage" />
		<TargetSet :run-mode="runMode" />
		<PowerStatus
			:work-status="workStatus"
			:run-mode="runMode"
			:out-mode="outMode"
			:fault-type="faultType"
		/>
		<Historical :dataHistory="dataHistory" @clearDataHistoryEvent="clearDataHistory" />
		<About />
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted, onBeforeUnmount } from 'vue';
	import type { DataHistoryItem, FunctionType } from '@/types';
	import Device from '@/components/Device.vue';
	import Output from '@/components/Output.vue';
	import TargetSet from '@/components/TargetSet.vue';
	import PowerStatus from '@/components/PowerStatus.vue';
	import Historical from '@/components/Historical.vue';
	import About from '@/components/About.vue';

	const device = ref();
	const inputVoltage = ref<number>(24.0);
	const inputCurrent = ref<number>(5.0);

	const workStatus = ref<number>(0);
	const runMode = ref<number>(0);
	const outMode = ref<number>(0);
	const faultType = ref<number>(0);
	const dataHistory = ref<DataHistoryItem[]>([]);
	const clearDataHistory = (): void => {
		dataHistory.value = [];
	};

	// ===== 生命周期钩子 =====
	onMounted(() => {});

	onBeforeUnmount(() => {
		device.value.disconnectDevice();
	});

	const sendData = (type: FunctionType, value: number) => {
		device.value.sendData(type, value);
	};
</script>

<style>
	@import url('./css/app.css');
</style>
