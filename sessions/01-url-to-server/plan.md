<!-- طرح جلسه: ساختار، بودجه، نمونه‌های واقعی و یادداشت‌های باز. متن اسلایدها در 01-url-to-server.md است. -->

## جلسهٔ ۱ — از URL تا سرور

**بودجه:** ۹۰ دقیقه `[فرض]` · تدریس: ۸۶ دقیقه · ذخیره: ۴ دقیقه

| ماژول | موضوع | دقیقه | پیامد یادگیری | مدل ذهنی | تصمیم مهندسی |
| --- | --- | --- | --- | --- | --- |
| M0 | تصویر کلی و زنجیره | ۹ | چهار مسئلهٔ رسیدن از نام به پاسخ و پروتکل هرکدام را نام ببرد، و مراحل پیش از ارسال درخواست را به ترتیب بگوید | هر پروتکل یک مسئله را حل می‌کند؛ کنار هم زنجیره‌ای می‌سازند که هر حلقه‌اش جداگانه می‌تواند کند شود یا بشکند | — |
| M1 | URL | ۲۱ | یک URL را به اجزایش بشکند و پیش‌بینی کند کدام جزء به سرور می‌رسد، کدام در لاگ ثبت می‌شود و کدام از مرورگر خارج نمی‌شود | URL یک ساختار است نه رشته؛ آنچه parser می‌فهمد تعیین‌کننده است | داده را کجا بگذاریم: در path یا query یا fragment یا header یا body؟ |
| M2 | Origin | ۱۰ | از روی دو URL تشخیص دهد same-origin هستند یا نه، و same-site را از same-origin جدا کند | origin سه‌تایی scheme و host و port، و مرز اعتماد مرورگر است | API روی `api.example.com` باشد یا `example.com/api`؟ |
| M3 | DNS | ۳۲ | مسیر یک پرس‌وجو را از stub تا authoritative رسم کند و پیش‌بینی کند تغییر رکورد کِی به کاربر می‌رسد | پایگاه‌دادهٔ توزیع‌شدهٔ سلسله‌مراتبی با لایه‌های cache؛ و هر کس resolver را اداره می‌کند، معنای نام‌ها را تعیین می‌کند | TTL چند باشد؟ از کدام resolver استفاده کنیم؟ |
| M4 | TLS به‌صورت جعبه‌سیاه | ۱۰ | بگوید TLS چه چیزی را تضمین می‌کند، ناظر شبکه هنوز چه می‌بیند، و اصالت سرور به چه کسی تکیه دارد | لوله‌ای مهروموم‌شده با سه تضمین: محرمانگی، یکپارچگی، اصالت سرور | چرا HTTPS همه‌جا؟ گواهی را از چه کسی بگیریم؟ |
| M5 | جمع‌بندی و تمرین کوتاه ۱ | ۸ | پیش‌بینی تمرین کوتاه ۱ را بنویسد | — | — |

پیامدهای Origin (SOP و CORS و CSRF و `SameSite`) عمداً به جلسهٔ ۳ رفته‌اند.

### نمونه‌های واقعی (case study) جلسهٔ ۱

