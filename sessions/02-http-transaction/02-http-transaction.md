---
theme: ../../theme
title: "جلسهٔ ۲: یک تراکنش HTTP"
exportFilename: 02-http-transaction
chapter: ch1
modules:
  M0: { slug: overview, title: نگاهی از دور }
  M1: { slug: message, title: پیام }
  M2: { slug: methods, title: متد }
  M3: { slug: status, title: کد وضعیت }
  M4: { slug: headers, title: header و مذاکره }
  M5: { slug: wrap-up, title: جمع‌بندی }
---

<p class="course">مهندسی اینترنت، فصل ۱: پروتکل‌ها</p>

# یک تراکنش HTTP

<p class="lede">جلسهٔ ۲: پیام و متد و کد وضعیت و header؛ و اینکه معنایشان را چه کسی تعیین می‌کند</p>

<Chain :today="['http']" />

<p class="byline">محمد بصیرزاده<br>دانشگاه شهید چمران اهواز، دانشکدهٔ مهندسی، پاییز ۱۴۰۵</p>

---
type: interactive
module: M0
minutes: 3
link: http
corner: نگاهی از دور
---

# سناریوی واقعی: کلاینت شما کد ۵۲۹ گرفته؛ چه کند؟

agent شما از API یک مدل زبانی پاسخ `529` گرفته؛ کدی که در هیچ استانداردی نیست و کلاینت هرگز ندیده است.

<ol class="options">
  <li><b>الف)</b> متوقف شود</li>
  <li v-mark.box.orange="1"><b>ب)</b> مثل <code>500</code></li>
  <li><b>ج)</b> مثل <code>200</code></li>
  <li><b>د)</b> فوراً تکرار کند</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ب)</strong> طبق <a href="https://www.rfc-editor.org/rfc/rfc9110#section-15">RFC 9110</a> کلاینت کد ناشناخته را مثل x00 همان کلاس می‌داند. <code>529</code> یعنی «سرور بیش از حد شلوغ است» در API مدل Claude. تکرار کند یا نه؟ پایان جلسه.</div>

::punch::

<div v-click="1">کد وضعیت برای ماشین است؛ ماشینی که همهٔ کدها را نمی‌شناسد هم باید درست رفتار کند.</div>

---
module: M0
minutes: 2
link: http
corner: نگاهی از دور
---

# نگاهی از دور: یک درخواست، یک پاسخ

<Txn />

- در جلسهٔ ۱ به سرور رسیدیم؛ امروز آخرین حلقهٔ زنجیره را بررسی می‌کنیم: [خود گفتگو]{.mark}
- هر تراکنش HTTP یک درخواست و یک پاسخ است؛ هر جزء این دو پیام یک بخش امروز است

::punch::

معنای هر تراکنش در همین چند جزء است؛ باقی، جزئیات قالب انتقال است.

---
layout: section
type: section
module: M1
minutes: 0
link: http
---

# پیام: روی اتصال چه فرستاده می‌شود؟

<p class="since">در جلسهٔ ۱ به سرور رسیدیم و اتصال برقرار شد.</p>

<p class="question">روی این اتصال دقیقاً چه بایت‌هایی رد و بدل می‌شود؟</p>

---
module: M1
minutes: 2
link: http
corner: پیام
---

# کالبدشکافی یک درخواست HTTP/1.1

<HttpMsg crlf :lines="[
  { t: 'GET /cart?id=7 HTTP/1.1', l: 'خط درخواست', c: 2 },
  { t: 'Host: shop.example.com', l: 'فیلد (header)', c: 4 },
  { t: 'User-Agent: curl/8.5.0', l: 'فیلد', c: 4 },
  { t: 'Accept: application/json', l: 'فیلد', c: 4 },
  { t: '', l: 'پایان فیلدها' },
]" />

- هر خط با دو بایت CRLF ‏(␍␊) تمام می‌شود؛ fragment هرگز فرستاده نمی‌شود
- نام فیلد به بزرگی و کوچکی حرف حساس نیست: `host` و `Host` یکی‌اند
- GET معمولاً محتوا ندارد؛ POST محتوا را بعد از خط خالی می‌فرستد

::punch::

پیام HTTP/1.1 متن است، ولی قاعده‌هایش دقیق است: یک CRLF جابه‌جا یعنی پیامی دیگر.

---
module: M1
minutes: 2
link: http
corner: پیام
---

# کالبدشکافی یک پاسخ

<HttpMsg :lines="[
  { t: 'HTTP/1.1 200 OK', l: 'خط وضعیت', c: 3 },
  { t: 'Content-Type: application/json', l: 'نوع بازنمایی', c: 4 },
  { t: 'Content-Length: 29', l: 'طول محتوا به بایت', c: 4 },
  { t: '', l: 'پایان فیلدها' },
  { t: '{&quot;id&quot;:7,&quot;items&quot;:[&quot;کتاب&quot;]}', l: 'محتوا (body)', c: 5 },
]" />

- عبارت `OK` در خط وضعیت فقط برای انسان است؛ کلاینت نباید به آن تکیه کند و HTTP/2 اصلاً آن را ندارد
- `Content-Length` بایت می‌شمارد، نه حرف: «کتاب» چهار حرف است و [هشت بایت]{.mark} در UTF-8

::punch::

ماشین عدد را می‌خواند، نه متن کنارش را.

---
type: interactive
module: M1
minutes: 3
link: http
corner: پیام
---

# چرا فیلد `Host` اجباری است؟

سرور از خود اتصال IP و پورت را می‌داند. پس چرا HTTP/1.1 درخواست بدون `Host` را رد می‌کند؟

