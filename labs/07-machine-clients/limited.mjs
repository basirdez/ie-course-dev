// یک API با سقف نرخ:  node limited.mjs   →  http://127.0.0.1:8821
//   GET /work     هر کلاینت (از روی Authorization، وگرنه نشانی) در هر WINDOW ثانیه فقط QUOTA درخواست
//   GET /stats    سرور چند درخواست دید، چند تا را با 429 رد کرد، و بزرگ‌ترین موج در ۱۰۰ میلی‌ثانیه (بعد از نیم ثانیهٔ اول)
//   POST /reset   صفر کردن شمارنده‌ها
// پاسخ 429 سه چیز می‌گوید: Retry-After (ثانیه)، و RateLimit-Policy و RateLimit به قالب draft-ietf-httpapi-ratelimit-headers
import http from 'node:http'

const QUOTA = Number(process.env.QUOTA || 5), WINDOW = Number(process.env.WINDOW || 1)      // پنج درخواست در هر ثانیه
const SHARED = process.env.SHARED === '1'                                                    // یک سقف برای همه (مثل ظرفیت خود سرور)
const buckets = new Map()                       // کلید → { start, used }
let seen = 0, rejected = 0, perTick = new Map(), t0 = Date.now()

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x')
  if (url.pathname === '/stats') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ seen, rejected, served: seen - rejected, firstBurst: perTick.get(0) || 0, peakLater: Math.max(0, ...[...perTick].filter(([t]) => t >= 5).map(([, n]) => n)) }) + '\n') }
  if (url.pathname === '/reset') { seen = rejected = 0; perTick = new Map(); buckets.clear(); t0 = Date.now(); res.writeHead(204); return res.end() }

  seen++
  const tick = Math.floor((Date.now() - t0) / 100); perTick.set(tick, (perTick.get(tick) || 0) + 1)
  const key = SHARED ? 'all' : (req.headers.authorization || req.socket.remoteAddress)
  const now = Date.now()
  let b = buckets.get(key)
  if (!b || now - b.start >= WINDOW * 1000) { b = { start: now, used: 0 }; buckets.set(key, b) }
  const resetIn = Math.max(1, Math.ceil((b.start + WINDOW * 1000 - now) / 1000))
  const policy = { 'RateLimit-Policy': `"default";q=${QUOTA};w=${WINDOW}` }
  if (b.used >= QUOTA) {
    rejected++
    res.writeHead(429, { ...policy, 'RateLimit': `"default";r=0;t=${resetIn}`, 'Retry-After': String(resetIn), 'Content-Type': 'application/json' })
    return res.end('{"error":"rate_limit_error"}\n')
  }
  b.used++
  res.writeHead(200, { ...policy, 'RateLimit': `"default";r=${QUOTA - b.used};t=${resetIn}`, 'Content-Type': 'application/json' })
  res.end('{"ok":true}\n')
}).listen(8821, () => console.log(`http://127.0.0.1:8821   quota ${QUOTA} per ${WINDOW}s${SHARED ? ' (shared)' : ' per client'}`))
