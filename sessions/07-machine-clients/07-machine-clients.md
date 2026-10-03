---
theme: ../../theme
title: "جلسهٔ ۷: وقتی کلاینت انسان نیست"
exportFilename: 07-machine-clients
chapter: ch1
modules:
  M0: { slug: overview, title: نگاهی از دور }
  M1: { slug: identity, title: هویت }
  M2: { slug: load, title: retry و سقف نرخ }
  M3: { slug: mcp, title: MCP }
  M4: { slug: wrap-up, title: جمع‌بندی فصل }
---

<p class="course">مهندسی اینترنت، فصل ۱: پروتکل‌ها</p>

# وقتی کلاینت انسان نیست

<p class="lede">جلسهٔ ۷: crawler و agent و MCP؛ چه چیزی در پروتکل عوض می‌شود؟</p>

<Chain :today="['http']" />

<p class="byline">محمد بصیرزاده<br>دانشگاه شهید چمران اهواز، دانشکدهٔ مهندسی، پاییز ۱۴۰۵</p>

---
type: interactive
module: M0
minutes: 3
link: http
corner: نگاهی از دور
---

# سهم bot‌ها از بار سنگین ویکی‌پدیا چقدر است؟

بنیاد ویکی‌مدیا در فروردین ۱۴۰۴ نوشت: حدود ۳۵ درصد بازدید صفحه‌ها از bot است. سهم bot‌ها از پرهزینه‌ترین درخواست‌ها چقدر است؟

<ol class="options">
  <li><b>الف)</b> ۱۰ درصد</li>
  <li><b>ب)</b> ۳۵ درصد</li>
  <li v-mark.box.orange="1"><b>ج)</b> ۶۵ درصد</li>
  <li><b>د)</b> ۹۵ درصد</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ج)</strong> انسان صفحه‌های پربازدید را می‌خواند که در cache لبه هست؛ crawler همه‌چیز را می‌خواند، و صفحهٔ کم‌بازدید باید از مرکز دادهٔ اصلی بیاید (جلسهٔ ۵). منبع: <a href="https://diff.wikimedia.org/2025/04/01/how-crawlers-impact-the-operations-of-the-wikimedia-projects/">Wikimedia</a>.</div>

::punch::

<div v-click="1">کلاینت ماشینی «کاربرِ بیشتر» نیست؛ الگوی رفتارش فرق دارد.</div>

---
module: M0
minutes: 2
link: http
corner: نگاهی از دور
---

# نگاهی از دور: سه فرضی که دیگر برقرار نیست

| فرض قدیمی دربارهٔ کلاینت | وقتی کلاینت ماشین است | بخش |
| --- | --- | --- |
| همان است که `User-Agent` می‌گوید | هر چه بخواهد می‌نویسد؛ هویت باید [ثابت شود]{.mark} | هویت |
| بعد از خطا دست نگه می‌دارد | خسته نمی‌شود و بی‌درنگ دوباره می‌فرستد | بار |
| پاسخ را یک انسان می‌خواند | پاسخ را مدل می‌خواند و شاید از آن [دستور بگیرد]{.mark} | MCP |

::punch::

HTTP عوض نشده است؛ فرض‌های ما دربارهٔ طرف مقابل عوض شده.

---
layout: section
type: section
module: M1
minutes: 0
link: http
---

# تو کیستی؟ هویت کلاینت ماشینی

<p class="since">در جلسهٔ ۳ کاربر را با کوکی و token شناختیم.</p>

<p class="question">برنامه‌ای که خودش را crawler یا agent معرفی می‌کند، از کجا بدانیم راست می‌گوید؟</p>

---
module: M1
minutes: 2
link: http
corner: هویت
---

# فایل robots.txt: یک خواهش، نه یک قفل

<div class="cols">
<div>

- فایلی در ریشهٔ سایت که می‌گوید کدام crawler کجا نرود؛ از ۱۳۷۳ رایج است و در ۱۴۰۱ استاندارد شد ([RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html))
- متن RFC: این قاعده‌ها [«مجوز دسترسی نیستند»]{.mark}؛ اجرایش با خود crawler است
- دام: خط `Disallow: /admin/` نشانی آن بخش را به همه می‌گوید

</div>

```text
User-agent: GPTBot
Disallow: /

User-agent: *
Allow: /
Disallow: /admin/
```

</div>

::punch::

robots.txt می‌گوید چه می‌خواهید؛ اینکه چه می‌شود را تعیین نمی‌کند.

---
type: interactive
module: M1
minutes: 3
link: http
corner: هویت
---

