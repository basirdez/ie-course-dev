// جمع‌آوری و تصحیح یک تمرین از مخزن‌های خصوصی دانشجوها (فقط روی رایانهٔ مدرس یا دستیار).
//   node scripts/collect.mjs s01 --deadline 2026-10-04T23:59+03:30   تمرین کوتاه جلسهٔ ۱ (short/s01.md)؛ نمرهٔ ۰ و ۱ و ۲ خودکار از روی ساختار
//   node scripts/collect.mjs w02 --deadline 2026-10-16T23:59+03:30   تمرین هفتهٔ ۲ (پوشهٔ w02/)
//   node scripts/collect.mjs w02 --deadline 2026-10-19T23:59+03:30 --only 401234567   (روز تأخیر)
//   node scripts/collect.mjs w02 --sample 0.2            فهرست تصادفی گفتگوی کوتاه
//   node scripts/collect.mjs w02 --send                  بازخوردهای grading/w02/<id>.md را به‌صورت issue می‌فرستد (با gh)
// ورودی: grading/students.csv با ستون‌های id,name,repo (مثلاً 401234567,علی رضایی,ali/ie1405-401234567)
// پوشهٔ grading/ در .gitignore است؛ دادهٔ دانشجو هرگز در مخزن نمی‌رود.
// grader کد دانشجو را اجرا می‌کند: این اسکریپت را در VM یا container جدا اجرا کنید.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const [ex, ...rest] = process.argv.slice(2)
const opt = k => { const i = rest.indexOf(`--${k}`); return i < 0 ? undefined : (rest[i + 1] && !rest[i + 1].startsWith('--') ? rest[i + 1] : true) }
if (!/^[sw]\d\d$/.test(ex || '')) { console.error('نام تمرین را بدهید: s01 برای تمرین کوتاه، w02 برای تمرین هفته'); process.exit(1) }
const short = ex.startsWith('s')
const part = short ? `short/${ex}.md` : ex   // مسیر تحویل در مخزن دانشجو
const slug = short ? undefined : readdirSync('exercises').find(d => d.startsWith(ex + '-'))
// تمرین کوتاه: ۲ اگر هر پنج بخش پر است و «شواهد» بلوک کد دارد، ۱ اگر ناقص است. دستیار نمونه‌ای را دستی می‌بیند.
const SECTIONS = ['پیش‌بینی', 'شواهد', 'اختلاف', 'سؤال', 'هوش مصنوعی']
const shortScore = md => {
  const body = h => (md.split(/^## +/m).find(b => b.startsWith(h)) || '').slice(h.length).trim()
  const missing = SECTIONS.filter(h => !body(h))
  const raw = /```[\s\S]*?```/.test(body('شواهد'))
  return { auto: missing.length || !raw ? 1 : 2, notes: [missing.length ? `ناقص: ${missing.join(' و ')}` : '', raw ? '' : 'شواهد بدون بلوک کد'].filter(Boolean).join('؛ ') }
}
const students = readFileSync('grading/students.csv', 'utf8').trim().split('\n').slice(1).map(l => { const [id, name, repo] = l.split(','); return { id: id.trim(), name: name.trim(), repo: repo.trim() } })
const dir = `grading/${ex}`; mkdirSync(dir, { recursive: true })
const git = (cwd, ...a) => execFileSync('git', a, { cwd, encoding: 'utf8' }).trim()

if (opt('sample')) {
  const k = Math.max(1, Math.round(students.length * Number(opt('sample'))))
  const pick = [...students].sort(() => Math.random() - 0.5).slice(0, k)
  writeFileSync(`${dir}/sample.txt`, pick.map(s => `${s.id} ${s.name}`).join('\n') + '\n')
  console.log(pick.map(s => `${s.id} ${s.name}`).join('\n')); process.exit(0)
}
if (opt('send')) {
  for (const s of students) {
    const f = `${dir}/${s.id}.md`; if (!existsSync(f)) continue
    execFileSync('gh', ['issue', 'create', '-R', s.repo, '-t', `بازخورد ${ex}`, '-F', f], { stdio: 'inherit' })
  }
  process.exit(0)
}

const deadline = opt('deadline'); if (!deadline) { console.error('--deadline لازم است'); process.exit(1) }
const only = opt('only')
const head = short ? 'id,name,commit,auto/2,final/2,notes' : 'id,name,commit,auto,predict/1,evidence/4,analysis/2.5,decision/2.5,total,notes'
const csv = existsSync(`${dir}/scores.csv`) ? readFileSync(`${dir}/scores.csv`, 'utf8').trim().split('\n') : [head]
const put = row => { const i = csv.findIndex(l => l.startsWith(`${row[0]},`)); if (i > 0) csv[i] = row.join(','); else csv.push(row.join(',')) }
for (const s of students.filter(s => !only || s.id === only)) {
  const repo = resolve(`grading/repos/${s.id}`)
  try {
    if (!existsSync(repo)) execFileSync('git', ['clone', '--quiet', /^(\/|\.|https?:)/.test(s.repo) ? s.repo : `https://github.com/${s.repo}.git`, repo])
    else git(repo, 'fetch', '--quiet', 'origin')
    const sha = git(repo, 'rev-list', '-1', `--before=${deadline}`, 'origin/main')
    if (!sha) throw new Error('تا مهلت چیزی push نشده')
    const snap = resolve(`${dir}/${s.id}`); mkdirSync(snap, { recursive: true })
    execFileSync('sh', ['-c', `git -C "${repo}" archive ${sha} ${part} | tar -x -C "${snap}"`])
    if (short) {
      const { auto, notes } = shortScore(readFileSync(`${snap}/${part}`, 'utf8'))
      put([s.id, s.name, sha.slice(0, 8), auto, auto, notes]); console.log(`✓ ${s.id} ${sha.slice(0, 8)} ${auto}`); continue
    }
    let auto = ''
    const grader = slug && `exercises/${slug}/grader/grade.mjs`
    if (grader && existsSync(grader)) auto = JSON.parse(execFileSync('node', [grader, `${snap}/${ex}`], { encoding: 'utf8', timeout: 120000 })).auto
    put([s.id, s.name, sha.slice(0, 8), auto, '', auto, '', '', '', ''])
    if (!existsSync(`${dir}/${s.id}.md`)) writeFileSync(`${dir}/${s.id}.md`, `# بازخورد ${ex}\n\ncommit: \`${sha.slice(0, 8)}\` · آزمون خودکار: ${auto === '' ? '—' : `${auto} از ۴`}\n\n## پیش‌بینی\n\n## شواهد و اجرا\n\n## تحلیل اختلاف\n\n## تصمیم مهندسی\n\n## نمره\n`)
    console.log(`✓ ${s.id} ${sha.slice(0, 8)} ${auto}`)
  }
  catch (e) { if (short) put([s.id, s.name, '', 0, 0, 'تحویل نشده']); console.log(`✗ ${s.id}: ${e.message.split('\n')[0]}`) }
}
writeFileSync(`${dir}/scores.csv`, csv.join('\n') + '\n')
console.log(`→ ${dir}/scores.csv و بازخوردها در ${dir}/`)
