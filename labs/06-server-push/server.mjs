// یک خوراک خبر، چهار راه برای رساندنش:  node server.mjs   →  http://127.0.0.1:8801
//   /poll?since=N      polling: هر چه بعد از N آمده، همین حالا
//   /longpoll?since=N  long polling: صبر کن تا خبری بعد از N بیاید (حداکثر ۱۰ ثانیه)
//   /events            SSE: یک پاسخ که تمام نمی‌شود؛ با Last-Event-ID از همان‌جا ادامه می‌دهد
//   /ws                WebSocket، بدون هیچ کتابخانه‌ای: handshake و frame با دست
import http from 'node:http'
import crypto from 'node:crypto'

const INTERVAL = Number(process.env.INTERVAL || 1000)
const events = []                         // { id, data }
const waiters = new Set()                 // تابع‌هایی که با هر خبر تازه صدا زده می‌شوند
setInterval(() => {
  const e = { id: events.length + 1, data: `news ${events.length + 1} at ${new Date().toISOString().slice(11, 19)}` }
  events.push(e); for (const w of [...waiters]) w(e)
}, INTERVAL)

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x')
  const since = Number(url.searchParams.get('since') || 0)
  console.log(`${req.method} ${req.url}${req.headers['last-event-id'] ? `  Last-Event-ID: ${req.headers['last-event-id']}` : ''}`)
  const json = body => { res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body) + '\n') }

  if (url.pathname === '/poll') return json(events.filter(e => e.id > since))
  if (url.pathname === '/longpoll') {
    const ready = events.filter(e => e.id > since)
    if (ready.length) return json(ready)
    const w = (e) => { clearTimeout(t); waiters.delete(w); json([e]) }
    const t = setTimeout(() => { waiters.delete(w); json([]) }, 10000)
    waiters.add(w); req.on('close', () => { clearTimeout(t); waiters.delete(w) })
    return
  }
  if (url.pathname === '/events') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' })
    res.write('retry: 2000\n\n')
    const send = e => res.write(`id: ${e.id}\nevent: news\ndata: ${e.data}\n\n`)
    events.filter(e => e.id > Number(req.headers['last-event-id'] || events.length)).forEach(send)   // فقط جاافتاده‌ها
    const beat = setInterval(() => res.write(': keep-alive\n\n'), 15000)
    waiters.add(send); req.on('close', () => { clearInterval(beat); waiters.delete(send) })
    return
  }
  res.writeHead(404); res.end()
})

// ---- WebSocket با دست (RFC 6455) ----
const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
const frame = (opcode, payload) => Buffer.concat([Buffer.from([0x80 | opcode, payload.length]), payload])   // سرور mask نمی‌کند؛ فقط payload کوتاه‌تر از ۱۲۶ بایت
server.on('upgrade', (req, socket) => {
  const key = req.headers['sec-websocket-key']
  if (req.headers.upgrade?.toLowerCase() !== 'websocket' || !key) return socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
  if (process.env.CHECK_ORIGIN && req.headers.origin !== process.env.CHECK_ORIGIN) return socket.end('HTTP/1.1 403 Forbidden\r\n\r\n')
  const accept = crypto.createHash('sha1').update(key + GUID).digest('base64')
  socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${accept}\r\n\r\n`)
  console.log(`WS open  origin=${req.headers.origin || '-'}  cookie=${req.headers.cookie || '-'}`)
  socket.write(frame(0x1, Buffer.from('Hello')))
  const send = e => socket.write(frame(0x1, Buffer.from(e.data)))
  waiters.add(send)
  socket.on('data', (buf) => {                // فقط frame تک‌تکه و کوتاه را می‌خوانیم؛ برای دمو کافی است
    const opcode = buf[0] & 0x0f, masked = buf[1] & 0x80, len = buf[1] & 0x7f
    const mask = buf.subarray(2, 6), payload = Buffer.from(buf.subarray(6, 6 + len)).map((b, i) => b ^ mask[i % 4])
    console.log(`WS frame  bytes=${buf.subarray(0, 6 + len).toString('hex').replace(/../g, '$& ').trim()}  opcode=${opcode}  masked=${Boolean(masked)}  text=${JSON.stringify(payload.toString())}`)
    if (opcode === 0x8) { socket.end(frame(0x8, Buffer.alloc(0))) } else if (opcode === 0x9) socket.write(frame(0xA, payload)); else if (opcode === 0x1) socket.write(frame(0x1, Buffer.from(`echo: ${payload}`)))
  })
  socket.on('close', () => waiters.delete(send)); socket.on('error', () => waiters.delete(send))
})
server.listen(8801, () => console.log('http://127.0.0.1:8801   /poll  /longpoll  /events  /ws'))
