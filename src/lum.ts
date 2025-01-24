// turn rgba images to luminance images
interface IImageLumExtractor<S extends CanvasImageSource = CanvasImageSource> {
    /**
     * resize underlying resouces
     * @param width 
     * @param height 
     */
    resize(width: number, height: number): void
    extract(source: CanvasImageSource, toArray: Uint8ClampedArray | Uint8Array): Promise<void>
}

export default class WebGPUImageLumExtractor /* implements IImageLumExtractor */ {
    #adapter: GPUAdapter | null = null;
    #device: GPUDevice | null = null;
    #computePipeline: GPUComputePipeline | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;
    #outputBuffer: GPUBuffer | null = null;
    #readBuffer: GPUBuffer | null = null;

    #width: number = 0
    #height: number = 0

    async init() {
        if (!navigator.gpu) {
            throw new Error("WebGPU not supported");
        }

        this.#adapter = await navigator.gpu.requestAdapter({
            powerPreference: "high-performance"
        });
        if (!this.#adapter) {
            throw new Error("No adapter found");
        }

        this.#device = await this.#adapter.requestDevice();

        const shaderRaw = await import('./shaders/lum-rgba.wgsl?raw')
        const computeShader = this.#device.createShaderModule({
            code: shaderRaw.default
        });

        // 更新bindGroupLayout以支持外部纹理
        this.#bindGroupLayout = this.#device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    externalTexture: {} // 使用外部纹理
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: { type: "storage" }
                }
            ]
        });

        const pipelineLayout = this.#device.createPipelineLayout({
            bindGroupLayouts: [this.#bindGroupLayout]
        });

        this.#computePipeline = await this.#device.createComputePipelineAsync({
            layout: pipelineLayout,
            compute: {
                module: computeShader,
                entryPoint: "main"
            }
        });
    }
    resize(width: number, height: number): void {
        if (width !== this.#width || height !== this.#height) {
            if (this.#outputBuffer) {
                this.#outputBuffer.destroy();
            }
            if (this.#readBuffer) {
                this.#readBuffer.destroy();
            }
            const size = width * height

            this.#outputBuffer = this.#device!.createBuffer({
                size: size,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            });
            this.#readBuffer = this.#device!.createBuffer({
                size: size,
                usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
            });
            this.#width = width
            this.#height = height
        }
    }

    async extractVideoFrame(source: VideoFrame, toArray: Uint8ClampedArray | Uint8Array): Promise<void> {
        const externalTexture = this.#device!.importExternalTexture({
            source: source
        });

        // 创建绑定组
        const bindGroup = this.#device!.createBindGroup({
            layout: this.#bindGroupLayout!,
            entries: [
                { binding: 0, resource: externalTexture },
                { binding: 1, resource: { buffer: this.#outputBuffer! } }
            ]
        });

        // 创建命令编码器
        const commandEncoder = this.#device!.createCommandEncoder();
        const computePass = commandEncoder.beginComputePass();

        computePass.setPipeline(this.#computePipeline!);
        computePass.setBindGroup(0, bindGroup);
        computePass.dispatchWorkgroups(
            Math.ceil(this.#width / 16 * 4),
            this.#height
        );
        computePass.end();

        // 读取结果
        const readBuffer = this.#readBuffer!

        commandEncoder.copyBufferToBuffer(
            this.#outputBuffer!, 0,
            readBuffer, 0,
            toArray.byteLength
        );

        // 提交命令
        this.#device!.queue.submit([commandEncoder.finish()]);

        // 读取结果到目标数组
        await readBuffer.mapAsync(GPUMapMode.READ);
        const copyArray = new Uint8Array(readBuffer.getMappedRange());
        toArray.set(copyArray);
        readBuffer.unmap();
    }
}
