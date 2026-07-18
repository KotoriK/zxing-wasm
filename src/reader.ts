import type { BarcodeFormats, Reader, MainModule } from '../wasm-out/reader/zxing_reader.js'
import { getUnderlyingBuffer } from './utils.js'
export type {BarcodeFormats}
type BarcodeReaderCanvas = OffscreenCanvas | HTMLCanvasElement

function isBarcodeReaderCanvas(
    value: BarcodeFormats | BarcodeReaderCanvas
): value is BarcodeReaderCanvas {
    return typeof value === 'object' && value !== null && 'getContext' in value
}

export default class BarcodeReader {
    c: BarcodeReaderCanvas
    #ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D
    #r: Reader
    /** underlying buffer of C++ side reader */
    #rb: Uint8Array
    constructor(m: MainModule, canvas?: BarcodeReaderCanvas)
    constructor(m: MainModule, formats: BarcodeFormats, canvas?: BarcodeReaderCanvas)
    constructor(
        public m: MainModule,
        formatOrCanvas: BarcodeFormats | BarcodeReaderCanvas = m.BarcodeFormat.All,
        canvas?: BarcodeReaderCanvas
    ) {
        const hasCanvas = isBarcodeReaderCanvas(formatOrCanvas)
        const formats = hasCanvas ? m.BarcodeFormat.All : formatOrCanvas
        this.c = (hasCanvas ? formatOrCanvas : canvas) || new OffscreenCanvas(0, 0)
        this.#ctx = this.c.getContext('2d', {
            willReadFrequently: true
        }) as OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D
        this.#r = new m.Reader(formats)
        this.#r.setChannel(4)
        this.#rb = getUnderlyingBuffer(m, this.#r.getBufOffset(), this.#r.getBufSize())
    }
    resize(width: number, height: number) {
        this.c.width = width
        this.c.height = height
        this.#r.resizeBuf(width, height)
        this.#rb = getUnderlyingBuffer(this.m, this.#r.getBufOffset(), this.#r.getBufSize())
    }
    /**
     * Read barcode from a VideoFrame
     * Caller owns the returned Barcodes and must call delete().
     * @param frame
     */
    readVF(frame: VideoFrame) {
        this.#ctx.drawImage(frame, 0, 0)
        const imageData = this.#ctx.getImageData(0, 0, frame.displayWidth, frame.displayHeight)
        this.#rb.set(imageData.data)
        return this.#r.read()
    }
    /** Caller owns the returned Barcodes and must call delete(). */
    read(image: Exclude<CanvasImageSource, VideoFrame | SVGImageElement>) {
        this.#ctx.drawImage(image, 0, 0)
        const imageData = this.#ctx.getImageData(0, 0, image.width, image.height)
        this.#rb.set(imageData.data)
        return this.#r.read()
    }
    delete() {
        this.#r.delete()
        this.#rb = this.c = this.#ctx = this.#r = null as any
    }
}