<ol class="options">
  <li><b>الف)</b> برای امنیت</li>
  <li v-mark.box.orange="1"><b>ب)</b> چون روی یک IP چند سایت است</li>
  <li><b>ج)</b> برای cache</li>
  <li><b>د)</b> برای TLS</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ب)</strong> روی یک IP می‌تواند هزاران سایت میزبانی شود (virtual hosting) و سرور فقط از <code>Host</code> می‌فهمد کدام سایت خواسته شده. HTTP/1.0 این فیلد را اجباری نداشت و هر سایت IP جدا می‌خواست؛ HTTP/1.1 آن را اجباری کرد و سرور باید درخواست بدون آن را با <code>400</code> رد کند (<a href="https://www.rfc-editor.org/rfc/rfc9112#section-3.2">RFC 9112 §3.2</a>).</div>

::punch::

<div v-click="1">یک فیلد متنی کوچک، کمبود نشانی IPv4 را برای وب قابل‌تحمل کرد.</div>

---
module: M1
minutes: 2
link: http
corner: پیام
---

# پیام کجا تمام می‌شود؟

روی یک اتصال، درخواست بعدی درست بعد از آخرین بایت درخواست قبلی شروع می‌شود؛ بین پیام‌ها هیچ جداکننده‌ای نیست.

| روش | پایان پیام | کجا |
| --- | --- | --- |
| `Content-Length: 29` | بعد از دقیقاً ۲۹ بایت | درخواست و پاسخ |
| `Transfer-Encoding: chunked` | تکه‌ها هرکدام با طولش؛ تکهٔ صفر یعنی پایان | وقتی طول از اول معلوم نیست |
| بسته شدن اتصال | هرچه تا بسته شدن رسید | فقط پاسخ |

::punch::

در HTTP/1.1 مرز پیام را طولی تعیین می‌کند که خود پیام اعلام کرده؛ اگر دو طرف دو طول بخوانند، دو پیام متفاوت می‌بینند.

---
module: M1
minutes: 2
link: http
corner: پیام
---

# سناریوی واقعی: وقتی دو سرور سر مرز یک پیام توافق ندارند

<Desync />

- این حمله request smuggling است؛ در مرداد ۱۴۰۴ پژوهش [HTTP/1.1 must die](https://portswigger.net/research/http1-must-die) با آن بیش از ۳۵۰ هزار دلار جایزهٔ باگ گرفت و یک باگ Cloudflare بیش از ۲۴ میلیون سایت را در معرض گذاشت
- توصیهٔ پژوهش: اتصال proxy به سرور با [HTTP/2]{.mark}، که مرز هر پیام را در قالب باینری صریح می‌نویسد

::punch::

ابهام در قالب انتقال، حفرهٔ امنیتی است.

---
type: demo
module: M1
minutes: 6
link: http
corner: پیام
lab: 02-http-transaction/h1-vs-h2
status: executed
---

# همان درخواست در HTTP/2 چه شکلی است؟

<dl class="run">
  <dt>سؤال</dt><dd>وقتی همان درخواست را با HTTP/2 بفرستیم، سرور چه می‌بیند؟</dd>
  <dt>مشاهده</dt><dd>خروجی <code>curl -v</code> برای یک سرور محلی که هم HTTP/1.1 و هم HTTP/2 بی‌رمز را پشتیبانی می‌کند</dd>
  <dt>تصمیم</dt><dd>کد سرور به reason phrase و فیلدهای مخصوص اتصال تکیه نکند</dd>
</dl>

```sh
curl -sv http://127.0.0.1:8767/hello?x=1
curl -sv --http2-prior-knowledge http://127.0.0.1:8766/hello?x=1
```

<p class="status">سرور محلی در <code>labs/02-http-transaction/h1-vs-h2</code>؛ curl 8.5.0 و Node 22.</p>

---
type: reserve
module: M1
minutes: 0
link: http
corner: پیام
---

# خروجی دمو: سرور در هر نسخه چه دید؟

```text
HTTP/1.1                              HTTP/2
> GET /hello?x=1 HTTP/1.1             * [HTTP/2] [1] [:method: GET]
> Host: 127.0.0.1:8767                * [HTTP/2] [1] [:authority: 127.0.0.1:8766]
< HTTP/1.1 200 OK                     < HTTP/2 200
< Connection: keep-alive              (no Connection, no Keep-Alive)
server saw: host=127.0.0.1:8767       server saw: host=-  :authority=127.0.0.1:8766
```

- در HTTP/2 خط درخواست به pseudo-header‌هایی مثل `:method` و `:authority` تبدیل می‌شود؛ reason phrase نیست و `Connection` [ممنوع است]{.mark}
- خروجی `-v` پیام HTTP/2 را هم متنی نشان می‌دهد؛ روی اتصال، frame باینری است

---
module: M1
minutes: 1
link: http
corner: پیام
---

# معنا ثابت، قالب متغیر

| لایه | سند | آنچه تعریف می‌کند |
| --- | --- | --- |
| معنا | [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110) | متد، کد وضعیت، فیلدها، و قاعدهٔ رفتار با هرکدام |
| HTTP/1.1 | [RFC 9112](https://www.rfc-editor.org/rfc/rfc9112) | پیام متنی روی TCP |
| HTTP/2 | [RFC 9113](https://www.rfc-editor.org/rfc/rfc9113) | frame باینری و چند جریان روی یک اتصال TCP |
| HTTP/3 | [RFC 9114](https://www.rfc-editor.org/rfc/rfc9114) | frame باینری روی QUIC |

فقط HTTP/1.x متنی است. قالب‌ها را در جلسهٔ ۴ بررسی می‌کنیم؛ هرچه امروز دربارهٔ متد و کد وضعیت و header می‌گوییم، در هر سه نسخه یکی است.

::punch::

HTTP یک معنا است با سه قالب انتقال؛ کسی که معنا را بفهمد، هر سه را فهمیده است.

---
layout: section
type: section
module: M2
minutes: 0
link: http
---

# متد: وعده‌ای به همهٔ ماشین‌ها

<p class="since">شکل پیام را دیدیم؛ اولین کلمه‌اش متد است.</p>

<p class="question">متد به چه کسانی، چه قولی می‌دهد؟</p>

---
module: M2
minutes: 2
link: http
corner: متد
---

# متد یک وعده است، نه فقط یک فعل

متد را برای سرور خودتان انتخاب نمی‌کنید؛ ماشین‌های زیادی بدون پرسیدن از شما، بر اساسش عمل می‌کنند:

- مرورگر پیش از ارسال دوبارهٔ فرم POST هشدار می‌دهد، ولی GET را بی‌صدا تکرار می‌کند
- پیش‌واکشی (prefetch یعنی باز کردن لینک پیش از کلیک، برای سرعت)، خزنده‌ها و اسکنرهای امنیتی فقط [لینک‌های GET را خودکار باز می‌کنند]{.mark}
- cache معمولاً فقط پاسخ GET و HEAD را نگه می‌دارد (جلسهٔ ۵)
- کتابخانه‌های HTTP و proxyها بعضی درخواست‌ها را پس از قطع اتصال خودکار تکرار می‌کنند

::punch::

متد قراردادی است با همهٔ ماشین‌هایی که در راه‌اند.

---
module: M2
minutes: 2
link: http
corner: متد
---

# safe و idempotent: دو وعدهٔ جدا

| متد | safe | idempotent | کاربرد |
| --- | --- | --- | --- |
| `GET` و `HEAD` | ✓ | ✓ | خواندن؛ HEAD فقط header‌ها |
| `OPTIONS` | ✓ | ✓ | پرسیدن قابلیت‌ها (CORS در جلسهٔ ۳) |
| `PUT` | ✗ | ✓ | جایگزینی کامل در نشانی معلوم |
| `DELETE` | ✗ | ✓ | حذف |
| `POST` و `PATCH` | ✗ | ✗ | پردازش، ساختن منبع تازه، تغییر بخشی |

<p class="small">safe: درخواست تغییری در سرور نمی‌خواهد (<a href="https://www.rfc-editor.org/rfc/rfc9110#section-9.2.1">RFC 9110 §9.2.1</a>) · idempotent: اثر چند درخواست یکسان برابر اثر یکی است (<a href="https://www.rfc-editor.org/rfc/rfc9110#section-9.2.2">RFC 9110 §9.2.2</a>)</p>

::punch::

safe یعنی بی‌اثر؛ idempotent یعنی تکرارش اثر تازه‌ای ندارد.

---
type: interactive
module: M2
minutes: 3
link: http
corner: متد
---

# DELETE دوم 404 می‌دهد؛ پس idempotent نیست؟

`DELETE /orders/7` اول `204` می‌گیرد و بار دوم `404`. پاسخ‌ها فرق دارند.

<ol class="options">
  <li><b>الف)</b> درست است؛ idempotent نیست</li>
  <li v-mark.box.orange="1"><b>ب)</b> idempotent است</li>
  <li><b>ج)</b> فقط اگر هر دو <code>204</code> بودند</li>
  <li><b>د)</b> به cache بستگی دارد</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ب)</strong> idempotent دربارهٔ اثر روی state سرور است، نه یکسانی پاسخ. بعد از DELETE اول سفارش ۷ نیست؛ DELETE دوم چیزی را عوض نمی‌کند. پس تکرارش امن است، هرچند پاسخش فرق دارد.</div>

