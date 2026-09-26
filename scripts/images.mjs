// دریافت تصویرهایی که در دک‌ها با <Shot src="images/x.jpg" wiki="File name.jpg" …> آمده‌اند.
// اجرا:  npm run images            فقط تصویرهای نبوده را می‌گیرد
//        npm run images -- --force  همه را دوباره می‌گیرد
// خروجی: sessions/<slug>/public/<src> و sessions/<slug>/public/images/credits.json (صاحب اثر، مجوز، صفحهٔ منبع)
// تصویرهای دریافت‌شده را commit کنید تا ساخت دک به شبکه وابسته نباشد. در GitHub Actions هم پیش از ساخت اجرا می‌شود.
// سیاست ویکی‌مدیا: User-Agent باید راه تماس داشته باشد؛ با WIKI_UA می‌توانید آن را عوض کنید.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const force = process.argv.includes('--force')
const repo = process.env.GITHUB_REPOSITORY ? `https://github.com/${process.env.GITHUB_REPOSITORY}` : 'local build'
const UA = process.env.WIKI_UA || `internet-engineering-slides/1.0 (${repo}; course slides)`
const API = 'https://en.wikipedia.org/w/api.php' // فایل‌های Commons را هم برمی‌گرداند
const WIDTH = 1400

const strip = html => (html || '').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/\s+/g, ' ').trim()
const attr = (tag, name) => (tag.match(new RegExp(`\\b${name}="([^"]+)"`)) || [])[1]

let got = 0, skipped = 0
const problems = []
for (const s of readdirSync('sessions').filter(d => existsSync(`sessions/${d}/${d}.md`)).sort()) {
  const md = readFileSync(`sessions/${s}/${s}.md`, 'utf8')
  const shots = [...md.matchAll(/<Shot\b[\s\S]*?\/>/g)].map(m => ({ src: attr(m[0], 'src'), wiki: attr(m[0], 'wiki') })).filter(x => x.src && x.wiki)
  if (!shots.length) continue
  const creditsPath = `sessions/${s}/public/images/credits.json`
  const credits = existsSync(creditsPath) ? JSON.parse(readFileSync(creditsPath, 'utf8')) : {}
  for (const { src, wiki } of shots) {
    const out = `sessions/${s}/public/${src}`
    const key = src.split('/').pop()
    if (!force && existsSync(out) && credits[key]) { skipped++; continue }
    try {
      const q = new URLSearchParams({ action: 'query', format: 'json', formatversion: '2', prop: 'imageinfo', iiprop: 'url|extmetadata|mime', iiurlwidth: String(WIDTH), titles: `File:${wiki}` })
      const r = await fetch(`${API}?${q}`, { headers: { 'User-Agent': UA } })
      if (!r.ok) throw new Error(`API ${r.status}`)
      const info = (await r.json()).query?.pages?.[0]?.imageinfo?.[0]
      if (!info) throw new Error('فایل پیدا نشد')
      const m = info.extmetadata || {}
      const img = await fetch(info.thumburl || info.url, { headers: { 'User-Agent': UA } })
      if (!img.ok) throw new Error(`دریافت ${img.status}`)
      mkdirSync(dirname(out), { recursive: true })
      writeFileSync(out, Buffer.from(await img.arrayBuffer()))
      const license = strip(m.LicenseShortName?.value)
      credits[key] = { file: wiki, artist: strip(m.Artist?.value).slice(0, 80), license, page: info.descriptionurl }
      if (/non-free|fair use/i.test(license)) problems.push(`${s}/${src}: مجوز «${license}» آزاد نیست؛ پیش از انتشار عمومی بررسی کنید`)
      got++
      console.log(`✓ ${s}/${src}  ← ${wiki}  (${license || 'مجوز نامعلوم'})`)
    }
    catch (e) {
      problems.push(`${s}/${src} ← ${wiki}: ${e.message}`)
    }
  }
  mkdirSync(dirname(creditsPath), { recursive: true })
  writeFileSync(creditsPath, `${JSON.stringify(credits, null, 2)}\n`)
}
console.log(`${got} تصویر دریافت شد، ${skipped} تصویر از قبل بود.`)
for (const p of problems) console.warn(`⚠ ${p}`)
// شکست دریافت، ساخت را متوقف نمی‌کند: Shot به‌جای تصویرِ نبوده کادر راهنما نشان می‌دهد.
