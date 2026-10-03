// پاسخ مرجع تمرین ۳ (خصوصی).   node server.mjs 8000
import http from 'node:http'
import crypto from 'node:crypto'

const port = Number(process.argv[2] || 8000)
const SAMESITE = process.env.SAMESITE || 'Lax'
const ALLOWED_ORIGIN = 'http://localhost:9000'       // تنها origin که اجازهٔ خواندن /api/me دارد
const sessions = new Map()

const readForm = req => new Promise((ok) => { let b = ''; req.on('data', c => (b += c)); req.on('end', () => ok(new URLSearchParams(b))) })
const cookies = req => Object.fromEntries((req.headers.cookie || '').split(';').map(c => c.trim().split('=')).filter(p => p[0]))
const page = `<!doctype html><meta charset="utf-8"><title>ex03</title><pre id="me"></pre>
<form method="post" action="/login"><input name="user" value="ali"><button>ورود</button></form>
<form method="post" action="/transfer"><input name="to" value="sara"><input name="amount" value="100"><button>انتقال</button></form>
<script>fetch('/me').then(r => r.text()).then(t => (document.getElementById('me').textContent = t))</script>`

http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://x')
  const sid = cookies(req).sid
  const s = sessions.get(sid)
  const site = req.headers['sec-fetch-site']
  console.log(`${req.method} ${pathname} session=${s ? 'yes' : 'no'} origin=${req.headers.origin || '-'} sec-fetch-site=${site || '-'}`)
  const send = (code, text, h = {}) => { res.writeHead(code, { 'Content-Type': 'text/plain; charset=utf-8', ...h }); res.end(text + '\n') }

  if (req.method === 'GET' && pathname === '/') { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); return res.end(page) }
  if (req.method === 'POST' && pathname === '/login') {
    const f = await readForm(req)
    const id = crypto.randomBytes(16).toString('base64url')          // ۱۲۸ بیت تصادفی
    sessions.set(id, { user: f.get('user') || 'ali', balance: 1000 })
    const attr = SAMESITE === 'off' ? '' : `; SameSite=${SAMESITE}${SAMESITE === 'None' ? '; Secure' : ''}`
    const setCookie = `sid=${id}; Path=/; HttpOnly${attr}`
    if ((req.headers.accept || '').includes('text/html')) { res.writeHead(303, { Location: '/', 'Set-Cookie': setCookie }); return res.end() }
    return send(200, 'logged in', { 'Set-Cookie': setCookie })
  }
  if (req.method === 'GET' && pathname === '/me') return s ? send(200, `user=${s.user} balance=${s.balance}`) : send(401, 'not logged in')
  if (req.method === 'GET' && pathname === '/api/me') {
    const cors = req.headers.origin === ALLOWED_ORIGIN ? { 'Access-Control-Allow-Origin': ALLOWED_ORIGIN, 'Access-Control-Allow-Credentials': 'true' } : {}
    res.writeHead(s ? 200 : 401, { 'Content-Type': 'application/json', Vary: 'Origin', ...cors })
    return res.end(JSON.stringify(s ? { user: s.user, balance: s.balance } : { error: 'not logged in' }) + '\n')
  }
  if (req.method === 'POST' && pathname === '/transfer') {
    if (!s) return send(401, 'not logged in')
    // دفاع دوم: فقط درخواستی که از همین origin شروع شده، یا کلاینت غیرمرورگر (بدون Sec-Fetch-Site)
    if (site && site !== 'same-origin' && site !== 'none') return send(403, `rejected: sec-fetch-site=${site}`)
    const f = await readForm(req)
    s.balance -= Number(f.get('amount') || 0)
    return send(200, `transferred ${f.get('amount')} to ${f.get('to')}; balance=${s.balance}`)
  }
  if (req.method === 'POST' && pathname === '/logout') { sessions.delete(sid); return send(200, 'bye', { 'Set-Cookie': 'sid=; Path=/; Max-Age=0' }) }
  send(404, 'not found')
}).listen(port, () => console.log(`http://localhost:${port}  SameSite=${SAMESITE}`))
