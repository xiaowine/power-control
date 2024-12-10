<template>
	<div class="power-control-system">
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
				<h4>输入参数</h4>
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
		<div class="section target-settings">
			<h3>目标设定</h3>
			<div>
				<label>
					<input
						type="number"
						oninput="if(value>80)value=80;if(value.length>4)value=value.slice(0,4);if(value<0)value=0"
						:value="targetVoltage"
						@input="(e) => e.target && updateTargetVoltage((e.target as HTMLInputElement).value)"
					/>
					V
				</label>
				<button @click="sendVoltageData">设定电压</button>
			</div>
			<div>
				<label>
					<input
						type="number"
						oninput="if(value>5)value=5;if(value.length>4)value=value.slice(0,4);if(value<0)value=0"
						:value="targetCurrent"
						@input="(e) => e.target && updateTargetCurrent((e.target as HTMLInputElement).value)"
					/>
					A
				</label>
				<button @click="sendCurrentData">设定电流</button>
			</div>
			<div>
				<button @click="powerOn">开机</button>
				<button @click="powerOff">关机</button>
			</div>
		</div>
		<div class="section power-status">
			<h3>电源状态</h3>
			<div class="status-tabs">
				<div class="status-tab">
					<div class="status-label">工作模式</div>
					<div class="status-options">
						<span
							v-for="mode in ['BUCK', 'BOOST', 'MIXED']"
							:key="mode"
							:class="['status-option', { active: workMode === mode }]"
						>
							{{ mode }}
						</span>
					</div>
				</div>

				<div class="status-tab">
					<div class="status-label">工作状态</div>
					<div class="status-options">
						<span
							v-for="status in ['未工作', '工作中']"
							:key="status"
							:class="['status-option', { active: workStatus === status }]"
						>
							{{ status }}
						</span>
					</div>
				</div>

				<div class="status-tab">
					<div class="status-label">输出模式</div>
					<div class="status-options">
						<span
							v-for="outputMode in ['CV', 'CC']"
							:key="outputMode"
							:class="['status-option', { active: mode === outputMode }]"
						>
							{{ outputMode }}
						</span>
					</div>
				</div>

				<div class="status-tab">
					<div class="status-label">故障类型</div>
					<div class="status-options error-options">
						<span
							v-for="error in ['正常', '断线', '过流', '过压', '过温']"
							:key="error"
							:class="['status-option', { active: faultType === error }]"
						>
							{{ error }}
						</span>
					</div>
				</div>
			</div>
		</div>
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
		<div class="section about">
			<div class="avatar-container">
				<div class="avatar-image"></div>
			</div>
			<a href="https://github.com/xiaowine" target="_blank">
				<div class="github-icon"></div>
			</a>
			<div class="author-name">xiao_wine</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted, onUnmounted, h } from 'vue';
	import { showDialog, showAlert } from './utils/dialog';
	import type { DataHistoryItem, FrameData } from './types';
	import { FunctionType, ReportType, type StatusMappings } from './types';
	import type { SerialPort } from './types/serial';

	// 状态变量
	const voltageAnimation = ref<HTMLElement>();
	const currentAnimation = ref<HTMLElement>();
	const inputVoltageAnimation = ref<HTMLElement>();
	const inputCurrentAnimation = ref<HTMLElement>();
	const device = ref<SerialPort>();
	const isConnected = ref<boolean>(false);
	const targetVoltage = ref<number>(24.0);
	const targetCurrent = ref<number>(5.0);
	const nowVoltage = ref<number>(24.0);
	const nowCurrent = ref<number>(5.0);
	const workMode = ref<'BUCK' | 'BOOST' | 'MIXED'>('BUCK');
	const workStatus = ref<'未工作' | '工作中'>('未工作');
	const mode = ref<'CV' | 'CC'>('CC');
	const faultType = ref<'正常' | '断线' | '过流' | '过压' | '过温'>('正常');
	const dataHistory = ref<DataHistoryItem[]>([]);
	const oldVoltage = ref<number>(24.0);
	const oldCurrent = ref<number>(5.0);
	const inputVoltage = ref<number>(24.0);
	const inputCurrent = ref<number>(5.0);
	const oldInputVoltage = ref<number>(24.0);
	const oldInputCurrent = ref<number>(5.0);
	const efficiency = ref<number>(0.0);
	const power = ref<number>(0.0);

	// 非响应式变量
	let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
	let buffer: number[] = [];
	let serialTimer = 0;
	let invalidDataCount = 0;
	let invalidDataTimer = 0;

	const STATUS_MAPPINGS: StatusMappings = {
		RUN_MODE: {
			BUCK: 0,
			BOOST: 1,
			MIXED: 2,
		},
		OUT_MODE: {
			CV: 0,
			CC: 1,
		},
		ERROR_TYPE: {
			OFFLINE: 0,
			OVERCURRENT: 1,
			OVERVOLTAGE: 2,
			OVERTEMP: 3,
		},
	};

	// 生命周期钩子
	onMounted(() => {});

	onUnmounted(() => {
		disconnectDevice();
	});

	// 方法
	const formatNumber = (number: number, decimals: number): string => {
		return number.toFixed(decimals).padStart(5, '0');
	};

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
			console.error('串口连接失败:', error);
			showAlert('串口打开失败，请检查设备连接');
			await disconnectDevice();
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
						serialTimer = window.setTimeout(processBuffer, 30);
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
			clearTimeout(invalidDataTimer);
			buffer = [];
		}
	};

	const processBuffer = (): void => {
		clearTimeout(serialTimer);
		serialTimer = 0;

		if (buffer.length === 6) {
			const data = new Uint8Array(buffer);
			const frame_data = dataParse(data);
			if (calculateChecksum(data) !== frame_data.CheckValue) {
				checkInvalidData();
				console.warn('校验和错误:', data);
				buffer = [];
				return;
			}

			const handlers: Record<number, () => void> = {
				[ReportType.VIN]: () => updateValue('voltage', frame_data.Value / 100, true),
				[ReportType.IIN]: () => updateValue('current', frame_data.Value / 100, true),
				[ReportType.VOUT]: () => updateValue('voltage', frame_data.Value / 100, false),
				[ReportType.IOUT]: () => updateValue('current', frame_data.Value / 100, false),
				[ReportType.RUN_ERROR_TYPE]: () => handleErrorType(frame_data.Value),
				[ReportType.RUN_MODE]: () => handleRunMode(frame_data.Value),
				[ReportType.OUT_MODE]: () => handleOutMode(frame_data.Value),
			};

			handlers[frame_data.FunctionCode]?.();
			addDataHistory(data);
		} else {
			checkInvalidData();
		}
		buffer = [];
	};

	const checkInvalidData = (): void => {
		if (invalidDataCount > 10) {
			showAlert('收到过多无效数据，已自动关闭串口');
			disconnectDevice();
			invalidDataCount = 0;
			clearTimeout(invalidDataTimer);
		} else {
			invalidDataCount++;
			clearTimeout(invalidDataTimer);
			invalidDataTimer = window.setTimeout(() => {
				if (invalidDataCount > 10) {
					showAlert('收到过多无效数据，已自动关闭串口');
					disconnectDevice();
				}
				invalidDataCount = 0;
				clearTimeout(invalidDataTimer);
			}, 60000);
		}
	};

	const dataParse = (data: Uint8Array): FrameData => {
		return {
			FunctionCode: (data[1] << 8) | data[0],
			Value: (data[3] << 8) | data[2],
			CheckValue: (data[5] << 8) | data[4],
		};
	};

	const updateValue = (type: 'voltage' | 'current', newValue: number, isInput = false): void => {
		const current = isInput
			? type === 'voltage'
				? inputVoltage.value
				: inputCurrent.value
			: type === 'voltage'
			? nowVoltage.value
			: nowCurrent.value;

		const old = isInput
			? type === 'voltage'
				? oldInputVoltage
				: oldInputCurrent
			: type === 'voltage'
			? oldVoltage
			: oldCurrent;

		if (current !== newValue) {
			old.value = current;
			if (isInput) {
				if (type === 'voltage') {
					inputVoltage.value = newValue;
				} else {
					inputCurrent.value = newValue;
				}
			} else {
				if (type === 'voltage') {
					nowVoltage.value = newValue;
				} else {
					nowCurrent.value = newValue;
				}
			}

			if (type === 'voltage' || type === 'current') {
				power.value = nowVoltage.value * nowCurrent.value;

				const inputPower = inputVoltage.value * inputCurrent.value;
				if (inputPower > 0) {
					efficiency.value = Math.min((power.value / inputPower) * 100, 100);
				}
			}

			animateValue(type, isInput);
		}
	};

	const handleErrorType = (value: number): void => {
		const errorTypes: Record<number, '正常' | '断线' | '过流' | '过压' | '过温'> = {
			[STATUS_MAPPINGS.ERROR_TYPE.OFFLINE]: '断线',
			[STATUS_MAPPINGS.ERROR_TYPE.OVERCURRENT]: '过流',
			[STATUS_MAPPINGS.ERROR_TYPE.OVERVOLTAGE]: '过压',
			[STATUS_MAPPINGS.ERROR_TYPE.OVERTEMP]: '过温',
		};
		faultType.value = errorTypes[value] ?? '正常';
	};

	const handleRunMode = (value: number): void => {
		const modes = Object.entries(STATUS_MAPPINGS.RUN_MODE).find(([_, v]) => v === value)?.[0] as
			| 'BUCK'
			| 'BOOST'
			| 'MIXED'
			| undefined;
		if (modes) workMode.value = modes;
	};

	const handleOutMode = (value: number): void => {
		const modes = Object.entries(STATUS_MAPPINGS.OUT_MODE).find(([_, v]) => v === value)?.[0] as
			| 'CV'
			| 'CC'
			| undefined;
		if (modes) mode.value = modes;
	};

	const setParameter = (type: string): void => {
		if (type === 'voltage') {
			if (nowVoltage.value !== targetVoltage.value) {
				oldVoltage.value = nowVoltage.value;
				nowVoltage.value = targetVoltage.value;
				animateValue('voltage');
			}
		} else if (type === 'current') {
			if (nowCurrent.value !== targetCurrent.value) {
				oldCurrent.value = nowCurrent.value;
				nowCurrent.value = targetCurrent.value;
				animateValue('current');
			}
		}
	};

	const powerOn = (): void => {
		workStatus.value = '工作中';
	};

	const powerOff = (): void => {
		workStatus.value = '未工作';
	};

	const clearDataHistory = (): void => {
		dataHistory.value = [];
	};

	const addDataHistory = (value: Uint8Array, type: 'sent' | 'received' = 'received'): void => {
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

	const updateTargetVoltage = (value: string): void => {
		const numValue = parseFloat(value);
		if (isNaN(numValue) || numValue < 0) {
			targetVoltage.value = 0;
		} else if (numValue > 80) {
			targetVoltage.value = 80;
		} else {
			targetVoltage.value = numValue;
		}
	};

	const updateTargetCurrent = (value: string): void => {
		const numValue = parseFloat(value);
		if (isNaN(numValue) || numValue < 0) {
			targetCurrent.value = 0;
		} else if (numValue > 5) {
			targetCurrent.value = 5;
		} else {
			targetCurrent.value = numValue;
		}
	};

	const calculateChecksum = (value: Uint8Array): number => {
		let calculatedChecksum = 0;
		for (let i = 0; i < 6 - 2; i++) {
			calculatedChecksum += value[i];
		}
		calculatedChecksum &= 0xffff;
		return calculatedChecksum;
	};

	const animateValue = (type: string, isInput = false): void => {
		const animationRef = isInput
			? type === 'voltage'
				? inputVoltageAnimation
				: inputCurrentAnimation
			: type === 'voltage'
			? voltageAnimation
			: currentAnimation;

		if (animationRef?.value) {
			animationRef.value.classList.remove('fade-in');
			void animationRef.value.offsetWidth;
			animationRef.value.classList.add('fade-in');
		}
	};

	const showDataDetail = (item: DataHistoryItem): void => {
		console.log(item.message);

		const dialog = showDialog({
			title: '数据详情',
			width: '500px',
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
								h('span', { class: 'detail-value' }, 'AAAAAAAA'),
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

	const formatValue = (type: string, value: number): string => {
		if (type === 'efficiency' || type === 'power') {
			return value.toFixed(1);
		}
		return formatNumber(value, 2);
	};

	const sendData = (type: FunctionType, value: number, label: string): void => {
		if (!device.value?.writable) {
			showAlert('请先连接设备');
			return;
		}
		const writer = device.value.writable.getWriter();
		const roundedValue = Math.round(value * 100);
		const data = new Uint8Array([
			type & 0xff,
			(type >> 8) & 0xff,
			roundedValue & 0xff,
			(roundedValue >> 8) & 0xff,
			0,
			0,
		]);
		const checksum = calculateChecksum(data);
		data[4] = checksum & 0xff;
		data[5] = (checksum >> 8) & 0xff;
		writer.write(data);
		writer.releaseLock();
		addDataHistory(data, 'sent');
		console.log(`发送${label}数据:`, value);
	};

	const sendVoltageData = (): void => {
		sendData(FunctionType.VREF, targetVoltage.value, '电压');
	};

	const sendCurrentData = (): void => {
		sendData(FunctionType.IREF, targetCurrent.value, '电流');
	};
</script>

<style>
	@import url('./css/app.css');
</style>
