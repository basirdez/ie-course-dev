// آزمون‌های تمرین ۶. سرور باید با HEARTBEAT=1000 روی پورت 8811 بالا باشد.
import http from 'node:http'
import net from 'node:net'
import crypto from 'node:crypto'

const HOST = '127.0.0.1'
const sleep = ms => new Promise(r => setTimeout(r, ms))

function request(port, method, path, { headers = {}, body } = {}) {
  return new Promise((ok, fail) => {
    const req = http.request({ host: HOST, port, method, path, headers, agent: false }, (res) => {
      let data = ''; res.setEncoding('utf8'); res.on('data', c => (data += c)); res.on('end', () => ok({ status: res.statusCode, headers: res.headers, body: data }))
    })
    req.on('error', fail); req.setTimeout(4000, () => req.destroy(new Error('timeout'))); req.end(body)
  })
}

// یک جریان SSE باز می‌کند و هر چه رسید نگه می‌دارد
function openSse(port, headers = {}) {
  const s = { status: 0, headers: {}, raw: '', events: [], comments: 0, close: () => req.destroy() }
  const req = http.request({ host: HOST, port, path: '/events', headers: { Accept: 'text/event-stream', ...headers }, agent: false }, (res) => {
    s.status = res.statusCode; s.headers = res.headers; res.setEncoding('utf8')
    let buf = ''
    res.on('data', (c) => {
      s.raw += c; buf += c
      let i; while ((i = buf.indexOf('\n\n')) >= 0) {
        const lines = buf.slice(0, i).split('\n'); buf = buf.slice(i + 2)
        if (lines.some(l => l.startsWith(':'))) s.comments++
        const data = lines.find(l => l.startsWith('data:')), id = lines.find(l => l.startsWith('id:'))
        if (data) s.events.push({ id: id ? id.slice(3).trim() : null, data: data.slice(5).trim(), at: Date.now() })
      }
    })
    res.on('error', () => {})
  })
  req.on('error', () => {}); req.end()
  return s
}

// یک اتصال WebSocket خام؛ پیام‌های متنی سرور را نگه می‌دارد
function openWs(port, path, headers = {}) {
  const w = { status: '', accept: '', key: crypto.randomBytes(16).toString('base64'), messages: [], closed: false, socket: net.connect(port, HOST) }
  const extra = Object.entries(headers).map(([k, v]) => `${k}: ${v}\r\n`).join('')
  w.socket.on('error', () => {}); w.socket.on('close', () => (w.closed = true))
  w.socket.on('connect', () => w.socket.write(`GET ${path} HTTP/1.1\r\nHost: ${HOST}:${port}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: ${w.key}\r\nSec-WebSocket-Version: 13\r\n${extra}\r\n`))
  let buf = Buffer.alloc(0), open = false
  w.socket.on('data', (c) => {
    buf = Buffer.concat([buf, c])
    if (!open) {
      const i = buf.indexOf('\r\n\r\n'); if (i < 0) return
      const head = buf.subarray(0, i).toString(); w.status = head.split('\r\n')[0]
      w.accept = (head.match(/sec-websocket-accept:\s*(\S+)/i) || [])[1] || ''
      open = / 101 /.test(w.status); buf = buf.subarray(i + 4); if (!open) return
    }
    for (;;) {
      if (buf.length < 2) return
      let len = buf[1] & 0x7f, off = 2
      if (len === 126) { if (buf.length < 4) return; len = buf.readUInt16BE(2); off = 4 }
      if (buf.length < off + len) return
      const opcode = buf[0] & 0x0f, text = buf.subarray(off, off + len).toString(); buf = buf.subarray(off + len)
      if (opcode === 0x1) w.messages.push({ text, at: Date.now() })
    }
  })
  return w
}
const expectedAccept = key => crypto.createHash('sha1').update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64')

