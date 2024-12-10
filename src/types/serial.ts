export interface SerialOptions {
	baudRate: number;
	dataBits?: number;
	stopBits?: number;
	parity?: string;
	bufferSize?: number;
	flowControl?: string;
}

export interface SerialPort {
	readable: ReadableStream<Uint8Array>;
	writable: WritableStream<Uint8Array>;
	open(options: SerialOptions): Promise<void>;
	close(): Promise<void>;
}

interface Serial {
	requestPort(): Promise<SerialPort>;
	getPorts(): Promise<SerialPort[]>;
}

declare global {
	interface Navigator {
		serial: Serial;
	}
}
