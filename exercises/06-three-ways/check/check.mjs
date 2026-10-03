// خودآزمایی تمرین ۶:  node check/check.mjs          (آزمون اختیاری کلاینت کُند:  node check/check.mjs --slow)
// پیش از اجرا:  HEARTBEAT=1000 node server.mjs      (پورت 8811)
import { run } from './tests.mjs'
const { ok, total } = await run({ slow: process.argv.includes('--slow') })
process.exit(ok === total ? 0 : 1)
