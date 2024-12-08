<template>
  <div class="power-control-system">
    <div class="section">
      <h3>设备状态</h3>
      <div class="port-config">
        <div>
          通信状态:
          <span>{{ device === undefined ? "未连接" : "已连接" }}</span>
        </div>
        <button @click="toggleConnection">
          <span class="status-dot" :class="{ connected: isConnected }"></span>
          {{ isConnected ? "断开连接" : "选择设备" }}
        </button>
      </div>
    </div>
    <div class="section output-parameters">
      <h3>输出参数</h3>
      <div>
        <div>
          电压: <span class="value">{{ formatNumber(nowVoltage, 2) }}V</span>
        </div>
        <div>
          电流: <span class="value">{{ formatNumber(nowCurrent, 2) }}A</span>
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
        <div>恒压/流: {{ mode }}</div>
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
          :class="item.type"
        >
          <span class="type"
            >{{ item.type === "sent" ? "发送" : "接收" }}:</span
          >
          <span class="message">{{ item.message }}</span>
        </li>
      </ul>
      <button @click="clearDataHistory">清除</button>
    </div>
    <div class="section">
      <h3>相关</h3>
      <a href="https://github.com/xiaowine" target="_blank">
        <img class="github-logo" src="./assets/github.svg" alt="github" />
      </a>
      <div>by xiao_wine</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick, onUnmounted } from "vue";

export default {
  setup() {
    // 定义状态变量
    const device = ref();
    const isConnected = ref(false);
    const targetVoltage = ref(24.0);
    const targetCurrent = ref(5.0);
    const nowVoltage = ref(24.0);
    const nowCurrent = ref(5.0);
    const workMode = ref("BUCK");
    const workStatus = ref("未工作");
    const mode = ref("CC");
    const faultType = ref("电源掉线");
    const dataHistory = ref([]);
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
    onMounted(() => {});

    onUnmounted(() => {
      disconnectDevice();
    });

    // 格式化数字
    const formatNumber = (number, decimals) => {
      return number.toFixed(decimals).padStart(5, "0");
    };

    // 切换连接状态
    const toggleConnection = async () => {
      if (!("serial" in navigator)) {
        alert("浏览器不支持");
        return;
      }
      if (isConnected.value) {
        await disconnectDevice();
      } else {
        await connectDevice();
      }
    };

    // 连接设备
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
        console.error("Failed to open serial port:", error);
        alert("串口打开失败");
        device.value = undefined;
        isConnected.value = false;
      }
    };

    // 断开设备连接
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

    // 处理缓冲区数据
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

    // 检查无效数据
    const checkInvalidData = () => {
      if (invalidDataCount > 10) {
        alert("收到过多无效数据，关闭串口");
        disconnectDevice();
        invalidDataCount = 0;
        invalidDataTimer = null;
      } else {
        invalidDataCount++;
        invalidDataTimer = null;
        invalidDataTimer = setTimeout(() => {
          if (invalidDataCount > 10) {
            alert("收到过多无效数据，关闭串口");
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
          case 0x0000:
            nowVoltage.value = frame.Value / 100;
            break;
          case 0x0001:
            nowCurrent.value = frame.Value / 100;
            break;
          case 0x0002:
            switch (frame.Value) {
              case 0:
                faultType.value = "电源掉线";
                break;
              case 1:
                faultType.value = "过流";
                break;
              case 2:
                faultType.value = "过压";
                break;
              case 3:
                faultType.value = "过温";
                break;
            }
            break;
          case 0x0003:
            switch (frame.Value) {
              case 0:
                workMode.value = "BUCK";
                break;
              case 1:
                workMode.value = "BOOST";
                break;
              case 2:
                workMode.value = "MIXED";
                break;
            }
            break;
          case 0x0004:
            mode.value = frame.Value === 0 ? "CV" : "CC";
            break;
        }
      } else {
        checkInvalidData();
        console.log(data);
      }
    };

    // 设置参数
    const setParameter = (type) => {
      if (type === "voltage") {
        nowVoltage.value = targetVoltage.value;
      } else if (type === "current") {
        nowCurrent.value = targetCurrent.value;
      }
    };

    // 开机
    const powerOn = () => {
      workStatus.value = "工作中";
    };

    // 关机
    const powerOff = () => {
      workStatus.value = "未工作";
    };

    // 清除数据历史
    const clearDataHistory = () => {
      dataHistory.value = [];
    };

    // 添加数据历史
    const addDataHistory = (value, type = "received") => {
      const hexValue = Array.from(value)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join(" ");

      if (dataHistory.value.length >= 100) {
        dataHistory.value.pop(); // 删除最后一条数据
      }
      dataHistory.value.unshift({ message: hexValue, type: type });
    };

    // 更新目标电压
    const updateTargetVoltage = (value) => {
      if (value < 0) {
        value = 0;
      }
      if (value > 80) {
        value = 80;
      }
      targetVoltage.value = parseFloat(value);
    };

    // 更新目标电流
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
      // Exclude the last two bytes of the checksum
      for (let i = 0; i < 6 - 2; i++) {
        calculatedChecksum += value[i];
      }
      calculatedChecksum &= 0xffff; // Keep only the lowest 16 bits
      return calculatedChecksum;
    };

    return {
      device,
      isConnected,
      targetVoltage,
      targetCurrent,
      nowVoltage,
      nowCurrent,
      workMode,
      workStatus,
      mode,
      faultType,
      dataHistory,
      formatNumber,
      toggleConnection,
      setParameter,
      powerOn,
      powerOff,
      clearDataHistory,
      addDataHistory,
      updateTargetVoltage,
      updateTargetCurrent,
    };
  },
};
</script>

<style>
@import url("./css/app.css");
</style>
