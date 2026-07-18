import type BarcodeReader from "./reader.js"

export default function createStreamReader(reader: BarcodeReader, stream: MediaStream) {
    type Barcodes = Awaited<ReturnType<BarcodeReader['readVF']>>
    const track = stream.getVideoTracks()[0]
    let pause = false
    let started = false
    /**
     * Barcodes is borrowed by the callback and released after its returned promise settles.
     */
    const start = async function start(
        onResult: (barcodes: Barcodes) => void | Promise<void>
    ) {
        if (started) {
            throw new Error('Already started')
        }
        started = true
        pause = false
        try {
            for await (const frame of new MediaStreamTrackProcessor({ track }).readable) {
                let barcodes: Barcodes | undefined
                try {
                    if (pause) {
                        return
                    }
                    barcodes = await reader.readVF(frame)
                    await onResult(barcodes)
                } finally {
                    barcodes?.delete()
                    frame.close()
                }
            }
        } finally {
            started = false
        }
    }
    return {
        start,
        stop: () => {
            pause = true
            track.stop()
            reader.delete()
        }
    }
}
