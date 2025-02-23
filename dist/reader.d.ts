import type { MainModule } from '../wasm-out/reader/zxing_reader';
export default class BarcodeReader {
    #private;
    modulePromise: Promise<MainModule>;
    constructor(modulePromise: Promise<MainModule>);
    init(): Promise<void>;
    resize(width: number, height: number): void;
    readVideoFrame(frame: VideoFrame): import("../wasm-out/reader/zxing_reader").Barcodes;
    read(image: ImageBitmap): import("../wasm-out/reader/zxing_reader").Barcodes;
}
