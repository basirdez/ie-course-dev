// کمینهٔ WebSocket سمت سرور (RFC 6455) برای تمرین ۶. کتابخانهٔ واقعی نیست؛ برای خواندن و فهمیدن است.
// فقط پیام متنی تک‌تکه تا ۶۵۵۳۵ بایت را می‌فهمد. این فایل را عوض نکنید.
import crypto from 'node:crypto'

const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
export const acceptKey = key => crypto.createHash('sha1').update(key + GUID).digest('base64')

// frame سرور: بدون mask. بایت اول = FIN + نوع؛ بعد طول؛ بعد خود داده.
export function encode(opcode, payload) {
  const p = Buffer.isBuffer(payload) ? payload : Buffer.from(String(payload))
  const head = p.length < 126 ? Buffer.from([0x80 | opcode, p.length]) : Buffer.from([0x80 | opcode, 126, p.length >> 8, p.length & 0xff])
  return Buffer.concat([head, p])
}

// handshake را کامل می‌کند و این را برمی‌گرداند:  { send(text), close(), buffered(), onmessage, onclose }
// اگر درخواست WebSocket نباشد، 400 می‌دهد و null برمی‌گرداند.
export function accept(req, socket) {
  const key = req.headers['sec-websocket-key']
  if (req.headers.upgrade?.toLowerCase() !== 'websocket' || !key) { socket.end('HTTP/1.1 400 Bad Request\r\n\r\n'); return null }
  socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${acceptKey(key)}\r\n\r\n`)
  const ws = {
    onmessage: null, onclose: null,
    send: text => { if (socket.writable) socket.write(encode(0x1, text)) },
    close: () => socket.destroy(),
    buffered: () => socket.writableLength,          // بایت‌هایی که نوشته‌ایم و هنوز به کلاینت نرسیده
  }
  let buf = Buffer.alloc(0)
  socket.on('data', (chunk) => {
    buf = Buffer.concat([buf, chunk])
    for (;;) {
      if (buf.length < 2) return
      const opcode = buf[0] & 0x0f, masked = buf[1] & 0x80
      let len = buf[1] & 0x7f, off = 2
      if (len === 126) { if (buf.length < 4) return; len = buf.readUInt16BE(2); off = 4 } else if (len === 127) return socket.destroy()
      if (!masked) return socket.destroy()           // frame بدون mask از کلاینت: اتصال بسته می‌شود
      if (buf.length < off + 4 + len) return
      const mask = buf.subarray(off, off + 4)
      const payload = Buffer.from(buf.subarray(off + 4, off + 4 + len)).map((b, i) => b ^ mask[i % 4])
      buf = buf.subarray(off + 4 + len)
      if (opcode === 0x8) return socket.end(encode(0x8, ''))
      if (opcode === 0x9) socket.write(encode(0xA, payload))
      else if (opcode === 0x1) ws.onmessage?.(payload.toString())
    }
  })
  socket.on('close', () => ws.onclose?.()); socket.on('error', () => {})
  return ws
}
