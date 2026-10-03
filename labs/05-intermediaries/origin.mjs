// سرور اصلی دموهای جلسهٔ ۵:  node origin.mjs   →  http://127.0.0.1:8791   (با اصلاح: FIX=1 node origin.mjs)
// هر درخواستی را که واقعاً به اینجا برسد لاگ می‌کند؛ اگر خطی چاپ نشد، یعنی cache جواب داده است.
import http from 'node:http'
const FIX = Boolean(process.env.FIX)
const cookies = req => Object.fromEntries((req.headers.cookie || '').split(';').map(c => c.trim().split('=')).filter(p => p[0]))
const hits = new Map()            // نشانی کلاینت → تعداد درخواست به /limited
let reportVersion = 1

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x')
  const inm = req.headers['if-none-match']
  console.log(`origin ← ${req.method} ${req.url}${inm ? `  If-None-Match: ${inm}` : ''}${req.headers.cookie ? `  Cookie: ${req.headers.cookie}` : ''}  XFF: ${req.headers['x-forwarded-for'] || '-'}`)
  const text = (code, body, h = {}) => { res.writeHead(code, { 'Content-Type': 'text/plain; charset=utf-8', ...h }); res.end(code === 304 ? undefined : body + '\n') }

  if (url.pathname === '/report') {                     // تازگی و اعتبارسنجی
    const etag = `"r${reportVersion}"`
    const h = { 'Cache-Control': 'max-age=5', ETag: etag }
    return inm === etag ? text(304, '', h) : text(200, `report version ${reportVersion}, generated at ${new Date().toISOString().slice(11, 19)}`, h)
  }
  if (url.pathname === '/report/update') { reportVersion++; return text(200, `report is now version ${reportVersion}`) }
  if (url.pathname === '/account') {                    // پاسخ شخصی؛ بدون FIX، قابل نگه‌داری در cache مشترک
    const user = cookies(req).user || 'guest'
    return text(200, `account page of ${user}: balance, address, last orders`, { 'Cache-Control': FIX ? 'private, max-age=30' : 'max-age=30' })
  }
  if (url.pathname === '/limited') {                    // محدودیت نرخ با «نشانی کلاینت»
    const xff = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress).split(',').map(s => s.trim())
    const client = FIX ? xff[xff.length - 1] : xff[0]   // درست: آخرین مقداری که proxy خودمان افزوده؛ غلط: اولین مقدار
    const n = (hits.get(client) || 0) + 1; hits.set(client, n)
    return n > 3 ? text(429, `too many requests from ${client}`, { 'Retry-After': '30' }) : text(200, `request ${n} of 3 from ${client}`)
  }
  text(404, 'not found')
}).listen(8791, () => console.log(`origin: http://127.0.0.1:8791${FIX ? '  (FIX)' : ''}`))
