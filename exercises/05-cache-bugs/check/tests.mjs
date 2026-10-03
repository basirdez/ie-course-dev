// آزمون‌های تمرین ۵: همهٔ درخواست‌ها از cache مشترک (8790) می‌گذرند، مگر جایی که گفته شده.
import http from 'node:http'

function request(port, method, path, headers = {}) {
  return new Promise((ok, fail) => {
    const req = http.request({ host: '127.0.0.1', port, method, path, headers }, (res) => {
      let data = ''; res.setEncoding('utf8'); res.on('data', c => (data += c)); res.on('end', () => ok({ status: res.statusCode, headers: res.headers, body: data }))
    })
    req.on('error', fail); req.setTimeout(4000, () => req.destroy(new Error('timeout'))); req.end()
  })
}

export async function run(proxy = 8790, origin = 8791) {
  const results = []
  const t = async (name, fn) => { try { const r = await fn(); results.push([name, r === true, r === true ? '' : r]) } catch (e) { results.push([name, false, e.message]) } }
  const viaCache = (path, headers) => request(proxy, 'GET', path, headers)
  await request(proxy, 'POST', '/__purge')

  await t('۱. /account: هر کاربر صفحهٔ خودش را می‌گیرد', async () => {
    const a = await viaCache('/account', { Cookie: 'user=sara' }), b = await viaCache('/account', { Cookie: 'user=ali' })
    return (/sara/.test(a.body) && /ali/.test(b.body)) || `علی این را گرفت: ${b.body.trim()}`
  })
  await t('۲. /search: زبان دوم، پاسخ زبان اول را نمی‌گیرد', async () => {
    const fa = await viaCache('/search?q=book', { 'Accept-Language': 'fa' }), en = await viaCache('/search?q=book', { 'Accept-Language': 'en' })
    return (/نتیجه/.test(fa.body) && /results for/.test(en.body)) || `کاربر انگلیسی‌زبان این را گرفت: ${en.body.trim()}`
  })
  await t('۲. /search: همان زبان، بار دوم از cache می‌آید', async () => {
    const again = await viaCache('/search?q=book', { 'Accept-Language': 'fa' })
    return /hit/.test(again.headers['cache-status'] || '') || `Cache-Status: ${again.headers['cache-status']}`
  })
  let assetPath = ''
  await t('۳. صفحهٔ اصلی هر بار پرسیده می‌شود و فایل ثابت اثر انگشت دارد', async () => {
    const home = await viaCache('/')
    const cc = String(home.headers['cache-control'] || '')
    if (!/no-cache|no-store|max-age=0/.test(cc)) return `Cache-Control صفحهٔ اصلی: ${cc}`
    assetPath = (home.body.match(/\/assets\/app\.[0-9a-f]{6,}\.js/) || [])[0] || ''
    return Boolean(assetPath) || 'نام فایل ثابت در HTML اثر انگشت ندارد'
  })
  await t('۳. فایل ثابت یک سال نگه داشته می‌شود', async () => {
    const js = await viaCache(assetPath || '/assets/app.js')
    const m = String(js.headers['cache-control'] || '').match(/max-age=(\d+)/)
    return (js.status === 200 && m && Number(m[1]) >= 31536000) || `${js.status} Cache-Control: ${js.headers['cache-control']}`
  })
  await t('۳. بعد از انتشار، کاربر نسخهٔ تازه را می‌گیرد', async () => {
    const before = (await viaCache(assetPath || '/assets/app.js')).body
    await request(origin, 'POST', '/deploy')
    const home = await viaCache('/')
    const next = (home.body.match(/\/assets\/app[^"]*\.js/) || [])[0]
    const after = (await viaCache(next)).body
    return after !== before || `بعد از انتشار هنوز: ${after.trim()}`
  })
  await t('۴. /price: بعد از تغییر قیمت، قیمت تازه دیده می‌شود', async () => {
    await viaCache('/price')
    await request(origin, 'POST', '/price?value=135')
    const p = await viaCache('/price')
    return /135/.test(p.body) || `بعد از تغییر هنوز: ${p.body.trim()}`
  })
  await t('۴. /price: پرسش دوباره ارزان است (ETag و 304)', async () => {
    const first = await request(origin, 'GET', '/price')
    if (!first.headers.etag) return 'ETag ندارد'
    const again = await request(origin, 'GET', '/price', { 'If-None-Match': first.headers.etag })
    return again.status === 304 || `به پرسش شرطی ${again.status} داد، نه 304`
  })
  for (const [name, ok, why] of results) console.log(`${ok ? '✓' : '✗'} ${name}${ok ? '' : `   ← ${why}`}`)
  const ok = results.filter(r => r[1]).length
  console.log(`\n${ok} از ${results.length}`)
  return { ok, total: results.length }
}
