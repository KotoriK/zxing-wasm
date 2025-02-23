import type BarcodeReader from "./reader";
export default function createStreamReader(reader: BarcodeReader, stream: MediaStream): {
    start: (onResult: (barcodes: ReturnType<BarcodeReader["readVideoFrame"]>) => void) => Promise<void>;
    pause: () => boolean;
    abort: () => void;
};