# کدام سازوکار جلوی crawler نافرمان را می‌گیرد؟

در robots.txt نوشته‌اید `Disallow: /`، ولی یک crawler باز هم همهٔ صفحه‌ها را می‌خواند.

<ol class="options">
  <li><b>الف)</b> CORS</li>
  <li><b>ب)</b> SameSite</li>
  <li><b>ج)</b> HSTS</li>
  <li v-mark.box.orange="1"><b>د)</b> هیچ‌کدام</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: د)</strong> هر سه را مرورگر اجرا می‌کند تا از کاربرش محافظت کند (جلسه‌های ۱ و ۳). crawler مرورگر نیست و این قاعده‌ها را اصلاً اجرا نمی‌کند. تنها جایی که می‌توانید چیزی را واقعاً رد کنید سرور خودتان است، یا واسطه‌ای که جلوی آن گذاشته‌اید.</div>

::punch::

<div v-click="1">قاعده‌ای که مرورگر اجرا می‌کند، کلاینت غیرمرورگر را نمی‌بندد.</div>

---
module: M1
minutes: 2
link: http
corner: هویت
---

# سناریوی واقعی: crawler با نام مرورگر برگشت

- Cloudflare دامنه‌هایی تازه ساخت که هیچ‌جا منتشر نشده بود و در robots.txt همه را منع کرد؛ سرویس Perplexity باز هم محتوایشان را می‌دانست ([گزارش ۱۳ مرداد ۱۴۰۴](https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/))
- وقتی crawler با نام اعلام‌شده‌اش رد می‌شد، درخواست با `User-Agent` یک [Chrome معمولی]{.mark} و از نشانی‌هایی بیرون از فهرست رسمی برمی‌گشت: ۳ تا ۶ میلیون درخواست در روز
- Perplexity این گزارش را نپذیرفت

::punch::

`User-Agent` یک ادعاست؛ هر کلاینتی هر چه بخواهد در آن می‌نویسد.

---
module: M1
minutes: 2
link: http
corner: هویت
---

# چهار نشانه برای شناختن یک bot

| نشانه | چقدر محکم | ضعف |
| --- | --- | --- |
| `User-Agent` | هیچ | هر کسی هر چه بخواهد می‌نویسد |
| نشانی IP و فهرست رسمی | متوسط | فهرست عوض می‌شود؛ در ابر مشترک گم می‌شود |
| اثر انگشت TLS (جلسهٔ ۴) | قرینه | نوع برنامه را می‌گوید، نه صاحبش را |
| [امضای درخواست]{.mark} | محکم | هنوز پیش‌نویس است و همه‌گیر نشده |

::punch::

هویت را چیزی ثابت می‌کند که جعلش سخت باشد، نه چیزی که نوشتنش آسان است.

---
module: M1
minutes: 2
link: http
corner: هویت
---

# امضای درخواست: هویت با کلید، نه با متن

<HttpMsg :lines="[
  { t: 'GET /article HTTP/1.1' },
  { t: 'Signature-Agent: &quot;https://chatgpt.com&quot;', l: 'چه کسی', c: 2 },
  { t: 'Signature-Input: sig1=(&quot;@authority&quot; …);tag=&quot;web-bot-auth&quot;', l: 'چه چیزی امضا شده', c: 4 },
  { t: 'Signature: sig1=:MEQCIB…:', l: 'امضا', c: 3 },
]" />

- bot هر درخواست را با [کلید خصوصی]{.mark} خودش امضا می‌کند ([RFC 9421](https://www.rfc-editor.org/rfc/rfc9421))؛ سرور کلید عمومی را از دامنهٔ خود bot می‌گیرد و امضا را می‌سنجد
- همان فکرِ گواهی TLS است، این بار برای کلاینت؛ نامش [Web Bot Auth](https://contextbolt.com/blog/web-bot-auth/) است و در IETF در دست استانداردسازی

::punch::

متن header را هر کسی می‌نویسد؛ امضا را فقط دارندهٔ کلید.

---
type: interactive
module: M1
minutes: 3
link: http
corner: هویت
---

# سرور به crawler پاسخ 402 داد؛ یعنی چه؟

یک crawler صفحه‌ای را از سایتی پشت Cloudflare می‌خواهد و پاسخ `402` می‌گیرد، همراه `crawler-price: USD 0.01`.

<ol class="options">
  <li><b>الف)</b> اول معرفی کن</li>
  <li v-mark.box.orange="1"><b>ب)</b> اول پول بده</li>
  <li><b>ج)</b> زیاد فرستادی</li>
  <li><b>د)</b> ورود ممنوع</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ب)</strong> کد <code>402 Payment Required</code> سی سال «برای آینده» کنار مانده بود. از تیر ۱۴۰۴ Cloudflare با آن از crawler پول می‌خواهد (<a href="https://blog.cloudflare.com/introducing-pay-per-crawl/">pay per crawl</a>)؛ crawler قیمت را در header می‌پذیرد و <code>200</code> می‌گیرد.</div>

