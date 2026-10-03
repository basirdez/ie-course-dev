// یک cache مشترک کوچک (مثل یک CDN تک‌گره‌ای):  node proxy.mjs   →  http://127.0.0.1:8790  جلوی  http://127.0.0.1:8791
// عمداً ساده است: فقط GET، کلید = متد و URL (و مقدار فیلدهایی که Vary نام برده)، و max-age و s-maxage و private و no-store و no-cache و ETag.
// سه کار دیگر هم می‌کند: Via و X-Forwarded-For را اضافه می‌کند، و در Cache-Status (RFC 9211) می‌گوید چه کرد.
import http from 'node:http'

const ORIGIN = { host: '127.0.0.1', port: Number(process.env.ORIGIN_PORT || 8791) }
const PORT = Number(process.env.PORT || 8790)
const store = new Map()            // کلید → { status, headers, body, storedAt, maxAge, vary }

const directives = h => Object.fromEntries(String(h || '').toLowerCase().split(',').map(d => d.trim().split('=')).filter(p => p[0]).map(([k, v]) => [k, v ?? true]))
const baseKey = req => `${req.method} ${req.url}`
const varyKey = (req, vary) => vary.map(n => `${n}=${req.headers[n] || ''}`).join('&')

function forward(req, extraHeaders, body) {
  return new Promise((ok, fail) => {
    const xff = [req.headers['x-forwarded-for'], req.socket.remoteAddress.replace('::ffff:', '')].filter(Boolean).join(', ')
    const headers = { ...req.headers, ...extraHeaders, 'x-forwarded-for': xff, via: '1.1 lab' }
    const up = http.request({ ...ORIGIN, method: req.method, path: req.url, headers }, (res) => {
      const chunks = []; res.on('data', c => chunks.push(c)); res.on('end', () => ok({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }))
    })
    up.on('error', fail); up.end(body)
  })
}

http.createServer(async (req, res) => {
  const chunks = []; for await (const c of req) chunks.push(c)
  const body = Buffer.concat(chunks)
  const send = (r, status, extra = {}) => { res.writeHead(r.status, { ...r.headers, via: '1.1 lab', 'cache-status': `lab; ${status}`, ...extra }); res.end(r.body) }
  try {
    if (req.url === '/__purge') { store.clear(); res.writeHead(204); return res.end() }   // خالی کردن cache، برای تکرار آزمایش
    if (req.method !== 'GET') return send(await forward(req, {}, body), 'fwd=method')
    const vary = store.get(`vary ${baseKey(req)}`) || []
    const key = `${baseKey(req)} ${varyKey(req, vary)}`
    const hit = store.get(key)
    const age = hit ? Math.floor((Date.now() - hit.storedAt) / 1000) : 0
    if (hit && age < hit.maxAge) return send(hit, `hit; ttl=${hit.maxAge - age}`, { age: String(age) })

    // کهنه شده و ETag دارد: به‌جای گرفتن دوبارهٔ بدنه، از origin بپرس
    const cond = hit && hit.headers.etag ? { 'if-none-match': hit.headers.etag } : {}
    const r = await forward(req, cond, body)
    if (hit && r.status === 304) { hit.storedAt = Date.now(); return send(hit, 'fwd=stale; fwd-status=304; stored', { age: '0' }) }

    const cc = directives(r.headers['cache-control'])
    const maxAge = Number(cc['s-maxage'] ?? cc['max-age'] ?? 0)
    const storable = r.status === 200 && !cc['no-store'] && !cc.private && (maxAge > 0 || (cc['no-cache'] && r.headers.etag))
    if (!storable) return send(r, `fwd=${hit ? 'stale' : 'uri-miss'}`)
    const v = String(r.headers.vary || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean)
    store.set(`vary ${baseKey(req)}`, v)
    store.set(`${baseKey(req)} ${varyKey(req, v)}`, { status: r.status, headers: r.headers, body: r.body, storedAt: Date.now(), maxAge: cc['no-cache'] ? 0 : maxAge })
    send(r, `fwd=${hit ? 'stale' : 'uri-miss'}; stored`)
  } catch (e) { res.writeHead(502, { 'content-type': 'text/plain', 'proxy-status': 'lab; error=connection_refused' }); res.end('502 Bad Gateway: origin is not reachable\n') }
}).listen(PORT, () => console.log(`proxy (shared cache): http://127.0.0.1:${PORT}  →  origin 127.0.0.1:${ORIGIN.port}`))
