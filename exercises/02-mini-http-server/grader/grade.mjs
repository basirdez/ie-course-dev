// نمره‌دهی خودکار تمرین ۲ (خصوصی؛ منتشر نمی‌شود).
// اجرا: node grader/grade.mjs <پوشهٔ ex02 دانشجو>   ← خروجی JSON روی stdout
// کد دانشجو را فقط در محیط جدا (VM یا container بدون دسترسی شبکه) اجرا کنید.
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { tests, raw, parse } from '../check/tests.mjs'

const dir = process.argv[2]
const port = 20000 + Math.floor(Math.random() * 20000)
const cmd = existsSync(join(dir, 'server.py')) ? ['python3', ['server.py', String(port)]]
  : existsSync(join(dir, 'server.mjs')) ? ['node', ['server.mjs', String(port)]] : null
if (!cmd) { console.log(JSON.stringify({ error: 'server.py یا server.mjs پیدا نشد', auto: 0 })); process.exit(0) }

const R = s => s.replace(/\n/g, '\r\n')
const hidden = [
  ['پنهان: درخواستی که در دو تکه می‌رسد', async p => (parse(await raw(p, [R('GET / HTTP/1.1\nHo'), R('st: localhost\nConnection: close\n\n')]))[0]?.status === 200)],
  ['پنهان: نام فیلد با حروف کوچک (host:)', async p => (parse(await raw(p, R('GET / HTTP/1.1\nhost: localhost\nConnection: close\n\n')))[0]?.status === 200)],
  ['پنهان: بدنهٔ ۱۰۰ کیلوبایتی در /echo', async p => {
    const body = 'x'.repeat(100_000)
    const [r] = parse(await raw(p, R(`POST /echo HTTP/1.1\nHost: localhost\nContent-Length: ${body.length}\nConnection: close\n\n`) + body, { wait: 1500 }))
    return r?.body.length === body.length
  }],
]

const child = spawn(cmd[0], cmd[1], { cwd: dir, stdio: 'ignore' })
await new Promise(r => setTimeout(r, 1200))
const log = console.log; console.log = () => {}
const pub = await import('../check/tests.mjs').then(m => m.run(port, tests))
const hid = await import('../check/tests.mjs').then(m => m.run(port, hidden))
console.log = log
child.kill()
// سهم خودکار «شواهد و اجرا» از ۴: آزمون‌های پایه ۳ نمره، چالش و پنهان ۱ نمره
const base = pub.results.slice(0, 9).filter(r => r.pass).length / 9
const extra = [...pub.results.slice(9), ...hid.results].filter(r => r.pass).length / (2 + hidden.length)
console.log(JSON.stringify({ auto: Math.round((base * 3 + extra) * 100) / 100, failed: [...pub.results, ...hid.results].filter(r => !r.pass).map(r => r.name) }))
