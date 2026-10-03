// در بایت‌های ضبط‌شده دنبال چند رشته می‌گردد:  node find.mjs conn1 shop.test TOPSECRET secret-path "IE Class Test CA"
import { readFileSync } from 'node:fs'
const [prefix, ...needles] = process.argv.slice(2)
for (const dir of ['client-to-server', 'server-to-client']) {
  const buf = readFileSync(`${prefix}-${dir}.bin`)
  console.log(`${dir}: ${buf.length} bytes`)
  for (const s of needles) console.log(`  ${buf.includes(Buffer.from(s)) ? 'دیده شد ' : 'دیده نشد'}  ${s}`)
}
