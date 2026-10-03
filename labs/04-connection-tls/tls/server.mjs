// سرور HTTPS با HTTP/2 و HTTP/1.1 (انتخاب با ALPN):  node tls/server.mjs   →  https://shop.test:8443
// اول گواهی‌ها را بسازید: sh tls/make-certs.sh
import http2 from 'node:http2'
import { readFileSync } from 'node:fs'
const dir = new URL('./certs/', import.meta.url)
http2.createSecureServer({ key: readFileSync(new URL('shop.key', dir)), cert: readFileSync(new URL('shop.pem', dir)), allowHTTP1: true }, (req, res) => {
  const s = req.socket
  res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' })
  res.end(`HTTP/${req.httpVersion}  ${s.getProtocol?.() ?? req.stream?.session.socket.getProtocol()}  ${JSON.stringify((s.getCipher?.() ?? req.stream.session.socket.getCipher()).name)}\n`)
}).listen(8443, () => console.log('https://shop.test:8443  (با --resolve shop.test:8443:127.0.0.1)'))
