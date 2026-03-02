// Inspect SS-4 PDF field names
import { PDFDocument } from 'pdf-lib'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pdfPath = path.join(__dirname, '..', 'public', 'form-ss4.pdf')

const pdfBytes = fs.readFileSync(pdfPath)
const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true })
const form = pdfDoc.getForm()

const fields = form.getFields()
console.log(`\n📋 SS-4 PDF tiene ${fields.length} campos:\n`)
fields.forEach((f, i) => {
    const name = f.getName()
    const type = f.constructor.name
    console.log(`  [${String(i + 1).padStart(3, '0')}] ${type.padEnd(16)} "${name}"`)
})
console.log('\n✅ Fin del diagnóstico\n')
