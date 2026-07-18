import type {
    MainModule,
    WriterBarcodeFormat
} from '../wasm-out/writer/zxing_writer.js'

export type { WriterBarcodeFormat } from '../wasm-out/writer/zxing_writer.js'

export interface WriteBarcodeOptions {
    /** Writable barcode format, e.g. "QRCode", "Code128", "EAN13", "DataMatrix" */
    format: WriterBarcodeFormat
    /** Creator options as a comma-separated key-value string, e.g. "ecLevel=30%" */
    creatorOptions?: string
    /** Scale factor (module size). Default: 1 */
    scale?: number
    /** Rotation in degrees (0, 90, 180, 270). Default: 0 */
    rotate?: number
    /** Add human-readable text below the barcode. Default: false */
    withHRT?: boolean
    /** Add quiet zones around the barcode. Default: true */
    withQuietZones?: boolean
}

export interface BarcodeImage {
    width: number
    height: number
    /** Grayscale pixel data (1 byte per pixel) */
    data: Uint8Array
}

function resolveOpts(opts: WriteBarcodeOptions) {
    return {
        creatorOptions: opts.creatorOptions ?? '',
        scale: opts.scale ?? 1,
        rotate: opts.rotate ?? 0,
        withHRT: opts.withHRT ?? false,
        withQuietZones: opts.withQuietZones ?? true,
    } as const
}

export default class BarcodeWriter {
    constructor(public m: MainModule) {}

    /** Generate a barcode as an SVG string */
    toSVG(text: string, opts: WriteBarcodeOptions): string {
        const o = resolveOpts(opts)
        return this.m.writeBarcodeToSVG(
            text, opts.format, o.creatorOptions,
            o.scale, o.rotate, o.withHRT, o.withQuietZones
        )
    }

    /** Generate a barcode as grayscale image data */
    toImage(text: string, opts: WriteBarcodeOptions): BarcodeImage {
        const o = resolveOpts(opts)
        return this.m.writeBarcodeToImage(
            text, opts.format, o.creatorOptions,
            o.scale, o.rotate, o.withHRT, o.withQuietZones
        )
    }

    /** Generate a barcode as UTF-8 text art */
    toUtf8(text: string, opts: WriteBarcodeOptions): string {
        const o = resolveOpts(opts)
        return this.m.writeBarcodeToUtf8(
            text, opts.format, o.creatorOptions,
            o.scale, o.rotate, o.withHRT, o.withQuietZones
        )
    }
}
