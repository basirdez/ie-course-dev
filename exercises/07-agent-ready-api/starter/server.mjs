// تمرین ۷: API نوبت‌دهی آزمایشگاه.     QUOTA=5 WINDOW=2 node server.mjs   →  http://127.0.0.1:8831
//   GET  /slots                      نوبت‌های خالی
//   POST /bookings  {slot, name}     گرفتن نوبت: 201؛ اگر نوبت گرفته شده باشد 409
//   GET  /bookings                   نوبت‌های همین کلاینت
// هر درخواست باید  Authorization: Bearer <token>  داشته باشد (agent-a تا agent-d).
// این سرور دو کمبود دارد که کار شماست:  (۱) سقف نرخ ندارد   (۲) در برابر تکرار POST امن نیست
import http from 'node:http'

const PORT = Number(process.env.PORT || 8831)
const QUOTA = Number(process.env.QUOTA || 5), WINDOW = Number(process.env.WINDOW || 2)     // پنج درخواست در هر دو ثانیه، برای هر token
const TOKENS = new Set((process.env.TOKENS || 'agent-a,agent-b,agent-c,agent-d').split(','))

const slots = new Map()            // نام نوبت → booking یا null
for (const day of ['sat', 'sun', 'mon', 'tue', 'wed']) for (const hour of ['08', '09', '10', '11']) slots.set(`${day}-${hour}`, null)
let nextId = 1

http.createServer((req, res) => {
  const send = (status, body, headers = {}) => { res.writeHead(status, { 'Content-Type': 'application/json', ...headers }); res.end(JSON.stringify(body) + '\n') }
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  if (!TOKENS.has(token)) return send(401, { error: 'unauthenticated' }, { 'WWW-Authenticate': 'Bearer' })
  console.log(`${token}  ${req.method} ${req.url}${req.headers['idempotency-key'] ? `  key=${req.headers['idempotency-key']}` : ''}`)

  // کار شما (۱): سقف نرخ برای هر token.
  //   در هر WINDOW ثانیه بیش از QUOTA درخواست نپذیرید؛ بقیه 429 بگیرند، با Retry-After (عدد صحیح ثانیه، دست‌کم ۱).
  //   سقف هر token جداست: پر شدن سقف agent-a نباید agent-b را رد کند.

  if (req.method === 'GET' && req.url === '/slots') return send(200, [...slots].filter(([, b]) => !b).map(([s]) => s))
  if (req.method === 'GET' && req.url === '/bookings') return send(200, [...slots.values()].filter(b => b && b.owner === token).map(({ owner, ...b }) => b))

  if (req.method === 'POST' && req.url === '/bookings') {
    let raw = ''; req.setEncoding('utf8'); req.on('data', c => (raw += c)); req.on('end', () => {
      let body; try { body = JSON.parse(raw) } catch { return send(400, { error: 'invalid JSON' }) }
      if (!slots.has(body.slot) || typeof body.name !== 'string') return send(400, { error: 'slot and name are required' })

      // کار شما (۲): کلید idempotency.
      //   اگر درخواست Idempotency-Key دارد و همین token قبلاً با همین کلید و همین بدنه درخواست داده، همان پاسخ قبلی را برگردانید
      //   (همان کد وضعیت و همان بدنه) و نوبت تازه نسازید. همان کلید با بدنهٔ دیگر: 422. کلید هر token جداست.

      if (slots.get(body.slot)) return send(409, { error: 'slot already taken' })
      const booking = { id: nextId++, slot: body.slot, name: body.name, owner: token }
      slots.set(body.slot, booking)
      const { owner, ...pub } = booking
      return send(201, pub)
    })
    return
  }
  send(404, { error: 'not found' })
}).listen(PORT, () => console.log(`http://127.0.0.1:${PORT}   quota ${QUOTA} per ${WINDOW}s per token`))
