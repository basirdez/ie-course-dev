// ساخت سایت درس در dist/: دک هر جلسه، PDF، صفحهٔ هر تمرین، قواعد درس، و صفحهٔ فهرست
//   node scripts/site.mjs                    همهٔ جلسه‌های موجود (پیش‌نمایش خصوصی)
//   node scripts/site.mjs 02-http-transaction فقط یک جلسه (فهرست هم ساخته می‌شود)
//   node scripts/site.mjs --public           فقط آنچه در course.json با published: true آمده
//   node scripts/site.mjs --pdf              PDF هر جلسه را هم می‌سازد (CHROME_PATH اختیاری)
// همهٔ نشانی‌ها نسبی‌اند؛ خروجی زیر هر مسیری (GitHub Pages یا سرور دانشگاه) کار می‌کند.
import { execSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import MarkdownIt from 'markdown-it'

const args = process.argv.slice(2)
const pub = args.includes('--public')
const pdf = args.includes('--pdf')
const only = args.find(a => !a.startsWith('--'))
const course = JSON.parse(readFileSync('course.json', 'utf8'))
const repoUrl = `https://github.com/${course.publicRepo}`
const exists = s => existsSync(`sessions/${s.slug}/${s.slug}.md`)
const visible = course.sessions.filter(s => !pub || s.published)
mkdirSync('dist/site-assets', { recursive: true })

// ۱) دک‌ها و PDF
for (const s of visible.filter(exists).filter(s => !only || s.slug === only)) {
  const out = resolve('dist', s.slug)
  execSync(`npx slidev build "sessions/${s.slug}/${s.slug}.md" --out "${out}" --base ./`, { stdio: 'inherit' })
  if (pdf) {
    const chrome = process.env.CHROME_PATH ? ` --executable-path "${process.env.CHROME_PATH}"` : ''
    execSync(`npx slidev export "sessions/${s.slug}/${s.slug}.md" --output "${out}/${s.slug}.pdf" --timeout 60000${chrome}`, { stdio: 'inherit' })
  }
}

// ۲) صفحه‌های markdown: تمرین‌ها و قواعد درس
const md = new MarkdownIt({ html: true, linkify: true, typographer: false })
const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
function page(title, body, depth, nav = true) {
  const up = '../'.repeat(depth)
  return `<!doctype html>
<html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · ${esc(course.title)}</title><link rel="stylesheet" href="${up}site-assets/site.css">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%230A6C86'/%3E%3Cpath d='M7 16h18' stroke='%23fff' stroke-width='3'/%3E%3C/svg%3E"></head>
<body><header class="top"><div class="wrap"><a class="brand" href="${up}index.html">${esc(course.title)}</a>${nav ? `<nav><a href="${up}index.html">جلسه‌ها</a><a href="${up}policy/">قواعد درس</a><a href="${repoUrl}">مخزن</a></nav>` : ''}</div></header>
<main class="wrap">${body}</main>
<footer class="wrap">${esc(course.instructor)} · ${esc(course.university)} · ${esc(course.term)}</footer></body></html>`
}
// پیوندهای نسبی داخل README: قواعد درس به صفحهٔ سایت، فایل‌ها به مخزن عمومی
function renderMd(file, exDir) {
  let src = readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '')
  src = src.replace(/\]\((?:\.\.\/)*course-policy\.md\)/g, '](../../policy/)')
  if (exDir) src = src.replace(/\]\((?!https?:|#|\.\.\/\.\.\/policy)([^)]+)\)/g, (_, p) => `](${repoUrl}/blob/main/exercises/${exDir}/${p})`)
  return md.render(src).replace(/<pre>/g, '<pre dir="ltr">').replace(/<table>/g, '<div class="tbl"><table>').replace(/<\/table>/g, '</table></div>')
}
for (const s of visible.filter(s => s.exercise && existsSync(`exercises/${s.exercise}/README.md`))) {
  mkdirSync(`dist/exercises/${s.exercise}`, { recursive: true })
  const files = ['starter', 'check'].filter(d => existsSync(`exercises/${s.exercise}/${d}`))
  const extra = files.length ? `<p class="files">فایل‌های تمرین: ${files.map(d => `<a href="${repoUrl}/tree/main/exercises/${s.exercise}/${d}"><code>${d}/</code></a>`).join(' · ')}</p>` : ''
  writeFileSync(`dist/exercises/${s.exercise}/index.html`, page(`تمرین کوتاه ${s.n}`, `<article class="doc">${renderMd(`exercises/${s.exercise}/README.md`, s.exercise)}${extra}</article>`, 2))
}
mkdirSync('dist/policy', { recursive: true })
writeFileSync('dist/policy/index.html', page('قواعد درس', `<article class="doc">${renderMd('course-policy.md')}</article>`, 1))

// ۳) صفحهٔ فهرست
const fa = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d])
const cards = course.chapters.map((ch) => {
  const rows = course.sessions.filter(s => s.chapter === ch.id && (!pub || s.published || !exists(s))).map((s) => {
    const built = existsSync(`dist/${s.slug}/index.html`) && (!pub || s.published)
    const links = built
      ? `<a class="btn" href="${s.slug}/">اسلایدها</a>${existsSync(`dist/${s.slug}/${s.slug}.pdf`) ? `<a class="btn" href="${s.slug}/${s.slug}.pdf">PDF</a>` : ''}${s.exercise && existsSync(`dist/exercises/${s.exercise}/index.html`) ? `<a class="btn ex" href="exercises/${s.exercise}/">تمرین کوتاه ${fa(s.n)}</a>` : ''}`
      : '<span class="soon">به‌زودی</span>'
    return `<li class="${built ? '' : 'off'}"><span class="n">${fa(s.n)}</span><div class="t"><b>${esc(s.title)}</b><small>${esc(s.question)}</small></div><div class="a">${links}</div></li>`
  }).join('')
  return rows ? `<section><h2>${esc(ch.title)}</h2><ol class="sessions">${rows}</ol></section>` : ''
}).join('')
writeFileSync('dist/index.html', page(course.title, `<div class="hero"><h1>${esc(course.title)}</h1><p>${esc(course.term)} · ${esc(course.instructor)}</p><p class="hint">هر جلسه: اسلایدها برای دیدن در مرورگر، PDF برای مرور و چاپ، و تمرین کوتاه پایان جلسه. پیش از اولین تمرین، <a href="policy/">قواعد درس</a> را بخوانید.</p></div>${cards}`, 0))

// ۴) قلم و CSS
copyFileSync('theme/styles/fonts/vazirmatn.woff2', 'dist/site-assets/vazirmatn.woff2')
copyFileSync('scripts/site.css', 'dist/site-assets/site.css')
console.log(`سایت در dist/ ساخته شد${pub ? ' (فقط موارد منتشرشده)' : ''}.`)
