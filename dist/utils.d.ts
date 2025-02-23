export declare function listAllVideoDevices(): AsyncGenerator<{
    deviceId: any;
    groupId: string;
    kind: MediaDeviceKind;
    label: string;
}, void, unknown>;
export declare function accuireUserMediaVideoStream(deviceId: string | undefined): Promise<MediaStream>;
