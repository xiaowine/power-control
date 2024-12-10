/**
 * 格式化数字，保留指定小数位数并补零
 */
export const formatNumber = (number: number, decimals: number): string => {
	return number.toFixed(decimals).padStart(5, '0');
};

/**
 * 计算校验和
 */
export const calculateChecksum = (value: Uint8Array): number => {
	let calculatedChecksum = 0;
	for (let i = 0; i < 6 - 2; i++) {
		calculatedChecksum += value[i];
	}
	calculatedChecksum &= 0xffff;
	return calculatedChecksum;
};

/**
 * 解析数据帧
 */
export const dataParse = (data: Uint8Array) => {
	return {
		FunctionCode: (data[1] << 8) | data[0],
		Value: (data[3] << 8) | data[2],
		CheckValue: (data[5] << 8) | data[4],
	};
};

/**
 * 格式化显示值
 */
export const formatValue = (type: string, value: number): string => {
	if (type === 'efficiency' || type === 'power') {
		return value.toFixed(1);
	}
	return formatNumber(value, 2);
};
