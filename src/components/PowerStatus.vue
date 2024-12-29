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
						:class="['status-option', { active: workStatus === workStatusLists.indexOf(status) }]"
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
						:class="['status-option', { active: runMode === runModeLists.indexOf(mode) }]"
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
						:class="['status-option', { active: error === errorMaps.get(faultType) }]"
					>
						{{ error }}
					</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
	import { FunctionType } from '@/types';
	import { hintDialog } from '@/utils/dialog';

	const emit = defineEmits();
	const workStatusLists = ['未工作', '工作中'];
	const runModeLists = ['BUCK', 'BOOST', 'MIXED'];
	const errorMaps: Map<number, string> = new Map<number, string>([
		[1, '输入欠压'],
		[2, '输入过压'],
		[3, '输出欠压'],
		[4, '输出过压'],
		[5, '输入过流'],
		[6, '输出过流'],
		[7, '输出短路'],
		[8, '温度过高'],
		[0, '正常'],
	]);

	defineProps<{
		runMode: number;
		faultType: number;
		workStatus: number;
	}>();
	const clearError = () => {
		hintDialog('消除故障', `确定要消除故障吗？`, () => {
			emit('sendDataEvent', FunctionType.CLEAR_ERROR, 0);
		});
	};
</script>
