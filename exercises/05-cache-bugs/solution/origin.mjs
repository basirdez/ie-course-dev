// پاسخ مرجع تمرین ۵ (خصوصی). تغییرها نسبت به starter با «اصلاح» علامت خورده‌اند.
import http from 'node:http'
import crypto from 'node:crypto'

let version = 1
let price = 100
const cookies = req => Object.fromEntries((req.headers.cookie || '').split(';').map(c => c.trim().split('=')).filter(p => p[0]))
const appJs = () => `console.log("app version ${version}")\n`
const hash = text => crypto.createHash('sha256').update(text).digest('hex').slice(0, 8)

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x')
  console.log(`origin ← ${req.method} ${req.url}  cookie=${req.headers.cookie || '-'}  lang=${req.headers['accept-language'] || '-'}  if-none-match=${req.headers['if-none-match'] || '-'}`)
  const send = (code, type, body, h = {}) => { res.writeHead(code, { 'Content-Type': type, ...h }); res.end(body) }

  if (req.method === 'POST' && url.pathname === '/deploy') { version++; return send(200, 'text/plain', `deployed version ${version}\n`) }
  if (req.method === 'POST' && url.pathname === '/price') { price = Number(url.searchParams.get('value')); return send(200, 'text/plain', `price is now ${price}\n`) }

  // اصلاح ۳: HTML هر بار پرسیده می‌شود و نام فایل، اثر انگشت محتواست؛ خود فایل یک سال می‌ماند
  if (url.pathname === '/') return send(200, 'text/html; charset=utf-8', `<!doctype html><title>shop</title><script src="/assets/app.${hash(appJs())}.js"></script>\n`, { 'Cache-Control': 'no-cache' })
  const asset = url.pathname.match(/^\/assets\/app\.([0-9a-f]{8})\.js$/)
  if (asset) return asset[1] === hash(appJs()) ? send(200, 'text/javascript', appJs(), { 'Cache-Control': 'public, max-age=31536000, immutable' }) : send(404, 'text/plain', 'not found\n')
  // اصلاح ۱: پاسخ شخصی فقط در cache مرورگر همان کاربر
  if (url.pathname === '/account') return send(200, 'text/plain; charset=utf-8', `account of ${cookies(req).user || 'guest'}\n`, { 'Cache-Control': 'private, max-age=30' })
  if (url.pathname === '/search') {
    const fa = /^fa/.test(req.headers['accept-language'] || '')
    // اصلاح ۲: زبان جزء کلید cache می‌شود
    return send(200, 'text/plain; charset=utf-8', `${fa ? 'نتیجه‌های جستجو برای' : 'results for'} ${url.searchParams.get('q')}\n`, { 'Cache-Control': 'max-age=60', Vary: 'Accept-Language' })
  }
  if (url.pathname === '/price') {
    // اصلاح ۴: همیشه بپرس، ولی پرسیدن ارزان باشد
    const etag = `"p${price}"`
    const h = { 'Cache-Control': 'no-cache', ETag: etag }
    if (req.headers['if-none-match'] === etag) { res.writeHead(304, h); return res.end() }
    return send(200, 'application/json', JSON.stringify({ price }) + '\n', h)
  }
  if (url.pathname === '/stream') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' })
    let n = 0; const t = setInterval(() => { res.write(`line ${++n} at ${new Date().toISOString().slice(17, 23)}\n`); if (n === 5) { clearInterval(t); res.end() } }, 1000)
    return
  }
  send(404, 'text/plain', 'not found\n')
}).listen(8791, () => console.log('origin (solution): http://127.0.0.1:8791'))
