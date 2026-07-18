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
export interface BarcodeFormatFlag<Name extends string, Value extends number> {
  /** Type-only format name; the runtime flag object exposes only value. */
  readonly __format?: Name;
  readonly value: Value;
}
export type BarcodeFormat = BarcodeFormatFlag<'None', 0>|BarcodeFormatFlag<'All', 10794>|BarcodeFormatFlag<'AllReadable', 29226>|BarcodeFormatFlag<'AllCreatable', 30506>|BarcodeFormatFlag<'AllLinear', 27690>|BarcodeFormatFlag<'AllMatrix', 27946>|BarcodeFormatFlag<'AllGS1', 18218>|BarcodeFormatFlag<'AllRetail', 21034>|BarcodeFormatFlag<'AllIndustrial', 18730>|BarcodeFormatFlag<'Codabar', 8262>|BarcodeFormatFlag<'Code39', 8257>|BarcodeFormatFlag<'Code39Std', 29505>|BarcodeFormatFlag<'Code39Ext', 25921>|BarcodeFormatFlag<'Code32', 12865>|BarcodeFormatFlag<'PZN', 28737>|BarcodeFormatFlag<'Code93', 8263>|BarcodeFormatFlag<'Code128', 8259>|BarcodeFormatFlag<'ITF', 8265>|BarcodeFormatFlag<'ITF14', 13385>|BarcodeFormatFlag<'DataBar', 8293>|BarcodeFormatFlag<'DataBarOmni', 28517>|BarcodeFormatFlag<'DataBarStk', 29541>|BarcodeFormatFlag<'DataBarStkOmni', 20325>|BarcodeFormatFlag<'DataBarLtd', 27749>|BarcodeFormatFlag<'DataBarExp', 25957>|BarcodeFormatFlag<'DataBarExpStk', 17765>|BarcodeFormatFlag<'EANUPC', 8261>|BarcodeFormatFlag<'EAN13', 12613>|BarcodeFormatFlag<'EAN8', 14405>|BarcodeFormatFlag<'EAN5', 13637>|BarcodeFormatFlag<'EAN2', 12869>|BarcodeFormatFlag<'ISBN', 26949>|BarcodeFormatFlag<'UPCA', 24901>|BarcodeFormatFlag<'UPCE', 25925>|BarcodeFormatFlag<'Telepen', 8258>|BarcodeFormatFlag<'TelepenAlpha', 12354>|BarcodeFormatFlag<'TelepenNumeric', 12610>|BarcodeFormatFlag<'OtherBarcode', 8280>|BarcodeFormatFlag<'DXFilmEdge', 30808>|BarcodeFormatFlag<'PDF417', 8268>|BarcodeFormatFlag<'CompactPDF417', 25420>|BarcodeFormatFlag<'MicroPDF417', 27980>|BarcodeFormatFlag<'Aztec', 8314>|BarcodeFormatFlag<'AztecCode', 25466>|BarcodeFormatFlag<'AztecRune', 29306>|BarcodeFormatFlag<'QRCode', 8273>|BarcodeFormatFlag<'QRCodeModel1', 12625>|BarcodeFormatFlag<'QRCodeModel2', 12881>|BarcodeFormatFlag<'MicroQRCode', 27985>|BarcodeFormatFlag<'RMQRCode', 29265>|BarcodeFormatFlag<'DataMatrix', 8292>|BarcodeFormatFlag<'MaxiCode', 8277>;

export type BarcodeFormats = Exclude<BarcodeFormat, BarcodeFormatFlag<'None', 0>> | readonly Exclude<BarcodeFormat, BarcodeFormatFlag<'None', 0>>[];

export interface Barcodes extends ClassHandle, Iterable<Barcode> {
  push_back(_0: Barcode): void;
  resize(_0: number, _1: Barcode): void;
  size(): number;
  get(_0: number): Barcode | undefined;
  set(_0: number, _1: Barcode): boolean;
}

export interface Barcode extends ClassHandle {
  readonly format: BarcodeFormat;
  readonly hasECI: boolean;
  readonly ecLevel: string;
}

export interface Reader extends ClassHandle {
  readonly width: number;
  readonly height: number;
  read(): Barcodes;
  resizeBuf(_0: number, _1: number): void;
  setChannel(_0: number): void;
  prepareBuf(_0: number, _1: number, _2: number, _3: number): void;
  getBufOffset(): number;
  getBufSize(): number;
}

