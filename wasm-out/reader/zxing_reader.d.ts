// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
declare namespace RuntimeExports {
    let HEAPU8: Uint8Array;
}
interface WasmModule {
}

type EmbindString = ArrayBuffer|Uint8Array|Uint8ClampedArray|Int8Array|string;
export interface ClassHandle {
  isAliasOf(other: ClassHandle): boolean;
  delete(): void;
  deleteLater(): this;
  isDeleted(): boolean;
  // @ts-ignore - If targeting lower than ESNext, this symbol might not exist.
  [Symbol.dispose](): void;
  clone(): this;
}
export interface Barcodes extends ClassHandle, Iterable<Barcode> {
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
