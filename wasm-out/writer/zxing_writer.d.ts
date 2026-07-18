// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
interface WasmModule {
}

type EmbindString = ArrayBuffer|Uint8Array|Uint8ClampedArray|Int8Array|string;
export type WriterBarcodeFormat = 'Codabar'|'Code39'|'Code39Std'|'Code39Ext'|'Code32'|'PZN'|'Code93'|'Code128'|'ITF'|'ITF14'|'DataBar'|'DataBarOmni'|'DataBarStk'|'DataBarStkOmni'|'DataBarLtd'|'DataBarExp'|'DataBarExpStk'|'EANUPC'|'EAN13'|'EAN8'|'EAN5'|'EAN2'|'ISBN'|'UPCA'|'UPCE'|'Telepen'|'TelepenAlpha'|'TelepenNumeric'|'DXFilmEdge'|'PDF417'|'CompactPDF417'|'MicroPDF417'|'Aztec'|'AztecCode'|'AztecRune'|'QRCode'|'QRCodeModel2'|'MicroQRCode'|'RMQRCode'|'DataMatrix'|'MaxiCode';

interface EmbindModule {
  WriterBarcodeFormat: {Codabar: 'Codabar', Code39: 'Code39', Code39Std: 'Code39Std', Code39Ext: 'Code39Ext', Code32: 'Code32', PZN: 'PZN', Code93: 'Code93', Code128: 'Code128', ITF: 'ITF', ITF14: 'ITF14', DataBar: 'DataBar', DataBarOmni: 'DataBarOmni', DataBarStk: 'DataBarStk', DataBarStkOmni: 'DataBarStkOmni', DataBarLtd: 'DataBarLtd', DataBarExp: 'DataBarExp', DataBarExpStk: 'DataBarExpStk', EANUPC: 'EANUPC', EAN13: 'EAN13', EAN8: 'EAN8', EAN5: 'EAN5', EAN2: 'EAN2', ISBN: 'ISBN', UPCA: 'UPCA', UPCE: 'UPCE', Telepen: 'Telepen', TelepenAlpha: 'TelepenAlpha', TelepenNumeric: 'TelepenNumeric', DXFilmEdge: 'DXFilmEdge', PDF417: 'PDF417', CompactPDF417: 'CompactPDF417', MicroPDF417: 'MicroPDF417', Aztec: 'Aztec', AztecCode: 'AztecCode', AztecRune: 'AztecRune', QRCode: 'QRCode', QRCodeModel2: 'QRCodeModel2', MicroQRCode: 'MicroQRCode', RMQRCode: 'RMQRCode', DataMatrix: 'DataMatrix', MaxiCode: 'MaxiCode'};
  DESCR: EmbindString;
  writeBarcodeToSVG(_0: EmbindString, _1: WriterBarcodeFormat, _2: EmbindString, _3: number, _4: number, _5: boolean, _6: boolean): string;
  writeBarcodeToImage(_0: EmbindString, _1: WriterBarcodeFormat, _2: EmbindString, _3: number, _4: number, _5: boolean, _6: boolean): { width: number; height: number; data: Uint8Array };
  writeBarcodeToUtf8(_0: EmbindString, _1: WriterBarcodeFormat, _2: EmbindString, _3: number, _4: number, _5: boolean, _6: boolean): string;
}

export type MainModule = WasmModule & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
