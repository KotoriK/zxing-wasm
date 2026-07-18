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

test('WriterBarcodeFormat only exposes creatable formats', async () => {
    const { default: init } = await import('../wasm-out/writer/zxing_writer.js')
    const module = await init()

    assert.equal(module.WriterBarcodeFormat.QRCode, 'QRCode')
    assert.equal(module.WriterBarcodeFormat.QRCodeModel1, undefined)
    assert.equal(module.WriterBarcodeFormat.AllCreatable, undefined)
    assert.match(
        module.writeBarcodeToSVG('text', module.WriterBarcodeFormat.QRCode, '', 1, 0, false, true),
        /<svg\b/
    )

    assert.throws(
        () => module.writeBarcodeToSVG(
            'text', 'definitely-not-a-format', '', 1, 0, false, true
        ),
        (error) => String(error?.message).includes('definitely-not-a-format')
    )
    assert.throws(
        () => module.writeBarcodeToSVG(
            'text', 'QRCodeModel1', '', 1, 0, false, true
        ),
        (error) => error instanceof TypeError
            && /not writable/.test(error.message)
            && /QRCodeModel1/.test(error.message)
    )
})
