// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
declare namespace RuntimeExports {
    let HEAPF32: any;
    let HEAPF64: any;
    let HEAP_DATA_VIEW: any;
    let HEAP8: any;
    let HEAPU8: any;
    let HEAP16: any;
    let HEAPU16: any;
    let HEAP32: any;
    let HEAPU32: any;
    let HEAP64: any;
    let HEAPU64: any;
}
interface WasmModule {
}

type EmbindString = ArrayBuffer|Uint8Array|Uint8ClampedArray|Int8Array|string;
export interface ClassHandle {
  isAliasOf(other: ClassHandle): boolean;
  delete(): void;
  deleteLater(): this;
  isDeleted(): boolean;
  clone(): this;
}
export interface Barcodes extends ClassHandle {
  push_back(_0: Barcode): void;
  resize(_0: number, _1: Barcode): void;
  size(): number;
  get(_0: number): Barcode | undefined;
  set(_0: number, _1: Barcode): boolean;
}

export interface Barcode extends ClassHandle {
  readonly hasECI: boolean;
  readonly ecLevel: string;
}

export interface Reader extends ClassHandle {
  width: number;
  height: number;
  read(): Barcodes;
  resizeBuf(_0: number, _1: number): void;
  setChannel(_0: number): void;
  getBufOffset(): number;
  getBufSize(): number;
}

interface EmbindModule {
  Barcodes: {
    new(): Barcodes;
  };
  Barcode: {};
  getBarcodeRect(_0: Barcode): [number,number,number,number,number,number,number,number];
  Reader: {
    new(): Reader;
    new(_0: number, _1: number): Reader;
  };
  DESCR: EmbindString;
  getBarcodeFormatDescription(_0: Barcode): string;
  getBarcodeText(_0: Barcode): string;
}

export type MainModule = WasmModule & typeof RuntimeExports & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