::punch::

<div v-click="1">کد وضعیت زبان مشترک است؛ ماشین‌ها با همان مذاکره می‌کنند.</div>

---
layout: section
type: section
module: M2
minutes: 0
link: http
---

# رفتار زیر بار: retry و سقف نرخ

<p class="since">کلاینت ماشینی خسته نمی‌شود و بعد از خطا بی‌درنگ دوباره می‌فرستد.</p>

<p class="question">سرور چطور بگوید «الان نه»، و کلاینت خوب چه جوابی می‌دهد؟</p>

---
module: M2
minutes: 2
link: http
corner: retry
---

# سناریوی واقعی: داشبوردی که سرور خودش را انداخت

- ۲۱ شهریور ۱۴۰۴: یک باگ در داشبورد Cloudflare باعث شد مرورگر هر کاربر یک API را [پیاپی]{.mark} صدا بزند؛ سرویس پشت آن از کار افتاد و داشبورد و APIها ۷۵ دقیقه مختل شدند ([گزارش](https://blog.cloudflare.com/deep-dive-into-cloudflares-sept-12-dashboard-and-api-outage/))
- سرویس را دوباره بالا آوردند؛ همهٔ داشبوردها [هم‌زمان]{.mark} برگشتند و دوباره افتاد
- نمونهٔ آشنا: صبح انتخاب واحد؛ هر بار refresh یک retry است

::punch::

برای انداختن یک سرویس مهاجم لازم نیست؛ کلاینت خودی با retry بد کافی است.

---
type: interactive
module: M2
minutes: 3
link: http
corner: retry
---

# پاسخ 429 رسید؛ agent شما چه کند؟

agent شما وسط یک کار ده‌مرحله‌ای است و در مرحلهٔ چهارم از API این پاسخ را می‌گیرد: `429 Too Many Requests`.

<ol class="options">
  <li><b>الف)</b> بی‌درنگ دوباره</li>
  <li><b>ب)</b> یک ثانیه صبر</li>
  <li v-mark.box.orange="1"><b>ج)</b> به گفتهٔ سرور</li>
  <li><b>د)</b> رها کردن کار</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ج)</strong> پاسخ <code>429</code> معمولاً فیلد <code>Retry-After</code> دارد: سرور خودش می‌گوید کِی برگردی. اگر نداشت: فاصله‌ای که با هر ناکامی بیشتر می‌شود، با کمی مقدار تصادفی، و سقفی برای تعداد تلاش.</div>

::punch::

<div v-click="1">سرور بهتر از شما می‌داند کِی جا دارد؛ اگر گفت، گوش کنید.</div>

---
module: M2
minutes: 2
link: http
corner: retry
---

# سرور چطور می‌گوید «الان نه»؟

<HttpMsg :lines="[
  { t: 'HTTP/1.1 429 Too Many Requests', l: 'زیاد فرستادی', c: 3 },
  { t: 'Retry-After: 1', l: 'کِی برگردی', c: 2 },
  { t: 'RateLimit-Policy: &quot;default&quot;;q=5;w=1', l: 'قاعده: ۵ در هر ثانیه', c: 4 },
  { t: 'RateLimit: &quot;default&quot;;r=0;t=1', l: 'چقدر مانده', c: 4 },
]" />

