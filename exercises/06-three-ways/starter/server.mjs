// تمرین ۶: یک خوراک خبر، سه راه رساندن.     node server.mjs   →  http://127.0.0.1:8811
//   POST /publish        بدنه = متن خبر؛ پاسخ {"id": N}                     آماده است
//   GET  /poll?since=N   هر خبری که بعد از N آمده، همین حالا                آماده است
//   GET  /events         SSE                                                 کار شما (۱)
//   GET  /ws?since=N     WebSocket                                           کار شما (۲)
import http from 'node:http'
import { accept } from './ws-lite.mjs'

const PORT = Number(process.env.PORT || 8811)
const HEARTBEAT = Number(process.env.HEARTBEAT || 15000)                       // میلی‌ثانیه
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || `http://127.0.0.1:${PORT}`

const events = []                 // { id, data }
const listeners = new Set()       // هر شنونده تابعی است که با هر خبر تازه صدا زده می‌شود
function publish(data) {
  const e = { id: events.length + 1, data }
  events.push(e)
  for (const l of [...listeners]) l(e)
  return e
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x')
  console.log(`${req.method} ${req.url}`)
  const json = (body, status = 200) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body) + '\n') }

  if (req.method === 'POST' && url.pathname === '/publish') {
    let body = ''; req.setEncoding('utf8'); req.on('data', c => (body += c)); req.on('end', () => json({ id: publish(body.trim()).id }))
    return
  }
  if (url.pathname === '/poll') return json(events.filter(e => e.id > Number(url.searchParams.get('since') || 0)))

  if (url.pathname === '/events') {
    // کار شما (۱): این پاسخ را به یک جریان SSE تبدیل کنید.
    //   - نوع محتوا، و header‌هایی که نمی‌گذارند واسطه پاسخ را نگه دارد یا جمع کند
    //   - هر خبر با id و data؛ خبر تازه بی‌درنگ فرستاده شود (از listeners کمک بگیرید)
    //   - اگر درخواست Last-Event-ID داشت، اول خبرهای جاافتاده
    //   - هر HEARTBEAT میلی‌ثانیه یک خط توضیح، تا اتصال ساکت بسته نشود
    //   - وقتی کلاینت رفت، شنونده و timer پاک شوند
    return json({ error: 'not implemented' }, 501)
  }
  res.writeHead(404); res.end()
})

server.on('upgrade', (req, socket) => {
  // کار شما (۲): اتصال WebSocket روی /ws
  //   - اگر Origin آمده و ALLOWED_ORIGIN نیست: 403، بدون handshake
  //   - handshake با accept(req, socket)؛ بعد هر خبر یک پیام متنی JSON به شکل {"id":N,"data":"…"}
  //   - اگر نشانی since=N داشت، اول خبرهای جاافتاده
  //   - وقتی اتصال بسته شد، شنونده پاک شود
  socket.end('HTTP/1.1 501 Not Implemented\r\n\r\n')
})

server.listen(PORT, () => console.log(`http://127.0.0.1:${PORT}   POST /publish · /poll · /events · /ws`))
