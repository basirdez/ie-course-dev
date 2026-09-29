<!-- طرح جلسه: ساختار، بودجه، نمونه‌های واقعی و یادداشت‌های باز. متن اسلایدها در 02-http-transaction.md است. -->

## جلسهٔ ۲ — یک تراکنش HTTP

- **سؤال محوری:** یک درخواست و پاسخ کامل از چه ساخته شده و معنایش را چه کسی تعیین می‌کند؟
- **مدل ذهنی اصلی:** هر تراکنش یک قرارداد معنایی است (متد و هدف و فیلدها و محتوا ← وضعیت و فیلدها و محتوا). معنا در RFC 9110 ثابت است و روی سه قالب انتقال سوار می‌شود: 9112 برای HTTP/1.1 و 9113 برای HTTP/2 و 9114 برای HTTP/3.
- **مدل‌های ذهنی فرعی:** متد وعده‌ای است که ماشین‌های دیگر (prefetch و اسکنر و retry) بر اساسش عمل می‌کنند · کلاینت کلاس کد وضعیت را می‌فهمد، نه همهٔ کدها را · یک منبع چند بازنمایی دارد و کلاینت فقط ترجیحش را می‌گوید.
- **تصمیم‌های مهندسی:** کدام عملیات GET باشد · تکرار درخواست پس از قطع شبکه امن است یا نه (و کلید idempotency) · `301` یا `308` · برای منبع خصوصی `403` یا `404` · زبان سایت با URL جدا یا با `Accept-Language` · اتصال upstream با HTTP/1.1 یا HTTP/2.
- **قلاب شروع و پایان:** «کلاینت شما کد ۵۲۹ گرفته و هرگز این کد را ندیده؛ چه کند؟» در M0 نیمه‌کاره می‌ماند و در M5 با هر چهار ماژول کامل جواب داده می‌شود.

**وضعیت:** دک نوشته شد (در انتظار بازبینی مدرس).

| ماژول | موضوع | دقیقه | پیامد یادگیری | مدل ذهنی | تصمیم مهندسی |
| --- | --- | --- | --- | --- | --- |
| M0 | نگاهی از دور: یک درخواست، یک پاسخ | ۵ | اجزای یک تراکنش را روی تصویر کلی نام ببرد | تراکنش = درخواست و پاسخ؛ هر جزء یک ماژول امروز است | — (سؤال ۵۲۹ باز می‌ماند) |
| M1 | پیام HTTP: معنا و قالب انتقال | ۱۸ | پیام HTTP/1.1 را بخواند و بنویسد؛ نقش `Host` را بگوید؛ همان پیام را در HTTP/2 تشخیص دهد؛ بگوید چرا مرز پیام در HTTP/1.1 شکننده است | معنا ثابت، قالب انتقال متغیر | اتصال upstream با HTTP/2؛ به reason phrase و `Connection` تکیه نکن |
| M2 | متد: وعده‌ای به همهٔ ماشین‌ها | ۲۰ | safe و idempotent را جدا کند؛ برای هر عملیات متد درست را انتخاب کند؛ خطر تکرار POST را توضیح دهد | متد قرارداد است، نه فقط یک فعل | کدام عملیات GET باشد؛ POST یا PUT؛ کلید idempotency |
| M3 | کد وضعیت: پیامی برای ماشین | ۲۰ | کلاس را از رقم اول بخواند و برای کد ناشناخته رفتار درست را بگوید؛ بین 401 و 403 و 404 انتخاب کند؛ کد redirect درست را انتخاب کند | کلاینت کلاس را می‌فهمد؛ کد وضعیت نمی‌گوید چه کسی پاسخ داده | `301` یا `308`؛ `403` یا `404` |
| M4 | header و مذاکرهٔ محتوا | ۱۶ | فیلدهای بازنمایی را از فیلدهای درخواست و پاسخ جدا کند؛ مذاکره با `Accept-*` را توضیح دهد | یک منبع، چند بازنمایی؛ فیلد ناشناخته نادیده گرفته می‌شود | زبان با URL یا با `Accept-Language`؛ پیشوند `X-` |
| M5 | جمع‌بندی و تمرین کوتاه ۲ | ۹ | به سؤال ۵۲۹ جواب کامل بدهد؛ پیش‌بینی تمرین کوتاه ۲ را بنویسد | — | — |

