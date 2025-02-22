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

export declare function createStreamReader(stream: MediaStream): {
    start: (onResult: (barcodes: ReturnType<BarcodeReader["readVideoFrame"]>) => void) => Promise<void>;
    pause: () => boolean;
    abort: () => void;
};

declare interface EmbindModule {
    Barcodes: {
        new(): Barcodes;
    };
    Rect: {};
    Barcode: {};
    getBarcodeRect(_0: Barcode): Rect;
    Reader: {
        new(): Reader;
        new(_0: number, _1: number): Reader;
    };
    DESCR: EmbindString;
    getBarcodeFormatDescription(_0: Barcode): string;
    getBarcodeText(_0: Barcode): string;
}

declare type EmbindString = ArrayBuffer|Uint8Array|Uint8ClampedArray|Int8Array|string;

declare type MainModule = WasmModule & typeof RuntimeExports & EmbindModule;

export declare const module: Promise<MainModule>;

declare interface Reader extends ClassHandle {
    width: number;
    height: number;
    read(): Barcodes;
    resizeBuf(_0: number, _1: number): void;
    setChannel(_0: number): void;
    getBuf(): any;
}

declare interface Rect extends ClassHandle {
    x: number;
    y: number;
    w: number;
    h: number;
}

declare namespace RuntimeExports {
    let HEAPF32: any;
    let HEAPF64: any;
    let HEAP_DATA_VIEW: any;
    let HEAP8: any;
    let HEAPU8: any;
    let HEAP16: any;
    let HEAPU16: any;
    let HEAP32: any;
    let HEAPU32: any;
    let HEAP64: any;
    let HEAPU64: any;
}

declare interface WasmModule {
}

export { }
