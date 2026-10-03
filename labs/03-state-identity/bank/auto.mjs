// همان آزمایش CSRF با مرورگر بدون رابط؛ جدول «کوکی همراه درخواست رفت یا نه» را چاپ می‌کند.
//   node bank/bank.mjs & node bank/evil.mjs & CHROME_PATH=... node bank/auto.mjs
import { chromium } from 'playwright-chromium'
const bank = 'http://localhost:8771'
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--no-sandbox'] })
console.log('browser:', browser.version())
const last = async (page, path) => (await (await page.request.get(`${bank}/log`)).json()).filter(r => r.path === path).pop()
const rows = []
for (const mode of ['(none set)', 'lax', 'strict', 'none']) {
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  await page.goto(bank + '/')
  const q = mode.startsWith('(') ? '' : `?samesite=${mode}`
  await page.evaluate(q => fetch('/login' + q, { method: 'POST', body: new URLSearchParams({ user: 'ali' }) }), q)
  const row = { cookie: mode }
  for (const [name, host] of [['cross-site', '127.0.0.1'], ['same-site', 'localhost']]) {
    await page.goto(`http://${host}:8772/post`); await page.waitForURL(/transfer/)
    row[`${name} POST form`] = (await last(page, '/transfer')).cookie ? 'sent' : '-'
  }
  await page.goto('http://127.0.0.1:8772/img'); await page.waitForTimeout(300)
  row['cross-site <img>'] = (await last(page, '/me')).cookie ? 'sent' : '-'
  await page.goto('http://127.0.0.1:8772/link'); await page.click('#go'); await page.waitForURL(/\/me/)
  const nav = await last(page, '/me')
  row['cross-site link (GET)'] = nav.cookie ? 'sent' : '-'
  row['Sec-Fetch-Site'] = nav.site
  rows.push(row)
  await ctx.close()
}
console.table(rows)
await browser.close()
