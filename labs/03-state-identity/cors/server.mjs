// CORS را مرورگر اجرا می‌کند، نه سرور:  node cors/server.mjs   →  http://127.0.0.1:8773
// فقط به origin مجاز اجازهٔ خواندن می‌دهد، ولی هر درخواستی را که برسد اجرا می‌کند.
import http from 'node:http'
const ALLOWED = 'https://app.example'
let balance = 1000
http.createServer((req, res) => {
  const origin = req.headers.origin
  const cors = origin === ALLOWED ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Credentials': 'true', Vary: 'Origin' } : { Vary: 'Origin' }
  if (req.method === 'OPTIONS') {       // preflight
    const ok = origin === ALLOWED
    res.writeHead(204, ok ? { ...cors, 'Access-Control-Allow-Methods': 'GET, POST, DELETE', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600' } : cors)
    return res.end()
  }
  if (req.url === '/api/balance') { res.writeHead(200, { 'Content-Type': 'application/json', ...cors }); return res.end(JSON.stringify({ balance }) + '\n') }
  if (req.method === 'POST' && req.url === '/api/transfer') {
    balance -= 100                        // کار انجام شد، پیش از آنکه مرورگر دربارهٔ خواندن پاسخ تصمیم بگیرد
    res.writeHead(200, { 'Content-Type': 'application/json', ...cors }); return res.end(JSON.stringify({ ok: true, balance }) + '\n')
  }
  res.writeHead(404, cors); res.end()
}).listen(8773, () => console.log('api: http://127.0.0.1:8773/api/balance'))
