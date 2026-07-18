import assert from 'node:assert/strict'
import test from 'node:test'

import createStreamReader from '../dist/stream-reader.js'

function makeFixture() {
    let deleted = false
    let closed = false
    let resized
    const barcodes = {
        delete() {
            deleted = true
        }
    }
    const frame = {
        close() {
            closed = true
        }
    }
    const track = {
        getSettings: () => ({ width: 320, height: 240 }),
        stop() {}
    }
    const reader = {
        resize(width, height) {
            resized = [width, height]
        },
        readVF: () => barcodes,
        delete() {}
    }
    const stream = { getVideoTracks: () => [track] }

    globalThis.MediaStreamTrackProcessor = class {
        readable = {
            async *[Symbol.asyncIterator]() {
                yield frame
            }
        }
    }

    return {
        barcodes,
        reader,
        stream,
        state: () => ({ closed, deleted, resized })
    }
}

test('stream reader awaits callback and releases Barcodes afterwards', async () => {
    const fixture = makeFixture()

    await createStreamReader(fixture.reader, fixture.stream).start(async (barcodes) => {
        assert.equal(barcodes, fixture.barcodes)
        await Promise.resolve()
        assert.equal(fixture.state().deleted, false)
    })

    assert.deepEqual(fixture.state(), {
        closed: true,
        deleted: true,
        resized: [320, 240]
    })
})

test('stream reader releases Barcodes when callback throws', async () => {
    const fixture = makeFixture()

    await assert.rejects(
        createStreamReader(fixture.reader, fixture.stream).start(() => {
            throw new Error('callback failed')
        }),
        /callback failed/
    )
    assert.equal(fixture.state().deleted, true)
    assert.equal(fixture.state().closed, true)
})