- `429` یعنی [تو]{.mark} زیاد فرستادی؛ `503` یعنی [من]{.mark} الان نمی‌توانم. هر دو می‌توانند `Retry-After` داشته باشند
- دو فیلد `RateLimit` در IETF [پیش‌نویس](https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-ratelimit-headers) است؛ API مدل Claude همین را با [`anthropic-ratelimit-…`](https://platform.claude.com/docs/en/api/rate-limits) می‌گوید

::punch::

سقف را پیش از رسیدن به آن اعلام کنید؛ کلاینت خوب خودش سرعتش را کم می‌کند.

---
module: M2
minutes: 2
link: http
corner: retry
---

# کدام خطا را دوباره بفرستیم؟

| پاسخ | دوباره؟ | چرا |
| --- | --- | --- |
| خطای اتصال، `408`، `429`، `500` به بالا | بله، با فاصله | مشکل [گذراست]{.mark} |
| `400`، `401`، `403`، `404`، `422` | نه | همان درخواست، همان جواب |
| `POST` بدون کلید idempotency | نه | شاید بار اول اجرا شده باشد (جلسهٔ ۲) |

- SDK شرکت Anthropic در حالت پیش‌فرض [دو بار]{.mark} دوباره می‌فرستد: برای خطای اتصال و `408` و `409` و `429` و `500` به بالا ([مستندات](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python))

::punch::

پیش از retry دو پرسش: مشکل گذراست؟ و تکرارِ این درخواست بی‌خطر است؟

---
type: demo
module: M2
minutes: 6
link: http
corner: retry
lab: 07-machine-clients
status: executed
---

# بیست agent و یک سقف نرخ

<dl class="run">
  <dt>سؤال</dt><dd>بیست agent هم‌زمان به سروری می‌رسند که در هر ثانیه فقط پنج درخواست می‌پذیرد. رفتار بعد از <code>429</code> چه فرقی می‌سازد؟</dd>
  <dt>مشاهده</dt><dd>سه رفتار: بی‌درنگ دوباره، صبر به اندازهٔ <code>Retry-After</code>، و همان به‌علاوهٔ تأخیر تصادفی. سرور چند درخواست می‌بیند و کار کِی تمام می‌شود؟</dd>
  <dt>تصمیم</dt><dd>کدام رفتار را در کلاینت خودتان می‌گذارید؟</dd>
</dl>

```sh
SHARED=1 node limited.mjs      # http://127.0.0.1:8821
curl -si http://127.0.0.1:8821/work
node clients.mjs               # naive, wait, jitter
```

<p class="status">کد در <code>labs/07-machine-clients</code>. پیش از اجرا از کلاس بپرسید: کدام رفتار زودتر تمام می‌شود؟</p>

---
type: reserve
module: M2
minutes: 0
link: http
corner: retry
---

# خروجی دمو: سه رفتار بعد از 429

| رفتار | زمان | درخواست‌هایی که سرور دید | بزرگ‌ترین موج retry |
| --- | --- | --- | --- |
| بی‌درنگ دوباره | ۳٫۰ ثانیه | [۱۱٬۴۷۸]{.mark} | ۶۵۱ در ۱۰۰ میلی‌ثانیه |
| صبر به اندازهٔ `Retry-After` | ۳٫۰ ثانیه | ۵۰ | ۱۵ |
| همان، با تأخیر تصادفی | ۴٫۴ ثانیه | ۵۰ | ۷ |

- بیست کار با سقف پنج در ثانیه، هر طور حساب کنید چهار نوبت می‌خواهد؛ عجله فقط بار اضافه ساخت: ۵۷۰ برابر
- تأخیر تصادفی تعداد درخواست را کم نکرد؛ موج را نصف کرد، به بهای زمان

---
type: interactive
module: M2
minutes: 3
link: http
corner: retry
---

# سه لایه، هر کدام سه تلاش؛ سرور چند درخواست می‌بیند؟

agent شما هر tool call را تا سه بار می‌فرستد. SDK زیر آن هم هر درخواست را تا سه بار، و gateway هم تا سه بار. سرور آخر خراب است.

<ol class="options">
  <li><b>الف)</b> ۳</li>
  <li><b>ب)</b> ۹</li>
  <li v-mark.box.orange="1"><b>ج)</b> ۲۷</li>
  <li><b>د)</b> ۸۱</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ج)</strong> لایه‌ها در هم ضرب می‌شوند: سه ضرب در سه ضرب در سه. سرویسی که زیر بار خم شده، درست همان لحظه ۲۷ برابر درخواست می‌گیرد. راه: retry فقط در یک لایه، و سقفی برای کل تلاش‌ها.</div>

::punch::

<div v-click="1">retry بار است؛ هر لایه‌ای که retry می‌کند، بار را چند برابر می‌کند.</div>

---
module: M2
minutes: 2
link: http
corner: سقف نرخ
---

# سقف نرخ را با چه کلیدی و کجا بگذاریم؟

| تصمیم | انتخاب | چرا |
| --- | --- | --- |
| کلید | [token یا کلید API]{.mark}، نه نشانی IP | هزار agent در یک ابر، یک IP دارند (جلسهٔ ۵) |
| جا | در لبه، پیش از کار گران | رد کردن باید ارزان‌تر از پذیرفتن باشد |
| واحد | هزینهٔ کار، نه فقط تعداد | API مدل‌ها token در دقیقه را هم می‌شمارد |
| پاسخ | `429` با `Retry-After` | کلاینت بداند کِی برگردد |

