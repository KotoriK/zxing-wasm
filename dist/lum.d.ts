export default class WebGPUImageLumExtractor {
    #private;
    init(): Promise<void>;
    resize(width: number, height: number): void;
    extractVideoFrame(source: VideoFrame, toArray: Uint8ClampedArray | Uint8Array): Promise<void>;
}
