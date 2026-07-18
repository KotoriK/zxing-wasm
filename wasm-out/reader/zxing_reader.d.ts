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
export interface BarcodeFormatValue<T extends number> {
  value: T;
}
export type BarcodeFormat = BarcodeFormatValue<0>|BarcodeFormatValue<10794>|BarcodeFormatValue<29226>|BarcodeFormatValue<30506>|BarcodeFormatValue<27690>|BarcodeFormatValue<27946>|BarcodeFormatValue<18218>|BarcodeFormatValue<21034>|BarcodeFormatValue<18730>|BarcodeFormatValue<8262>|BarcodeFormatValue<8257>|BarcodeFormatValue<29505>|BarcodeFormatValue<25921>|BarcodeFormatValue<12865>|BarcodeFormatValue<28737>|BarcodeFormatValue<8263>|BarcodeFormatValue<8259>|BarcodeFormatValue<8265>|BarcodeFormatValue<13385>|BarcodeFormatValue<8293>|BarcodeFormatValue<28517>|BarcodeFormatValue<29541>|BarcodeFormatValue<20325>|BarcodeFormatValue<27749>|BarcodeFormatValue<25957>|BarcodeFormatValue<17765>|BarcodeFormatValue<8261>|BarcodeFormatValue<12613>|BarcodeFormatValue<14405>|BarcodeFormatValue<13637>|BarcodeFormatValue<12869>|BarcodeFormatValue<26949>|BarcodeFormatValue<24901>|BarcodeFormatValue<25925>|BarcodeFormatValue<8258>|BarcodeFormatValue<12354>|BarcodeFormatValue<12610>|BarcodeFormatValue<8280>|BarcodeFormatValue<30808>|BarcodeFormatValue<8268>|BarcodeFormatValue<25420>|BarcodeFormatValue<27980>|BarcodeFormatValue<8314>|BarcodeFormatValue<25466>|BarcodeFormatValue<29306>|BarcodeFormatValue<8273>|BarcodeFormatValue<12625>|BarcodeFormatValue<12881>|BarcodeFormatValue<27985>|BarcodeFormatValue<29265>|BarcodeFormatValue<8292>|BarcodeFormatValue<8277>;

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
  BarcodeFormat: {None: BarcodeFormatValue<0>, All: BarcodeFormatValue<10794>, AllReadable: BarcodeFormatValue<29226>, AllCreatable: BarcodeFormatValue<30506>, AllLinear: BarcodeFormatValue<27690>, AllMatrix: BarcodeFormatValue<27946>, AllGS1: BarcodeFormatValue<18218>, AllRetail: BarcodeFormatValue<21034>, AllIndustrial: BarcodeFormatValue<18730>, Codabar: BarcodeFormatValue<8262>, Code39: BarcodeFormatValue<8257>, Code39Std: BarcodeFormatValue<29505>, Code39Ext: BarcodeFormatValue<25921>, Code32: BarcodeFormatValue<12865>, PZN: BarcodeFormatValue<28737>, Code93: BarcodeFormatValue<8263>, Code128: BarcodeFormatValue<8259>, ITF: BarcodeFormatValue<8265>, ITF14: BarcodeFormatValue<13385>, DataBar: BarcodeFormatValue<8293>, DataBarOmni: BarcodeFormatValue<28517>, DataBarStk: BarcodeFormatValue<29541>, DataBarStkOmni: BarcodeFormatValue<20325>, DataBarLtd: BarcodeFormatValue<27749>, DataBarExp: BarcodeFormatValue<25957>, DataBarExpStk: BarcodeFormatValue<17765>, EANUPC: BarcodeFormatValue<8261>, EAN13: BarcodeFormatValue<12613>, EAN8: BarcodeFormatValue<14405>, EAN5: BarcodeFormatValue<13637>, EAN2: BarcodeFormatValue<12869>, ISBN: BarcodeFormatValue<26949>, UPCA: BarcodeFormatValue<24901>, UPCE: BarcodeFormatValue<25925>, Telepen: BarcodeFormatValue<8258>, TelepenAlpha: BarcodeFormatValue<12354>, TelepenNumeric: BarcodeFormatValue<12610>, OtherBarcode: BarcodeFormatValue<8280>, DXFilmEdge: BarcodeFormatValue<30808>, PDF417: BarcodeFormatValue<8268>, CompactPDF417: BarcodeFormatValue<25420>, MicroPDF417: BarcodeFormatValue<27980>, Aztec: BarcodeFormatValue<8314>, AztecCode: BarcodeFormatValue<25466>, AztecRune: BarcodeFormatValue<29306>, QRCode: BarcodeFormatValue<8273>, QRCodeModel1: BarcodeFormatValue<12625>, QRCodeModel2: BarcodeFormatValue<12881>, MicroQRCode: BarcodeFormatValue<27985>, RMQRCode: BarcodeFormatValue<29265>, DataMatrix: BarcodeFormatValue<8292>, MaxiCode: BarcodeFormatValue<8277>};
  Barcodes: {
    new(): Barcodes;
  };
  Barcode: {};
  getBarcodeRect(_0: Barcode): [number,number,number,number,number,number,number,number];
  Reader: {
    new(): Reader;
    new(_0: BarcodeFormat): Reader;
    new(_0: number, _1: number): Reader;
    new(_0: number, _1: number, _2: BarcodeFormat): Reader;
  };
  DESCR: EmbindString;
  getBarcodeFormatDescription(_0: Barcode): string;
  getBarcodeText(_0: Barcode): string;
}

export type MainModule = WasmModule & typeof RuntimeExports & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
