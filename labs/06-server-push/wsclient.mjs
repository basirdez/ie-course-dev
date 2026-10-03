// کلاینت WebSocket با دست، روی TCP خام:  node wsclient.mjs [text]
// handshake را چاپ می‌کند، یک frame متنیِ mask‌شده می‌فرستد و بایت‌های هر frame را به شانزده‌شانزدهی نشان می‌دهد.
import net from 'node:net'
import crypto from 'node:crypto'
const text = process.argv[2] || 'Hello'
const hex = b => b.toString('hex').replace(/../g, '$& ').trim()
const sock = net.connect(8801, '127.0.0.1', () => {
  const key = crypto.randomBytes(16).toString('base64')
  sock.write(`GET /ws HTTP/1.1\r\nHost: 127.0.0.1:8801\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: ${key}\r\nSec-WebSocket-Version: 13\r\n\r\n`)
  console.log(`> Sec-WebSocket-Key: ${key}`)
})
let open = false, frames = 0
sock.on('data', (buf) => {
  if (!open) {
    const end = buf.indexOf('\r\n\r\n')
    console.log(buf.subarray(0, end).toString().split('\r\n').map(l => `< ${l}`).join('\n')); open = true; buf = buf.subarray(end + 4)
    const mask = process.env.MASK ? Buffer.from(process.env.MASK, 'hex') : crypto.randomBytes(4), payload = Buffer.from(text)
    const out = Buffer.concat([Buffer.from([0x81, 0x80 | payload.length]), mask, payload.map((b, i) => b ^ mask[i % 4])])
    console.log(`> frame  ${hex(out)}   (masked ${JSON.stringify(text)})`); sock.write(out)
  }
  while (buf.length >= 2) {
    const len = buf[1] & 0x7f
    console.log(`< frame  ${hex(buf.subarray(0, 2 + len))}   (${JSON.stringify(buf.subarray(2, 2 + len).toString())})`)
    buf = buf.subarray(2 + len)
    if (++frames === 3) { sock.write(Buffer.from([0x88, 0x80, 0, 0, 0, 0])); console.log('> frame  88 80 00 00 00 00   (close)'); setTimeout(() => sock.destroy(), 200) }
  }
})
