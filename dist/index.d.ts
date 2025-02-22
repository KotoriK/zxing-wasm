declare interface Barcode extends ClassHandle {
    readonly hasECI: boolean;
    readonly ecLevel: string;
}

export declare class BarcodeReader {
    #private;
    constructor();
    init(): Promise<void>;
    resize(width: number, height: number): void;
    readVideoFrame(frame: VideoFrame): Barcodes;
    read(image: ImageBitmap): Barcodes;
}

declare interface Barcodes extends ClassHandle {
    push_back(_0: Barcode): void;
    resize(_0: number, _1: Barcode): void;
    size(): number;
    get(_0: number): Barcode | undefined;
    set(_0: number, _1: Barcode): boolean;
}

declare interface ClassHandle {
    isAliasOf(other: ClassHandle): boolean;
    delete(): void;
    deleteLater(): this;
    isDeleted(): boolean;
    clone(): this;
}

export { }