export async function run({ port = 8811, slow = false } = {}) {
  const results = []
  const t = async (name, fn) => { try { const r = await fn(); results.push([name, r === true, r === true ? '' : r]) } catch (e) { results.push([name, false, e.message]) } }
  const publish = async text => JSON.parse((await request(port, 'POST', '/publish', { body: text })).body).id
  const tag = crypto.randomBytes(3).toString('hex')

  await t('۰. polling: خبر منتشرشده با since دیده می‌شود (آماده بود)', async () => {
    const id = await publish(`p-${tag}`)
    const got = JSON.parse((await request(port, 'GET', `/poll?since=${id - 1}`)).body)
    return (got.length === 1 && got[0].data === `p-${tag}`) || `پاسخ: ${JSON.stringify(got)}`
  })

  // ---------- SSE ----------
  const s = openSse(port); await sleep(300)
  await t('۱. SSE: نوع محتوا text/event-stream است و پاسخ باز می‌ماند', async () => {
    if (s.status !== 200) return `وضعیت: ${s.status || 'پاسخی نیامد'}`
    return /^text\/event-stream/.test(s.headers['content-type'] || '') || `Content-Type: ${s.headers['content-type']}`
  })
  await t('۱. SSE: واسطه نباید پاسخ را نگه دارد یا جمع کند', async () => {
    const cc = String(s.headers['cache-control'] || ''), xab = String(s.headers['x-accel-buffering'] || '')
    return (/no-store|no-cache/.test(cc) && xab === 'no') || `Cache-Control: ${cc || '-'} · X-Accel-Buffering: ${xab || '-'}`
  })
  let firstId = 0
  await t('۱. SSE: خبر تازه در کمتر از نیم ثانیه می‌رسد، با id', async () => {
    const before = Date.now(); firstId = await publish(`s1-${tag}`); await sleep(500)
    const e = s.events.find(x => x.data === `s1-${tag}`)
    if (!e) return 'خبر در نیم ثانیه نرسید'
    return (String(e.id) === String(firstId) && e.at - before < 500) || `id: ${e.id} (باید ${firstId} باشد)`
  })
  await t('۱. SSE: اتصال ساکت هر HEARTBEAT یک خط توضیح می‌گیرد', async () => {
    const before = s.comments; await sleep(1600)
    return s.comments > before || 'در ۱٫۶ ثانیه هیچ خطی که با «:» شروع شود نرسید (سرور را با HEARTBEAT=1000 بالا آورده‌اید؟)'
  })
  s.close()
  await t('۲. SSE: با Last-Event-ID خبرهای جاافتاده اول می‌رسند', async () => {
    const a = await publish(`s2-${tag}`), b = await publish(`s3-${tag}`)
    const r = openSse(port, { 'Last-Event-ID': String(firstId) }); await sleep(400); r.close()
    const ids = r.events.map(e => Number(e.id))
    return (ids.includes(a) && ids.includes(b) && !ids.includes(firstId)) || `با Last-Event-ID: ${firstId} این idها رسید: [${ids}]؛ باید ${a} و ${b} باشد`
  })
  await t('۲. SSE: بدون Last-Event-ID تاریخچه دوباره فرستاده نمی‌شود', async () => {
    const r = openSse(port); await sleep(400); r.close()
    return r.events.length === 0 || `${r.events.length} خبر کهنه فرستاده شد`
  })

  // ---------- WebSocket ----------
  const w = openWs(port, '/ws'); await sleep(300)
  await t('۳. WebSocket: handshake با 101 و Sec-WebSocket-Accept درست', async () =>
    (/ 101 /.test(w.status) && w.accept === expectedAccept(w.key)) || `خط وضعیت: ${w.status || 'پاسخی نیامد'}`)
  let wsId = 0
  await t('۳. WebSocket: خبر تازه در کمتر از نیم ثانیه، به شکل JSON با id و data', async () => {
    wsId = await publish(`w1-${tag}`); await sleep(500)
    const m = w.messages.map((x) => { try { return JSON.parse(x.text) } catch { return {} } }).find(x => x.data === `w1-${tag}`)
    return (m && m.id === wsId) || `پیام‌های رسیده: ${JSON.stringify(w.messages.map(x => x.text))}`
  })
  w.socket.destroy()
  await t('۴. WebSocket: با since خبرهای جاافتاده اول می‌رسند', async () => {
    const a = await publish(`w2-${tag}`)
    const r = openWs(port, `/ws?since=${wsId}`); await sleep(400); r.socket.destroy()
    const ids = r.messages.map((x) => { try { return JSON.parse(x.text).id } catch { return null } })
    return (ids.length === 1 && ids[0] === a) || `با since=${wsId} این idها رسید: [${ids}]؛ باید فقط ${a} باشد`
  })
  await t('۵. WebSocket: Origin بیگانه 403 می‌گیرد، نه 101', async () => {
    const r = openWs(port, '/ws', { Origin: 'http://evil.test' }); await sleep(300); r.socket.destroy()
    return / 403 /.test(r.status) || `خط وضعیت برای Origin: http://evil.test → ${r.status || 'پاسخی نیامد'}`
  })
  await t('۵. WebSocket: Origin خودی پذیرفته می‌شود', async () => {
    const r = openWs(port, '/ws', { Origin: `http://127.0.0.1:${port}` }); await sleep(300); r.socket.destroy()
    return / 101 /.test(r.status) || `خط وضعیت: ${r.status || 'پاسخی نیامد'}`
  })

  if (slow) await t('چالش. کلاینت کُند: سرور صف را بی‌نهایت نگه نمی‌دارد', async () => {
    const r = openWs(port, '/ws'); await sleep(300)
    if (!/ 101 /.test(r.status)) return 'اتصال باز نشد'
    r.socket.pause()                                            // کلاینتی که نمی‌خواند
    const big = 'x'.repeat(60000)
    for (let i = 0; i < 400; i++) await request(port, 'POST', '/publish', { body: big })      // حدود ۲۴ مگابایت
    r.socket.resume(); await sleep(1500)
    const got = r.messages.length; r.socket.destroy()
    return (r.closed && got < 400) || `سرور همهٔ ${got} پیام را برای کلاینتِ کُند نگه داشت و اتصال را نبست`
  })

  let ok = 0
  for (const [name, pass, why] of results) { if (pass) ok++; console.log(`${pass ? '✓' : '✗'} ${name}${pass ? '' : `\n    ${why}`}`) }
  console.log(`\n${ok} از ${results.length}`)
  return { ok, total: results.length }
}
