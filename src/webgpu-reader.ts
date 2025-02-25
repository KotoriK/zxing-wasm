import init, { Reader } from '../wasm-out/reader/zxing_reader.js'
import WebGPUImageLumExtractor from './lum.js'
export default class WebGPUBarcodeReader {
    #r: Reader
    #lum: WebGPUImageLumExtractor
    async #read(img: VideoFrame, width: number, height: number) {
        const arr = this.#r.getBuf() as Uint8Array
        performance.mark('extract start')

        await this.#lum.extractVideoFrame(img, arr)
        performance.mark('extract end')
        performance.measure('extract', 'extract start', 'extract end')

        return this.#r.read()
    }
    *initPromises() {
        yield init().then(module => {
            this.#r = new module.Reader()
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
