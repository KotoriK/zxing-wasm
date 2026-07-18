import type {
    Barcode,
    BarcodeFormat,
    BarcodeFormatFlag,
    BarcodeFormats,
    MainModule,
    Reader
} from '../wasm-out/reader/zxing_reader.js'
import type {
    BarcodeFormatFlag as PublicBarcodeFormatFlag,
    BarcodeFormats as PublicBarcodeFormats
} from '../src/index.js'

type Assert<T extends true> = T

type BarcodeFormatUsesNamedFlags = Assert<
    BarcodeFormat extends BarcodeFormatFlag<string, number> ? true : false
>
type ReadBarcodeExportsFormat = Assert<
    Barcode['format'] extends BarcodeFormat ? true : false
>
type PublicFlagTypeIsExported = Assert<
    BarcodeFormatFlag<'QRCode', 8273> extends PublicBarcodeFormatFlag<'QRCode', 8273>
        ? true
        : false
>
type NoneIsNotSelectable = Assert<
    BarcodeFormatFlag<'None', 0> extends BarcodeFormats ? false : true
>
type BarcodeFormatsDescribesMultipleFormats = Assert<
    readonly [
        BarcodeFormatFlag<'QRCode', 8273>,
        BarcodeFormatFlag<'DataMatrix', 8292>
    ] extends BarcodeFormats ? true : false
>
type PublicBarcodeFormatsMatchesGenerated = Assert<
    BarcodeFormats extends PublicBarcodeFormats
        ? PublicBarcodeFormats extends BarcodeFormats
            ? true
            : false
        : false
>

declare const module: MainModule
declare const reader: Reader
const qrCode: BarcodeFormatFlag<'QRCode', 8273> = module.BarcodeFormat.QRCode
const formats: BarcodeFormats = [
    module.BarcodeFormat.QRCode,
    module.BarcodeFormat.DataMatrix
]

new module.Reader(qrCode)
new module.Reader(formats)

// Dimensions describe native buffer state and must only change through resizeBuf().
// @ts-expect-error width is readonly
reader.width = 1
// @ts-expect-error height is readonly
reader.height = 1

export type {
    BarcodeFormatsDescribesMultipleFormats,
    BarcodeFormatUsesNamedFlags,
    NoneIsNotSelectable,
    PublicFlagTypeIsExported,
    PublicBarcodeFormatsMatchesGenerated,
    ReadBarcodeExportsFormat
}
