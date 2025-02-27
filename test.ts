import { BarcodeReader, init } from './src'
import WebGPUImageLumExtractor from './src/lum'

/* const cameraStream = await navigator.mediaDevices.getDisplayMedia()
 */const cameraStream = await navigator.mediaDevices.getUserMedia({
    video: {
        facingMode: 'environment',
    }
})
const video = document.createElement('video')
video.srcObject = cameraStream
document.body.appendChild(video)
video.play()
video.style.width = '50%'
const previewCanvas = document.createElement('canvas')
const ctx = previewCanvas.getContext('2d')
const track = cameraStream.getVideoTracks()[0]
document.body.appendChild(previewCanvas)
previewCanvas.style.width = '100%'

async function* readStream(track: MediaStreamVideoTrack) {
    for await (const frame of new MediaStreamTrackProcessor({ track: track }).readable) {
        yield frame
    }
}
const lum = new WebGPUImageLumExtractor()

async function* iterateBarcodes(track: MediaStreamVideoTrack) {
    const reader = new BarcodeReader(await init())
    const { width, height } = track.getSettings()
    if (!width || !height) {
        throw new TypeError('invalid width or height')
    }
    reader.resize(width, height)

    for await (const frame of readStream(track)) {
        performance.mark('read start')
        const vector = reader.readVF(frame)
        performance.mark('read end')
        performance.measure('read', 'read start', 'read end')

        frame.close()
        for (let i = 0; i < vector.size(); i++) {
            const res = vector.get(i)!
            yield res
        }
    }
}
for await (const res of iterateBarcodes(track)) {
    console.log(res)
}


/* await lum.init()
const iterator = readStream(track)
const { value: firstFrame, } = await iterator.next()
let width, height
if (firstFrame) {
    width = firstFrame.displayWidth
    height = firstFrame.displayHeight
    lum.resize(width, height)
     previewCanvas.width = width
    previewCanvas.height = height 
} */

/* for await (const frame of iterator) {
    const arr = new Uint8ClampedArray(width! * height!)
    console.log(frame.format)
    performance.mark('lum start')
    await lum.extractVideoFrame(frame, arr)
    performance.mark('lum end')
    performance.measure('lum', 'lum start', 'lum end')
    const finalData = new Uint8ClampedArray(width! * height! * 4)
    for (let i = 0; i < arr.length; i++) {
        finalData[i * 4] = arr[i]
        finalData[i * 4 + 1] = arr[i]
        finalData[i * 4 + 2] = arr[i]
        finalData[i * 4 + 3] = 255
    }
    const imageData = new ImageData(finalData, width!, height!)
    ctx?.putImageData(imageData, 0, 0)
    frame.close()
} */