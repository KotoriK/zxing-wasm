export default function createStreamReader(reader, stream) {
    const track = stream.getVideoTracks()[0];
    let pause = false;
    let started = false;
    const start = async function start(onResult) {
        if (started) {
            throw new Error('Already started');
        }
        started = true;
        pause = false;
        const settings = track.getSettings();
        reader.resize(settings.width, settings.height);
        for await (const frame of new MediaStreamTrackProcessor({ track }).readable) {
            try {
                if (pause) {
                    return;
                }
                const barcodes = reader.readVF(frame);
                onResult(barcodes);
            }
            finally {
                frame.close();
            }
        }
        started = false;
    };
    return {
        start,
        stop: () => {
            pause = true;
            track.stop();
            reader.delete();
        }
    };
}
