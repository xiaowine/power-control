export interface SerialPortOptions {
  baudRate: number;
  dataBits?: number;
  stopBits?: number;
  parity?: string;
  bufferSize?: number;
  flowControl?: string;
}
export interface SerialOptions {
  filters?: SerialPortFilter[];
}

export interface SerialPortFilter {
  usbVendorId?: number;
  usbProductId?: number;
}

export interface SerialPort {
  readable: ReadableStream<Uint8Array>;
  writable: WritableStream<Uint8Array>;
  open(options: SerialPortOptions): Promise<void>;
  close(): Promise<void>;
}

interface Serial {
  addEventListener: (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) => void;

  requestPort(): Promise<SerialPort>;
  requestPort(options?: SerialOptions): Promise<SerialPort>;
  getPorts(): Promise<SerialPort[]>;
}

declare global {
  interface Navigator {
    serial: Serial;
  }
}