::punch::

<div v-click="1">idempotent یعنی تکرار، دنیا را بیشتر عوض نمی‌کند؛ نه اینکه پاسخ‌ها یکسان‌اند.</div>

---
module: M2
minutes: 2
link: http
corner: متد
---

# سناریوی واقعی: شتاب‌دهنده‌ای که صفحه‌ها را پاک کرد

- اردیبهشت ۱۳۸۴: Google افزونه‌ای به نام Web Accelerator منتشر کرد که برای سرعت، [لینک‌های صفحه را پیش از کلیک باز می‌کرد]{.mark}
- کاربران Backpack، سرویس 37signals، گزارش دادند صفحه‌هایشان «ناپدید» می‌شود
- دلیل: پیوندهای «delete» در این برنامه با GET کار می‌کردند و تأیید JavaScript را افزونه اصلاً اجرا نمی‌کرد ([Signal vs. Noise](https://signalvnoise.com/archives2/google_web_accelerator_hey_not_so_fast_an_alert_for_web_app_designers))

::punch::

پیوندی که چیزی را پاک می‌کند، دیر یا زود به‌دست یک ماشین کلیک می‌شود.

---
module: M2
minutes: 2
link: http
corner: متد
---

# همان اشتباه، بیست سال بعد: لینک یک‌بارمصرف و اسکنر ایمیل

- اسکنرهای امنیتی ایمیل همهٔ لینک‌های نامه را باز می‌کنند و [لینک ورود یک‌بارمصرف را پیش از کاربر مصرف می‌کنند]{.mark} ([Stytch](https://stytch.com/docs/b2b/guides/magic-links/protected-eml))
- لغو اشتراک خبرنامه هم همین مشکل را داشت؛ [RFC 8058](https://www.rfc-editor.org/rfc/rfc8058.html) لغو یک‌کلیکی را با POST تعریف کرد، چون ضداسپم‌ها URLها را خودکار باز می‌کنند
- امروز [Gmail](https://support.google.com/a/answer/81126) همین لغو یک‌کلیکی را از فرستندگان انبوه می‌خواهد

::punch::

لینک ایمیل فقط صفحه‌ای را باز کند؛ خودِ کار با یک POST از همان صفحه انجام شود.

---
type: interactive
module: M2
minutes: 3
link: http
corner: متد
---

# کدام را نباید با یک لینک GET انجام داد؟

<ol class="steps plain">
  <li><span>جستجوی کتاب در کتابخانهٔ دانشگاه</span></li>
  <li><span>لغو اشتراک خبرنامه از لینک داخل ایمیل</span></li>
  <li><span>خروج از حساب کاربری</span></li>
  <li><span>دیدن فاکتور خرید</span></li>
</ol>

<ol class="options">
  <li><b>الف)</b> فقط ۲</li>
  <li v-mark.box.orange="1"><b>ب)</b> ۲ و ۳</li>
  <li><b>ج)</b> ۳ و ۴</li>
  <li><b>د)</b> هیچ‌کدام</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ب)</strong> جستجو و دیدن فاکتور فقط می‌خوانند. لغو اشتراک و خروج state را عوض می‌کنند؛ خروج با GET یعنی هر تصویر یا پیش‌واکشی در یک صفحهٔ دیگر می‌تواند کاربر را از حسابش بیرون کند.</div>

---
module: M2
minutes: 2
link: http
corner: متد
---

# پاسخ نرسید؛ دوباره بفرستیم؟

درخواست رفت و اتصال پیش از رسیدن پاسخ قطع شد. کلاینت نمی‌داند سرور کار را انجام داده یا نه.

- درخواست idempotent را می‌شود [خودکار تکرار کرد]{.mark}؛ اگر بار اول انجام شده بود، تکرار چیزی را بیشتر عوض نمی‌کند ([RFC 9110 §9.2.2](https://www.rfc-editor.org/rfc/rfc9110#section-9.2.2))
- تکرار POST یعنی شاید دو سفارش یا دو پرداخت
- شبکهٔ همراه و Wi-Fi ضعیف این وضعیت را هر روزی می‌کنند، نه استثنا

::punch::

در شبکه «جواب نیامد» یعنی «نمی‌دانم»، نه «انجام نشد».

---
module: M2
minutes: 2
link: http
corner: متد
---

# سناریوی واقعی: پرداختی که دو بار کم شد

```http
POST /v1/payments HTTP/1.1
Idempotency-Key: "8e03978e-40d5-43e8-bc93-6894a57f9324"
Content-Type: application/json
```

- کلاینت برای هر عملیات یک کلید یکتا می‌سازد و در هر تکرار همان را می‌فرستد؛ سرور نتیجهٔ بار اول را [برای همان کلید برمی‌گرداند]{.mark}
- [Stripe](https://docs.stripe.com/api/idempotent_requests) و بسیاری از درگاه‌های پرداخت همین را دارند؛ [پیش‌نویس IETF](https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-idempotency-key-header-07) آن را استاندارد می‌کند
- در پیش‌نویس، تکرار پیش از پایان پردازش `409` می‌گیرد و همان کلید با بدنهٔ دیگر `422`

::punch::

وقتی متد idempotent نیست، idempotency را خودتان با یک کلید بسازید.

---
module: M2
minutes: 2
link: http
corner: متد
---

# پیوند با هوش مصنوعی: وقتی agent ابزار را صدا می‌زند

در [MCP](https://modelcontextprotocol.io/) هر ابزار برچسب خطر دارد؛ همان وعده‌های HTTP با نام تازه:

| برچسب ابزار | معادل HTTP | پیش‌فرض |
| --- | --- | --- |
| `readOnlyHint` | safe | نه |
| `idempotentHint` | idempotent | نه |
| `destructiveHint` | ناامن و مخرب، مثل DELETE | بله |

- پیش‌فرض‌ها بدبینانه‌اند، و کلاینت برچسب سرور ناشناس را [باور نمی‌کند]{.mark} ([MCP blog](https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/))

::punch::

agent هم تکرار می‌کند؛ واژه‌های HTTP زبان خطر آن شده‌اند.

---
layout: section
type: section
module: M3
minutes: 0
link: http
---

# کد وضعیت: پیامی برای ماشین

<p class="since">درخواست را ساختیم و دیدیم متدش به چه کسانی قول می‌دهد.</p>

<p class="question">پاسخ را چه کسی می‌خواند، و از یک عدد سه‌رقمی چه می‌فهمد؟</p>

---
module: M3
minutes: 2
link: http
corner: کد وضعیت
---

# پنج کلاس، یک رقم

| کلاس | معنا | کدهای پرکاربرد |
| --- | --- | --- |
| 1xx | هنوز تمام نشده؛ پاسخ موقت | `100` و `101` و `103` |
| 2xx | انجام شد | `200` و `201` و `204` |
| 3xx | برو جای دیگر | `301` و `304` و `308` |
| 4xx | [اشکال از درخواست]{.mark}؛ تکرارش بی‌تغییر فایده ندارد | `400` و `401` و `403` و `404` و `405` و `409` و `429` |
| 5xx | [اشکال از سرور یا واسطه]{.mark}؛ شاید بعداً درست شود | `500` و `502` و `503` و `504` |

::punch::

رقم اول می‌گوید تقصیر با کیست و کلاینت چه کند؛ دو رقم بعد جزئیات است.

---
module: M3
minutes: 2
link: http
corner: کد وضعیت
---

# کد ناشناخته = x00 همان کلاس

قاعدهٔ [RFC 9110 §15](https://www.rfc-editor.org/rfc/rfc9110#section-15): کلاینت باید [کلاس هر کد را بفهمد]{.mark} و کد ناشناخته را مثل x00 همان کلاس بداند. کدهای غیراستانداردی که هر روز می‌بینید:

| کد | که می‌فرستد | معنا |
| --- | --- | --- |
| `529` | [API مدل Claude](https://platform.claude.com/docs/en/api/errors) | سرور بیش از حد شلوغ است |
| `499` | nginx، فقط در لاگ | کلاینت پیش از پاسخ اتصال را بست |
| `520` تا `527` | Cloudflare | خطای سرور اصلی پشت CDN |

::punch::

کد تازه، کلاینت قدیمی را نمی‌شکند؛ همین قاعده HTTP را توسعه‌پذیر کرد.

---
module: M3
minutes: 1
link: http
corner: کد وضعیت
---

# 1xx: پاسخ پیش از پاسخ

- `100 Continue`: «بدنهٔ بزرگت را بفرست»؛ پیش از آپلود سنگین، کلاینت اول اجازه می‌گیرد
- `101 Switching Protocols`: از این به بعد پروتکل دیگری روی همین اتصال؛ راه ورود WebSocket (جلسهٔ ۶)
- `103 Early Hints`: تا سرور HTML را آماده می‌کند، به مرورگر می‌گوید CSS و فونت را از همین حالا بگیرد؛ جانشین HTTP/2 Server Push که از [Chrome 106 حذف شد](https://developer.chrome.com/blog/removing-push) (قصه‌اش در جلسهٔ ۴)

::punch::

یک درخواست می‌تواند چند پاسخ داشته باشد، ولی فقط یکی نهایی است.

---
type: interactive
module: M3
minutes: 3
link: http
corner: کد وضعیت
---

# سناریوی واقعی: مخزن خصوصی؛ 401 یا 403 یا 404؟

کاربری که وارد نشده، اطلاعات یک مخزن **خصوصی** را از API سایت GitHub می‌خواهد. GitHub چه کدی برمی‌گرداند؟

<ol class="options">
  <li><b>الف)</b> <code>401</code></li>
  <li><b>ب)</b> <code>403</code></li>
  <li v-mark.box.orange="1"><b>ج)</b> <code>404</code></li>
  <li><b>د)</b> <code>410</code></li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ج)</strong> <a href="https://docs.github.com/en/rest/using-the-rest-api/troubleshooting-the-rest-api">GitHub</a> نمی‌خواهد دربارهٔ مخزن خصوصی هیچ اطلاعی بدهد. <code>401</code> یعنی «نمی‌دانم کیستی» و <code>403</code> یعنی «می‌شناسمت ولی اجازه نداری»؛ هر دو تأیید می‌کنند که چنین مخزنی هست.</div>

::punch::

<div v-click="1">کد وضعیت هم اطلاعات نشت می‌دهد؛ گاهی امن‌ترین پاسخ «چنین چیزی نیست» است.</div>

---
module: M3
minutes: 2
link: http
corner: کد وضعیت
---

# redirect: یک Location، پنج کد

| کد | دائمی؟ | متد و بدنه در درخواست بعدی | کاربرد |
| --- | --- | --- | --- |
| `301` | بله | مرورگر POST را GET می‌کند | انتقال دائمی صفحه |
| `302` | نه | مرورگر POST را GET می‌کند | انتقال موقت صفحه |
| `303` | — | همیشه GET | بعد از فرم: برو صفحهٔ نتیجه را بخوان |
| `307` | نه | [حفظ می‌شود]{.mark} | انتقال موقت API |
| `308` | بله | [حفظ می‌شود]{.mark} | انتقال دائمی API |

::punch::

فیلد `Location` می‌گوید کجا؛ کد می‌گوید تا کِی و با چه متدی.

---
module: M3
minutes: 2
link: http
corner: کد وضعیت
---

# چرا 307 و 308 لازم شدند؟

- قرار بود `301` و `302` متد را حفظ کنند؛ ولی مرورگرهای دههٔ ۱۹۹۰ بعد از آن‌ها [POST را به GET تبدیل کردند]{.mark}
- مشخصات رفتار واقعی را پذیرفت: HTTP/1.1 کد `303` را برای «حتماً GET» و `307` را برای «حتماً همان متد» آورد، و [RFC 7538](https://www.rfc-editor.org/rfc/rfc7538) در ۱۳۹۴ کد `308` را
- امروز [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110#section-15.4.2) می‌گوید «به دلایل تاریخی» کلاینت می‌تواند بعد از 301 متد را عوض کند، و [استاندارد Fetch](https://fetch.spec.whatwg.org/#http-redirect-fetch) می‌گوید مرورگر دقیقاً چنین می‌کند

::punch::

همان الگوی جلسهٔ صفر: وقتی رفتار واقعی با مشخصات نخواند، معمولاً مشخصات عوض می‌شود.

---
type: demo
module: M3
minutes: 6
link: http
corner: کد وضعیت
lab: 02-http-transaction/redirect-method
status: executed
---

# POST بعد از 301 چه می‌شود؟

<dl class="run">
  <dt>سؤال</dt><dd>بعد از هر کد redirect، درخواست دوم با چه متد و بدنه‌ای فرستاده می‌شود؟</dd>
  <dt>مشاهده</dt><dd>سرور محلی متد و بدنهٔ درخواست دوم را برمی‌گرداند؛ برای ۳۰۱ تا ۳۰۸ تکرار می‌کنیم</dd>
  <dt>تصمیم</dt><dd>برای جابه‌جایی دائمی API از <code>308</code> استفاده کن، نه <code>301</code></dd>
</dl>

```sh
for c in 301 302 303 307 308; do curl -s -L -d 'x=1' http://127.0.0.1:8765/r/$c; done
curl -s -L -X POST -d 'x=1' http://127.0.0.1:8765/r/301
```

<p class="status">سرور محلی در <code>labs/02-http-transaction/redirect-method</code>؛ curl 8.5.0 و Python 3.11.</p>

---
type: reserve
module: M3
minutes: 0
link: http
corner: کد وضعیت
---

# خروجی دمو: متد و بدنه بعد از redirect

| درخواست اول | کد | درخواست دوم |
| --- | --- | --- |
| `POST` با `x=1` | `301` یا `302` یا `303` | `GET` بدون بدنه |
| `POST` با `x=1` | `307` یا `308` | `POST` با `x=1` |
| `POST` با `--post301` | `301` | `POST` با `x=1` |
| `-X POST` و `-L` | `301` | `POST` [بدون بدنه]{.mark} |

- سطر آخر دام ابزار است نه پروتکل: `-X` متد را در همهٔ درخواست‌ها تحمیل می‌کند ولی curl بدنه را باز هم حذف می‌کند؛ سرور یک POST خالی می‌گیرد
- رفتار curl الزام پروتکل نیست؛ مرورگر همین کار را طبق استاندارد Fetch می‌کند

---
module: M3
minutes: 2
link: http
corner: کد وضعیت
---

# سناریوی واقعی: این 403 را چه کسی فرستاده؟

- پژوهشی در [۱۳۹۲](https://www.usenix.org/system/files/conference/foci13/foci13-aryan.pdf) نشان داد درخواست HTTP به سایت فیلترشده در ایران پاسخ `403` می‌گرفت با یک iframe به نشانی `10.10.34.34`
- تشخیص از روی فیلد `Host` در درخواست بی‌رمز بود، و [پاسخ سرور اصلی هرگز نمی‌رسید]{.mark}
- کد وضعیت امضا ندارد: در HTTP بی‌رمز هر جعبهٔ میانی می‌تواند به‌جای سرور پاسخ دهد؛ TLS همین را می‌بندد (جلسهٔ ۴)

::punch::

پاسخ بدون TLS فقط ادعا می‌کند از سرور آمده.

---
layout: section
type: section
module: M4
minutes: 0
link: http
---

# header و مذاکره

<p class="since">خط اول هر پیام را دیدیم: متد در درخواست، کد در پاسخ.</p>

<p class="question">بقیهٔ پیام چه می‌گوید، و کلاینت و سرور چطور سر شکل پاسخ توافق می‌کنند؟</p>

---
module: M4
minutes: 2
link: http
corner: header
---

# header: فراداده‌ای که ناشناخته‌اش نادیده گرفته می‌شود

| دسته در RFC 9110 | نمونه‌ها |
| --- | --- |
| زمینهٔ درخواست | `Host` و `User-Agent` و `Referer` و `Authorization` (جلسهٔ ۳) |
| زمینهٔ پاسخ | `Server` و `Location` و `Allow` و `Retry-After` |
| بازنمایی | `Content-Type` و `Content-Encoding` و `Content-Language` |
| محتوا | `Content-Length` |

قاعدهٔ [RFC 9110 §5.1](https://www.rfc-editor.org/rfc/rfc9110#section-5.1): proxy فیلد ناشناخته را دست‌نخورده رد می‌کند و بقیه آن را [نادیده می‌گیرند]{.mark}.

::punch::

قاعدهٔ «ناشناخته را نادیده بگیر» اجازه داد HTTP سی سال بدون شکستن رشد کند.

---
module: M4
minutes: 1
link: http
corner: header
---

# پیشوند X- چرا کنار گذاشته شد؟

- فیلد آزمایشی را با `X-` شروع می‌کردند؛ ولی وقتی استاندارد می‌شد، [نامش دیگر عوض نمی‌شد]{.mark}
- نمونه: `X-Forwarded-For` هنوز همه‌جا هست، با اینکه جانشین استانداردش، فیلد `Forwarded` در RFC 7239، سال‌هاست منتشر شده
- [RFC 6648](https://www.rfc-editor.org/rfc/rfc6648) در ۱۳۹۱ این رسم را منسوخ کرد؛ فیلد تازه را بدون پیشوند نام‌گذاری کنید، مثل `Idempotency-Key`

::punch::

موقت‌ها ماندگار می‌شوند؛ از روز اول نام درست بگذارید.

---
module: M4
minutes: 2
link: http
corner: مذاکره
---

# یک منبع، چند بازنمایی

<div class="cols">
<div>

- نشانی `/report` یک منبع است؛ HTML برای مرورگر، JSON برای برنامه، فارسی یا انگلیسی، فشرده یا نه، همه [بازنمایی]{.mark} همان منبع‌اند
- کلاینت ترجیحش را با `Accept-*` می‌گوید و سرور انتخاب می‌کند
- فیلد `Vary` به cache می‌گوید پاسخ به کدام فیلد درخواست بستگی داشت (جلسهٔ ۵)

</div>

```http
GET /report HTTP/1.1
Accept: application/json, text/html;q=0.5
Accept-Language: fa, en;q=0.8
Accept-Encoding: gzip, br, zstd

HTTP/1.1 200 OK
Content-Type: application/json
Content-Language: fa
Content-Encoding: br
Vary: Accept, Accept-Language,
      Accept-Encoding
```

</div>

::punch::

کلاینت فقط ترجیح می‌گوید؛ تصمیم با سرور است و در فیلدهای پاسخ اعلام می‌شود.

---
type: interactive
module: M4
minutes: 3
link: http
corner: مذاکره
---

# سناریوی واقعی: زبان سایت با `Accept-Language` یا با URL جدا؟

سایت دانشگاه دو نسخهٔ فارسی و انگلیسی دارد. نسخهٔ هر صفحه را چطور انتخاب کنیم؟

<ol class="options">
  <li><b>الف)</b> با <code>Accept-Language</code></li>
  <li v-mark.box.orange="1"><b>ب)</b> URL جدا: <code>/fa/</code> و <code>/en/</code></li>
  <li><b>ج)</b> با IP کاربر</li>
  <li><b>د)</b> با کوکی</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ب)</strong> <a href="https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites">راهنمای Google</a> URL جدا را توصیه می‌کند؛ خزنده‌اش <code>Accept-Language</code> نمی‌فرستد و نسخه‌های دیگر را نمی‌بیند. URL جدا را می‌شود به اشتراک گذاشت و cache کرد.</div>

::punch::

<div v-click="1">مذاکره برای چیزی است که کاربر نمی‌خواهد انتخاب کند (مثل فشرده‌سازی)، نه چیزی که می‌خواهد به اشتراک بگذارد.</div>

---
module: M4
minutes: 2
link: http
corner: مذاکره
---

# سناریوی واقعی: صفحهٔ سفید بعد از به‌روزرسانی Chrome

- در اسفند ۱۴۰۲، Chrome 123 به‌طور پیش‌فرض `zstd` را به `Accept-Encoding` اضافه کرد
- سرور متن‌باز kanidm پیش از آن هم zstd داشت، ولی پاسخ فشرده‌اش پنجره‌ای بزرگ‌تر از سقف ۸ مگابایتی Chrome می‌خواست؛ کاربران [صفحهٔ خالی]{.mark} می‌دیدند ([kanidm #2593](https://github.com/kanidm/kanidm/issues/2593))
- راه موقت: proxy جلوی سرور `zstd` را از `Accept-Encoding` حذف کرد

::punch::

در مذاکره، فهرست کلاینت زیر پای شما عوض می‌شود؛ فقط چیزی را پیشنهاد و ارسال کنید که واقعاً آزموده‌اید.

---
module: M4
minutes: 2
link: http
corner: مذاکره
---

# پیوند با هوش مصنوعی: `Accept: text/markdown`

- agentها HTML پر از منو و اسکریپت را نمی‌خواهند؛ متن تمیز با توکن کمتر می‌خواهند
- از بهمن ۱۴۰۴، [Cloudflare](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents) برای درخواستی که `Accept: text/markdown` دارد HTML را به markdown تبدیل می‌کند
- پاسخ: `Content-Type: text/markdown` و `Vary: Accept` و فیلد تعداد توکن `x-markdown-tokens`

::punch::

نوع تازه‌ای از کلاینت آمد و سازوکار تازه‌ای لازم نشد؛ مذاکرهٔ محتوای دههٔ ۱۹۹۰ کافی بود.

---
type: demo
module: M4
minutes: 4
link: http
corner: مذاکره
lab: 02-http-transaction/negotiation
status: executed
---

# مذاکره را ببینیم

<dl class="run">
  <dt>سؤال</dt><dd>یک URL با تغییر <code>Accept</code> و <code>Accept-Encoding</code> چند پاسخ متفاوت می‌دهد؟</dd>
  <dt>مشاهده</dt><dd>فیلدهای <code>Content-Type</code> و <code>Content-Encoding</code> و <code>Vary</code> و طول پاسخ</dd>
  <dt>تصمیم</dt><dd>هر جا پاسخ به فیلدی از درخواست وابسته است، <code>Vary</code> بفرست</dd>
</dl>

```sh
U=http://127.0.0.1:8768/report
curl -s -D - -o /dev/null -H 'Accept: text/markdown' $U
curl -s -D - -o /dev/null -H 'Accept: application/json' \
     -H 'Accept-Encoding: gzip' $U
```

<p class="status">سرور محلی در <code>labs/02-http-transaction/negotiation</code>.</p>

---
type: reserve
module: M4
minutes: 0
link: http
corner: مذاکره
---

# خروجی دمو: یک URL، چهار پاسخ

| درخواست | `Content-Type` | `Content-Encoding` | طول |
| --- | --- | --- | --- |
| `Accept: text/html` | `text/html; charset=utf-8` | — | ۳۴ بایت |
| `Accept: application/json` | `application/json` | — | ۳۲ بایت |
| `Accept: text/markdown` | `text/markdown; charset=utf-8` | — | ۲۵ بایت |
| همان JSON با `Accept-Encoding: gzip` | `application/json` | `gzip` | [۵۳ بایت]{.mark} |

- در هر چهار پاسخ: `Vary: Accept, Accept-Encoding`
- فشرده‌سازی برای بدنهٔ کوچک حجم را بیشتر کرد؛ سرورها معمولاً زیر یک آستانه فشرده نمی‌کنند

---
layout: section
type: section
module: M5
minutes: 0
link: http
---

# جمع‌بندی

<p class="since">پیام و متد و کد وضعیت و header را بررسی کردیم.</p>

<p class="question">حالا به سؤال اول جلسه، کد ۵۲۹، چه جواب کاملی می‌دهیم؟</p>

---
type: interactive
module: M5
minutes: 3
link: http
corner: جمع‌بندی
---

# حالا جواب کامل: با ۵۲۹ چه کنیم؟

agent شما برای تولید پاسخ یک `POST` به API مدل فرستاده و `529` گرفته است. بهترین رفتار؟

<ol class="options">
  <li><b>الف)</b> تکرار نکن؛ POST است</li>
  <li v-mark.box.orange="1"><b>ب)</b> با فاصلهٔ فزاینده تکرار کن</li>
  <li><b>ج)</b> فوراً ده بار تکرار کن</li>
  <li><b>د)</b> درخواست را اصلاح کن</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ب)</strong> کلاس 5xx یعنی شاید بعداً درست شود؛ اگر <code>Retry-After</code> آمد، همان را صبر کن. تولید پاسخ اثری در دنیا ندارد، پس تکرار این POST امن است؛ ولی تکرار ابزاری با اثر جانبی فقط با <code>idempotentHint</code> یا کلید idempotency.</div>

