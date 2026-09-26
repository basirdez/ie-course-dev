// یک منبع، چند بازنمایی: /report بر اساس Accept و Accept-Encoding
import http from 'node:http'
import zlib from 'node:zlib'
const data = { title: 'گزارش', items: 3 }
http.createServer((req, res) => {
  if (req.url !== '/report') { res.writeHead(404); return res.end() }
  const accept = req.headers.accept || '*/*'
  let type, body
  if (/text\/markdown/.test(accept)) { type = 'text/markdown; charset=utf-8'; body = `# ${data.title}\n\n- items: ${data.items}\n` }
  else if (/application\/json/.test(accept)) { type = 'application/json'; body = JSON.stringify(data) }
  else { type = 'text/html; charset=utf-8'; body = `<h1>${data.title}</h1><p>items: ${data.items}</p>` }
  let buf = Buffer.from(body)
  const headers = { 'Content-Type': type, Vary: 'Accept, Accept-Encoding' }
  if (/\bgzip\b/.test(req.headers['accept-encoding'] || '')) { buf = zlib.gzipSync(buf); headers['Content-Encoding'] = 'gzip' }
  headers['Content-Length'] = buf.length
  res.writeHead(200, headers); res.end(buf)
}).listen(8768, () => console.log('http://127.0.0.1:8768/report'))
