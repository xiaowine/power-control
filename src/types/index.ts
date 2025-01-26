export interface DataHistoryItem {
  message: string;
  type: "sent" | "received";
  timestamp: string;
}

export interface FrameData {
  FunctionCode: number;
  Value: number;
  CheckValue: number;
}

export enum FunctionType {
  EN = 0,
  VREF = 1,
  IREF = 2,
  OUT_MODE = 3,
  CLEAR_ERROR = 4,
  ASK_DEVICE_NAME = 5,
}

export enum ReportType {
  VIN = 0,
  IIN = 1,
  VOUT = 2,
  IOUT = 3,
  RUN_ERROR_TYPE = 4,
  RUN_MODE = 5,
  OUT_MODE = 6,
  EN = 7,
  TargetV = 8,
  TargetI = 9,
  DEVICE_NAME_START = 10,
  DEVICE_NAME = 11,
  DEVICE_NAME_END = 12,
}

const VMULTIPLE = 31.6;
const ADC_MAX = 4096;
const IMULTIPLE = 62;
const Resistance = 0.005;
export const REALITY_V = (VMULTIPLE * 3.3) / ADC_MAX; // V
export const REALITY_I = 3.3 / (IMULTIPLE * ADC_MAX * Resistance); // A
export const ADC_V = ADC_MAX / (VMULTIPLE * 3.3); // 电压采样值
export const ADC_I = (ADC_MAX * IMULTIPLE * Resistance) / 3.3; // 电流采样值
