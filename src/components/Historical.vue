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
					<span class="type">{{ item.type === 'sent' ? '发送' : '接收' }}:</span>
					<span class="message">{{ item.message }}</span>
				</li>
			</ul>
			<button class="clear-btn" @click="clearDataHistory" title="清除历史记录"></button>
		</div>
	</div>
</template>
<script lang="ts" setup>
	import type { DataHistoryItem } from '@/types';
	import { showDialog } from '@/utils/dialog';
	import { h } from 'vue';
	defineProps<{
		dataHistory: DataHistoryItem[];
	}>();
	const emit = defineEmits();

	const showDataDetail = (item: DataHistoryItem): void => {
		const dialog = showDialog({
			title: '数据详情',
			content: {
				setup() {
					return () =>
						h('div', { class: 'data-detail' }, [
							h('div', { class: 'detail-item' }, [
								h('span', { class: 'detail-label' }, '类型:'),
								h('span', { class: 'detail-value' }, item.type === 'sent' ? '发送' : '接收'),
							]),
							h('div', { class: 'detail-item' }, [
								h('span', { class: 'detail-label' }, '时间:'),
								h('span', { class: 'detail-value' }, item.timestamp),
							]),
							h('div', { class: 'detail-item' }, [
								h('span', { class: 'detail-label' }, '数据:'),
								h('span', { class: 'detail-value' }, item.message),
							]),
							h('div', { class: 'detail-item' }, [
								h('span', { class: 'detail-label' }, '解释:'),
								h(
									'span',
									{ class: 'detail-value' },
									parseDataFrame(item.message, item.type === 'sent')
								),
							]),
						]);
				},
			},
			footer: {
				setup() {
					return () =>
						h(
							'button',
							{
								onClick: () => dialog.close(),
							},
							'关闭'
						);
				},
			},
		});
	};
	function parseDataFrame(hexString: string, isSend: boolean): string {
		try {
			const data = new Uint8Array(hexString.split(' ').map((byte) => parseInt(byte, 16)));

			// // 解析发送的数据
			// const sendExplanations: Record<number, string> = {
			// 	[FunctionType.VREF]: `设置电压: ${frameData.Value * ADC_V} V`,
			// 	[FunctionType.IREF]: `设置电流: ${frameData.Value * ADC_I} A`,
			// 	[FunctionType.EN]: `${frameData.Value === 1 ? '开机' : '关机'}`,
			// 	[FunctionType.OUT_MODE]: `设置模式: ${frameData.Value === 0 ? 'CV' : 'CC'}`,
			// };
			// // 解析接收的数据
			// const receiveExplanations: Record<number, string> = {
			// 	[ReportType.VIN]: `输入电压: ${frameData.Value * REALITY_V} V`,
			// 	[ReportType.IIN]: `输入电流: ${frameData.Value * REALITY_I} A`,
			// 	[ReportType.VOUT]: `输出电压: ${frameData.Value * REALITY_V} V`,
			// 	[ReportType.IOUT]: `输出电流: ${frameData.Value * REALITY_I} A`,
			// 	[ReportType.RUN_ERROR_TYPE]: `错误类型: ${getErrorTypeDescription(frameData.Value)}`,
			// 	[ReportType.RUN_MODE]: `运行模式: ${getRunModeDescription(frameData.Value)}`,
			// 	[ReportType.OUT_MODE]: `输出模式: ${getOutModeDescription(frameData.Value)}`,
			// };
			// if (isSend) {
			// 	return sendExplanations[frameData.FunctionCode];
			// } else {
			// 	return receiveExplanations[frameData.FunctionCode];
			// }
			return '';
		} catch (error) {
			console.error('解析数据帧错误:', error);
			return '数据解析错误';
		}
	}
	const clearDataHistory = (): void => {
		emit('clearDataHistoryEvent');
	};
</script>
