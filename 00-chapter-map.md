# فصل ۱ — پروتکل‌ها · نقشهٔ فصل

درس مهندسی اینترنت · پاییز ۱۴۰۵
آخرین به‌روزرسانی: ۱۴۰۵/۰۷/۰۶

این فایل نقشهٔ سطح فصل است: ستون فقرات، فهرست جلسه‌ها، طرح اولیهٔ جلسه‌های آینده و اصلاحات دک ترم پیش. جزئیات هر جلسه (ماژول‌ها، بودجه، نمونه‌های واقعی، یادداشت‌های باز) در `sessions/NN-slug/plan.md` همان جلسه است، تا هر چت فقط طرح جلسهٔ خودش را بخواند.
متن اسلایدها فقط در منبع دک هر جلسه است (`sessions/NN-slug/NN-slug.md`)، و رئوس مطالب فصل برای فهرست پیشرفت پایان هر جلسه در `sessions/ch1-syllabus.md`؛ این فایل ساختار فصل را نگه می‌دارد، نه متن اسلایدها. دقیقهٔ هر اسلاید در frontmatter خودش است و `npm run check` جمع آن را با جدول ماژول‌های همین فایل مقایسه می‌کند.

---

## ستون فقرات فصل

```text
parse URL ← بررسی HSTS ← DNS ← اتصال (TCP/QUIC) ← TLS ← HTTP
```

هر جلسه یک حلقه از این زنجیره را بررسی می‌کند و در شروع هر جلسه زنجیره دوباره نشان داده می‌شود.

| جلسه | عنوان | سؤال محوری | وضعیت |
| --- | --- | --- | --- |
| ۰ | [اینترنت چطور به اینجا رسید؟](sessions/00-how-we-got-here/plan.md) (پیش از فصل ۱) | اینترنت امروز حاصل کدام تصمیم‌های مهندسی است؟ | دک ۴۷ اسلاید و تمرین ۰ ✅ (بازبینی سوم اعمال شد؛ در انتظار تأیید) |
| ۱ | [از URL تا سرور](sessions/01-url-to-server/plan.md) | مرورگر چگونه از URL به سرور می‌رسد، و کدام مرحله می‌تواند خراب شود؟ | دک ۴۹ اسلاید و تمرین ۱ ✅ (M2–M5 در انتظار بازبینی) |
| ۲ | [یک تراکنش HTTP](sessions/02-http-transaction/plan.md) | یک درخواست و پاسخ کامل از چه ساخته شده و معنایش را چه کسی تعیین می‌کند؟ | دک ۴۹ اسلاید و تمرین ۲ ✅ (در انتظار بازبینی) |
| ۳ | state و هویت | پروتکلی که بی‌حالت است، شما را چطور می‌شناسد؟ | طرح اولیه |
| ۴ | زیر HTTP: اتصال و TLS | چرا HTTP سه نسخه دارد و TLS دقیقاً از چه چیزی محافظت می‌کند؟ | طرح اولیه |
| ۵ | واسطه‌ها: cache و proxy و CDN | چه کسی بین شما و سرور نشسته و چه چیزی را می‌بیند؟ | طرح اولیه |
| ۶ | وقتی سرور باید اول حرف بزند | push از سرور به کلاینت با چه سازوکارهایی ممکن است و هرکدام کجا می‌شکند؟ | طرح اولیه |
| ۷ | کلاینت‌های ماشینی، agent و MCP | وقتی کلاینت انسان نیست، چه چیزی در پروتکل عوض می‌شود؟ | طرح اولیه |

---

## جلسه‌های ۳ تا ۷ — طرح اولیه

بودجهٔ دقیقه‌ای و پیامد یادگیری این جلسه‌ها هنوز تعیین نشده است. پیش از نوشتن هر جلسه، طرحش به `sessions/NN-slug/plan.md` منتقل و کامل می‌شود.

