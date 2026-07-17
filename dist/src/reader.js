import { getUnderlyingBuffer } from './utils.js';
export default class BarcodeReader {
    m;
    c;
    #ctx;
    #r;
    #rb;
    constructor(m, canvas) {
        this.m = m;
        this.c = canvas || new OffscreenCanvas(0, 0);
        this.#ctx = this.c.getContext('2d', {
            willReadFrequently: true
        });
        this.#r = new m.Reader();
        this.#r.setChannel(4);
        this.#rb = getUnderlyingBuffer(m, this.#r.getBufOffset(), this.#r.getBufSize());
    }
    resize(width, height) {
        this.c.width = width;
        this.c.height = height;
        this.#r.resizeBuf(width, height);
        this.#rb = getUnderlyingBuffer(this.m, this.#r.getBufOffset(), this.#r.getBufSize());
    }
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
