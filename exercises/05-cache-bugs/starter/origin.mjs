// فروشگاه کوچک تمرین ۵:  node origin.mjs   →  http://127.0.0.1:8791   (پشت proxy.mjs روی 8790)
// این سرور چهار باگ cache دارد. منطق برنامه درست است؛ فقط header‌ها (و نشانی فایل ثابت) را عوض کنید.
import http from 'node:http'

let version = 1            // با هر «انتشار» یکی زیاد می‌شود:  POST /deploy
let price = 100            // قیمت کالا؛ فروشنده عوضش می‌کند:   POST /price?value=120
const cookies = req => Object.fromEntries((req.headers.cookie || '').split(';').map(c => c.trim().split('=')).filter(p => p[0]))

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x')
  console.log(`origin ← ${req.method} ${req.url}  cookie=${req.headers.cookie || '-'}  lang=${req.headers['accept-language'] || '-'}  if-none-match=${req.headers['if-none-match'] || '-'}`)
  const send = (code, type, body, h = {}) => { res.writeHead(code, { 'Content-Type': type, ...h }); res.end(body) }

  if (req.method === 'POST' && url.pathname === '/deploy') { version++; return send(200, 'text/plain', `deployed version ${version}\n`) }
  if (req.method === 'POST' && url.pathname === '/price') { price = Number(url.searchParams.get('value')); return send(200, 'text/plain', `price is now ${price}\n`) }

  if (url.pathname === '/') return send(200, 'text/html; charset=utf-8', `<!doctype html><title>shop</title><script src="/assets/app.js"></script>\n`, { 'Cache-Control': 'max-age=3600' })
  if (url.pathname === '/assets/app.js') return send(200, 'text/javascript', `console.log("app version ${version}")\n`, { 'Cache-Control': 'max-age=86400' })
  if (url.pathname === '/account') return send(200, 'text/plain; charset=utf-8', `account of ${cookies(req).user || 'guest'}\n`, { 'Cache-Control': 'max-age=30' })
  if (url.pathname === '/search') {
    const fa = /^fa/.test(req.headers['accept-language'] || '')
    return send(200, 'text/plain; charset=utf-8', `${fa ? 'نتیجه‌های جستجو برای' : 'results for'} ${url.searchParams.get('q')}\n`, { 'Cache-Control': 'max-age=60' })
  }
  if (url.pathname === '/price') return send(200, 'application/json', JSON.stringify({ price }) + '\n', { 'Cache-Control': 'max-age=3600' })
  if (url.pathname === '/stream') {                 // بخش امتیازی: پنج خط، هر ثانیه یکی
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' })
    let n = 0; const t = setInterval(() => { res.write(`line ${++n} at ${new Date().toISOString().slice(17, 23)}\n`); if (n === 5) { clearInterval(t); res.end() } }, 1000)
    return
  }
  send(404, 'text/plain', 'not found\n')
}).listen(8791, () => console.log('origin: http://127.0.0.1:8791'))
