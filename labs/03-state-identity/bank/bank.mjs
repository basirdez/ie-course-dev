// بانک آزمایشی با نشست کوکی‌محور:  node bank/bank.mjs   →  http://localhost:8771
// عمداً هیچ دفاعی در برابر CSRF ندارد؛ فقط attribute کوکی را می‌شود عوض کرد: /login?samesite=lax|strict|none
import http from 'node:http'
import crypto from 'node:crypto'

const sessions = new Map()          // sid → { user, balance }
const seen = []                      // هر درخواست: مسیر، کوکی داشت یا نه، و هدرهای مبدأ
const form = req => new Promise((ok) => { let b = ''; req.on('data', c => (b += c)); req.on('end', () => ok(new URLSearchParams(b))) })
const cookies = req => Object.fromEntries((req.headers.cookie || '').split(';').map(c => c.trim().split('=')).filter(p => p[0]))
const page = `<!doctype html><meta charset="utf-8"><title>bank</title>
<h1>بانک آزمایشی</h1><pre id="me"></pre>
<form method="post" action="/login"><input name="user" value="ali">
<select name="samesite"><option value="">بدون SameSite</option><option>lax</option><option>strict</option><option>none</option></select><button>ورود</button></form>
<script>fetch('/me').then(r => r.text()).then(t => (document.getElementById('me').textContent = t))</script>`

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x')
  const sid = cookies(req).sid
  const s = sessions.get(sid)
  const send = (code, text, h = {}) => { res.writeHead(code, { 'Content-Type': 'text/plain; charset=utf-8', ...h }); res.end(text + '\n') }
  if (url.pathname !== '/log') seen.push({ method: req.method, path: url.pathname, cookie: Boolean(s), origin: req.headers.origin || '-', site: req.headers['sec-fetch-site'] || '-' })

  if (req.method === 'GET' && url.pathname === '/') { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); return res.end(page) }
  if (req.method === 'POST' && url.pathname === '/login') {
    const f = await form(req)
    const id = crypto.randomBytes(8).toString('hex')
    sessions.set(id, { user: f.get('user') || 'ali', balance: 1000 })
    const mode = url.searchParams.get('samesite') || f.get('samesite')
    const attr = mode ? `; SameSite=${mode[0].toUpperCase()}${mode.slice(1)}${mode === 'none' ? '; Secure' : ''}` : ''
    const setCookie = `sid=${id}; Path=/; HttpOnly${attr}`
    if ((req.headers.accept || '').includes('text/html')) { res.writeHead(303, { Location: '/', 'Set-Cookie': setCookie }); return res.end() }   // از فرم مرورگر
    return send(200, 'logged in', { 'Set-Cookie': setCookie })
  }
  if (url.pathname === '/me') return s ? send(200, `user=${s.user} balance=${s.balance}`) : send(401, 'not logged in')
  if (req.method === 'POST' && url.pathname === '/transfer') {
    if (!s) return send(401, 'not logged in')
    const f = await form(req)
    s.balance -= Number(f.get('amount') || 0)
    return send(200, `transferred ${f.get('amount')} to ${f.get('to')}; balance=${s.balance}`)
  }
  if (req.method === 'POST' && url.pathname === '/logout') { sessions.delete(sid); return send(200, 'bye', { 'Set-Cookie': 'sid=; Path=/; Max-Age=0' }) }
  if (url.pathname === '/log') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify(seen)) }
  send(404, 'not found')
}).listen(8771, () => console.log('bank: http://localhost:8771'))
