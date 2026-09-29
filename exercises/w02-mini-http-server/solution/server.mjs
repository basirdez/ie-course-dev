// پاسخ مرجع تمرین ۲ (خصوصی؛ پس از مهلت منتشر می‌شود). فقط net، بدون ماژول http.
import net from 'node:net'
const port = Number(process.argv[2] || process.env.PORT || 8080)
const routes = { '/': ['GET', 'HEAD'], '/hello': ['GET', 'HEAD'], '/echo': ['POST'], '/old': ['GET', 'HEAD'], '/visits': ['GET', 'HEAD'] }
const visits = new Map()

function respond(sock, status, reason, headers, body = Buffer.alloc(0), { head = false, close = false } = {}) {
  const b = Buffer.isBuffer(body) ? body : Buffer.from(body, 'utf8')
  const h = { 'Content-Length': b.length, ...headers }; if (close) h.Connection = 'close'
  sock.write(`HTTP/1.1 ${status} ${reason}\r\n${Object.entries(h).map(([k, v]) => `${k}: ${v}`).join('\r\n')}\r\n\r\n`)
  if (!head && b.length) sock.write(b)
  if (close) sock.end()
}

net.createServer((sock) => {
  let buf = Buffer.alloc(0)
  sock.on('data', (d) => { buf = Buffer.concat([buf, d]); pump() })
  sock.on('error', () => {})
  function pump() {
    for (;;) {
      const end = buf.indexOf('\r\n\r\n'); if (end < 0) return
      const lines = buf.subarray(0, end).toString('latin1').split('\r\n')
      const [method, target, version] = lines[0].split(' ')
      const fields = []
      for (const l of lines.slice(1)) { const i = l.indexOf(':'); if (i > 0) fields.push([l.slice(0, i).trim().toLowerCase(), l.slice(i + 1).trim()]) }
      const get = k => fields.filter(f => f[0] === k).map(f => f[1])
      const cl = get('content-length'); const te = get('transfer-encoding')
      // مرز مبهم پیام = رد و بستن اتصال (RFC 9112 §6.3)
      if ((cl.length && te.length) || new Set(cl).size > 1 || (cl[0] && !/^\d+$/.test(cl[0]))) return respond(sock, 400, 'Bad Request', {}, 'ambiguous framing\n', { close: true })
      if (te.length) return respond(sock, 501, 'Not Implemented', {}, '', { close: true })
      const len = Number(cl[0] || 0)
      if (buf.length < end + 4 + len) return
      const body = buf.subarray(end + 4, end + 4 + len); buf = buf.subarray(end + 4 + len)
      const close = /close/i.test(get('connection')[0] || '')
      if (version !== 'HTTP/1.1' && version !== 'HTTP/1.0') return respond(sock, 505, 'HTTP Version Not Supported', {}, '', { close: true })
      if (version === 'HTTP/1.1' && get('host').length !== 1) return respond(sock, 400, 'Bad Request', {}, 'Host required\n', { close: true })
      const u = new URL(target, 'http://x'); const head = method === 'HEAD'
      const allow = routes[u.pathname]
      if (!allow) { respond(sock, 404, 'Not Found', { 'Content-Type': 'text/plain; charset=utf-8' }, 'not found\n', { head, close }); continue }
      if (!allow.includes(method)) { respond(sock, 405, 'Method Not Allowed', { Allow: allow.join(', ') }, '', { close }); continue }
      const txt = { 'Content-Type': 'text/plain; charset=utf-8' }
      if (u.pathname === '/') respond(sock, 200, 'OK', { 'Content-Type': 'text/html; charset=utf-8' }, '<!doctype html><p>سرور کوچک</p>\n', { head, close })
      else if (u.pathname === '/hello') respond(sock, 200, 'OK', txt, `سلام ${u.searchParams.get('name') || 'دنیا'}\n`, { head, close })
      else if (u.pathname === '/old') respond(sock, 308, 'Permanent Redirect', { Location: '/hello' }, '', { head, close })
      else if (u.pathname === '/echo') respond(sock, 200, 'OK', { 'Content-Type': 'application/octet-stream' }, body, { close })
      else if (u.pathname === '/visits') { const k = sock.remoteAddress; visits.set(k, (visits.get(k) || 0) + 1); respond(sock, 200, 'OK', txt, `${visits.get(k)}\n`, { head, close }) }
      if (close) return
    }
  }
}).listen(port, () => console.log(`http://127.0.0.1:${port}/`))
