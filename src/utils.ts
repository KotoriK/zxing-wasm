import { MainModule } from "../wasm-out/reader/zxing_reader.js"

export async function* listAllVideoDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices()
    for (const device of devices) {
        if (device.kind === 'videoinput' || (device as any).kind === 'video') {
            yield {
                deviceId: device.deviceId || (device as any).id,
                groupId: device.groupId,
                kind: device.kind,
                label: device.label,
            }
        }
    }
}
export async function accuireUserMediaVideoStream(deviceId: string | undefined) {
    return await navigator.mediaDevices.getUserMedia({
        video: deviceId ? {
            deviceId: { exact: deviceId },
        } : {
            facingMode: 'environment',
        },
    })
}
export function getUnderlyingBuffer(module: MainModule, offset: number, size: number) {
    return (module.HEAPU8 as Uint8Array).subarray(offset, offset + size)
}