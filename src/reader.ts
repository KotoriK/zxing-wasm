import type { Reader, MainModule } from '../wasm-out/reader/zxing_reader.js'
import { getUnderlyingBuffer } from './utils.js'

export default class BarcodeReader {
    c: OffscreenCanvas | HTMLCanvasElement
    #ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D
    #r: Reader
    #rb: Uint8Array
    constructor(public m: MainModule, canvas?: OffscreenCanvas | HTMLCanvasElement) {
        this.c = canvas || new OffscreenCanvas(0, 0)
        this.#ctx = this.c.getContext('2d', {
            willReadFrequently: true
        })!
        this.#r = new m.Reader()
        this.#r.setChannel(4)
        this.#rb = getUnderlyingBuffer(m, this.#r.getBufOffset(), this.#r.getBufSize())
    }
    resize(width: number, height: number) {
        this.c.width = width
        this.c.height = height
        this.#r.resizeBuf(width, height)
        this.#rb = getUnderlyingBuffer(this.m, this.#r.getBufOffset(), this.#r.getBufSize())
    }
    readVF(frame: VideoFrame) {
        this.#ctx.drawImage(frame, 0, 0)
        const imageData = this.#ctx.getImageData(0, 0, frame.displayWidth, frame.displayHeight)
        this.#rb.set(imageData.data)
        return this.#r.read()
    }
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