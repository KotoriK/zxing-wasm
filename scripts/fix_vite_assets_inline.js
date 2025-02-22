// https://github.com/vitejs/vite/issues/4454 
// use noInlineRE to fix
import fs from 'fs/promises'
import { basename, extname } from 'path'
// read target file name from command line
const JS_PATH = process.argv[2]
const WASM_NAME = basename(JS_PATH.replace(extname(JS_PATH), '.wasm'))
const fileContent = await fs.readFile(JS_PATH, 'utf-8')
const replacedContent = fileContent.replace(`"${WASM_NAME}",import.meta.url`, `"${WASM_NAME}?no-inline",import.meta.url`)
console.log('replaced ', WASM_NAME)
fs.writeFile(JS_PATH, replacedContent, 'utf-8')