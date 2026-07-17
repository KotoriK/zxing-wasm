import type { MainModule } from '../wasm-out/writer/zxing_writer.js';
export interface WriteBarcodeOptions {
    /** Barcode format string, e.g. "QRCode", "Code128", "EAN13", "DataMatrix" */
    format: string;
    /** Creator options as a comma-separated key-value string, e.g. "ecLevel=30%" */
    creatorOptions?: string;
    /** Scale factor (module size). Default: 1 */
    scale?: number;
    /** Rotation in degrees (0, 90, 180, 270). Default: 0 */
    rotate?: number;
    /** Add human-readable text below the barcode. Default: false */
    withHRT?: boolean;
    /** Add quiet zones around the barcode. Default: true */
    withQuietZones?: boolean;
}
export interface BarcodeImage {
    width: number;
    height: number;
    /** Grayscale pixel data (1 byte per pixel) */
    data: Uint8Array;
}
export default class BarcodeWriter {
    m: MainModule;
    constructor(m: MainModule);
    /** Generate a barcode as an SVG string */
    toSVG(text: string, opts: WriteBarcodeOptions): string;
    /** Generate a barcode as grayscale image data */
    toImage(text: string, opts: WriteBarcodeOptions): BarcodeImage;
    /** Generate a barcode as UTF-8 text art */
    toUtf8(text: string, opts: WriteBarcodeOptions): string;
}