### فهرست اسلایدها

در ستون نوع، `section` و `optional` و `extra` و `reserve` صفر دقیقه‌اند. عنوان‌ها چالشی‌اند و پاسخ و punch هر سؤال کلاسی در یک click می‌آیند.

| ماژول | عنوان | نوع | دقیقه | محتوا |
| --- | --- | --- | --- | --- |
| M0 | جلد | — | ۰ | |
| M0 | سناریوی واقعی: کلاینت شما کد ۵۲۹ گرفته؛ چه کند؟ | interactive | ۳ | چهار گزینه؛ پاسخ نیمه‌کاره: «مثل 500»؛ اینکه دوباره بفرستد یا نه، پایان جلسه |
| M0 | نگاهی از دور: یک درخواست، یک پاسخ | core | ۲ | نمودار درخواست و پاسخ؛ هر جزء با شمارهٔ ماژولش؛ زنجیرهٔ فصل روی HTTP |
| M1 | بخش ۱: پیام | section | ۰ | تا اینجا: اتصال برقرار است · سؤال: روی این اتصال دقیقاً چه فرستاده می‌شود؟ |
| M1 | کالبدشکافی یک درخواست | core | ۲ | خط درخواست (متد، هدف، نسخه)، فیلدها، خط خالی، محتوا؛ به سبک کالبدشکافی URL در جلسهٔ ۱ |
| M1 | کالبدشکافی یک پاسخ | core | ۲ | خط وضعیت (نسخه، کد، reason phrase)، فیلدها، محتوا |
| M1 | چرا `Host` اجباری است؟ | interactive | ۳ | پاسخ: میزبانی مجازی؛ هزاران سایت روی یک IP؛ در HTTP/1.1 اجباری شد (RFC 9112 §3.2) |
| M1 | پیام کجا تمام می‌شود؟ | core | ۲ | `Content-Length` و chunked و بستن اتصال؛ پیش‌نیاز اسلاید بعد |
| M1 | سناریوی واقعی: وقتی دو سرور سر مرز یک پیام توافق ندارند | core | ۲ | request smuggling؛ پژوهش «HTTP/1.1 must die» (۱۴۰۴)؛ تصمیم: upstream با HTTP/2 |
| M1 | همان درخواست در HTTP/2 چه شکلی است؟ | demo | ۶ | `curl -v` در HTTP/1.1 و HTTP/2 روی سرور محلی؛ pseudo-header و نبود reason phrase و `Connection` |
| M1 | معنا ثابت، قالب متغیر | core | ۱ | جدول 9110 در برابر 9112 و 9113 و 9114؛ punch مدل ذهنی |
| M2 | بخش ۲: متد | section | ۰ | تا اینجا: شکل پیام · سؤال: متد به چه کسانی چه قولی می‌دهد؟ |
| M2 | متد یک وعده است، نه فقط یک فعل | core | ۲ | چه کسانی به متد تکیه می‌کنند: prefetch و خزنده و اسکنر لینک و cache و retry |
| M2 | safe و idempotent: دو وعدهٔ جدا | core | ۲ | جدول GET و HEAD و OPTIONS و POST و PUT و DELETE و PATCH |
| M2 | DELETE دوم 404 می‌دهد؛ پس idempotent نیست؟ | interactive | ۳ | پاسخ: idempotent دربارهٔ اثر روی سرور است، نه یکسانی پاسخ |
| M2 | سناریوی واقعی: شتاب‌دهندهٔ Google که صفحه‌ها را پاک کرد | core | ۲ | ۱۳۸۴؛ پیش‌واکشی لینک‌های «delete» در Backpack |
| M2 | همان اشتباه، بیست سال بعد: لینک یک‌بارمصرف و اسکنر ایمیل | core | ۲ | مصرف magic link به‌دست اسکنرها؛ RFC 8058 و لغو اشتراک با POST؛ الزام Gmail |
| M2 | کدام را GET کنیم؟ | interactive | ۳ | جستجو، لغو اشتراک از ایمیل، خروج از حساب، دیدن فاکتور |
| M2 | پاسخ نرسید؛ دوباره بفرستیم؟ | core | ۲ | تکرار خودکار فقط برای متد idempotent (RFC 9110 §9.2.2) |
| M2 | سناریوی واقعی: پرداختی که دو بار کم شد | core | ۲ | `Idempotency-Key` در Stripe و پیش‌نویس IETF؛ 409 و 422 |
| M2 | پیوند با هوش مصنوعی: وقتی agent ابزار را صدا می‌زند | core | ۲ | ToolAnnotations در MCP: `readOnlyHint` و `idempotentHint` و `destructiveHint`؛ پیش‌فرض بدبینانه؛ hint قابل اعتماد نیست |
| M3 | بخش ۳: کد وضعیت | section | ۰ | تا اینجا: درخواست · سؤال: پاسخ را چه کسی، برای چه کسی، و با چه جزئیاتی می‌خواند؟ |
| M3 | پنج کلاس، یک رقم | core | ۲ | کلاس‌ها و کدهای پرکاربرد؛ تقصیر با کیست |
| M3 | کد ناشناخته = x00 همان کلاس | core | ۲ | RFC 9110 §15؛ ۵۲۹ در Anthropic و ۴۹۹ در nginx و ۵۲۰ تا ۵۲۷ در Cloudflare |
| M3 | 1xx: پاسخ پیش از پاسخ | core | ۱ | `103 Early Hints`؛ جانشین Server Push (قصهٔ کامل در جلسهٔ ۴) |
| M3 | سناریوی واقعی: مخزن خصوصی؛ 401 یا 403 یا 404؟ | interactive | ۳ | GitHub برای مخزن خصوصی 404 می‌دهد تا وجودش لو نرود |
| M3 | redirect: یک Location و پنج کد | core | ۲ | جدول 301 و 302 و 303 و 307 و 308: دائمی؟ متد حفظ می‌شود؟ |
| M3 | چرا 307 و 308 لازم شدند؟ | core | ۲ | مرورگرها POST را پس از 301 و 302 به GET تبدیل کردند؛ مشخصات رفتار را پذیرفت |
| M3 | POST بعد از 301 چه می‌شود؟ | demo | ۶ | سرور محلی و `curl -L`؛ دام `-X POST` |
| M3 | سناریوی واقعی: این 403 را چه کسی فرستاده؟ | core | ۲ | فیلترینگ HTTP در ایران: 403 و iframe به 10.10.34.34 بر اساس `Host` (FOCI 2013)؛ در HTTP بی‌رمز هر میانی می‌تواند جواب بدهد |
| M4 | بخش ۴: header و مذاکره | section | ۰ | تا اینجا: خط اول پیام · سؤال: بقیهٔ پیام چه می‌گوید و چه کسی گوش می‌دهد؟ |
| M4 | header: فراداده‌ای که ناشناخته‌اش نادیده گرفته می‌شود | core | ۲ | دسته‌های RFC 9110 به‌جای «entity headers»؛ `Authorization` (جلسهٔ ۳) |
| M4 | پیشوند X- چرا کنار گذاشته شد؟ | core | ۱ | RFC 6648؛ `X-Forwarded-For` در برابر `Forwarded` |
| M4 | یک منبع، چند بازنمایی | core | ۲ | `Accept` و `Content-Type`؛ `Vary` (جلسهٔ ۵) |
| M4 | سناریوی واقعی: زبان را با URL انتخاب کنیم یا با Accept-Language؟ | interactive | ۳ | راهنمای Google: URL جدا؛ خزندهٔ Google `Accept-Language` نمی‌فرستد |
| M4 | سناریوی واقعی: صفحهٔ سفید بعد از به‌روزرسانی Chrome | core | ۲ | `zstd` در Chrome 123 و محدودیت پنجرهٔ ۸ مگابایتی؛ صفحهٔ خالی kanidm |
| M4 | پیوند با هوش مصنوعی: `Accept: text/markdown` | core | ۲ | Markdown for Agents در Cloudflare؛ `Vary: Accept` و شمارش توکن |
| M4 | مذاکره را ببینیم | demo | ۴ | سرور محلی با `Accept` و `Accept-Encoding` و `Accept-Language` |
| M5 | حالا جواب کامل: با ۵۲۹ چه کنیم؟ | interactive | ۳ | کلاس 5xx؛ POST؛ `Retry-After`؛ تکرار LLM در برابر تکرار ابزار agent |
| M5 | امروز چه ساختیم؟ | core | ۱ | چهار مدل ذهنی، چهار تصمیم |
| M5 | تمرین کوتاه ۲: سایت از کجا می‌داند شما کیستید؟ | exercise | ۴ | پیش‌بینی سر کلاس؛ صورت کامل در `exercises/02-who-are-you/`؛ سرور کوچک HTTP به تمرین هفته رفت (`exercises/w02-mini-http-server/`) |
| M5 | نقشهٔ فصل ۱: کجای راهیم؟ | core | ۱ | `src: ../ch1-syllabus.md` |
| M5 | برای کنجکاوی بیشتر (۱ و ۲) | extra | ۰ | |
| M5 | منابع | reserve | ۰ | |