### جلسهٔ ۳ — state و هویت
- **ماژول‌ها:** cookie و attributeها · SOP و CORS · CSRF و `SameSite` · authentication (خلاصه؛ تفصیل در فصل بعد)
- **مدل ذهنی:** پروتکل بی‌حالت است، برنامه نه؛ مرورگر کوکی را خودکار می‌فرستد و همین هم قدرت است هم خطر
- **تصمیم مهندسی:** session cookie یا bearer token؟ `SameSite=Lax` یا `Strict`؟
- **نمونهٔ واقعی:** عقب‌نشینی Google از حذف کوکی شخص ثالث (۲ اردیبهشت ۱۴۰۴) و تعطیلی Privacy Sandbox (۲۵ مهر ۱۴۰۴) — [Privacy Sandbox](https://privacysandbox.google.com/blog/privacy-sandbox-next-steps)

### جلسهٔ ۴ — زیر HTTP: اتصال و TLS
- **ماژول‌ها:** TCP و head-of-line blocking · QUIC · HTTP/1.1 ↔ ۲ ↔ ۳ · TLS 1.3 کامل (handshake، گواهی، 0-RTT)
- **مدل ذهنی:** HTTP/2 مشکل HOL را در لایهٔ HTTP حل کرد ولی در TCP نه؛ QUIC به همین دلیل وجود دارد
- **تصمیم مهندسی:** فعال کردن HTTP/3 کِی می‌ارزد؟
- **نمونهٔ واقعی:** HTTP/2 Rapid Reset (CVE-2023-44487) `[بررسی‌نشده: لینک]` · شکست Server Push و حذفش از Chrome 106 ([Chrome blog](https://developer.chrome.com/blog/removing-push))؛ از جلسهٔ ۲ به اینجا آمد · تفاوت «پشتیبانی اعلام‌شده» از HTTP/3 (حدود ۳۹٪ سایت‌ها در W3Techs) با «سهم واقعی درخواست‌ها» (حدود ۲۰٪) `[volatile: بررسی ۱۴۰۵/۱۰]`

### جلسهٔ ۵ — واسطه‌ها: cache و proxy و CDN
- **ماژول‌ها:** freshness و `Cache-Control` · conditional request (`ETag`، `304`) · cache key و `Vary` · forward و reverse proxy · `Forwarded` و مرز اعتماد · CDN و TLS termination
- **مدل ذهنی:** CDN همان reverse proxy است؛ TLS در لبه باز می‌شود پس CDN متن ساده را می‌بیند
- **تصمیم مهندسی:** `no-cache` یا `no-store`؟ به `X-Forwarded-For` اعتماد کنیم؟
- **نمونهٔ واقعی:** قطعی Cloudflare (۲۷ آبان ۱۴۰۴) — [پست‌مورتم رسمی](https://blog.cloudflare.com/18-november-2025-outage/)

### جلسهٔ ۶ — وقتی سرور باید اول حرف بزند
- **ماژول‌ها:** polling و long polling · SSE · WebSocket (handshake و frame و masking) · WebTransport (اشاره) · MQTT (اشاره)
- **مدل ذهنی:** هر سازوکار push یک مصالحه بین جهت، سازگاری با proxy و هزینهٔ اتصال بازِ طولانی است
- **تصمیم مهندسی:** SSE یا WebSocket؟ اتصال طولانی را پشت load balancer چطور مقیاس دهیم؟
- **نمونهٔ واقعی:** استریم توکن در APIهای LLM با SSE · مسیر transport در MCP از HTTP+SSE دو-endpointی به Streamable HTTP — [MCP](https://modelcontextprotocol.io/specification/draft/basic/transports/streamable-http)

### جلسهٔ ۷ — کلاینت‌های ماشینی، agent و MCP
- **ماژول‌ها:** robots.txt، احراز هویت crawler و `402` · retry، `429`، `Retry-After` و idempotency key · MCP (خلاصه؛ تفصیل در فصل بعد)
- **مدل ذهنی:** یک پروتکل تازه (MCP) در عمل همان درس‌های HTTP را دوباره کشف کرد: بی‌حالتی، قابلیت cache و مسیریابی از روی header
- **تصمیم مهندسی:** agent شما کِی retry کند و چطور تکرار عملیات را بی‌خطر کند؟
- **نمونهٔ واقعی:** block پیش‌فرض crawlerهای هوش مصنوعی و pay-per-crawl در Cloudflare — [بلاگ Cloudflare](https://blog.cloudflare.com/introducing-pay-per-crawl/) · بازنگری MCP ۲۰۲۶-۰۷-۲۸ (حذف session، هدرهای `Mcp-Method`/`Mcp-Name`، `ttlMs` و `cacheScope`) — [بلاگ MCP](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)

---

## قراردادها

قراردادهای درس (زبان، ساختار جلسه، سؤال کلاسی، جهت متن، منبع‌دهی، برچسب‌ها) در skill است:
`internet-engineering-slides/references/teaching.md`. ابزار، تم و روند کار هم در `SKILL.md` و
`references/template.md` همان skill. این فایل فقط موارد خاص فصل ۱ را نگه می‌دارد.

## گام بعد

هر جلسه با یک تمرین تمام می‌شود که به جلسهٔ بعد پل می‌زند: صورت کامل در `exercises/NN-slug/`، قواعد نمره و تحویل در `course-policy.md`، و فهرست انتشار در `course.json`. تمرین جلسه‌های ۳ تا ۷ در چت همان جلسه طراحی می‌شود؛ پیشنهاد اولیه: ورود با کوکی و شکستن آن با CSRF (۳)، باز کردن TLS با کلید خودتان (۴)، پیدا کردن باگ cache (۵)، سه راه برای خبر گرفتن (۶)، و امن کردن API برای agent (۷).

## اصلاحات دک ترم پیش (محافظ در برابر بازگشت خطا)

| بیان قدیم | بیان درست |
| --- | --- |
| HTTP/1.1 = RFC 2068 و HTTP/2 = RFC 7540 | معنا در 9110، cache در 9111، و wire format در 9112 و 9113 و 9114 |
| HTTP is text-based | فقط HTTP/1.x متنی است؛ HTTP/2 و HTTP/3 باینری‌اند |
| path = مسیر فایل روی سرور | path یک نام در فضای‌نام سرور است؛ نگاشت به فایل یک انتخاب پیاده‌سازی است |
| HttpOnly = فقط روی HTTP فرستاده می‌شود | HttpOnly = از `document.cookie` قابل خواندن نیست |
| 307 Moved Temporarily | 307 Temporary Redirect؛ متد و body حفظ می‌شوند (مثل 308) |
| عملیات safe شامل «فرستادن داده به سرور» | POST safe نیست؛ safe یعنی درخواست تغییری در سرور نمی‌خواهد |
| idempotent «در cache کمک می‌کند» | cacheable بودن ویژگی جداست؛ idempotent یعنی تکرار خودکار پس از قطع شبکه امن است |
| 401 = Authorization required | 401 یعنی احراز هویت نشده (همراه `WWW-Authenticate`)؛ 403 یعنی شناخته شده ولی اجازه ندارد |
| دسته‌های General و Request و Response و Entity برای header | RFC 9110 از representation و content و زمینهٔ درخواست و پاسخ حرف می‌زند |
| `Connection: keep-alive` یک header عمومی است | در HTTP/2 و HTTP/3 فیلدهای مخصوص اتصال ممنوع‌اند |
| HTTP/2 Server Push قابلیت جاری است | از Chrome 106 حذف شده؛ جانشین: `103 Early Hints` |
| `no-cache` = ذخیره نکن | `no-cache` = ذخیره کن ولی پیش از استفاده revalidate کن؛ «ذخیره نکن» = `no-store` |
| MQTT = RFC 9431 | MQTT استاندارد OASIS است |
| حداقل‌های RFC برای cookie = سقف مرورگر | حداقل الزامی پیاده‌ساز است، نه سقف واقعی |

---

## فرض‌ها و ورودی‌های باز
- `[فرض]` هر اسلات ۹۰ دقیقه است.
- `[فرض]` دانشجو TCP و مفهوم port را از درس شبکه می‌شناسد.
- `[فرض]` در کلاس اینترنت، مرورگر و ترمینال برای دمو هست.
- باز: WebRTC در دامنهٔ جلسهٔ ۶ هست یا نه؟
- باز: REST و طراحی API در این فصل است یا فصل بعد؟
