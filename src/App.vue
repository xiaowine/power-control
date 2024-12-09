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
		</div>
		<div class="section output-section">
			<h3>输出参数</h3>
			<div class="output-grid">
				<div class="output-card">
					<span class="output-label">电压</span>
					<div class="output-value-container">
						<span class="output-value">
							{{ formatNumber(nowVoltage, 2) }}
							<small>V</small>
						</span>
						<span class="output-value output-value-animation" ref="voltageAnimation">
							{{ formatNumber(oldVoltage, 2) }}
							<small>V</small>
						</span>
					</div>
				</div>
				<div class="output-card">
					<span class="output-label">电流</span>
					<div class="output-value-container">
						<span class="output-value">
							{{ formatNumber(nowCurrent, 2) }}
							<small>A</small>
						</span>
						<span class="output-value output-value-animation" ref="currentAnimation">
							{{ formatNumber(oldCurrent, 2) }}
							<small>A</small>
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
						@input="updateTargetVoltage($event.target.value)"
					/>
					V
				</label>
				<button @click="setParameter('voltage')">设定电压</button>
			</div>
			<div>
				<label>
					<input
						type="number"
						oninput="if(value>5)value=5;if(value.length>4)value=value.slice(0,4);if(value<0)value=0"
						:value="targetCurrent"
						@input="updateTargetCurrent($event.target.value)"
					/>
					A
				</label>
				<button @click="setParameter('current')">设定电流</button>
			</div>
			<div>
				<button @click="powerOn">开机</button>
				<button @click="powerOff">关机</button>
			</div>
		</div>
		<div class="section power-status">
			<h3>电源状态</h3>
			<div>
				<div>工作模式: {{ workMode }}</div>
				<div>工作状态: {{ workStatus }}</div>
				<div>输出模式: {{ mode }}</div>
				<div>
					故障类型: <span class="error">{{ faultType }}</span>
				</div>
			</div>
		</div>
		<div class="section">
			<h3>发送/接收数据</h3>
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
			<button @click="clearDataHistory">清除</button>
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
		<!-- 定义底部按钮 -->
		<!-- <Dialog v-model="showCustomDialog" title="自定义弹窗">
			<p>这是一个自定义底部按钮的弹窗</p>
			<template #footer>
				<button @click="showCustomDialog = false">关闭</button>
				<button @click="handleConfirm">保存</button>
			</template>
		</Dialog> -->

		<!-- 触发按钮 -->
		<!-- <button @click="showCustomDialog = true">打开自定义弹窗</button> -->

		<!-- 数据详情弹窗 -->
		<Dialog v-model="showDataDialog" title="数据详情" width="500px" class="data-dialog">
			<div v-if="selectedData" class="data-detail">
				<div class="detail-item">
					<span class="detail-label">类型:</span>
					<span class="detail-value">{{ selectedData.type === 'sent' ? '发送' : '接收' }}</span>
				</div>
				<div class="detail-item">
					<span class="detail-label">时间:</span>
					<span class="detail-value">{{ selectedData.timestamp }}</span>
				</div>
				<div class="detail-item">
					<span class="detail-label">数据:</span>
					<span class="detail-value">{{ selectedData.message }}</span>
				</div>
				<div class="detail-item">
					<span class="detail-label">解释:</span>
					<span class="detail-value">AAAAAAAA</span>
				</div>
			</div>
			<template #footer>
				<button @click="showDataDialog = false">关闭</button>
			</template>
		</Dialog>
	</div>
</template>

