// سرور HTTPS تمرین ۴ (HTTP/2 و HTTP/1.1 با ALPN):  node server.mjs   →  https://shop.test:8443
// اول گواهی‌ها را بسازید: sh make-certs.sh        با گواهی منقضی‌شده: CERT=old node server.mjs
import http2 from 'node:http2'
import { readFileSync } from 'node:fs'
const dir = new URL('./certs/', import.meta.url)
const name = process.env.CERT || 'shop'
http2.createSecureServer({ key: readFileSync(new URL(`${name}.key`, dir)), cert: readFileSync(new URL(`${name}.pem`, dir)), allowHTTP1: true }, (req, res) => {
  const tls = req.socket.getProtocol ? req.socket : req.stream.session.socket
  console.log(`${req.method} ${req.url}  HTTP/${req.httpVersion}  ${tls.getProtocol()}  cookie=${req.headers.cookie || '-'}`)
  res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' })
  res.end(`HTTP/${req.httpVersion} ${tls.getProtocol()} ${tls.getCipher().name}\n`)
}).listen(8443, () => console.log('https://shop.test:8443   (curl --resolve shop.test:8443:127.0.0.1 …)'))
