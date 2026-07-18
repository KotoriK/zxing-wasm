import type BarcodeReader from "./reader.js";
export default function createStreamReader(reader: BarcodeReader, stream: MediaStream): {
    start: (onResult: (barcodes: import("./index.js").Barcodes) => void | Promise<void>) => Promise<void>;
    stop: () => void;
};
