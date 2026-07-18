import type BarcodeReader from "./reader.js"

export default function createStreamReader(reader: BarcodeReader, stream: MediaStream) {
    const track = stream.getVideoTracks()[0]
    let pause = false
    let started = false
    /**
     * Barcodes is borrowed by the callback and released after its returned promise settles.
     */
    const start = async function start(
        onResult: (barcodes: ReturnType<BarcodeReader['readVF']>) => void | Promise<void>
    ) {
        if (started) {
            throw new Error('Already started')
        }
        started = true
        pause = false
        try {
            const settings = track.getSettings()
            reader.resize(settings.width, settings.height)
            for await (const frame of new MediaStreamTrackProcessor({ track }).readable) {
                let barcodes: ReturnType<BarcodeReader['readVF']> | undefined
                try {
                    if (pause) {
                        return
                    }
                    barcodes = reader.readVF(frame)
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
