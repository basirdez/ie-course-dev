# کلید تمرین ۱ (خصوصی؛ اجراشده با Node 22 و curl 8.5.0)

| # | parser مرورگر (WHATWG): host و path | curl: Host و خط درخواست |
| --- | --- | --- |
| 1 | `evil.test` · `/login` (userinfo = example.com) | `evil.test` · `/login` |
| 2 | `evil.test` · `/@example.com/` (بک‌اسلش = اسلش) | `example.com` · `/` (بک‌اسلش جزء userinfo) |
| 3 | `example.com` · `/a/c` | `EXAMPLE.com` · `/a/c` |
| 4 | `example.com.` · `/` (origin با نقطه) | `example.com.` · `/` |
| 5 | `example.com` · `/` (پورت پیش‌فرض حذف) | `example.com` · `/` |
| 6 | `[::1]:8080` · `/x` | `[::1]:8080` · `/x` |
| 7 | `127.0.0.1` · `/` | `127.0.0.1` · `/` |
| 8 | `example.com` · `/admin` (`%2e%2e` = `..`) | `example.com` · `/%2e%2e/admin` |

- از `includes` رد می‌شوند و جای دیگری می‌روند: ۱ (و در مرورگر ۲). مورد ۲ نمونهٔ کلاسیک اختلاف parser است.
- اختلاف parser در مورد ۲ (host متفاوت) و مورد ۸ (path متفاوت؛ اگر سرور بعداً decode کند، path traversal).
- بررسی درست: parse با همان کتابخانه‌ای که درخواست را می‌فرستد؛ `hostname === 'example.com'`، بدون userinfo، پورت مجاز، و رد IP literal.
