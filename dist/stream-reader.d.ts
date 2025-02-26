import type BarcodeReader from "./reader.js";
export default function createStreamReader(reader: BarcodeReader, stream: MediaStream): {
    start: (onResult: (barcodes: ReturnType<BarcodeReader["readVideoFrame"]>) => void) => Promise<void>;
    stop: () => void;
};
