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

			<div class="status-tab">
				<div class="status-label">输出模式</div>
				<div class="status-options">
					<span
						v-for="outputMode in outModeLists"
						:key="outputMode"
						:class="['status-option', { active: runMode === outModeLists.indexOf(outputMode) }]"
					>
						{{ outputMode }}
					</span>
				</div>
			</div>

			<div class="status-tab">
				<div class="status-label">故障类型</div>
				<div class="status-options error-options">
					<span
						v-for="error in errorLists"
						:key="error"
						:class="['status-option', { active: faultType === errorLists.indexOf(error) }]"
					>
						{{ error }}
					</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
	const workStatusLists = ['未工作', '工作中'];
	const runModeLists = ['BUCK', 'BOOST', 'MIXED'];
	const outModeLists = ['CV', 'CC'];
	const errorLists = [
		'正常',
		'输入欠压保护',
		'输入过压保护',
		'输出欠压保护',
		'输出过压保护',
		'输入过流保护',
		'输出过流保护',
		'输出短路保护',
		'温度过高保护',
	];
	defineProps<{
		workStatus: number;
		runMode: number;
		outMode: number;
		faultType: number;
	}>();
</script>