::punch::

سقف نرخ جریمه نیست؛ قراردادی است که کلاینت خوب را قابل‌پیش‌بینی می‌کند.

---
module: M2
minutes: 2
link: http
corner: هوش مصنوعی
---

# پیوند با هوش مصنوعی: وقتی agent یک کار را دو بار می‌کند

- agent بعد از timeout نمی‌داند ابزار اجرا شده یا نه؛ مدل هم ممکن است همان ابزار را دوباره صدا بزند. «ثبت سفارش» دو بار اجرا می‌شود
- MCP از مرداد ۱۴۰۵: اگر جریان پاسخ قطع شود، درخواست [از دست رفته است]{.mark} و کلاینت باید آن را از نو بفرستد ([changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog))
- پس ابزاری که چیزی را عوض می‌کند، کلید idempotency می‌خواهد؛ همان درس `POST` در جلسهٔ ۲

::punch::

هر ابزاری که agent صدا می‌زند، دیر یا زود دو بار صدا زده می‌شود.

---
layout: section
type: section
module: M3
minutes: 0
link: http
---

# MCP: پروتکلی تازه، درس‌هایی آشنا

<p class="since">agent برای کار کردن با سرویس‌ها به ابزار نیاز دارد.</p>

<p class="question">پروتکلی که برای agent ساخته شد، کدام درس‌های HTTP را دوباره کشف کرد؟</p>

---
module: M3
minutes: 2
link: http
corner: MCP
---

# یک tool call در شبکه چه شکلی است؟

<HttpMsg :lines="[
  { t: 'POST /mcp HTTP/1.1', l: 'یک POST معمولی', c: 2 },
  { t: 'MCP-Protocol-Version: 2026-07-28', l: 'نسخه', c: 4 },
  { t: 'Mcp-Method: tools/call', l: 'چه کاری', c: 3 },
  { t: 'Mcp-Name: get_grade', l: 'کدام ابزار', c: 3 },
  { t: '' },
  { t: '{&quot;jsonrpc&quot;:&quot;2.0&quot;,&quot;id&quot;:2,&quot;method&quot;:&quot;tools/call&quot;,', l: 'بدنه: JSON-RPC', c: 5 },
  { t: ' &quot;params&quot;:{&quot;name&quot;:&quot;get_grade&quot;,&quot;arguments&quot;:{…}}}', c: 5 },
]" />

- با `tools/list` فهرست ابزارها می‌آید و با `tools/call` اجرا؛ هر درخواست [مستقل]{.mark} است

::punch::

MCP روی HTTP سوار است: همان متد و header و کد وضعیت، با یک پیام JSON در بدنه.

---
type: interactive
module: M3
minutes: 3
link: http
corner: MCP
---

# نام ابزار در بدنه هست؛ چرا در header تکرار شده؟

در درخواست `tools/call`، نام ابزار هم در بدنهٔ JSON آمده و هم در فیلد `Mcp-Name`.

<ol class="options">
  <li><b>الف)</b> برای لاگ</li>
  <li v-mark.box.orange="1"><b>ب)</b> برای واسطه‌ها</li>
  <li><b>ج)</b> برای مرورگر</li>
  <li><b>د)</b> برای نسخهٔ قدیم</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ب)</strong> gateway و load balancer فقط header را می‌خوانند (جلسهٔ ۵)؛ با این فیلد، بی‌آنکه بدنه را باز کنند، مسیر می‌دهند و برای هر ابزار سقف نرخ می‌گذارند. ولی یک واقعیت در دو جا یعنی خطر ناهمخوانی؛ پس سرور باید درخواستی را که header و بدنه‌اش با هم نمی‌خوانند رد کند.</div>

::punch::

<div v-click="1">هر چه واسطه باید بداند در header؛ و هر تکرار، یک بررسی همخوانی.</div>

---
type: demo
module: M3
minutes: 5
link: http
corner: MCP
lab: 07-machine-clients
status: executed
---

# یک سرور MCP را با curl صدا بزنیم

<dl class="run">
  <dt>سؤال</dt><dd>پاسخ <code>tools/list</code> چه چیزی دربارهٔ cache می‌گوید؟ و اگر header بگوید <code>get_grade</code> ولی بدنه بگوید <code>delete_grades</code>؟</dd>
  <dt>مشاهده</dt><dd>فیلدهای <code>ttlMs</code> و <code>cacheScope</code>؛ پاسخ ابزار؛ و کد وضعیت درخواست ناهمخوان</dd>
  <dt>تصمیم</dt><dd>اگر gateway از روی header اجازه می‌دهد، سرور باید همخوانی را بسنجد</dd>
