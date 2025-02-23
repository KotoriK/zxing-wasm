export default class BarcodeReader {
    modulePromise;
    #c;
    #ctx;
    #r;
    constructor(modulePromise) {
        this.modulePromise = modulePromise;
        this.#c = new OffscreenCanvas(0, 0);
        this.#ctx = this.#c.getContext('2d', {
            willReadFrequently: true
        });
    }
    async init() {
        const module = await this.modulePromise;
        console.log(module.DESCR);
        this.#r = new module.Reader();
        this.#r.setChannel(4);
    }
    resize(width, height) {
        this.#c.width = width;
        this.#c.height = height;
        this.#r.resizeBuf(width, height);
    }
    readVideoFrame(frame) {
        this.#ctx.drawImage(frame, 0, 0);
        const imageData = this.#ctx.getImageData(0, 0, frame.displayWidth, frame.displayHeight);
        const buf = this.#r.getBuf();
        buf.set(imageData.data);
        return this.#r.read();
    }
    read(image) {
        this.#c.getContext('bitmaprenderer')?.transferFromImageBitmap(image);
        const imageData = this.#ctx.getImageData(0, 0, image.width, image.height);
        const buf = this.#r.getBuf();
        buf.set(imageData.data);
        return this.#r.read();
    }
}
