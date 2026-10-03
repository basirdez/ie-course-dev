// هر پاسخ ۳۰۰ میلی‌ثانیه طول می‌کشد:  node mux/server.mjs
//   HTTP/1.1 روی 8782   و   HTTP/2 بی‌رمز (h2c) روی 8781
// سرور برای هر درخواست می‌نویسد روی کدام اتصال TCP رسیده است.
import http from 'node:http'
import http2 from 'node:http2'
const DELAY = 300
const ids = new WeakMap(); let next = { h1: 0, h2: 0 }
const conn = (kind, socket) => { if (!ids.has(socket)) ids.set(socket, ++next[kind]); return ids.get(socket) }
const t0 = Date.now()
const log = (kind, socket, url) => console.log(`${String(Date.now() - t0).padStart(6)}ms  ${kind}  connection #${conn(kind, socket)}  ${url}`)

http.createServer((req, res) => {
  log('h1', req.socket, req.url)
  setTimeout(() => res.end('ok\n'), DELAY)
}).listen(8782)

http2.createServer().on('stream', (stream, headers) => {
  log('h2', stream.session.socket, `${headers[':path']}  stream ${stream.id}`)
  setTimeout(() => { stream.respond({ ':status': 200 }); stream.end('ok\n') }, DELAY)
}).listen(8781, () => console.log('h1: http://127.0.0.1:8782/slow   h2c: http://127.0.0.1:8781/slow'))
