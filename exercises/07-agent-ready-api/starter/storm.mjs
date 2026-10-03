// ده agent هم‌زمان با یک token، هر کدام یک درخواست:   node storm.mjs [مسیر client.mjs]
// بعد از اجرا خط‌های لاگ سرور را بشمارید: سرور برای این ده کار چند درخواست دید؟
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const { callWithRetry } = await import(pathToFileURL(path.resolve(process.argv[2] || 'client.mjs')).href)
const AGENTS = Number(process.env.AGENTS || 10), TARGET = 'http://127.0.0.1:8831/slots'
const start = Date.now()
const codes = await Promise.all(Array.from({ length: AGENTS }, async () => {
  try { const res = await callWithRetry(TARGET, { headers: { Authorization: 'Bearer agent-a' } }); await res.arrayBuffer(); return res.status } catch { return 'error' }
}))
console.log(`${AGENTS} agents finished in ${((Date.now() - start) / 1000).toFixed(1)} s   results: ${codes.join(' ')}`)
