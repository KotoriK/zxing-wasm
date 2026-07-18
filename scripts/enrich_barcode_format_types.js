import { readFile, writeFile } from 'node:fs/promises'

const [file] = process.argv.slice(2)
if (!file) {
    throw new Error('usage: node enrich_barcode_format_types.js <zxing_reader.d.ts>')
}

let source = await readFile(file, 'utf8')
if (source.includes('export interface BarcodeFormatFlag<')) {
    process.exit(0)
}

const moduleEntry = source.match(/  BarcodeFormat: \{([^\n]+)\};/)
if (!moduleEntry) {
    throw new Error('BarcodeFormat module entry not found')
}

const namesByValue = new Map()
for (const match of moduleEntry[1].matchAll(/([A-Za-z_$][\w$]*): BarcodeFormatValue<(\d+)>/g)) {
    const [, name, value] = match
    if (namesByValue.has(value)) {
        throw new Error(`duplicate BarcodeFormat value ${value}`)
    }
    namesByValue.set(value, name)
}
if (namesByValue.size === 0) {
    throw new Error('BarcodeFormat values not found')
}

source = source.replace(
    /export interface BarcodeFormatValue<T extends number> \{\n  value: T;\n\}/,
    `export interface BarcodeFormatFlag<Name extends string, Value extends number> {
  /** Type-only format name; the runtime flag object exposes only value. */
  readonly __format?: Name;
  readonly value: Value;
}`
)

source = source.replace(/BarcodeFormatValue<(\d+)>/g, (_, value) => {
    const name = namesByValue.get(value)
    if (!name) {
        throw new Error(`name for BarcodeFormat value ${value} not found`)
    }
    return `BarcodeFormatFlag<'${name}', ${value}>`
})

await writeFile(file, source)
