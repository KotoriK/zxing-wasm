import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const nativeFetch = globalThis.fetch
globalThis.window = {}
globalThis.fetch = async (input, init) => {
    const url = input instanceof URL ? input : new URL(input)

    if (url.protocol === 'file:') {
        return new Response(await readFile(url), {
            headers: { 'Content-Type': 'application/wasm' }
        })
    }

    return nativeFetch(input, init)
}

test('BarcodeFormat exposes named flags accepted by Reader', async () => {
    const { default: init } = await import('../wasm-out/reader/zxing_reader.js')
    const module = await init()

    assert.equal(module.BarcodeFormat.QRCode.value, 8273)

    const reader = new module.Reader(module.BarcodeFormat.QRCode)
    reader.delete()
})

test('Reader accepts multiple flags and rejects invalid flags', async () => {
    const { default: init } = await import('../wasm-out/reader/zxing_reader.js')
    const module = await init()

    const reader = new module.Reader([
        module.BarcodeFormat.QRCode,
        module.BarcodeFormat.DataMatrix
    ])
    reader.delete()

    assert.throws(
        () => new module.Reader('definitely-not-a-format'),
        (error) => error instanceof TypeError && /flag object/.test(error.message)
    )
    assert.throws(
        () => new module.Reader({ value: 123456 }),
        (error) => error instanceof TypeError && /123456/.test(error.message)
    )
    assert.throws(
        () => new module.Reader(module.BarcodeFormat.None),
        (error) => error instanceof TypeError && /0/.test(error.message)
    )
})

test('Reader keeps its buffer size in sync with dimensions and channels', async () => {
    const { default: init } = await import('../wasm-out/reader/zxing_reader.js')
    const module = await init()
    const reader = new module.Reader(2, 3, module.BarcodeFormat.QRCode)

    assert.equal(reader.getBufSize(), 6)
    reader.setChannel(4)
    assert.equal(reader.getBufSize(), 24)
    const rgbaOffset = reader.getBufOffset()
    reader.setChannel(1)
    reader.setChannel(4)
    assert.equal(reader.getBufOffset(), rgbaOffset)
    reader.resizeBuf(4, 5)
    assert.equal(reader.getBufSize(), 80)
    assert.equal(reader.width, 4)
    assert.equal(reader.height, 5)
    reader.setChannel(1)
    assert.equal(reader.getBufSize(), 20)

    reader.delete()

    assert.throws(
        () => new module.Reader(-1, 1),
        (error) => error instanceof TypeError && /non-negative/.test(error.message)
    )
})

test('decoded Barcode exposes its format flag', async () => {
    const [{ default: readerInit }, { default: writerInit }] = await Promise.all([
        import('../wasm-out/reader/zxing_reader.js'),
        import('../wasm-out/writer/zxing_writer.js')
    ])
    const [readerModule, writerModule] = await Promise.all([readerInit(), writerInit()])
    const image = writerModule.writeBarcodeToImage(
        'format-test', writerModule.WriterBarcodeFormat.QRCode, '', 4, 0, false, true
    )
    const reader = new readerModule.Reader(
        image.width, image.height, readerModule.BarcodeFormat.QRCode
    )
    readerModule.HEAPU8.set(image.data, reader.getBufOffset())

    const barcodes = reader.read()
    const barcode = barcodes.get(0)
    assert.ok(barcode)
    assert.equal(barcode.format, readerModule.BarcodeFormat.QRCode)

    barcode.delete()
    barcodes.delete()
    reader.delete()
})
