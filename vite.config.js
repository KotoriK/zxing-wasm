import dts from 'vite-plugin-dts'
import wasm from 'vite-plugin-wasm'
/**
 * @type {import('vite').UserConfig}
 */
export default {
    plugins: [dts({ rollupTypes: true }), wasm()],
    build: {
        outDir: 'dist',
        target: "esnext",
        sourcemap: true,
        minify: false,
        lib: {
            entry: 'src/index.ts',
            name: 'index',
            formats: ['es']
        },
    }
}