::punch::

<div v-click="1">برای هر تکرار سه سؤال: کلاس کد چه می‌گوید؟ عملیات idempotent است؟ سرور گفته کِی؟</div>

---
module: M5
minutes: 1
link: http
corner: جمع‌بندی
---

# چهار مدل ذهنی، چهار تصمیم

| مدل ذهنی | تصمیم مهندسی |
| --- | --- |
| معنا ثابت است و قالب انتقال عوض می‌شود | اتصال proxy به سرور با HTTP/2؛ تکیه نکردن به reason phrase |
| متد وعده‌ای به همهٔ ماشین‌های در راه است | کدام کار GET باشد؛ کلید idempotency برای POST |
| کلاینت کلاس کد را می‌فهمد، نه همهٔ کدها را | `308` برای API؛ `404` برای منبع خصوصی |
| یک منبع چند بازنمایی دارد | URL جدا برای زبان؛ `Vary` برای هر پاسخ وابسته به درخواست |

::punch::

جلسهٔ بعد: پروتکلی که هر درخواست را جدا می‌بیند، شما را چطور به یاد می‌آورد؟

---
type: exercise
module: M5
minutes: 4
link: http
corner: تمرین
---

# تمرین ۲: سروری که HTTP را خودش می‌خواند

<Exercise ex="02-mini-http-server" due="تا شب پیش از جلسهٔ ۳">
<dl class="run">
  <dt>چالش</dt><dd>یک سرور HTTP/1.1 فقط با socket بنویسید که پیام را خودش از بایت‌ها جدا کند: <code>Host</code> اجباری، <code>405</code> و <code>308</code>، و رد درخواستی که مرزش مبهم است. یک شمارندهٔ بازدید هم بسازید، بدون کوکی.</dd>
  <dt>پیش‌بینی</dt><dd>همین حالا روی کاغذ: درخواستی که هم <code>Content-Length</code> دارد و هم <code>Transfer-Encoding</code>، باید چه پاسخی بگیرد؟ چرا؟</dd>
  <dt>پل</dt><dd>شمارندهٔ بدون کوکی جایی اشتباه می‌شمارد؛ همان جا جلسهٔ ۳ شروع می‌شود.</dd>
