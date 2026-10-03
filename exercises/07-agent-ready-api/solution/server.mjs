// پاسخ مرجع تمرین ۷.     QUOTA=5 WINDOW=2 node server.mjs   →  http://127.0.0.1:8831
import http from 'node:http'
import crypto from 'node:crypto'

const PORT = Number(process.env.PORT || 8831)
const QUOTA = Number(process.env.QUOTA || 5), WINDOW = Number(process.env.WINDOW || 2)
const TOKENS = new Set((process.env.TOKENS || 'agent-a,agent-b,agent-c,agent-d').split(','))

const slots = new Map()
for (const day of ['sat', 'sun', 'mon', 'tue', 'wed']) for (const hour of ['08', '09', '10', '11']) slots.set(`${day}-${hour}`, null)
let nextId = 1

const windows = new Map()          // token → { start, used }
const replies = new Map()          // `${token} ${key}` → { hash, status, body }

http.createServer((req, res) => {
  const send = (status, body, headers = {}) => { res.writeHead(status, { 'Content-Type': 'application/json', ...headers }); res.end(JSON.stringify(body) + '\n') }
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  if (!TOKENS.has(token)) return send(401, { error: 'unauthenticated' }, { 'WWW-Authenticate': 'Bearer' })
  console.log(`${token}  ${req.method} ${req.url}${req.headers['idempotency-key'] ? `  key=${req.headers['idempotency-key']}` : ''}`)

  // (۱) سقف نرخ با پنجرهٔ ثابت، برای هر token جدا
  const now = Date.now()
  let w = windows.get(token)
  if (!w || now - w.start >= WINDOW * 1000) { w = { start: now, used: 0 }; windows.set(token, w) }
  const resetIn = Math.max(1, Math.ceil((w.start + WINDOW * 1000 - now) / 1000))
  const rate = { 'RateLimit-Policy': `"default";q=${QUOTA};w=${WINDOW}`, 'RateLimit': `"default";r=${Math.max(0, QUOTA - w.used - 1)};t=${resetIn}` }
  if (w.used >= QUOTA) return send(429, { error: 'rate_limit_error' }, { ...rate, 'Retry-After': String(resetIn) })
  w.used++

  if (req.method === 'GET' && req.url === '/slots') return send(200, [...slots].filter(([, b]) => !b).map(([s]) => s), rate)
  if (req.method === 'GET' && req.url === '/bookings') return send(200, [...slots.values()].filter(b => b && b.owner === token).map(({ owner, ...b }) => b), rate)

  if (req.method === 'POST' && req.url === '/bookings') {
    let raw = ''; req.setEncoding('utf8'); req.on('data', c => (raw += c)); req.on('end', () => {
      let body; try { body = JSON.parse(raw) } catch { return send(400, { error: 'invalid JSON' }, rate) }
      if (!slots.has(body.slot) || typeof body.name !== 'string') return send(400, { error: 'slot and name are required' }, rate)

      // (۲) کلید idempotency: کلید در دامنهٔ همان token، و پاسخ همراه اثر انگشت بدنه نگه داشته می‌شود
      const key = req.headers['idempotency-key']
      const hash = crypto.createHash('sha256').update(JSON.stringify({ slot: body.slot, name: body.name })).digest('hex')
      const slotKey = key && `${token} ${key}`
      if (slotKey && replies.has(slotKey)) {
        const old = replies.get(slotKey)
        if (old.hash !== hash) return send(422, { error: 'Idempotency-Key was used with a different request' }, rate)
        return send(old.status, old.body, { ...rate, 'Idempotency-Replayed': 'true' })
      }
      const reply = (status, out) => { if (slotKey) replies.set(slotKey, { hash, status, body: out }); send(status, out, rate) }

      if (slots.get(body.slot)) return reply(409, { error: 'slot already taken' })
      const booking = { id: nextId++, slot: body.slot, name: body.name, owner: token }
      slots.set(body.slot, booking)
      const { owner, ...pub } = booking
      return reply(201, pub)
    })
    return
  }
  send(404, { error: 'not found' }, rate)
}).listen(PORT, () => console.log(`http://127.0.0.1:${PORT}   quota ${QUOTA} per ${WINDOW}s per token`))
