// پاسخ مرجع کلاینت تمرین ۷.
const sleep = ms => new Promise(r => setTimeout(r, ms))
const TRANSIENT = new Set([408, 429, 500, 502, 503, 504])
const IDEMPOTENT = new Set(['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS'])

export async function callWithRetry(url, init = {}, { maxAttempts = 4, baseMs = 200, capMs = 5000 } = {}) {
  const method = (init.method || 'GET').toUpperCase()
  const repeatable = IDEMPOTENT.has(method) || new Headers(init.headers || {}).has('Idempotency-Key')
  for (let attempt = 1; ; attempt++) {
    let res, error
    try { res = await fetch(url, init) } catch (e) { error = e }
    const last = attempt >= maxAttempts
    if (error) { if (!repeatable || last) throw error }                         // خطای اتصال: معلوم نیست اجرا شده یا نه
    else if (!TRANSIENT.has(res.status) || last) return res                     // پاسخ قطعی، یا آخرین تلاش
    else if (!repeatable && res.status !== 429) return res                      // 429 یعنی اجرا نشده؛ بقیه برای POST بدون کلید خطرناک‌اند
    if (res) await res.arrayBuffer().catch(() => {})                            // بدنه را بخوان تا اتصال آزاد شود
    const retryAfter = res ? Number(res.headers.get('retry-after')) : NaN
    const floor = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 0
    await sleep(floor + Math.random() * Math.min(capMs, baseMs * 2 ** attempt))
  }
}
