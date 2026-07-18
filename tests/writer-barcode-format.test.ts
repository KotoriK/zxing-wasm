import type {
    MainModule,
    WriterBarcodeFormat as GeneratedWriterBarcodeFormat
} from '../wasm-out/writer/zxing_writer.js'
import type { WriterBarcodeFormat, WriteBarcodeOptions } from '../src/index.js'

type Assert<T extends true> = T

type WriterBarcodeFormatUsesStrings = Assert<
    GeneratedWriterBarcodeFormat extends string ? true : false
>
type ReaderOnlyFormatIsExcluded = Assert<
    'QRCodeModel1' extends GeneratedWriterBarcodeFormat ? false : true
>
type PublicWriterFormatMatchesGenerated = Assert<
    WriteBarcodeOptions['format'] extends GeneratedWriterBarcodeFormat
        ? GeneratedWriterBarcodeFormat extends WriteBarcodeOptions['format']
            ? WriterBarcodeFormat extends GeneratedWriterBarcodeFormat
                ? true
                : false
            : false
        : false
>

declare const module: MainModule
const qrCode: 'QRCode' = module.WriterBarcodeFormat.QRCode

module.writeBarcodeToSVG('text', qrCode, '', 1, 0, false, true)

export type {
    PublicWriterFormatMatchesGenerated,
    ReaderOnlyFormatIsExcluded,
    WriterBarcodeFormatUsesStrings
}
