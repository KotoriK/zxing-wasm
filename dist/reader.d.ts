import type { BarcodeFormat, MainModule } from '../wasm-out/reader/zxing_reader.js';
type BarcodeReaderCanvas = OffscreenCanvas | HTMLCanvasElement;
export default class BarcodeReader {
    #private;
    m: MainModule;
    c: BarcodeReaderCanvas;
    constructor(m: MainModule, canvas?: BarcodeReaderCanvas);
    constructor(m: MainModule, format: BarcodeFormat, canvas?: BarcodeReaderCanvas);
    resize(width: number, height: number): void;
    /**
     * Read barcode from a VideoFrame
     * @param frame
     */
    readVF(frame: VideoFrame): import("../wasm-out/reader/zxing_reader.js").Barcodes;
    read(image: Exclude<CanvasImageSource, VideoFrame | SVGImageElement>): import("../wasm-out/reader/zxing_reader.js").Barcodes;
    delete(): void;
}
export {};
