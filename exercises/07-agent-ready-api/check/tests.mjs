// آزمون‌های تمرین ۷. بخش سرور روی پورت 8831 (QUOTA=5 WINDOW=2)؛ بخش کلاینت روی یک سرور ناپایدار که خود آزمون می‌سازد (8832).
import http from 'node:http'

const HOST = '127.0.0.1'
const sleep = ms => new Promise(r => setTimeout(r, ms))

function request(port, method, path, { token, headers = {}, body } = {}) {
  return new Promise((ok, fail) => {
    const h = { ...headers }
    if (token) h.Authorization = `Bearer ${token}`
    if (body !== undefined) h['Content-Type'] = 'application/json'
    const req = http.request({ host: HOST, port, method, path, headers: h, agent: false }, (res) => {
      let data = ''; res.setEncoding('utf8'); res.on('data', c => (data += c)); res.on('end', () => { let json = null; try { json = JSON.parse(data) } catch {} ok({ status: res.statusCode, headers: res.headers, body: data, json }) })
    })
    req.on('error', fail); req.setTimeout(4000, () => req.destroy(new Error('timeout'))); req.end(body === undefined ? undefined : JSON.stringify(body))
  })
}

// سرور ناپایدار: برای هر مسیر صفی از پاسخ‌ها دارد؛ وقتی صف تمام شد 200 می‌دهد. هر درخواست را با زمانش ثبت می‌کند.
function flaky() {
  const scripts = new Map(), seen = new Map()
  const server = http.createServer((req, res) => {
    const log = seen.get(req.url) || []; seen.set(req.url, log)
    log.push({ at: Date.now(), method: req.method, key: req.headers['idempotency-key'] || null })
    req.resume()
    const step = (scripts.get(req.url) || []).shift()
    if (step === 'drop') return req.socket.destroy()
    if (step) { res.writeHead(step.status, step.headers || {}); return res.end('{}') }
    res.writeHead(200, { 'Content-Type': 'application/json' }); res.end('{"ok":true}')
  })
  return { server, script: (path, steps) => scripts.set(path, [...steps]), seen: path => seen.get(path) || [] }
}

