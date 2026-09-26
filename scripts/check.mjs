// بازبینی خودکار یک جلسهٔ ساخته‌شده.
// استفاده:  node scripts/check.mjs dist/01-url-to-server         (اسلایدهای ساخته‌شده)
//           node scripts/check.mjs path/to/file.md               (lint متن فارسی)
// Chrome نصب‌شده:  CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"
// خروجی: اسکرین‌شات هر اسلاید در <dist>/_check/ و فهرست ایرادها؛ اگر ایرادی باشد exit 1.
import { createServer } from 'node:http'
import { readFile, mkdir } from 'node:fs/promises'
import { extname, join, resolve } from 'node:path'
import { chromium } from 'playwright-chromium'

// حالت lint برای فایل‌های md:
//   node scripts/check.mjs sessions/01-x/01-x.md   یا   00-chapter-map.md
// ۱) جهت: GitHub به هر بند dir="auto" می‌دهد؛ بندِ فارسی که با واژهٔ لاتین شروع شود چپ‌به‌راست دیده می‌شود.
//    (برای منبع Slidev اجرا نمی‌شود؛ layout اسلایدها خودش راست‌به‌چپ است.)
// ۲) فهرست لاتین: «HSTS، DNS» در متن راست‌به‌چپ یک تکهٔ چپ‌به‌راست می‌شود و ترتیبش وارونه خوانده می‌شود.
//    اصطلاحات لاتینِ پشت‌سرهم با «و» جدا شوند: «HSTS و DNS».
// ۳) لاتین و رقم: در «UCLA، ۲۹ اکتبر» رقم فارسی بعد از واژهٔ لاتین چپ‌به‌راست می‌شود و «۲۹» پیش از «UCLA» خوانده می‌شود.
//    میان واژهٔ لاتین و رقم یک واژهٔ فارسی بیاید: «UCLA، شب ۲۹ اکتبر» یا «NSA در ۲۰۱۳».
// ۴) بودجه (فقط منبع دک): minutes هر اسلاید، جمع‌شده به ازای module، با جدول ماژول plan.md همان جلسه مقایسه می‌شود.
if (process.argv[2]?.endsWith('.md')) {
  const { readFileSync } = await import('node:fs')
  const src = readFileSync(process.argv[2], 'utf8')
  const isDeck = /^---\n[\s\S]*?^theme:/m.test(src.split('\n---\n')[0] + '\n')
  const fa = /[\u0620-\u064A\u066E-\u06D5\u06FA-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF]/, latin = /[A-Za-z]/  // فقط حروف؛ رقم فارسی جهت را تعیین نمی‌کند
  const latinList = /[A-Za-z][A-Za-z0-9/.+-]*[)\]]?\s*،\s*[(\[]?[A-Za-z]/  // «9110، cache» مشکلی ندارد؛ «HTTP/2، HTTP/3» دارد
  const latinNum = /[A-Za-z][A-Za-z0-9/.+-]*[)\]]?\s*[،:؛]\s*«?[۰-۹]/
  let fence = false, prev = ''; const bad = []
  src.split('\n').forEach((line, i) => {
    const before = prev; prev = fence ? '' : line
    if (/^\s*```/.test(line)) { fence = !fence; prev = ''; return }
    if (fence) return
    const plain = line.replace(/`[^`]*`/g, ' ').replace(/<code>.*?<\/code>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\]\([^)]*\)/g, ']')
    // متن ویژگی‌های نمایشی (alt و caption و …) هم روی اسلاید دیده می‌شود
    const shown = `${plain} ${[...line.matchAll(/\b(?:alt|caption|label|how|title)="([^"]*)"/g)].map(m => m[1]).join(' ')}`
    const yaml = /^\s*[A-Za-z0-9_]+:\s/.test(line)
    if (fa.test(shown) && latinList.test(shown)) bad.push(`خط ${i + 1} (فهرست لاتین با «،»): ${line.trim().slice(0, 60)}`)
    if (!yaml && fa.test(shown) && latinNum.test(shown)) bad.push(`خط ${i + 1} (رقم فارسی بلافاصله بعد از لاتین): ${line.trim().slice(0, 60)}`)
    // «§5.1» تنها در متن فارسی به «5.1§» تبدیل می‌شود؛ همیشه با نام سند بنویسید: «RFC 9110 §5.1»
    if (/(^|[^A-Za-z0-9\s]|[\u0600-\u06FF])\s*[\[(]?§/.test(plain.replace(/RFC \d+ §/g, ''))) bad.push(`خط ${i + 1} (§ بدون نام سند): ${line.trim().slice(0, 60)}`)
    if (isDeck) return
    const blockStart = !before.trim() || /^\s*(#{1,6}\s|[-*+]\s|\d+[.)]\s|[۰-۹]+[.)]\s|>)/.test(line) || /^#{1,6}\s/.test(before)
    if (!blockStart || /^\s*(\||<|$)/.test(line) || !fa.test(line)) return
    const text = line.replace(/^\s*(#{1,6}\s+|[-*+]\s+|\d+[.)]\s+|[۰-۹]+[.)]\s+|>\s*)/, '')
    for (const ch of text) { if (fa.test(ch)) return; if (latin.test(ch)) { bad.push(`خط ${i + 1} (لاتین‌آغاز): ${line.trim().slice(0, 60)}`); return } }
  })
  // ۴) بودجه (فقط منبع دک): جمع minutes اسلایدهای core/interactive/demo هر module، در برابر جدول جلسه در 00-chapter-map.md
  if (isDeck) {
    const fa2en = x => String(x).replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    const fms = [...src.matchAll(/\n---\n((?:[A-Za-z]+:.*\n)+)---\n/g)].map(m => Object.fromEntries(m[1].trim().split('\n').map(l => [l.slice(0, l.indexOf(':')).trim(), l.slice(l.indexOf(':') + 1).trim()])))
    const sums = {}
    fms.forEach((f, i) => {
      if (!('minutes' in f) || !f.module) { bad.push(`اسلاید ${i + 2}: frontmatter بدون minutes یا module`); return }
      if (['core', 'interactive', 'demo', 'exercise'].includes(f.type || 'core')) sums[f.module] = (sums[f.module] || 0) + Number(f.minutes)
    })
    const n = parseInt((src.match(/^exportFilename:\s*(\d+)/m) || [])[1])
    const { existsSync } = await import('node:fs')
    const { dirname, join } = await import('node:path')
    const plan = {}
    const planFile = join(dirname(process.argv[2]), 'plan.md')
    if (existsSync(planFile)) {
      // طرح همان جلسه: هر ردیف «| M1 | موضوع | دقیقه |» در plan.md
      for (const l of readFileSync(planFile, 'utf8').split('\n')) {
        const r = l.match(/^\|\s*(M\d+)\s*\|[^|]*\|\s*([۰-۹0-9]+)\s*\|/); if (r) plan[r[1]] = Number(fa2en(r[2]))
      }
    } else if (existsSync('00-chapter-map.md')) {
      let inSec = false
      for (const l of readFileSync('00-chapter-map.md', 'utf8').split('\n')) {
        const h = l.match(/^## جلسهٔ\s*([۰-۹0-9]+)/); if (h) { inSec = Number(fa2en(h[1])) === n; continue }
        if (/^## /.test(l)) inSec = false
        const r = inSec && l.match(/^\|\s*(M\d+)\s*\|[^|]*\|\s*([۰-۹0-9]+)\s*\|/); if (r) plan[r[1]] = Number(fa2en(r[2]))
      }
    }
    const mods = [...new Set([...Object.keys(plan), ...Object.keys(sums)])].sort()
    const total = mods.reduce((a, m) => a + (sums[m] || 0), 0)
    console.log(`بودجه: ${mods.map(m => `${m} ${sums[m] || 0}/${plan[m] ?? '?'}`).join('  ')}  ·  جمع ${total} دقیقه`)
    for (const m of mods) if (plan[m] !== undefined && (sums[m] || 0) !== plan[m]) bad.push(`بودجهٔ ${m}: اسلایدها ${sums[m] || 0} دقیقه، نقشهٔ فصل ${plan[m]} دقیقه`)
    if (total > 90) bad.push(`جمع ${total} دقیقه از اسلات ۹۰ دقیقه‌ای بیشتر است`)
  }
  console.log(bad.length ? bad.join('\n') : 'ایرادی در متن پیدا نشد.')
  process.exit(bad.length ? 1 : 0)
}

const root = resolve(process.argv[2] || 'dist')
const outDir = join(root, '_check')
const W = 1280, H = 720, TOL = 2
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json', '.wasm': 'application/wasm', '.pdf': 'application/pdf' }

const server = createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  if (path.endsWith('/')) path += 'index.html'
  try {
    const body = await readFile(join(root, path))
    res.writeHead(200, { 'content-type': types[extname(path)] || 'application/octet-stream' }).end(body)
  } catch { res.writeHead(404).end() }
}).listen(0)
const base = `http://127.0.0.1:${server.address().port}/`

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: W, height: H } })
await mkdir(outDir, { recursive: true })