<script setup>
	import { ref, onMounted, onUnmounted } from 'vue';
	import Dialog from './components/Dialog.vue';

	// 状态变量
	const selectedData = ref(null);
	const showDataDialog = ref(false);
	const device = ref();
	const isConnected = ref(false);
	const targetVoltage = ref(24.0);
	const targetCurrent = ref(5.0);
	const nowVoltage = ref(24.0);
	const nowCurrent = ref(5.0);
	const workMode = ref('BUCK');
	const workStatus = ref('未工作');
	const mode = ref('CC');
	const faultType = ref('电源掉线');
	const dataHistory = ref([]);
	const oldVoltage = ref(24.0);
	const oldCurrent = ref(5.0);
	const showCustomDialog = ref(false);

	// 非响应式变量
	let reader;
	let buffer = [];
	let serialTimer;
	let invalidDataCount = 0;
	let invalidDataTimer;
	let frame = {
		FunctionCode: 0,
		Value: 0,
		CheckValue: 0,
	};
	const FUN_TYPE = {
		EN: 0,
		VREF: 1,
		IREF: 2,
	};

	const REPORT_TYPE = {
		VOUT: 0,
		IOUT: 1,
		RUN_ERROR_TYPE: 2,
		RUN_MODE: 3,
		OUT_MODE: 4,
	};

	const RUN_MODE_TYPE = {
		BUCK: 0,
		BOOST: 1,
		MIXED: 2,
	};

	const OUT_MODE_TYPE = {
		CV: 0,
		CC: 1,
	};

	// 生命周期钩子
	onMounted(() => {});

	onUnmounted(() => {
		disconnectDevice();
	});

	// 方法
	const formatNumber = (number, decimals) => {
		return number.toFixed(decimals).padStart(5, '0');
	};

	const toggleConnection = async () => {
		if (!('serial' in navigator)) {
			alert('浏览器不支持');
			return;
		}
		if (isConnected.value) {
			await disconnectDevice();
		} else {
			await connectDevice();
		}
	};

	const connectDevice = async () => {
		try {
			device.value = await navigator.serial.requestPort();
			await device.value.open({ baudRate: 115200 });
			isConnected.value = true;
			reader = device.value.readable.getReader();
			while (isConnected.value) {
				const { value, done } = await reader.read();
				if (done) break;
				if (value) {
					buffer.push(...value);
					if (!serialTimer) {
						serialTimer = setTimeout(processBuffer, 30);
					}
				}
			}
			reader.releaseLock();
		} catch (error) {
			console.error('Failed to open serial port:', error);
			alert('串口打开失败');
			device.value = undefined;
			isConnected.value = false;
		}
	};

	const disconnectDevice = async () => {
		if (device.value) {
			if (reader) {
				await reader.cancel();
				reader.releaseLock();
			}
			await device.value.close();
		}
		isConnected.value = false;
	};

	const processBuffer = () => {
		if (buffer.length === 6) {
			let data = new Uint8Array(buffer);
			dataParse(data);
			addDataHistory(data);
		} else {
			checkInvalidData();
		}
		buffer = [];
		serialTimer = null;
	};

	const checkInvalidData = () => {
		if (invalidDataCount > 10) {
			alert('收到过多无效数据，关闭串口');
			disconnectDevice();
			invalidDataCount = 0;
			invalidDataTimer = null;
		} else {
			invalidDataCount++;
			invalidDataTimer = null;
			invalidDataTimer = setTimeout(() => {
				if (invalidDataCount > 10) {
					alert('收到过多无效数据，关闭串口');
					disconnectDevice();
				}
				invalidDataCount = 0;
				invalidDataTimer = null;
			}, 60000);
		}
	};

	const dataParse = (data) => {
		frame.FunctionCode = (data[1] << 8) | data[0];
		frame.Value = (data[3] << 8) | data[2];
		frame.CheckValue = (data[5] << 8) | data[4];
		if (calculateChecksum(data) === frame.CheckValue) {
			switch (frame.FunctionCode) {
				case REPORT_TYPE.VOUT:
					if (nowVoltage.value !== frame.Value / 100) {
						oldVoltage.value = nowVoltage.value;
						nowVoltage.value = frame.Value / 100;
						animateValue('voltage');
					}
					break;
				case REPORT_TYPE.IOUT:
					if (nowCurrent.value !== frame.Value / 100) {
						oldCurrent.value = nowCurrent.value;
						nowCurrent.value = frame.Value / 100;
						animateValue('current');
					}
					break;
				case REPORT_TYPE.RUN_ERROR_TYPE:
					switch (frame.Value) {
						case 0:
							faultType.value = '电源掉线';
							break;
						case 1:
							faultType.value = '过流';
							break;
						case 2:
							faultType.value = '过压';
							break;
						case 3:
							faultType.value = '过温';
							break;
					}
					break;
				case REPORT_TYPE.RUN_MODE:
					switch (frame.Value) {
						case RUN_MODE_TYPE.BUCK:
							workMode.value = 'BUCK';
							break;
						case RUN_MODE_TYPE.BOOST:
							workMode.value = 'BOOST';
							break;
						case RUN_MODE_TYPE.MIXED:
							workMode.value = 'MIXED';
							break;
					}
					break;
				case REPORT_TYPE.OUT_MODE:
					switch (frame.Value) {
						case OUT_MODE_TYPE.CV:
							mode.value = 'CV';
							break;
						case OUT_MODE_TYPE.CC:
							mode.value = 'CC';
							break;
					}
					break;
			}
		} else {
			checkInvalidData();
			console.log(data);
		}
	};

	const setParameter = (type) => {
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

	const powerOn = () => {
		workStatus.value = '工作中';
	};

	const powerOff = () => {
		workStatus.value = '未工作';
	};

	const clearDataHistory = () => {
		dataHistory.value = [];
	};

	const addDataHistory = (value, type = 'received') => {
		const hexValue = Array.from(value)
			.map((byte) => byte.toString(16).padStart(2, '0'))
			.join(' ');
		const timestamp = new Date().toLocaleString();

		if (dataHistory.value.length >= 100) {
			dataHistory.value.pop();
		}
		dataHistory.value.unshift({
			message: hexValue,
			type: type,
			timestamp: timestamp,
		});
	};

	const updateTargetVoltage = (value) => {
		if (value < 0) {
			value = 0;
		}
		if (value > 80) {
			value = 80;
		}
		targetVoltage.value = parseFloat(value);
	};

	const updateTargetCurrent = (value) => {
		if (value < 0) {
			value = 0;
		}
		if (value > 5) {
			value = 5;
		}
		targetCurrent.value = parseFloat(value);
	};

	const calculateChecksum = (value) => {
		let calculatedChecksum = 0;
		for (let i = 0; i < 6 - 2; i++) {
			calculatedChecksum += value[i];
		}
		calculatedChecksum &= 0xffff;
		return calculatedChecksum;
	};

	const animateValue = (type) => {
		const element = document.querySelector(
			`.output-card:nth-child(${type === 'voltage' ? '1' : '2'}) .output-value-animation`
		);
		element.classList.remove('fade-in');
		void element.offsetWidth;
		element.classList.add('fade-in');
	};

	const handleConfirm = () => {
		showCustomDialog.value = false;
	};

	const showDataDetail = (item) => {
		selectedData.value = item;
		showDataDialog.value = true;
	};
</script>

<style>
	@import url('./css/app.css');

	.data-detail {
		text-align: left;
	}

	.data-dialog {
		margin-left: 100px;
	}
</style>
