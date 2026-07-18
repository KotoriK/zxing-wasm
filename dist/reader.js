import { getUnderlyingBuffer } from './utils.js';
function isBarcodeReaderCanvas(value) {
    return typeof value === 'object' && value !== null && 'getContext' in value;
}
export default class BarcodeReader {
    m;
    c;
    #ctx;
    #r;
    /** underlying buffer of C++ side reader */
    #rb;
    constructor(m, formatOrCanvas = m.BarcodeFormat.All, canvas) {
        this.m = m;
        const hasCanvas = isBarcodeReaderCanvas(formatOrCanvas);
        const format = hasCanvas ? m.BarcodeFormat.All : formatOrCanvas;
        this.c = (hasCanvas ? formatOrCanvas : canvas) || new OffscreenCanvas(0, 0);
        this.#ctx = this.c.getContext('2d', {
            willReadFrequently: true
        });
        this.#r = new m.Reader(format);
        this.#r.setChannel(4);
        this.#rb = getUnderlyingBuffer(m, this.#r.getBufOffset(), this.#r.getBufSize());
    }
    resize(width, height) {
        this.c.width = width;
        this.c.height = height;
        this.#r.resizeBuf(width, height);
        this.#rb = getUnderlyingBuffer(this.m, this.#r.getBufOffset(), this.#r.getBufSize());
    }
    /**
     * Read barcode from a VideoFrame
     * @param frame
     */
    readVF(frame) {
        this.#ctx.drawImage(frame, 0, 0);
        const imageData = this.#ctx.getImageData(0, 0, frame.displayWidth, frame.displayHeight);
        this.#rb.set(imageData.data);
        return this.#r.read();
    }
    read(image) {
        this.#ctx.drawImage(image, 0, 0);
        const imageData = this.#ctx.getImageData(0, 0, image.width, image.height);
        this.#rb.set(imageData.data);
        return this.#r.read();
    }
    delete() {
        this.#r.delete();
        this.#rb = this.c = this.#ctx = this.#r = null;
    }
}
