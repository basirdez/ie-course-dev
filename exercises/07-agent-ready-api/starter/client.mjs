// کلاینت تمرین ۷. این نسخهٔ «بد» است: هر پاسخ ناموفق را بی‌درنگ دوباره می‌فرستد. کار شما (۳) درست کردن آن است.
//
//   callWithRetry(url, init, { maxAttempts = 4, baseMs = 200, capMs = 5000 })   →  آخرین Response
//
// رفتار درست:
//   - فقط وقتی دوباره بفرست که مشکل گذرا باشد: خطای اتصال، 408، 429، و 500 به بالا. بقیهٔ پاسخ‌ها همان بار اول برگردانده شوند.
//   - فقط وقتی دوباره بفرست که تکرار بی‌خطر باشد: متدهای idempotent، یا POST با Idempotency-Key.
//     (استثنا: 429 یعنی درخواست اصلاً اجرا نشده؛ تکرارش برای هر متدی بی‌خطر است.)
//   - اگر پاسخ Retry-After داشت، دست‌کم همان‌قدر صبر کن.
//   - فاصلهٔ تلاش‌ها با هر ناکامی بیشتر شود و مقداری تصادفی داشته باشد:  random() * min(capMs, baseMs * 2 ** attempt)
//   - بعد از maxAttempts تلاش، آخرین پاسخ را برگردان (اگر هیچ پاسخی نیامده، همان خطا را پرتاب کن).
export async function callWithRetry(url, init = {}, { maxAttempts = 4 } = {}) {
  let res
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    res = await fetch(url, init)
    if (res.ok) return res
  }
  return res
}
