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
  _malloc(_0: number): number;
  _free(_0: number): void;
}

type EmbindString = ArrayBuffer|Uint8Array|Uint8ClampedArray|Int8Array|string;
export interface ClassHandle {
  isAliasOf(other: ClassHandle): boolean;
  delete(): void;
  deleteLater(): this;
  isDeleted(): boolean;
  clone(): this;
}
export interface ReadResults extends ClassHandle {
  size(): number;
  get(_0: number): ReadResult | undefined;
  push_back(_0: ReadResult): void;
  resize(_0: number, _1: ReadResult): void;
  set(_0: number, _1: ReadResult): boolean;
}

export interface Rect extends ClassHandle {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ReadResult extends ClassHandle {
  readonly text: string;
  readonly format: string;
  readonly ecLevel: string;
  readonly rect: Rect;
  readonly hasECI: boolean;
}

export interface Reader extends ClassHandle {
  read(): ReadResults;
  getBuf(): any;
}

interface EmbindModule {
  ReadResults: {
    new(): ReadResults;
  };
  Rect: {};
  ReadResult: {};
  Reader: {
    new(): Reader;
    new(_0: number, _1: number): Reader;
  };
}

export type MainModule = WasmModule & typeof RuntimeExports & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
