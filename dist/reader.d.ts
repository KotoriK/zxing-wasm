import type { MainModule } from '../wasm-out/reader/zxing_reader.js';
export default class BarcodeReader {
    #private;
    m: MainModule;
    c: OffscreenCanvas | HTMLCanvasElement;
    constructor(m: MainModule, canvas?: OffscreenCanvas | HTMLCanvasElement);
    resize(width: number, height: number): void;
    readVF(frame: VideoFrame): import("../wasm-out/reader/zxing_reader.js").Barcodes;
    read(image: Exclude<CanvasImageSource, VideoFrame | SVGImageElement>): import("../wasm-out/reader/zxing_reader.js").Barcodes;
    delete(): void;
}