</dl>

```sh
U=http://127.0.0.1:8822/mcp
H='-H Content-Type:application/json -H MCP-Protocol-Version:2026-07-28'
curl -s  $H -H 'Mcp-Method: tools/list' -d @list.json $U
curl -si $H -H 'Mcp-Method: tools/call' -H 'Mcp-Name: get_grade' -d @delete.json $U
```

<p class="status">سرور آموزشی با <code>node mcp.mjs</code> در <code>labs/07-machine-clients</code>؛ به شکل MCP است، نه پیاده‌سازی کامل آن.</p>

---
type: reserve
module: M3
minutes: 0
link: http
corner: MCP
---

# خروجی دمو: فهرست، صدا زدن، و ناهمخوانی

```text
tools/list →  {"result":{"resultType":"complete","tools":[…],
               "ttlMs":300000,"cacheScope":"public"}}

tools/call →  {"result":{"resultType":"complete",
               "content":[{"type":"text","text":"sara: 18.5"}]}}

mismatch   →  HTTP/1.1 400 Bad Request
              {"error":{"code":-32020,
               "message":"Mcp-Name header does not match body"}}
```

- درخواست سوم در header می‌گفت `get_grade` و در بدنه `delete_grades`؛ سرور ردش کرد و [نمره‌ها سر جایشان ماندند]{.mark}

---
module: M3
minutes: 2
link: http
corner: MCP
---

# همان درس‌ها، در یک پروتکل تازه

| درس این فصل | در MCP، بازنگری مرداد ۱۴۰۵ |
| --- | --- |
| بی‌حالتی (جلسهٔ ۲) | session و handshake [حذف شد]{.mark}؛ هر درخواست مستقل است |
| تازگی و دامنهٔ cache (جلسهٔ ۵) | `ttlMs` و `cacheScope`، مثل `max-age` و `private` |
| مرز origin (جلسهٔ ۳) | درخواست با `Origin` بیگانه `403` می‌گیرد |
| جریان پاسخ (جلسهٔ ۶) | SSE فقط در پاسخ همان درخواست |
| سقف نرخ (همین جلسه) | polling فقط با backoff و jitter |

::punch::

این درس‌ها ویژگی HTTP نیستند؛ ویژگی هر سیستمی‌اند که باید بزرگ شود.

---
module: M3
minutes: 2
link: http
corner: MCP
---

# سناریوی واقعی: یک issue که به agent دستور داد

