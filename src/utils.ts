export async function* listAllVideoDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices()
    for (const device of devices) {
        if (device.kind === 'videoinput' || (device as any).kind === 'video') {
            yield {
                ...device,
                deviceId: device.deviceId || (device as any).id,
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