### دموها (فاز ۲؛ کدشان در `labs/02-http-transaction/`)

- دموی **h1-vs-h2** (M1) · سؤال: وقتی همان درخواست را با HTTP/2 بفرستیم، سرور چه می‌بیند؟ · مشاهده: خط‌های `[:method: GET]` و `[:authority: …]` در خروجی verbose، `HTTP/2 200` بدون reason phrase، و اینکه سرور `host` ندارد و `:authority` دارد · تصمیم: کد سرور به reason phrase و `Connection` تکیه نکند. اجراشده با curl 8.5.0 و Node 22 روی سرور محلی h2c.
- دموی **redirect-method** (M3) · سؤال: بعد از `301` متد و بدنه چه می‌شوند؟ · مشاهده: POST پس از 301 و 302 و 303 به GET بی‌بدنه تبدیل شد و پس از 307 و 308 با بدنه ماند؛ با `-X POST` روش POST ماند ولی بدنه رفت · تصمیم: برای جابه‌جایی دائمی API از `308` استفاده کن. اجراشده با curl 8.5.0 و Python 3.11.
- دموی **negotiation** (M4) · سؤال: یک URL چند پاسخ می‌تواند داشته باشد؟ · مشاهده: `Content-Type` و `Content-Encoding` و `Vary` با تغییر `Accept-*` · تصمیم: هر جا پاسخ به فیلدی از درخواست وابسته است، `Vary` بفرست. اجراشده با Node 22 و curl 8.5.0؛ بدنهٔ ۳۲ بایتی JSON با gzip به ۵۳ بایت رسید.

