// بیست agent هم‌زمان، هر کدام یک کار؛ سه راه برای رفتار بعد از 429:   node clients.mjs [naive|wait|jitter]
// پیش از اجرا:  SHARED=1 node limited.mjs
const BASE = 'http://127.0.0.1:8821', AGENTS = Number(process.env.AGENTS || 20), MAX = 100000
const sleep = ms => new Promise(r => setTimeout(r, ms))

const strategies = {
  naive: async () => 0,                                                             // بی‌درنگ دوباره
  wait: async (res) => Number(res.headers.get('retry-after') || 1) * 1000,          // همان Retry-After، همه با هم
  jitter: async (res, attempt) => {                                                 // Retry-After به‌علاوهٔ تأخیر تصادفیِ رو به رشد
    const floor = Number(res.headers.get('retry-after') || 0) * 1000
    return floor + Math.random() * Math.min(8000, 250 * 2 ** attempt)
  },
}

async function agent(wait) {
  for (let attempt = 0; attempt < MAX; attempt++) {
    const res = await fetch(`${BASE}/work`); await res.arrayBuffer()
    if (res.status === 200) return attempt + 1
    await sleep(await wait(res, attempt))
  }
  return MAX
}

console.log('strategy   time      requests seen by server   rejected (429)   biggest retry wave (per 100 ms)   worst agent')
for (const name of process.argv[2] ? [process.argv[2]] : Object.keys(strategies)) {
  await fetch(`${BASE}/reset`, { method: 'POST' })
  const start = Date.now()
  const tries = await Promise.all(Array.from({ length: AGENTS }, () => agent(strategies[name])))
  const ms = Date.now() - start
  const s = await (await fetch(`${BASE}/stats`)).json()
  console.log(`${name.padEnd(10)} ${`${(ms / 1000).toFixed(1)} s`.padEnd(9)} ${String(s.seen).padEnd(25)} ${String(s.rejected).padEnd(16)} ${String(s.peakLater).padEnd(33)} ${Math.max(...tries)} tries`)
  await sleep(1200)
}
