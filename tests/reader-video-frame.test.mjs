import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import BarcodeReader from '../dist/reader.js'

function makeReaderFixture() {
    const heap = new Uint8Array(64)
    const result = { delete() {} }
    const state = {
        channel: 1,
        size: 0,
        width: 0,
        height: 0,
        readBytes: undefined
    }

    class Reader {
        setChannel(channel) {
            state.channel = channel
        }
        prepareBuf(width, height, channel, size) {
            state.width = width
            state.height = height
            state.channel = channel
            state.size = size
        }
        getBufOffset() {
            return 0
        }
        getBufSize() {
            return state.size
        }
        read() {
            state.readBytes = [...heap.subarray(0, state.size)]
            return result
        }
        delete() {}
    }

    const context = {
        drawImage() {
            throw new Error('Canvas fallback must not run for native YUV')
        },
        getImageData() {
            throw new Error('Canvas fallback must not run for native YUV')
        }
    }
    const canvas = {
        width: 0,
        height: 0,
        getContext: () => context
    }
    const module = {
        BarcodeFormat: { All: { value: 1 } },
        HEAPU8: heap,
        Reader
    }

    return {
        module,
        canvas,
        result,
        state
    }
}

test('VideoFrame native YUV copies directly into a luminance reader buffer', async () => {
    const fixture = makeReaderFixture()
    const reader = new BarcodeReader(fixture.module, fixture.canvas)
    let allocationCalls = 0
    const copyOptions = []
    const makeFrame = () => ({
        format: 'I420',
        visibleRect: { x: 0, y: 0, width: 2, height: 2 },
        allocationSize() {
            allocationCalls++
            return 6
        },
        async copyTo(destination, options) {
            copyOptions.push(options)
            assert.deepEqual(options.rect, { x: 0, y: 0, width: 2, height: 2 })
            destination.set([16, 32, 48, 64, 128, 128])
            return [
                { offset: 0, stride: 2 },
                { offset: 4, stride: 1 },
                { offset: 5, stride: 1 }
            ]
        }
    })

    assert.equal(await reader.readVF(makeFrame()), fixture.result)
    assert.equal(await reader.readVF(makeFrame()), fixture.result)
    assert.equal(allocationCalls, 1)
    assert.equal(copyOptions.length, 2)
    assert.equal(copyOptions[0], copyOptions[1])
    assert.deepEqual(fixture.state, {
        channel: 1,
        size: 6,
        width: 2,
        height: 2,
        readBytes: [16, 32, 48, 64, 128, 128]
    })
})

test('VideoFrame I420 luma path decodes through the real Wasm reader', async () => {
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

    const [{ default: readerInit }, { default: writerInit }] = await Promise.all([
        import('../wasm-out/reader/zxing_reader.js'),
        import('../wasm-out/writer/zxing_writer.js')
    ])
    const [readerModule, writerModule] = await Promise.all([readerInit(), writerInit()])
    const image = writerModule.writeBarcodeToImage(
        'luma-path', writerModule.WriterBarcodeFormat.QRCode, '', 4, 0, false, true
    )
    const chromaWidth = Math.ceil(image.width / 2)
    const chromaHeight = Math.ceil(image.height / 2)
    const chromaSize = chromaWidth * chromaHeight
    const allocationSize = image.data.byteLength + chromaSize * 2
    const canvas = {
        width: 0,
        height: 0,
        getContext: () => ({
            drawImage() {
                throw new Error('Canvas fallback must not run for I420')
            },
            getImageData() {
                throw new Error('Canvas fallback must not run for I420')
            }
        })
    }
    const reader = new BarcodeReader(
        readerModule,
        readerModule.BarcodeFormat.QRCode,
        canvas
    )
    const frame = {
        format: 'I420',
        visibleRect: { x: 0, y: 0, width: image.width, height: image.height },
        allocationSize: () => allocationSize,
        async copyTo(destination) {
            destination.set(image.data)
            destination.fill(128, image.data.byteLength)
            return [
                { offset: 0, stride: image.width },
                { offset: image.data.byteLength, stride: chromaWidth },
                { offset: image.data.byteLength + chromaSize, stride: chromaWidth }
            ]
        }
    }

    const barcodes = await reader.readVF(frame)
    const barcode = barcodes.get(0)
    assert.ok(barcode)
    assert.equal(readerModule.getBarcodeText(barcode), 'luma-path')

    barcode.delete()
    barcodes.delete()
    reader.delete()
})
