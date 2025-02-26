import type { MainModule } from '../wasm-out/reader/zxing_reader.js';
export default class BarcodeReader {
    #private;
    modulePromise: Promise<MainModule>;
    constructor(modulePromise: Promise<MainModule>);
    init(): Promise<void>;
    resize(width: number, height: number): void;
    readVideoFrame(frame: VideoFrame): import("../wasm-out/reader/zxing_reader.js").Barcodes;
    read(image: Exclude<CanvasImageSource, VideoFrame | SVGImageElement>): import("../wasm-out/reader/zxing_reader.js").Barcodes;
    delete(): void;
}
