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
			<div class="target-controls">
				<div class="target-group">
					<div class="target-input">
						<label>电压设定</label>
						<div class="input-with-unit">
							<input
								type="number"
								oninput="if(value>80)value=80;if(value.length>4)value=value.slice(0,4);if(value<0)value=0"
								:value="targetVoltage"
								@input="(e) => e.target && updateTargetVoltage((e.target as HTMLInputElement).value)"
							/>
							<span class="unit">V</span>
						</div>
						<button class="set-btn" @click="sendVoltageData">设定电压</button>
					</div>

					<div class="target-input">
						<label>电流设定</label>
						<div class="input-with-unit">
							<input
								type="number"
								oninput="if(value>5)value=5;if(value.length>4)value=value.slice(0,4);if(value<0)value=0"
								:value="targetCurrent"
								@input="(e) => e.target && updateTargetCurrent((e.target as HTMLInputElement).value)"
							/>
							<span class="unit">A</span>
						</div>
						<button class="set-btn" @click="sendCurrentData">设定电流</button>
					</div>
				</div>

				<div class="control-group">
					<div class="power-controls">
						<button class="power-btn" :class="{ active: workStatus === '工作中' }" @click="powerOn">
							<i class="power-icon"></i>开机
						</button>
						<button class="power-btn off" @click="powerOff">关机</button>
					</div>
					<div class="mode-controls">
						<button :class="{ active: mode === 'CV' }" @click="">CV</button>
						<button :class="{ active: mode === 'CC' }" @click="">CC</button>
					</div>
				</div>
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
	import { ref, onMounted, onUnmounted, h, type Ref } from 'vue';
	import { showDialog, showAlert } from './utils/dialog';
	import { formatNumber, calculateChecksum, dataParse, formatValue } from './utils/tools';
	import type { DataHistoryItem, StatusMappings } from './types';
	import { FunctionType, ReportType } from './types';
	import type { SerialPort } from './types/serial';

	// ===== 状态变量分组 =====
	// UI 动画相关的 refs
	const voltageAnimation = ref<HTMLElement>();
	const currentAnimation = ref<HTMLElement>();
	const inputVoltageAnimation = ref<HTMLElement>();
	const inputCurrentAnimation = ref<HTMLElement>();

	// 设备连接状态
	const device = ref<SerialPort>();
	const isConnected = ref<boolean>(false);

	// 目标值设定
	const targetVoltage = ref<number>(24.0);
	const targetCurrent = ref<number>(5.0);

	// 当前输出值
	const nowVoltage = ref<number>(24.0);
	const nowCurrent = ref<number>(5.0);
	const oldVoltage = ref<number>(24.0);
	const oldCurrent = ref<number>(5.0);

	// 输入参数
	const inputVoltage = ref<number>(24.0);
	const inputCurrent = ref<number>(5.0);
	const oldInputVoltage = ref<number>(24.0);
	const oldInputCurrent = ref<number>(5.0);

	// 计算值
	const efficiency = ref<number>(0.0);
	const power = ref<number>(0.0);

	// 工作状态
	const workMode = ref<'BUCK' | 'BOOST' | 'MIXED'>('BUCK');
	const workStatus = ref<'未工作' | '工作中'>('未工作');
	const mode = ref<'CV' | 'CC'>('CC');
	const faultType = ref<'正常' | '断线' | '过流' | '过压' | '过温'>('正常');

	// 数据历史
	const dataHistory = ref<DataHistoryItem[]>([]);

	// 串口通信相关变量
	let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
	let buffer: number[] = [];
	let serialTimer = 0;
	let invalidDataCount = 0;
	let invalidDataTimer = 0;

	// 状态映射表
	const STATUS_MAPPINGS: StatusMappings = {
		RUN_MODE: { BUCK: 0, BOOST: 1, MIXED: 2 },
		OUT_MODE: { CV: 0, CC: 1 },
		ERROR_TYPE: {
			OFFLINE: 0,
			OVERCURRENT: 1,
			OVERVOLTAGE: 2,
			OVERTEMP: 3,
		},
	};

	// ===== 生命周期钩子 =====
	onMounted(() => {});

	onUnmounted(() => {
		disconnectDevice();
	});

	// ===== 串口通信相关方法 =====
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

	// ===== 数据处理相关方法 =====
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

	// ===== 值更新和动画相关方法 =====
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

			updatePowerAndEfficiency();
			animateValue(type, isInput);
		}
	};

	const updatePowerAndEfficiency = (): void => {
		power.value = nowVoltage.value * nowCurrent.value;
		const inputPower = inputVoltage.value * inputCurrent.value;
		if (inputPower > 0) {
			efficiency.value = Math.min((power.value / inputPower) * 100, 100);
		}
	};

	// ===== 控制命令相关方法 =====
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

	// 导出控制命令
	const sendVoltageData = (): void => sendData(FunctionType.VREF, targetVoltage.value, '电压');
	const sendCurrentData = (): void => sendData(FunctionType.IREF, targetCurrent.value, '电流');
	const powerOn = (): void => sendData(FunctionType.EN, 1, '开机');
	const powerOff = (): void => sendData(FunctionType.EN, 0, '关机');

	// ===== 其余代码保持不变 =====
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

	function getErrorTypeDescription(value: number): '正常' | '断线' | '过流' | '过压' | '过温' {
		const errorTypes: Record<number, '正常' | '断线' | '过流' | '过压' | '过温'> = {
			[STATUS_MAPPINGS.ERROR_TYPE.OFFLINE]: '断线',
			[STATUS_MAPPINGS.ERROR_TYPE.OVERCURRENT]: '过流',
			[STATUS_MAPPINGS.ERROR_TYPE.OVERVOLTAGE]: '过压',
			[STATUS_MAPPINGS.ERROR_TYPE.OVERTEMP]: '过温',
		};
		return errorTypes[value] ?? '正常';
	}

	const handleErrorType = (value: number): void => {
		faultType.value = getErrorTypeDescription(value);
	};

	function getDescription(
		value: number,
		mappings: Record<string, number>,
		defaultDescription: string
	): string {
		const mode = Object.entries(mappings).find(([_, v]) => v === value)?.[0];
		return mode ?? defaultDescription;
	}

	const handleMode = (
		value: number,
		mappings: Record<string, number>,
		modeRef: Ref<string>,
		defaultDescription: string
	): void => {
		const mode = Object.entries(mappings).find(([_, v]) => v === value)?.[0];
		modeRef.value = mode || defaultDescription;
	};

	const handleRunMode = (value: number): void => {
		handleMode(value, STATUS_MAPPINGS.RUN_MODE, workMode, '未知运行模��');
	};

	const handleOutMode = (value: number): void => {
		handleMode(value, STATUS_MAPPINGS.OUT_MODE, mode, '未知输出模式');
	};

	function getRunModeDescription(value: number): string {
		return getDescription(value, STATUS_MAPPINGS.RUN_MODE, '未知运行模式');
	}

	function getOutModeDescription(value: number): string {
		return getDescription(value, STATUS_MAPPINGS.OUT_MODE, '未知输出模式');
	}

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

	function parseDataFrame(hexString: string): string {
		try {
			const data = new Uint8Array(hexString.split(' ').map((byte) => parseInt(byte, 16)));
			const frameData = dataParse(data);
			const explanations: Record<number, string> = {
				[ReportType.VIN]: `输入电压: ${frameData.Value / 100} V`,
				[ReportType.IIN]: `输入电流: ${frameData.Value / 100} A`,
				[ReportType.VOUT]: `输出电压: ${frameData.Value / 100} V`,
				[ReportType.IOUT]: `输出电流: ${frameData.Value / 100} A`,
				[ReportType.RUN_ERROR_TYPE]: `错误类型: ${getErrorTypeDescription(frameData.Value)}`,
				[ReportType.RUN_MODE]: `运行模式: ${getRunModeDescription(frameData.Value)}`,
				[ReportType.OUT_MODE]: `输出模式: ${getOutModeDescription(frameData.Value)}`,
			};

			return explanations[frameData.FunctionCode] || '未知功能码';
		} catch (error) {
			console.error('解析数据帧错误:', error);
			return '数据解析错误';
		}
	}

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
								h('span', { class: 'detail-value' }, parseDataFrame(item.message)),
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
</script>