</dl>
</Exercise>

---
src: ../ch1-syllabus.md
type: core
module: M5
minutes: 1
---

---
type: extra
module: M5
minutes: 0
link: http
corner: جمع‌بندی
---

# برای کنجکاوی بیشتر (۱ از ۲)

<ol class="curious">
  <li>چرا نام فیلد <code>Referer</code> غلط املایی دارد، و چرا هرگز درست نشد؟<span class="hint">در RFC 1945 دنبالش بگردید؛ الگوی «هرچه پرکاربردتر، عوض کردنش سخت‌تر» از جلسهٔ صفر.</span></li>
  <li>چرا HTTP/2 نام فیلدها را حتماً با حروف کوچک می‌خواهد، و سرور با نام بزرگ چه باید بکند؟<span class="hint">RFC 9113 بخش ۸.۲.</span></li>
  <li>چرا پاسخ <code>HEAD</code> می‌تواند <code>Content-Length</code> داشته باشد ولی بدنه نه، و این برای parser کلاینت چه دردسری دارد؟<span class="hint">قاعدهٔ اول RFC 9112 بخش ۶.۳.</span></li>
</ol>

---
type: extra
module: M5
minutes: 0
link: http
corner: جمع‌بندی
---

# برای کنجکاوی بیشتر (۲ از ۲)

