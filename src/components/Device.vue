<template>
	<div class="section status-section">
		<h3>设备状态</h3>
		<div class="port-config">
			<div class="connection-status">
				<i class="status-icon" :class="{ connected: isConnected }"></i>
				<span>{{ device === undefined ? '未连接' : '已连接' }}</span>
			</div>
			<button class="connect-btn" @click="toggleConnection">
				{{ isConnected ? '断开连接' : '选择设备' }}
			</button>
		</div>
		<div class="input-parameters">
			<!-- <h4>输入参数</h4> -->
			<div class="card-grid">
				<div class="card">
					<span class="output-label">电压</span>
					<div class="value-container">
						<span class="value-display">
							{{ formatNumber(inputVoltage, 2) }}
							<small>V</small>
						</span>
						<span class="value-display value-animation" ref="inputVoltageAnimation">
							{{ formatNumber(oldInputVoltage, 2) }}
							<small>V</small>
						</span>
					</div>
				</div>
				<div class="card">
					<span class="output-label">电流</span>
					<div class="value-container">
						<span class="value-display">
							{{ formatNumber(inputCurrent, 2) }}
							<small>A</small>
						</span>
						<span class="value-display value-animation" ref="inputCurrentAnimation">
							{{ formatNumber(oldInputCurrent, 2) }}
							<small>A</small>
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { SerialPort } from '@/types/serial';

	import { ref } from 'vue';
	import { FunctionType } from '@/types';
	import { showAlert } from '@/utils/dialog';
	import { formatNumber, dataParse, calculateChecksum } from '@/utils/tools';

	// 输入参数
	const inputVoltage = ref<number>(24.0);
	const inputCurrent = ref<number>(5.0);
	const oldInputVoltage = ref<number>(24.0);
	const oldInputCurrent = ref<number>(5.0);

	// 设备连接状态
	const device = ref<SerialPort>();
	const isConnected = ref<boolean>(false);

	// 串口通信相关变量
	let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
	let buffer: number[] = [];
	let serialTimer = 0;

	const toggleConnection = async (): Promise<void> => {
		if (!('serial' in navigator)) {
			showAlert('浏览器不支持串口通信');
			return;
		}
		if (isConnected.value) {
			await disconnectDevice();
		} else {
			await connectDevice();
		}
	};

	const connectDevice = async (): Promise<void> => {
		try {
			device.value = await navigator.serial.requestPort();
			await device.value.open({ baudRate: 115200 });
			isConnected.value = true;
			startReading();
		} catch (error) {
			console.error('未选择设备或者串口连接失败:', error);
			showAlert('未选择设备或者串口连接失败');
			await disconnectDevice();
		}
	};

	const disconnectDevice = async (): Promise<void> => {
		try {
			if (reader) {
				await reader.cancel();
				reader.releaseLock();
			}
			if (device.value) {
				await device.value.close();
			}
		} catch (error) {
			console.error('断开连接错误:', error);
		} finally {
			device.value = undefined;
			isConnected.value = false;
			clearTimeout(serialTimer);
			buffer = [];
		}
	};

	const startReading = async (): Promise<void> => {
		if (!device.value?.readable) return;
		reader = device.value.readable.getReader();
		if (!reader) return;

		try {
			while (isConnected.value) {
				const { value, done } = await reader.read();
				if (done) break;

				if (value) {
					buffer.push(...Array.from(value));
					if (serialTimer === 0) {
						serialTimer = window.setTimeout(processBuffer, 50);
					}
				}
			}
		} catch (error) {
			console.error('读取数据错误:', error);
			showAlert('数据读取错误，连接已断开');
		} finally {
			reader?.releaseLock();
		}
	};

	const processBuffer = (): void => {
		clearTimeout(serialTimer);
		serialTimer = 0;

		if (buffer.length === 6) {
			const data = new Uint8Array(buffer);
			const frame_data = dataParse(data);
			if (calculateChecksum(data) !== frame_data.CheckValue) {
				console.warn('校验和错误:', data);
				buffer = [];
				return;
			}
			// console.log('sssssss');
			// console.log(frame_data.CheckValue);
			// console.log(frame_data.FunctionCode);
			// console.log(frame_data.Value);
			// 	const handlers: Record<number, () => void> = {
			// 		[ReportType.VIN]: () => updateVoltage(frame_data.Value * REALITY_V, true),
			// 		[ReportType.IIN]: () => updateCurrent(frame_data.Value * REALITY_I, true),
			// 		[ReportType.VOUT]: () => updateVoltage(frame_data.Value * REALITY_V, false),
			// 		[ReportType.IOUT]: () => updateCurrent(frame_data.Value * REALITY_I, false),
			// 		[ReportType.RUN_ERROR_TYPE]: () => handleErrorType(frame_data.Value),
			// 		[ReportType.RUN_MODE]: () => handleRunMode(frame_data.Value),
			// 		[ReportType.OUT_MODE]: () => handleOutMode(frame_data.Value),
			// 		[ReportType.EN]: () => handleEn(frame_data.Value),
			// 	};

			// 	handlers[frame_data.FunctionCode]?.();
			// 	addDataHistory(data);
		}
		buffer = [];
	};

	// ===== 控制命令相关方法 =====
	const sendData = (type: FunctionType, value: number, label: string = '未知'): void => {
		if (!device.value?.writable) {
			showAlert('请先连接设备');
			return;
		}

		const data = new Uint8Array([
			type & 0xff,
			(type >> 8) & 0xff,
			value & 0xff,
			(value >> 8) & 0xff,
			0,
			0,
		]);

		const writer = device!.value.writable.getWriter();
		const checksum = calculateChecksum(data);
		data[4] = checksum & 0xff;
		data[5] = (checksum >> 8) & 0xff;
		writer.write(data);
		writer.releaseLock();
		// addDataHistory(data, 'sent');
		console.log(`发送${label}数据:`, value);
	};

	defineExpose({ disconnectDevice, sendData });
</script>