<style>
	@import url('./css/app.css');

	/* 目标设定部分的样式 */
	.target-settings {
		padding: 20px;
	}

	.target-controls {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.target-group {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 20px;
	}

	.target-input {
		display: flex;
		flex-direction: column;
		gap: 10px;
		background: var(--bg-secondary);
		padding: 15px;
		border-radius: 8px;
		border: 1px solid var(--border-color);
	}

	.target-input label {
		font-size: 0.9em;
		color: var(--text-secondary);
		margin-bottom: 0;
	}

	.input-with-unit {
		display: flex;
		align-items: center;
		gap: 8px;
		background: var(--bg-primary);
		padding: 8px;
		border-radius: 6px;
		border: 1px solid var(--border-color);
	}

	.input-with-unit input {
		flex: 1;
		border: none;
		padding: 8px;
		font-size: 1.1em;
		background: transparent;
		color: var(--text-primary);
		width: auto;
		min-width: 0;
	}

	.input-with-unit .unit {
		color: var(--text-secondary);
		font-size: 0.9em;
		padding-right: 8px;
		flex-shrink: 0;
	}

	.set-btn {
		width: 100%;
		padding: 10px;
		background: var(--primary-color);
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.3s ease;
		font-size: 1em;
	}

	.set-btn:hover {
		background: var(--primary-dark);
		transform: translateY(-1px);
	}

	.control-group {
		display: flex;
		gap: 20px;
		flex-wrap: wrap;
	}

	.power-controls,
	.mode-controls {
		display: flex;
		gap: 10px;
		flex: 1;
		min-width: 200px;
	}

	.power-btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 12px 20px;
		border-radius: 6px;
		font-weight: 500;
		min-height: 44px;
	}

	.power-btn.active {
		background: var(--success-color);
	}

	.power-btn.off {
		background: var(--danger-color);
	}

	.power-icon {
		width: 14px;
		height: 14px;
		border: 2px solid currentColor;
		border-radius: 50%;
		position: relative;
		flex-shrink: 0;
	}

	.power-icon::after {
		content: '';
		position: absolute;
		top: -5px;
		left: 4px;
		width: 2px;
		height: 8px;
		background: currentColor;
	}

	.mode-controls button {
		flex: 1;
		padding: 12px 20px;
		min-height: 44px;
	}

	.mode-controls button.active {
		background: var(--primary-dark);
	}

	/* 响应式调整 */
	@media (max-width: 768px) {
		.target-settings {
			padding: 15px;
		}

		.target-group {
			grid-template-columns: 1fr;
			gap: 15px;
		}

		.target-input {
			padding: 12px;
		}

		.input-with-unit {
			padding: 6px;
		}

		.input-with-unit input {
			font-size: 1em;
			padding: 6px;
		}

		.set-btn {
			padding: 12px 8px;
			font-size: 0.95em;
		}

		.control-group {
			gap: 12px;
		}

		.power-controls,
		.mode-controls {
			width: 100%;
			min-width: unset;
		}

		/* 优化按钮在移动端的显示 */
		.power-btn,
		.mode-controls button {
			padding: 10px 15px;
			font-size: 0.95em;
		}

		/* 确保电源图标在小屏幕上正确显示 */
		.power-icon {
			width: 12px;
			height: 12px;
		}

		.power-icon::after {
			top: -4px;
			left: 3px;
			height: 6px;
		}
	}

	/* 超小屏幕优化 */
	@media (max-width: 360px) {
		.target-settings {
			padding: 10px;
		}

		.target-controls {
			gap: 15px;
		}

		.target-input {
			padding: 10px;
		}

		.input-with-unit input {
			font-size: 0.95em;
		}

		.power-btn,
		.mode-controls button {
			padding: 8px 12px;
			font-size: 0.9em;
		}
	}

	/* 添加触摸设备的优化 */
	@media (hover: none) {
		.set-btn:hover {
			transform: none;
		}

		.set-btn:active {
			background: var(--primary-dark);
			transform: translateY(1px);
		}

		.power-btn:active,
		.mode-controls button:active {
			transform: translateY(1px);
			opacity: 0.9;
		}
	}
</style>
