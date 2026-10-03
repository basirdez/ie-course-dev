// خودآزمایی تمرین ۵:  node check/check.mjs
// پیش از اجرا: node origin.mjs  (پورت 8791)  و  node proxy.mjs  (پورت 8790). آزمون خودش cache را خالی می‌کند.
import { run } from './tests.mjs'
const { ok, total } = await run()
process.exit(ok === total ? 0 : 1)
