// اندازه‌گیری تأخیر و بایتِ هر خبر، برای سه سازوکار.     node measure.mjs [poll|sse|ws]
//   PORT          جایی که کلاینت وصل می‌شود (پیش‌فرض 8811؛ برای آزمایش از پشت proxy: 8790)
//   PUBLISH_PORT  جایی که خبر منتشر می‌شود (همیشه خود سرور: 8811)
//   N=8 خبر، با فاصلهٔ تصادفی و میانگین GAP=1000 میلی‌ثانیه؛ فاصلهٔ polling: POLL=1000
// بایت‌ها از شمارندهٔ خود اتصال TCP خوانده می‌شود: همهٔ بایت‌های رفته و آمده، header و بدنه.
import http from 'node:http'
import net from 'node:net'
import crypto from 'node:crypto'

const HOST = '127.0.0.1'
const PORT = Number(process.env.PORT || 8811), PUBLISH_PORT = Number(process.env.PUBLISH_PORT || 8811)
const N = Number(process.env.N || 8), GAP = Number(process.env.GAP || 1000), POLL = Number(process.env.POLL || 1000)
const sleep = ms => new Promise(r => setTimeout(r, ms))
const median = a => a.length ? [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)] : NaN

function request(port, method, path, { headers = {}, body, agent } = {}) {
  return new Promise((ok, fail) => {
    let socket
    const req = http.request({ host: HOST, port, method, path, headers, agent }, (res) => {
      let data = ''; res.setEncoding('utf8'); res.on('data', c => (data += c)); res.on('end', () => ok({ status: res.statusCode, body: data, socket }))
    })
    req.on('socket', s => (socket = s)); req.on('error', fail); req.setTimeout(5000, () => req.destroy(new Error('timeout'))); req.end(body)
  })
}
const lastId = async () => { const all = JSON.parse((await request(PUBLISH_PORT, 'GET', '/poll?since=0')).body); return all.length ? all.at(-1).id : 0 }
async function publishAll() { for (let i = 1; i <= N; i++) { await sleep(GAP * (0.5 + Math.random())); await request(PUBLISH_PORT, 'POST', '/publish', { body: `tick ${i} ${Date.now()}` }) } }
const latencyOf = data => Date.now() - Number(String(data).split(' ')[2])

async function poll() {
  const agent = new http.Agent({ keepAlive: true, maxSockets: 1 })          // مثل مرورگر: یک اتصال، چند درخواست
  const sockets = new Set(), lat = []; let since = await lastId(), polls = 0, done = false
  const loop = (async () => {
    while (!done) {
      const r = await request(PORT, 'GET', `/poll?since=${since}`, { agent }).catch(() => null)
      polls++
      if (r) { sockets.add(r.socket); if (r.status === 200) for (const e of JSON.parse(r.body)) { since = e.id; lat.push(latencyOf(e.data)) } }
      await sleep(POLL)
    }
  })()
  await publishAll(); await sleep(POLL + 300); done = true; await loop
  let bytes = 0; for (const s of sockets) bytes += s.bytesRead + s.bytesWritten
  agent.destroy()
  return { name: `poll (${POLL} ms)`, lat, bytes, note: `${polls} requests` }
}

async function sse() {
  const lat = []; let socket, status = 0
  const req = http.request({ host: HOST, port: PORT, path: '/events', headers: { Accept: 'text/event-stream' }, agent: false }, (res) => {
    status = res.statusCode; let buf = ''; res.setEncoding('utf8')
    res.on('data', (c) => {
      buf += c
      let i; while ((i = buf.indexOf('\n\n')) >= 0) { const block = buf.slice(0, i); buf = buf.slice(i + 2); const d = block.split('\n').find(l => l.startsWith('data:')); if (d) lat.push(latencyOf(d.slice(5).trim())) }
    })
    res.on('error', () => {})
  })
  req.on('socket', s => (socket = s)); req.on('error', () => {}); req.end()
  await sleep(200); await publishAll(); await sleep(500)
  const bytes = socket ? socket.bytesRead + socket.bytesWritten : 0
  req.destroy()
  return { name: 'sse', lat, bytes, note: status ? `status ${status}` : 'no response yet' }
}

async function ws() {
  const lat = []; let status = ''
  const since = await lastId()
  const socket = net.connect(PORT, HOST)
  socket.on('error', () => {})
  await new Promise(r => socket.once('connect', r))
  socket.write(`GET /ws?since=${since} HTTP/1.1\r\nHost: ${HOST}:${PORT}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: ${crypto.randomBytes(16).toString('base64')}\r\nSec-WebSocket-Version: 13\r\n\r\n`)
  let buf = Buffer.alloc(0), open = false
  socket.on('data', (c) => {
    buf = Buffer.concat([buf, c])
    if (!open) { const i = buf.indexOf('\r\n\r\n'); if (i < 0) return; status = buf.subarray(0, buf.indexOf('\r\n')).toString(); open = /^HTTP\/1\.1 101/.test(status); buf = buf.subarray(i + 4); if (!open) return }
    for (;;) {
      if (buf.length < 2) return
      let len = buf[1] & 0x7f, off = 2
      if (len === 126) { if (buf.length < 4) return; len = buf.readUInt16BE(2); off = 4 }
      if (buf.length < off + len) return
      const text = buf.subarray(off, off + len).toString(); buf = buf.subarray(off + len)
      try { lat.push(latencyOf(JSON.parse(text).data)) } catch {}
    }
  })
  await sleep(200); await publishAll(); await sleep(500)
  const bytes = socket.bytesRead + socket.bytesWritten
  socket.destroy()
  return { name: 'ws', lat, bytes, note: status || 'no response' }
}

const which = process.argv[2] ? [process.argv[2]] : ['poll', 'sse', 'ws']
console.log(`client → http://${HOST}:${PORT}    publish → :${PUBLISH_PORT}    ${N} events, about one every ${GAP} ms\n`)
console.log('mechanism        received   median latency   bytes total   bytes/event   note')
for (const w of which) {
  const r = await ({ poll, sse, ws })[w]()
  const per = r.lat.length ? Math.round(r.bytes / r.lat.length) : '-'
  console.log(`${r.name.padEnd(16)} ${`${r.lat.length}/${N}`.padEnd(10)} ${`${median(r.lat)} ms`.padEnd(16)} ${String(r.bytes).padEnd(13)} ${String(per).padEnd(13)} ${r.note}`)
}
process.exit(0)