async function open(no) {
  await page.goto(`${base}#/${no}?clicks=999`, { waitUntil: 'load' })
  await page.waitForTimeout(1500)
  if (await page.$('.mermaid, [class*="mermaid"]')) await page.waitForTimeout(1500)
}

// تعداد اسلایدها از شمارهٔ صفحهٔ layout خوانده می‌شود («۲ از ۱۰»)
await open(2)
const fa = s => Number(s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
const total = fa((await page.textContent('.page-no')).split('از')[1].trim())

const issues = []
for (let no = 1; no <= total; no++) {
  await open(no)
  const found = await page.evaluate(({ W, H, TOL }) => {
    const layout = [...document.querySelectorAll('.slidev-layout')].find(e => e.offsetParent && e.getBoundingClientRect().width > 0)
    if (!layout) return ['layout پیدا نشد']
    const L = layout.getBoundingClientRect(), out = []
    const name = e => e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : '') + ' «' + (e.textContent || '').trim().slice(0, 30) + '»'
    const visible = e => { const cs = getComputedStyle(e); return cs.visibility !== 'hidden' && cs.opacity !== '0' && cs.display !== 'none' }
    const all = [...layout.querySelectorAll('*')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && visible(e) && !e.closest('.monaco-editor') })
    // ۱) بیرون‌زدگی از کادر اسلاید
    for (const e of all) {
      const r = e.getBoundingClientRect()
      if (r.left < L.left - TOL || r.top < L.top - TOL || r.right > L.left + W + TOL || r.bottom > L.top + H + TOL) out.push(`بیرون از کادر: ${name(e)}`)
    }
    // ۲) هم‌پوشانی محتوای body با punch
    const punch = layout.querySelector('.punch'), body = layout.querySelector('.body')
    if (punch && body && visible(punch)) {
      const P = punch.getBoundingClientRect()
      for (const e of body.querySelectorAll('*')) {
        const r = e.getBoundingClientRect()
        if (!r.width || !r.height || !visible(e)) continue
        const dy = Math.min(r.bottom, P.bottom) - Math.max(r.top, P.top), dx = Math.min(r.right, P.right) - Math.max(r.left, P.left)
        if (dy > TOL && dx > TOL) { out.push(`هم‌پوشانی با punch: ${name(e)}`); break }
      }
    }
    // ۳) شمارهٔ فهرست ناخواسته روی فهرست‌های تم
    for (const li of layout.querySelectorAll('ol.chain li, ol.options li, ol.steps li'))
      if (getComputedStyle(li).listStyleType !== 'none') { out.push(`شمارهٔ فهرست ناخواسته: ${name(li)}`); break }
    return [...new Set(out)].slice(0, 5)
  }, { W, H, TOL })
  await page.screenshot({ path: join(outDir, `${String(no).padStart(2, '0')}.png`) })
  for (const f of found) issues.push(`اسلاید ${no}: ${f}`)
}

await browser.close(); server.close()
console.log(`${total} اسلاید بررسی شد · اسکرین‌شات‌ها: ${outDir}`)
if (issues.length) { console.log(issues.join('\n')); process.exit(1) }
console.log('ایرادی پیدا نشد.')
