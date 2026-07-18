import { getUnderlyingBuffer } from './utils.js';
const LUMA_VIDEO_FORMATS = new Set([
    'I420',
    'I420A',
    'I422',
    'I444',
    'NV12'
]);
function isBarcodeReaderCanvas(value) {
    return typeof value === 'object' && value !== null && 'getContext' in value;
}
function hasDisplayTransform(frame) {
    const orientedFrame = frame;
    return (orientedFrame.rotation ?? 0) !== 0 || (orientedFrame.flip ?? false);
}
export default class BarcodeReader {
    m;
    c;
    #ctx;
    #r;
    /** underlying buffer of C++ side reader */
    #rb;
    #bufferWidth = 0;
    #bufferHeight = 0;
    #bufferChannel = 4;
    #bufferSize = 0;
    #lumaCopyPlan;
    constructor(m, formatOrCanvas = m.BarcodeFormat.All, canvas) {
        this.m = m;
        const hasCanvas = isBarcodeReaderCanvas(formatOrCanvas);
        const formats = hasCanvas ? m.BarcodeFormat.All : formatOrCanvas;
        this.c = (hasCanvas ? formatOrCanvas : canvas) || new OffscreenCanvas(0, 0);
        this.#ctx = this.c.getContext('2d', {
            willReadFrequently: true
        });
        this.#r = new m.Reader(formats);
        this.#r.setChannel(4);
        this.#rb = getUnderlyingBuffer(m, this.#r.getBufOffset(), this.#r.getBufSize());
    }
    #refreshBuffer() {
        this.#rb = getUnderlyingBuffer(this.m, this.#r.getBufOffset(), this.#r.getBufSize());
    }
    #prepareBuffer(width, height, channel, size) {
        if (width !== this.#bufferWidth ||
            height !== this.#bufferHeight ||
            channel !== this.#bufferChannel ||
            size !== this.#bufferSize) {
            this.#r.prepareBuf(width, height, channel, size);
            this.#bufferWidth = width;
            this.#bufferHeight = height;
            this.#bufferChannel = channel;
            this.#bufferSize = size;
        }
        if (this.#rb.buffer !== this.m.HEAPU8.buffer || this.#rb.byteLength !== size) {
            this.#refreshBuffer();
        }
    }
    #getLumaCopyPlan(frame, rect) {
        const cached = this.#lumaCopyPlan;
        if (cached &&
            cached.format === frame.format &&
            cached.x === rect.x &&
            cached.y === rect.y &&
            cached.width === rect.width &&
            cached.height === rect.height) {
            return cached;
        }
        const options = {
            rect: {
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height
            }
        };
        const plan = {
            format: frame.format,
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            size: frame.allocationSize(options),
            options
        };
        this.#lumaCopyPlan = plan;
        return plan;
    }
    resize(width, height) {
        this.c.width = width;
        this.c.height = height;
        this.#prepareBuffer(width, height, 4, width * height * 4);
    }
    /**
     * Read barcode from a VideoFrame
     * Caller owns the returned Barcodes and must call delete().
     * @param frame
     */
    async readVF(frame) {
        const rect = frame.visibleRect;
        if (rect &&
            frame.format &&
            LUMA_VIDEO_FORMATS.has(frame.format) &&
            typeof frame.copyTo === 'function' &&
            !hasDisplayTransform(frame)) {
            const plan = this.#getLumaCopyPlan(frame, rect);
            this.#prepareBuffer(plan.width, plan.height, 1, plan.size);
            const [lumaLayout] = await frame.copyTo(this.#rb, plan.options);
            if (lumaLayout.offset !== 0 || lumaLayout.stride !== plan.width) {
                throw new TypeError('VideoFrame luma plane must be tightly packed at offset 0');
            }
            return this.#r.read();
        }
        if (this.c.width !== frame.displayWidth || this.c.height !== frame.displayHeight) {
            this.resize(frame.displayWidth, frame.displayHeight);
        }
        this.#ctx.drawImage(frame, 0, 0);
        const imageData = this.#ctx.getImageData(0, 0, frame.displayWidth, frame.displayHeight);
        this.#rb.set(imageData.data);
        return this.#r.read();
    }
    /** Caller owns the returned Barcodes and must call delete(). */
    read(image) {
        if (this.c.width !== image.width || this.c.height !== image.height) {
            this.resize(image.width, image.height);
        }
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
