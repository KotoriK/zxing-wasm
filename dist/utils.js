export async function* listAllVideoDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    for (const device of devices) {
        if (device.kind === 'videoinput' || device.kind === 'video') {
            yield {
                deviceId: device.deviceId || device.id,
                groupId: device.groupId,
                kind: device.kind,
                label: device.label,
            };
        }
    }
}
export async function accuireUserMediaVideoStream(deviceId) {
    return await navigator.mediaDevices.getUserMedia({
        video: deviceId ? {
            deviceId: { exact: deviceId },
        } : {
            facingMode: 'environment',
        },
    });
}