| ماژول | case study | نقش در درس | منبع |
| --- | --- | --- | --- |
| M1 | نشت داده از طریق تصویر markdown در خروجی مدل‌های زبانی؛ نمونهٔ Superhuman AI (دی ۱۴۰۴) | query در URL یک کانال ارسال داده است؛ مهاجم می‌تواند URL را از طریق مدل بسازد | [Simon Willison: exfiltration-attacks](https://simonwillison.net/tags/exfiltration-attacks/) · [Embrace The Red (۲۰۲۳)](https://embracethered.com/blog/posts/2023/chatgpt-webpilot-data-exfil-via-markdown-injection/) |
| M1 | homograph و Punycode | آنچه کاربر می‌بیند با آنچه DNS می‌بیند فرق دارد | `[بررسی‌نشده: لینک مقالهٔ Xudong Zheng، ۲۰۱۷]` |
| M1 | اختلاف parserها و SSRF؛ الزام تطابق header و body در MCP ۲۰۲۶-۰۷-۲۸ | optional: دو parser، دو برداشت | [MCP Streamable HTTP](https://modelcontextprotocol.io/specification/draft/basic/transports/streamable-http) · `[بررسی‌نشده: لینک ارائهٔ Orange Tsai، Black Hat 2017]` |
| M3 | قطعی AWS us-east-1 (۲۷–۲۸ مهر ۱۴۰۴): race condition در خودکارسازی DNS، رکورد خالی، بازیابی منتظر انقضای cacheها | TTL یک تصمیم واقعی است | [ThousandEyes](https://www.thousandeyes.com/blog/aws-outage-analysis-october-20-2025) · [The Register](https://www.theregister.com/2025/10/23/amazon_outage_postmortem/) |
| M3 | 🇮🇷 جستجوی امن اجباری Google از طریق دستکاری DNS (تیر ۱۴۰۱؛ گزارش‌های مجدد خرداد ۱۴۰۵) | DNS متن‌ساده یکپارچگی ندارد؛ اداره‌کنندهٔ resolver می‌تواند پاسخ را عوض کند | [زومیت](https://www.zoomit.ir/tech-iran/384240-internet-iran-safe-search/) · [فارنت](https://farnet.io/1401/04/318601/iran-hijacks-dns-to-force-safesearch-in-google/) · [گجت‌نیوز، ۱۴۰۵](https://gadgetnews.net/1163319/reports-forced-activation-safesearch/) `[ویرایش مدرس]` |
| M3 | 🇮🇷 resolver خارجی در زمان قطع اینترنت بین‌الملل؛ پیشنهاد DNS داخلی/ملی | resolver هم یک وابستگی است؛ و resolverی که دسترس‌پذیری می‌دهد، همان است که می‌تواند پاسخ را تغییر دهد | [برقچی](https://barghchi.com/mag/change-dns/) · `[بررسی‌نشده: رویداد دقیق «مشکل DNS بانک‌ها» را مدرس تأیید کند]` `[ویرایش مدرس]` |
| M3 | DNS rebinding علیه سرورهای محلی MCP | DNS مرز Origin را دور می‌زند؛ MCP بررسی هدر `Origin` و bind به localhost را الزامی کرده | [MCP Streamable HTTP، بخش Security](https://modelcontextprotocol.io/specification/draft/basic/transports/streamable-http) |
| M4 | 🇮🇷 خطای گواهی در سایت بانک‌ها و مهاجرت به گواهی داخلی (شهریور ۱۴۰۵) | اصالت سرور به CAای تکیه دارد که مرورگر به آن اعتماد کند؛ عادت دادن کاربر به نادیده گرفتن هشدار، زمینهٔ phishing است | [انتخاب](https://www.entekhab.ir/fa/news/938656/) · [تکنوک](https://technoc.ir/foreign-footprint-in-internet-banking-disruptions-at-certain-banks/) `[ویرایش مدرس]` |

یادداشت برای مدرس: تحقیق من یک رویداد مستند با عنوان «مشکل DNS بانک‌ها» پیدا نکرد. دو رویداد نزدیک پیدا شد: وابستگی به resolver خارجی در قطع‌ها (DNS در M3) و خطای گواهی بانک‌ها (TLS در M4). اگر منظورتان رویداد دیگری است، منبعش را اضافه کنید.

### یادداشت‌های باز جلسهٔ ۱
- `[بررسی‌نشده: لینک]` ارائهٔ Orange Tsai در Black Hat USA 2017 (اسلاید ۱۶)
- `[بررسی‌نشده: لینک]` سند Google دربارهٔ `forcesafesearch.google.com` (اسلاید ۳۰)
- `[ویرایش مدرس]` اسلایدهای ۲۹، ۳۰ و ۳۵
- وضعیت ECH در مرورگرها (اسلاید ۳۴) `[volatile: بررسی ۱۴۰۵/۱۰]`
- `[اجرانشده]` دموی ۲۴: در محیط آماده‌سازی به DNS بیرونی دسترسی نبود
- `[تصویر لازم]` سه اسکرین‌شات: زبانهٔ Timing در DevTools، نوار نشانی با Punycode، و صفحهٔ هشدار گواهی. تا جایگزینی، کادر راهنما با دستور گرفتن عکس و نام فایل (`sessions/01-url-to-server/public/images/…`) نشان داده می‌شود.
