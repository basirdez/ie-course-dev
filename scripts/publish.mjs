// آماده‌سازی نسخهٔ عمومی از روی مخزن خصوصی. فقط فهرست مجاز منتشر می‌شود (deny by default):
//   out/site/  سایت درس (جلسه‌ها و تمرین‌های published، PDF، قواعد درس) → شاخهٔ gh-pages مخزن عمومی
//   out/repo/  فایل‌های عمومی برای دانشجو → شاخهٔ main مخزن عمومی
// هرگز منتشر نمی‌شود: plan.md، نقشهٔ فصل، grader/، و solution/ تمرینی که در course.json → solutions نیامده.
// اجرا: node scripts/publish.mjs   (در GitHub Actions: workflow «Publish»)
import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

const course = JSON.parse(readFileSync('course.json', 'utf8'))
const live = course.sessions.filter(s => s.published)
if (!live.length) { console.error('هیچ جلسه‌ای در course.json منتشرشده (published: true) نیست.'); process.exit(1) }

rmSync('dist', { recursive: true, force: true }); rmSync('out', { recursive: true, force: true })
execSync('node scripts/site.mjs --public --pdf', { stdio: 'inherit' })
cpSync('dist', 'out/site', { recursive: true })

mkdirSync('out/repo/exercises', { recursive: true })
cpSync('course-policy.md', 'out/repo/course-policy.md')
const rows = []
for (const s of live) {
  rows.push(`| ${s.n} | [${s.title}](${course.site}${s.slug}/) | [PDF](${course.site}${s.slug}/${s.slug}.pdf) | ${s.exercise ? `[${s.exercise}](exercises/${s.exercise}/)` : '—'} |`)
  if (!s.exercise || !existsSync(`exercises/${s.exercise}`)) continue
  const dst = `out/repo/exercises/${s.exercise}`
  mkdirSync(dst, { recursive: true })
  cpSync(`exercises/${s.exercise}/README.md`, `${dst}/README.md`)
  for (const d of ['starter', 'check']) if (existsSync(`exercises/${s.exercise}/${d}`)) cpSync(`exercises/${s.exercise}/${d}`, `${dst}/${d}`, { recursive: true })
  if ((course.solutions || []).includes(s.exercise) && existsSync(`exercises/${s.exercise}/solution`)) cpSync(`exercises/${s.exercise}/solution`, `${dst}/solution`, { recursive: true })
}
writeFileSync('out/repo/README.md', `# ${course.title} · ${course.term}

سایت درس: ${course.site}

پیش از اولین تمرین، [قواعد درس](course-policy.md) را بخوانید.

| جلسه | اسلایدها | PDF | تمرین |
| --- | --- | --- | --- |
${rows.join('\n')}
`)
console.log(`آماده: out/site و out/repo (${live.length} جلسه).`)