- مهاجم در مخزن عمومیِ قربانی یک issue می‌نویسد که در متنش [دستور پنهان]{.mark} است
- قربانی به agent خود می‌گوید: «issueهای باز را نگاه کن». agent دستور را می‌خواند، از مخزن خصوصی داده برمی‌دارد و در یک pull request عمومی می‌گذارد ([گزارش خرداد ۱۴۰۴](https://invariantlabs.ai/blog/mcp-github-vulnerability))
- نه سرور MCP باگ داشت و نه پروتکل: token معتبر بود و هر درخواست، جداگانه، مجاز

::punch::

برای مدل، محتوایی که می‌خواند و دستوری که می‌گیرد از یک جنس‌اند.

---
module: M3
minutes: 2
link: http
corner: MCP
---

# سه‌گانهٔ مرگبار: کدام ضلع را برمی‌دارید؟

| ضلع | در آن حمله | تصمیم مهندسی |
| --- | --- | --- |
| دسترسی به دادهٔ خصوصی | token با دسترسی به همهٔ مخزن‌ها | [کمترین دسترسی]{.mark}: یک مخزن برای هر نشست |
| خواندن محتوای نامطمئن | متن issue | جدا کردن agentِ خواننده از agentِ دارای دسترسی |
| راهی برای فرستادن به بیرون | ساختن pull request عمومی | تأیید انسان برای کار برگشت‌ناپذیر |

<p class="small">نام‌گذاری از <a href="https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/">Simon Willison</a>، خرداد ۱۴۰۴.</p>

::punch::

TLS و CORS و SameSite اینجا کمکی نمی‌کنند: کلاینت مجاز است و token معتبر.

---
layout: section
type: section
module: M4
minutes: 0
link: all
---

# جمع‌بندی فصل

<p class="since">هفت جلسه، یک زنجیره: از URL تا HTTP، و کلاینتی که دیگر انسان نیست.</p>

<p class="question">از خودِ پروتکل چه چیزی را می‌توان مطمئن شد، و چه چیزی را نه؟</p>

---
module: M4
minutes: 3
link: all
corner: جمع‌بندی فصل
---

# یک tool call، از اول تا آخر زنجیره

| حلقه | برای این درخواست | کجا می‌شکند |
| --- | --- | --- |
| parse و HSTS و DNS | نشانی سرور MCP؛ فقط `https` | نشانی فریبنده؛ پاسخ DNS کهنه (۱) |
| اتصال | TCP یا QUIC | صف و بستهٔ گم‌شده (۴) |
| TLS | سرور ثابت می‌کند کیست | گواهی؛ واسطه‌ای که TLS را باز می‌کند (۴ و ۵) |
| HTTP | `POST` با token و کلید idempotency | `401` و `429` و retry (۲ و ۳ و ۷) |
| پاسخ | JSON یا جریان SSE | واسطهٔ بافرکننده؛ خطا وسط جریان (۶) |

::punch::

زنجیره همان است که جلسهٔ اول دیدیم؛ حالا برای هر حلقه می‌دانید کجا می‌شکند.

---
module: M4
minutes: 2
link: all
corner: جمع‌بندی فصل
---

# هفت جلسه، هفت مدل ذهنی

| جلسه | مدل ذهنی |
| --- | --- |
| ۱ | نشانی پیش از هر اتصال چند بار تفسیر می‌شود؛ origin مرز اعتماد است |
| ۲ | معنای پیام را متد و کد وضعیت می‌گویند، نه بدنه |
| ۳ | پروتکل بی‌حالت است؛ مرورگر کوکی را خودکار می‌فرستد |
| ۴ | هر نسخهٔ HTTP صف را یک لایه پایین‌تر برد |
| ۵ | واسطه می‌بیند، نگه می‌دارد و عوض می‌کند |
| ۶ | برای حرف زدن سرور، یا پاسخ کش می‌آید یا از HTTP بیرون می‌رویم |
| ۷ | پروتکل همان است؛ فرض‌ها دربارهٔ کلاینت عوض شده |

---
type: interactive
module: M4
minutes: 3
link: all
corner: جمع‌بندی فصل
---

# از کدام‌یک می‌توانید مطمئن باشید؟

کلاینتی با `https` و یک token معتبر به API شما وصل شده است. پروتکل کدام را تضمین می‌کند؟

<ol class="options">
  <li><b>الف)</b> هویت برنامه</li>
  <li v-mark.box.orange="1"><b>ب)</b> سلامت مسیر</li>
  <li><b>ج)</b> انسان بودن</li>
  <li><b>د)</b> تکرار نشدن</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ب)</strong> TLS تضمین می‌کند بایت‌ها تا جایی که TLS باز می‌شود عوض نشده‌اند. بقیه را پروتکل نمی‌گوید: نام برنامه ادعاست، token فقط می‌گوید «دارندهٔ این token»، و تکرار نشدن را باید خودتان با کلید idempotency بسازید.</div>

::punch::

<div v-click="1">پروتکل سلامت مسیر را تضمین می‌کند، نه نیت طرف مقابل را؛ بقیه طراحی شماست.</div>

---
module: M4
minutes: 1
link: all
corner: جمع‌بندی فصل
---

# چهار مدل ذهنی، چهار تصمیم

| مدل ذهنی | تصمیم مهندسی |
| --- | --- |
| `User-Agent` ادعاست | هویت را با امضا یا token بسنج |
| قاعدهٔ مرورگر، غیرمرورگر را نمی‌بندد | هر چه مهم است در سرور اجرا شود |
| retry بار است | `Retry-After`؛ backoff با jitter؛ فقط در یک لایه |
| پاسخ را مدل می‌خواند | کمترین دسترسی؛ تأیید انسان برای کار برگشت‌ناپذیر |

::punch::

فصل ۱ تمام شد. فصل بعد: از پروتکل به طراحی؛ آنچه پشت سرور می‌گذرد.

---
type: exercise
module: M4
minutes: 4
link: http
corner: تمرین
---

# تمرین ۷: API خودتان را برای agent آماده کنید

