// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
interface WasmModule {
}

type EmbindString = ArrayBuffer|Uint8Array|Uint8ClampedArray|Int8Array|string;
interface EmbindModule {
  DESCR: EmbindString;
  writeBarcodeToSVG(_0: EmbindString, _1: EmbindString, _2: EmbindString, _3: number, _4: number, _5: boolean, _6: boolean): string;
  writeBarcodeToImage(_0: EmbindString, _1: EmbindString, _2: EmbindString, _3: number, _4: number, _5: boolean, _6: boolean): { width: number; height: number; data: Uint8Array };
  writeBarcodeToUtf8(_0: EmbindString, _1: EmbindString, _2: EmbindString, _3: number, _4: number, _5: boolean, _6: boolean): string;
}

export type MainModule = WasmModule & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