interface EmbindModule {
  BarcodeFormat: {None: BarcodeFormatFlag<'None', 0>, All: BarcodeFormatFlag<'All', 10794>, AllReadable: BarcodeFormatFlag<'AllReadable', 29226>, AllCreatable: BarcodeFormatFlag<'AllCreatable', 30506>, AllLinear: BarcodeFormatFlag<'AllLinear', 27690>, AllMatrix: BarcodeFormatFlag<'AllMatrix', 27946>, AllGS1: BarcodeFormatFlag<'AllGS1', 18218>, AllRetail: BarcodeFormatFlag<'AllRetail', 21034>, AllIndustrial: BarcodeFormatFlag<'AllIndustrial', 18730>, Codabar: BarcodeFormatFlag<'Codabar', 8262>, Code39: BarcodeFormatFlag<'Code39', 8257>, Code39Std: BarcodeFormatFlag<'Code39Std', 29505>, Code39Ext: BarcodeFormatFlag<'Code39Ext', 25921>, Code32: BarcodeFormatFlag<'Code32', 12865>, PZN: BarcodeFormatFlag<'PZN', 28737>, Code93: BarcodeFormatFlag<'Code93', 8263>, Code128: BarcodeFormatFlag<'Code128', 8259>, ITF: BarcodeFormatFlag<'ITF', 8265>, ITF14: BarcodeFormatFlag<'ITF14', 13385>, DataBar: BarcodeFormatFlag<'DataBar', 8293>, DataBarOmni: BarcodeFormatFlag<'DataBarOmni', 28517>, DataBarStk: BarcodeFormatFlag<'DataBarStk', 29541>, DataBarStkOmni: BarcodeFormatFlag<'DataBarStkOmni', 20325>, DataBarLtd: BarcodeFormatFlag<'DataBarLtd', 27749>, DataBarExp: BarcodeFormatFlag<'DataBarExp', 25957>, DataBarExpStk: BarcodeFormatFlag<'DataBarExpStk', 17765>, EANUPC: BarcodeFormatFlag<'EANUPC', 8261>, EAN13: BarcodeFormatFlag<'EAN13', 12613>, EAN8: BarcodeFormatFlag<'EAN8', 14405>, EAN5: BarcodeFormatFlag<'EAN5', 13637>, EAN2: BarcodeFormatFlag<'EAN2', 12869>, ISBN: BarcodeFormatFlag<'ISBN', 26949>, UPCA: BarcodeFormatFlag<'UPCA', 24901>, UPCE: BarcodeFormatFlag<'UPCE', 25925>, Telepen: BarcodeFormatFlag<'Telepen', 8258>, TelepenAlpha: BarcodeFormatFlag<'TelepenAlpha', 12354>, TelepenNumeric: BarcodeFormatFlag<'TelepenNumeric', 12610>, OtherBarcode: BarcodeFormatFlag<'OtherBarcode', 8280>, DXFilmEdge: BarcodeFormatFlag<'DXFilmEdge', 30808>, PDF417: BarcodeFormatFlag<'PDF417', 8268>, CompactPDF417: BarcodeFormatFlag<'CompactPDF417', 25420>, MicroPDF417: BarcodeFormatFlag<'MicroPDF417', 27980>, Aztec: BarcodeFormatFlag<'Aztec', 8314>, AztecCode: BarcodeFormatFlag<'AztecCode', 25466>, AztecRune: BarcodeFormatFlag<'AztecRune', 29306>, QRCode: BarcodeFormatFlag<'QRCode', 8273>, QRCodeModel1: BarcodeFormatFlag<'QRCodeModel1', 12625>, QRCodeModel2: BarcodeFormatFlag<'QRCodeModel2', 12881>, MicroQRCode: BarcodeFormatFlag<'MicroQRCode', 27985>, RMQRCode: BarcodeFormatFlag<'RMQRCode', 29265>, DataMatrix: BarcodeFormatFlag<'DataMatrix', 8292>, MaxiCode: BarcodeFormatFlag<'MaxiCode', 8277>};
  Barcodes: {
    new(): Barcodes;
  };
  Barcode: {};
  getBarcodeRect(_0: Barcode): [number,number,number,number,number,number,number,number];
  Reader: {
    new(): Reader;
    new(_0: BarcodeFormats): Reader;
    new(_0: number, _1: number): Reader;
    new(_0: number, _1: number, _2: BarcodeFormats): Reader;
  };
  DESCR: EmbindString;
  getBarcodeFormatDescription(_0: Barcode): string;
  getBarcodeText(_0: Barcode): string;
}

export type MainModule = WasmModule & typeof RuntimeExports & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