export async function run({ callWithRetry, port = 8831, flakyPort = 8832 } = {}) {
  const results = []
  const t = async (name, fn) => { try { const r = await fn(); results.push([name, r === true, r === true ? '' : r]) } catch (e) { results.push([name, false, `خطا: ${e.message}`]) } }
  const tag = Date.now().toString(36)

  // ---------- سرور: سقف نرخ ----------
  await t('۰. بدون token پاسخ 401 با WWW-Authenticate می‌آید (آماده بود)', async () => {
    const r = await request(port, 'GET', '/slots')
    return (r.status === 401 && /bearer/i.test(r.headers['www-authenticate'] || '')) || `وضعیت: ${r.status}`
  })
  let limited
  await t('۱. سقف نرخ: پنج درخواست پذیرفته می‌شود و ششمی 429 می‌گیرد', async () => {
    const codes = []
    for (let i = 0; i < 6; i++) { limited = await request(port, 'GET', '/slots', { token: 'agent-a' }); codes.push(limited.status) }
    return codes.join(' ') === '200 200 200 200 200 429' || `کدها: ${codes.join(' ')}`
  })
  await t('۱. سقف نرخ: پاسخ 429 فیلد Retry-After دارد (عدد صحیح، ۱ تا ۲ ثانیه)', async () => {
    const v = limited?.headers['retry-after']
    return (/^\d+$/.test(v || '') && Number(v) >= 1 && Number(v) <= 2) || `Retry-After: ${v ?? '(ندارد)'}`
  })
  await t('۱. سقف نرخ: سقف هر token جداست', async () => {
    const r = await request(port, 'GET', '/slots', { token: 'agent-b' })
    return r.status === 200 || `agent-b این را گرفت: ${r.status}`
  })
  await t('۱. سقف نرخ: بعد از Retry-After دوباره پذیرفته می‌شود', async () => {
    await sleep((Number(limited?.headers['retry-after']) || 2) * 1000 + 100)
    const r = await request(port, 'GET', '/slots', { token: 'agent-a' })
    return r.status === 200 || `بعد از صبر: ${r.status}`
  })

  // ---------- سرور: کلید idempotency ----------
  const free = (await request(port, 'GET', '/slots', { token: 'agent-b' })).json || []
  const [s1, s2, s3] = free
  let first
  await t('۲. تکرار با همان کلید: همان پاسخ، و فقط یک نوبت', async () => {
    const opts = { token: 'agent-c', headers: { 'Idempotency-Key': `k1-${tag}` }, body: { slot: s1, name: 'Sara' } }
    first = await request(port, 'POST', '/bookings', opts)
    const again = await request(port, 'POST', '/bookings', opts)
    const mine = (await request(port, 'GET', '/bookings', { token: 'agent-c' })).json || []
    if (first.status !== 201) return `بار اول: ${first.status}`
    if (again.status !== 201 || again.json?.id !== first.json?.id) return `بار دوم: ${again.status} ${again.body.trim()} (باید همان 201 و همان id باشد)`
    return mine.filter(b => b.slot === s1).length === 1 || 'بیش از یک نوبت ساخته شد'
  })
  await t('۲. همان کلید با بدنهٔ دیگر: 422', async () => {
    const r = await request(port, 'POST', '/bookings', { token: 'agent-c', headers: { 'Idempotency-Key': `k1-${tag}` }, body: { slot: s2, name: 'Sara' } })
    return r.status === 422 || `وضعیت: ${r.status} ${r.body.trim()}`
  })
  await t('۲. کلید هر token جداست: token دیگر با همان کلید، پاسخ او را نمی‌گیرد', async () => {
    const r = await request(port, 'POST', '/bookings', { token: 'agent-d', headers: { 'Idempotency-Key': `k1-${tag}` }, body: { slot: s1, name: 'Sara' } })
    return (r.status === 409 && r.json?.id === undefined) || `agent-d این را گرفت: ${r.status} ${r.body.trim()} (باید 409 باشد: نوبت مال agent-c است)`
  })
  await t('۲. بدون کلید، رفتار قبلی می‌ماند: بار دوم 409', async () => {
    const a = await request(port, 'POST', '/bookings', { token: 'agent-d', body: { slot: s3, name: 'Ali' } })
    const b = await request(port, 'POST', '/bookings', { token: 'agent-d', body: { slot: s3, name: 'Ali' } })
    return (a.status === 201 && b.status === 409) || `کدها: ${a.status} ${b.status}`
  })

  // ---------- کلاینت ----------
  const f = flaky()
  await new Promise(r => f.server.listen(flakyPort, HOST, r))
  const base = `http://${HOST}:${flakyPort}`
  const fast = { maxAttempts: 4, baseMs: 20, capMs: 100 }

  await t('۳. کلاینت: بعد از 429 دست‌کم به اندازهٔ Retry-After صبر می‌کند', async () => {
    f.script('/a', [{ status: 429, headers: { 'Retry-After': '1' } }])
    const res = await callWithRetry(`${base}/a`, {}, fast)
    const log = f.seen('/a')
    if (res.status !== 200 || log.length !== 2) return `پاسخ ${res.status} بعد از ${log.length} درخواست (باید 200 بعد از ۲ درخواست باشد)`
    const gap = log[1].at - log[0].at
    return gap >= 950 || `فاصلهٔ دو درخواست ${gap} میلی‌ثانیه بود؛ سرور گفته بود یک ثانیه`
  })
  await t('۳. کلاینت: خطای گذرا (503) را دوباره می‌فرستد، با فاصله', async () => {
    f.script('/b', [{ status: 503 }, { status: 503 }])
    const res = await callWithRetry(`${base}/b`, {}, { maxAttempts: 4, baseMs: 400, capMs: 2000 })
    const log = f.seen('/b')
    if (res.status !== 200 || log.length !== 3) return `پاسخ ${res.status} بعد از ${log.length} درخواست (باید 200 بعد از ۳ درخواست باشد)`
    return log[2].at - log[0].at >= 30 || `سه درخواست در ${log[2].at - log[0].at} میلی‌ثانیه رفت؛ میان تلاش‌ها فاصله‌ای نیست`
  })
  await t('۳. کلاینت: خطای قطعی (400) را دوباره نمی‌فرستد', async () => {
    f.script('/c', [{ status: 400 }, { status: 400 }])
    const res = await callWithRetry(`${base}/c`, {}, fast)
    return (res.status === 400 && f.seen('/c').length === 1) || `${f.seen('/c').length} درخواست فرستاد`
  })
  await t('۳. کلاینت: بعد از maxAttempts دست می‌کشد و آخرین پاسخ را برمی‌گرداند', async () => {
    f.script('/d', Array(10).fill({ status: 503 }))
    const res = await callWithRetry(`${base}/d`, {}, { maxAttempts: 3, baseMs: 20, capMs: 100 })
    return (res.status === 503 && f.seen('/d').length === 3) || `پاسخ ${res.status} بعد از ${f.seen('/d').length} درخواست (باید 503 بعد از ۳ درخواست باشد)`
  })
  await t('۳. کلاینت: خطای اتصال در GET را دوباره می‌فرستد', async () => {
    f.script('/e', ['drop'])
    const res = await callWithRetry(`${base}/e`, {}, fast)
    return (res.status === 200 && f.seen('/e').length === 2) || `${f.seen('/e').length} درخواست`
  })
  await t('۴. کلاینت: POST بدون Idempotency-Key را بعد از 503 دوباره نمی‌فرستد', async () => {
    f.script('/f', [{ status: 503 }])
    const res = await callWithRetry(`${base}/f`, { method: 'POST', body: '{}' }, fast)
    return (res.status === 503 && f.seen('/f').length === 1) || `${f.seen('/f').length} درخواست POST فرستاد؛ ممکن بود سفارش دو بار ثبت شود`
  })
  await t('۴. کلاینت: POST با Idempotency-Key را دوباره می‌فرستد، با همان کلید', async () => {
    f.script('/g', [{ status: 503 }])
    const res = await callWithRetry(`${base}/g`, { method: 'POST', body: '{}', headers: { 'Idempotency-Key': 'abc' } }, fast)
    const log = f.seen('/g')
    return (res.status === 200 && log.length === 2 && log.every(x => x.key === 'abc')) || `پاسخ ${res.status} بعد از ${log.length} درخواست؛ کلیدها: ${log.map(x => x.key)}`
  })
  f.server.close(); f.server.closeAllConnections?.()

  let ok = 0
  for (const [name, pass, why] of results) { if (pass) ok++; console.log(`${pass ? '✓' : '✗'} ${name}${pass ? '' : `\n    ${why}`}`) }
  console.log(`\n${ok} از ${results.length}`)
  return { ok, total: results.length }
}
