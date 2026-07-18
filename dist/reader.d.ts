import type { BarcodeFormats, MainModule } from '../wasm-out/reader/zxing_reader.js';
export type { BarcodeFormats };
type BarcodeReaderCanvas = OffscreenCanvas | HTMLCanvasElement;
export default class BarcodeReader {
    #private;
    m: MainModule;
    c: BarcodeReaderCanvas;
    constructor(m: MainModule, canvas?: BarcodeReaderCanvas);
    constructor(m: MainModule, formats: BarcodeFormats, canvas?: BarcodeReaderCanvas);
    resize(width: number, height: number): void;
    /**
     * Read barcode from a VideoFrame
     * Caller owns the returned Barcodes and must call delete().
     * @param frame
     */
    readVF(frame: VideoFrame): Promise<import("../wasm-out/reader/zxing_reader.js").Barcodes>;
    /** Caller owns the returned Barcodes and must call delete(). */
    read(image: Exclude<CanvasImageSource, VideoFrame | SVGImageElement>): import("../wasm-out/reader/zxing_reader.js").Barcodes;
    delete(): void;
}
