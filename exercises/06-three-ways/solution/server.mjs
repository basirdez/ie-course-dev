// راه‌حل نمونهٔ تمرین ۶.     node server.mjs   →  http://127.0.0.1:8811
import http from 'node:http'
import { accept } from '../starter/ws-lite.mjs'

const PORT = Number(process.env.PORT || 8811)
const HEARTBEAT = Number(process.env.HEARTBEAT || 15000)
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || `http://127.0.0.1:${PORT}`
const MAX_BUFFERED = Number(process.env.MAX_BUFFERED || 1_000_000)             // بایت؛ سیاست کلاینت کُند

const events = []
const listeners = new Set()
function publish(data) {
  const e = { id: events.length + 1, data }
  events.push(e)
  for (const l of [...listeners]) l(e)
  return e
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x')
  console.log(`${req.method} ${req.url}${req.headers['last-event-id'] ? `  Last-Event-ID: ${req.headers['last-event-id']}` : ''}`)
  const json = (body, status = 200) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body) + '\n') }

  if (req.method === 'POST' && url.pathname === '/publish') {
    let body = ''; req.setEncoding('utf8'); req.on('data', c => (body += c)); req.on('end', () => json({ id: publish(body.trim()).id }))
    return
  }
  if (url.pathname === '/poll') return json(events.filter(e => e.id > Number(url.searchParams.get('since') || 0)))

  if (url.pathname === '/events') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' })
    res.write('retry: 2000\n\n')
    const send = e => res.write(`id: ${e.id}\ndata: ${e.data}\n\n`)
    const last = req.headers['last-event-id']
    if (last !== undefined) events.filter(e => e.id > Number(last)).forEach(send)      // فقط وقتی کلاینت گفته تا کجا را دارد
    const beat = setInterval(() => res.write(': keep-alive\n\n'), HEARTBEAT)
    listeners.add(send)
    req.on('close', () => { clearInterval(beat); listeners.delete(send) })
    return
  }
  res.writeHead(404); res.end()
})

server.on('upgrade', (req, socket) => {
  const url = new URL(req.url, 'http://x')
  if (url.pathname !== '/ws') return socket.end('HTTP/1.1 404 Not Found\r\n\r\n')
  const origin = req.headers.origin
  if (origin && origin !== ALLOWED_ORIGIN) { console.log(`WS rejected  origin=${origin}`); return socket.end('HTTP/1.1 403 Forbidden\r\n\r\n') }
  const ws = accept(req, socket)
  if (!ws) return
  const send = (e) => {
    if (ws.buffered() > MAX_BUFFERED) { console.log(`WS slow client: ${ws.buffered()} bytes waiting, closing`); listeners.delete(send); return ws.close() }
    ws.send(JSON.stringify(e))
  }
  if (url.searchParams.has('since')) events.filter(e => e.id > Number(url.searchParams.get('since'))).forEach(send)
  listeners.add(send)
  ws.onclose = () => listeners.delete(send)
})

server.listen(PORT, () => console.log(`http://127.0.0.1:${PORT}   POST /publish · /poll · /events · /ws`))
