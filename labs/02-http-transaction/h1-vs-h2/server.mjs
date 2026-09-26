import http2 from 'node:http2'
import http from 'node:http'
const h = (req, res) => { res.setHeader('content-type', 'text/plain'); res.end(`${req.method} ${req.url} host=${req.headers.host ?? '-'} authority=${req.headers[':authority'] ?? '-'}\n`) }
http2.createServer(h).listen(8766)
http.createServer(h).listen(8767)
