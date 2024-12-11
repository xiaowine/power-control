export interface DataHistoryItem {
	message: string;
	type: 'sent' | 'received';
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
}

export interface StatusMappings {
	RUN_MODE: {
		BUCK: number;
		BOOST: number;
		MIXED: number;
	};
	OUT_MODE: {
		CV: number;
		CC: number;
	};
	ERROR_TYPE: {
		NONE: number;
		OVERCURRENT: number;
		OVERVOLTAGE: number;
		OVERTEMP: number;
	};
}