### نمونه‌های واقعی (راستی‌آزمایی‌شده)

| ماژول | نمونه | منبع |
| --- | --- | --- |
| M0 و M3 | کد ۵۲۹ یعنی overloaded در API مدل Claude | [Claude API errors](https://platform.claude.com/docs/en/api/errors) |
| M1 | پژوهش «HTTP/1.1 must die»، مرداد ۱۴۰۴: بیش از ۳۵۰ هزار دلار جایزهٔ باگ و ۲۴ میلیون سایت در معرض یک باگ Cloudflare؛ توصیه: upstream با HTTP/2 | [PortSwigger](https://portswigger.net/research/http1-must-die) |
| M2 | Google Web Accelerator در اردیبهشت ۱۳۸۴ لینک‌های delete را پیش‌واکشی کرد و صفحه‌های Backpack ناپدید شدند | [Signal vs. Noise](https://signalvnoise.com/archives2/google_web_accelerator_hey_not_so_fast_an_alert_for_web_app_designers) |
| M2 | اسکنرهای امنیتی ایمیل لینک‌ها را باز می‌کنند و magic link را پیش از کاربر مصرف می‌کنند | [Stytch](https://stytch.com/docs/b2b/guides/magic-links/protected-eml) |
| M2 | لغو اشتراک یک‌کلیکی با POST، چون ضداسپم‌ها URLها را خودکار باز می‌کنند | [RFC 8058](https://www.rfc-editor.org/rfc/rfc8058.html) · [Gmail sender guidelines](https://support.google.com/a/answer/81126) |
| M2 | کلید idempotency در پرداخت؛ پیش‌نویس IETF: 409 برای تکرار حین پردازش و 422 برای کلید تکراری با بدنهٔ دیگر | [Stripe](https://docs.stripe.com/api/idempotent_requests) · [Stripe blog](https://stripe.com/blog/idempotency) · [draft-07](https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-idempotency-key-header-07) |
| M2 | ToolAnnotations در MCP و اینکه hint قابل اعتماد نیست | [MCP blog](https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/) |
| M3 | GitHub برای مخزن خصوصی 404 می‌دهد، نه 403 | [GitHub Docs](https://docs.github.com/en/rest/using-the-rest-api/troubleshooting-the-rest-api) |
| M3 | حذف Server Push از Chrome 106 و جانشینی 103 | [Chrome blog](https://developer.chrome.com/blog/removing-push) |
| M3 | فیلترینگ HTTP در ایران: 403 و iframe به 10.10.34.34 | [Aryan و همکاران، FOCI 2013](https://www.usenix.org/system/files/conference/foci13/foci13-aryan.pdf) · [OONI](https://ooni.org/post/iran-internet-censorship) |
| M4 | راهنمای Google: URL جدا برای هر زبان؛ خزنده `Accept-Language` نمی‌فرستد | [Google Search Central](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites) |
| M4 | صفحهٔ سفید kanidm پس از فعال شدن zstd در Chrome 123 | [kanidm #2593](https://github.com/kanidm/kanidm/issues/2593) · [chromestatus](https://chromestatus.com/feature/6186023867908096) |
| M4 | Markdown for Agents در Cloudflare، بهمن ۱۴۰۴ | [Cloudflare docs](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents) |

### منتقل به جلسه‌های دیگر

- اتصال پایدار و pipelining و multiplexing در HTTP/2 ← جلسهٔ ۴ (دک ترم پیش این‌ها را در همین بخش آورده بود)
- `304` و `Cache-Control` و `Vary` به تفصیل ← جلسهٔ ۵
- کوکی و `Authorization` و `WWW-Authenticate` ← جلسهٔ ۳
- قصهٔ کامل Server Push و SSE ← جلسهٔ ۶
- `429` و `Retry-After` و بات‌ها به تفصیل ← جلسهٔ ۷

### یادداشت‌های باز جلسهٔ ۲

- اصلاحات بخش HTTP دک ترم پیش به جدول «اصلاحات دک ترم پیش» در `00-chapter-map.md` اضافه شد و در این دک باید رعایت شود
- بودجهٔ ۸۸ دقیقه، با ۴ دقیقهٔ پیش‌بینی تمرین کوتاه
- `[فرض]` قلاب ۵۲۹ جای Server Push را در نقش «نمونهٔ اصلی» گرفت، چون هر چهار ماژول را به هم وصل می‌کند و به هوش مصنوعی پیوند دارد؛ Server Push به جلسهٔ ۴ رفت
- `[ویرایش مدرس]` اسلاید فیلترینگ HTTP در ایران: داده از ۱۳۹۲ است؛ رفتار امروز فرق دارد و بیشتر ترافیک HTTPS است
- کدهای غیراستاندارد ۵۲۹ و ۴۹۹، وضعیت پیش‌نویس Idempotency-Key، و Markdown for Agents تغییرپذیرند `[volatile: بررسی ۱۴۰۵/۰۷]`
- در curl 8.5.0 پس از `303` با PUT، روش PUT ماند و فقط بدنه حذف شد؛ این رفتار ابزار است، نه پروتکل، و فقط در README دمو می‌آید
