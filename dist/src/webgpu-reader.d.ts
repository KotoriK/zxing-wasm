export default class WebGPUBarcodeReader {
    #private;
    initPromises(): Generator<Promise<void>, void, unknown>;
    init(): Promise<void>;
    resize(width: number, height: number): void;
    readVideoFrame(frame: VideoFrame): Promise<import("../wasm-out/reader/zxing_reader.js").Barcodes>;
}