<Exercise ex="07-agent-ready-api" due="تا شب پیش از جلسهٔ ۸">
<dl class="run">
  <dt>چالش</dt><dd>یک API نوبت‌دهی به شما داده می‌شود که نه سقف نرخ دارد و نه در برابر تکرار امن است. سرور را برای agent آماده کنید، و کلاینتی بنویسید که درست retry کند.</dd>
  <dt>پیش‌بینی</dt><dd>همین حالا روی کاغذ: agent شما <code>POST /bookings</code> فرستاد و پیش از رسیدن پاسخ، اتصال قطع شد. دوباره بفرستد یا نه؟ در هر حالت چه چیزی خراب می‌شود؟</dd>
  <dt>پل</dt><dd>سرور شما شمارندهٔ سقف نرخ را در حافظه نگه می‌دارد. اگر دو نسخه از آن پشت load balancer باشد چه می‌شود؟ فصل بعد.</dd>
</dl>
</Exercise>

---
src: ../ch1-syllabus.md
type: core
module: M4
minutes: 1
---

---
type: extra
module: M4
minutes: 0
link: http
corner: جمع‌بندی فصل
---

# برای کنجکاوی بیشتر (۱ از ۲)

<ol class="curious">
  <li>اگر crawler فایل robots.txt را بخواهد و <code>503</code> بگیرد، باید چه کند؟ اگر <code>404</code> بگیرد چه؟<span class="hint">RFC 9309 بخش ۲.۳.۱؛ ببینید کدام حالت «همه‌چیز ممنوع» است و چرا.</span></li>
  <li>سقف نرخ با «پنجرهٔ ثابت» چه ایرادی دارد که token bucket ندارد؟<span class="hint">در مرز دو پنجره، کلاینت می‌تواند دو برابر سقف بفرستد؛ با سرور دمو بیازمایید.</span></li>
  <li>اگر token یک agent لو برود، با token یک کاربر چه فرقی دارد؟<span class="hint">جلسهٔ ۳؛ در مشخصات MCP بخوانید چرا سرور نباید token را به سرویس دیگری رد کند.</span></li>
</ol>

---
type: extra
module: M4
minutes: 0
link: http
corner: جمع‌بندی فصل
---

# برای کنجکاوی بیشتر (۲ از ۲)

<ol class="curious" start="4" style="counter-reset: q 3">
  <li>agentی که با مرورگر شما کار می‌کند، کوکی‌های شما را هم دارد. کدام دفاع‌های جلسهٔ ۳ هنوز کار می‌کنند؟<span class="hint">اسلاید «پیوند با هوش مصنوعی» جلسهٔ ۳ و گزارش Brave دربارهٔ Comet.</span></li>
  <li>سایت چطور می‌تواند بگوید «بخوان، ولی برای آموزش مدل استفاده نکن»؟<span class="hint">گروه کاری AIPREF در IETF و فیلد پیشنهادی <code>Content-Usage</code>.</span></li>
  <li>چرا ترتیب ابزارها در پاسخ <code>tools/list</code> باید ثابت باشد؟<span class="hint">changelog بازنگری ۲۰۲۶ و prompt caching در جلسهٔ ۵.</span></li>
</ol>

---
type: reserve
module: M4
minutes: 0
link: http
corner: منابع
---

# منابع

<ul class="src two">
  <li><a href="https://diff.wikimedia.org/2025/04/01/how-crawlers-impact-the-operations-of-the-wikimedia-projects/">Wikimedia: how crawlers impact operations</a></li>
  <li><a href="https://www.rfc-editor.org/rfc/rfc9309.html">RFC 9309: Robots Exclusion Protocol</a></li>
  <li><a href="https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/">Cloudflare: stealth crawlers</a></li>
  <li><a href="https://www.rfc-editor.org/rfc/rfc9421">RFC 9421: HTTP Message Signatures</a> · <a href="https://contextbolt.com/blog/web-bot-auth/">Web Bot Auth</a></li>
  <li><a href="https://blog.cloudflare.com/introducing-pay-per-crawl/">Cloudflare: pay per crawl</a></li>
  <li><a href="https://blog.cloudflare.com/deep-dive-into-cloudflares-sept-12-dashboard-and-api-outage/">Cloudflare: Sept 12 dashboard outage</a></li>
  <li><a href="https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-ratelimit-headers">IETF draft: RateLimit header fields</a></li>
  <li><a href="https://platform.claude.com/docs/en/api/rate-limits">Claude API: rate limits</a></li>
  <li><a href="https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/">AWS: exponential backoff and jitter</a></li>
  <li><a href="https://modelcontextprotocol.io/specification/2026-07-28/changelog">MCP 2026-07-28: key changes</a></li>
  <li><a href="https://invariantlabs.ai/blog/mcp-github-vulnerability">Invariant Labs: GitHub MCP exploited</a></li>
  <li><a href="https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/">Simon Willison: the lethal trifecta</a></li>
</ul>
