// خودآزمایی تمرین ۷:  node check/check.mjs [مسیر client.mjs]
// پیش از اجرا:  QUOTA=5 WINDOW=2 node server.mjs   (پورت 8831؛ سرور را تازه بالا بیاورید تا نوبت‌ها خالی باشد)
import path from 'node:path'
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'
import { run } from './tests.mjs'

const wanted = process.argv[2] || (fs.existsSync('client.mjs') ? 'client.mjs' : 'starter/client.mjs')
const { callWithRetry } = await import(pathToFileURL(path.resolve(wanted)).href)
console.log(`client: ${wanted}\n`)
const { ok, total } = await run({ callWithRetry })
process.exit(ok === total ? 0 : 1)
