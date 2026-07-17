import { MainModule } from "../wasm-out/reader/zxing_reader.js";
export declare function listAllVideoDevices(): AsyncGenerator<{
    deviceId: any;
    groupId: string;
    kind: MediaDeviceKind;
    label: string;
}, void, unknown>;
export declare function accuireUserMediaVideoStream(deviceId: string | undefined): Promise<MediaStream>;
export declare function getUnderlyingBuffer(module: MainModule, offset: number, size: number): Uint8Array<ArrayBufferLike>;
