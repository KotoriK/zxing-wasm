import init, { type MainModule, type Reader } from '../wasm-out/reader/zxing_reader.js'
import WebGPUImageLumExtractor from './lum.js'
import { getUnderlyingBuffer } from './utils.js'

export default class WebGPUBarcodeReader {
    #m: MainModule
    #r: Reader
    #rb: Uint8Array
    #lum: WebGPUImageLumExtractor
    async #read(img: VideoFrame, width: number, height: number) {
        this.resize(width, height)
        performance.mark('extract start')

        await this.#lum.extractVideoFrame(img, this.#rb)
        performance.mark('extract end')
        performance.measure('extract', 'extract start', 'extract end')

        return this.#r.read()
    }
    *initPromises() {
        yield init().then(module => {
            this.#m = module
            this.#r = new module.Reader()
            this.#rb = getUnderlyingBuffer(module, this.#r.getBufOffset(), this.#r.getBufSize())
        })
        this.#lum = new WebGPUImageLumExtractor()
        yield this.#lum.init()
    }
    async init() {
        await Promise.all(this.initPromises())
    }
    resize(width: number, height: number) {
        this.#lum.resize(width, height)
        if (this.#r.width !== width || this.#r.height !== height) {
            this.#r.resizeBuf(width, height)
            this.#rb = getUnderlyingBuffer(this.#m, this.#r.getBufOffset(), this.#r.getBufSize())
        }
    }
/*     read(img: Exclude<CanvasImageSource, SVGImageElement | VideoFrame>) {
        const { width, height } = img
        this.resize(width, height)

        return this.#read(img, width, height)
    } */
    readVideoFrame(frame: VideoFrame) {
        return this.#read(frame, frame.displayWidth, frame.displayHeight)
    }
}
