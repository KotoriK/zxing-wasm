function resolveOpts(opts) {
    return {
        creatorOptions: opts.creatorOptions ?? '',
        scale: opts.scale ?? 1,
        rotate: opts.rotate ?? 0,
        withHRT: opts.withHRT ?? false,
        withQuietZones: opts.withQuietZones ?? true,
    };
}
export default class BarcodeWriter {
    m;
    constructor(m) {
        this.m = m;
    }
    /** Generate a barcode as an SVG string */
    toSVG(text, opts) {
        const o = resolveOpts(opts);
        return this.m.writeBarcodeToSVG(text, opts.format, o.creatorOptions, o.scale, o.rotate, o.withHRT, o.withQuietZones);
    }
    /** Generate a barcode as grayscale image data */
    toImage(text, opts) {
        const o = resolveOpts(opts);
        return this.m.writeBarcodeToImage(text, opts.format, o.creatorOptions, o.scale, o.rotate, o.withHRT, o.withQuietZones);
    }
    /** Generate a barcode as UTF-8 text art */
    toUtf8(text, opts) {
        const o = resolveOpts(opts);
        return this.m.writeBarcodeToUtf8(text, opts.format, o.creatorOptions, o.scale, o.rotate, o.withHRT, o.withQuietZones);
    }
}