<ol class="curious" start="4" style="counter-reset: q 3">
  <li>درخواست <code>OPTIONS *</code> دربارهٔ کدام منبع سؤال می‌کند؟<span class="hint">فرم asterisk در RFC 9112 بخش ۳.۲.۴.</span></li>
  <li>اگر کلاینت بدنهٔ ۲ گیگابایتی را بفرستد و سرور آن را نخواهد، چطور پیش از ارسال به او بگوید؟<span class="hint"><code>Expect: 100-continue</code> در RFC 9110 بخش ۱۰.۱.۱.</span></li>
  <li>کد <code>418</code> از کجا آمده، و چرا وقتی خواستند حذفش کنند، ماند؟<span class="hint">RFC 2324 و جنبش «Save 418»؛ ببینید RFC 9110 با آن چه کرد.</span></li>
</ol>

---
type: reserve
module: M5
minutes: 0
link: http
corner: منابع
---

# منابع

<ul class="src two">
  <li><a href="https://www.rfc-editor.org/rfc/rfc9110">RFC 9110: HTTP Semantics</a></li>
  <li><a href="https://www.rfc-editor.org/rfc/rfc9112">RFC 9112: HTTP/1.1</a> · <a href="https://www.rfc-editor.org/rfc/rfc9113">RFC 9113</a> · <a href="https://www.rfc-editor.org/rfc/rfc9114">RFC 9114</a></li>
  <li><a href="https://fetch.spec.whatwg.org/#http-redirect-fetch">WHATWG Fetch: HTTP-redirect fetch</a></li>
  <li><a href="https://www.rfc-editor.org/rfc/rfc7538">RFC 7538: 308</a> · <a href="https://www.rfc-editor.org/rfc/rfc6648">RFC 6648</a> · <a href="https://www.rfc-editor.org/rfc/rfc8058.html">RFC 8058</a></li>
  <li><a href="https://portswigger.net/research/http1-must-die">PortSwigger: HTTP/1.1 must die</a></li>
  <li><a href="https://signalvnoise.com/archives2/google_web_accelerator_hey_not_so_fast_an_alert_for_web_app_designers">Signal vs. Noise: Web Accelerator</a></li>
  <li><a href="https://stytch.com/docs/b2b/guides/magic-links/protected-eml">Stytch: email scanners</a> · <a href="https://support.google.com/a/answer/81126">Gmail sender guidelines</a></li>
  <li><a href="https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-idempotency-key-header-07">IETF: Idempotency-Key draft</a> · <a href="https://docs.stripe.com/api/idempotent_requests">Stripe</a></li>
  <li><a href="https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/">MCP: tool annotations</a></li>
  <li><a href="https://platform.claude.com/docs/en/api/errors">Claude API errors</a></li>
  <li><a href="https://docs.github.com/en/rest/using-the-rest-api/troubleshooting-the-rest-api">GitHub REST API: troubleshooting</a></li>
  <li><a href="https://developer.chrome.com/blog/removing-push">Chrome: removing Server Push</a></li>
  <li><a href="https://www.usenix.org/system/files/conference/foci13/foci13-aryan.pdf">Aryan et al., FOCI 2013</a></li>
  <li><a href="https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites">Google: multilingual sites</a></li>
  <li><a href="https://github.com/kanidm/kanidm/issues/2593">kanidm #2593: zstd</a></li>
  <li><a href="https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents">Cloudflare: Markdown for Agents</a></li>
</ul>
