---
theme: ../../theme
title: "جلسهٔ ۶: وقتی سرور باید اول حرف بزند"
exportFilename: 06-server-push
chapter: ch1
modules:
  M0: { slug: overview, title: نگاهی از دور }
  M1: { slug: polling, title: polling }
  M2: { slug: sse, title: SSE }
  M3: { slug: websocket, title: WebSocket }
  M4: { slug: scale, title: مقیاس و انتخاب }
  M5: { slug: wrap-up, title: جمع‌بندی }
---

<p class="course">مهندسی اینترنت، فصل ۱: پروتکل‌ها</p>

# وقتی سرور باید اول حرف بزند

<p class="lede">جلسهٔ ۶: polling و SSE و WebSocket؛ هر کدام چه می‌دهد و کجا می‌شکند؟</p>

<Chain :today="['http']" />

<p class="byline">محمد بصیرزاده<br>دانشگاه شهید چمران اهواز، دانشکدهٔ مهندسی، پاییز ۱۴۰۵</p>

---
type: interactive
module: M0
minutes: 3
link: http
corner: نگاهی از دور
---

# پاسخ مدل زبانی کلمه‌به‌کلمه می‌آید؛ با کدام سازوکار؟

در صفحهٔ گفتگو با یک مدل زبانی، متن پاسخ تکه‌تکه و پیش از کامل شدن روی صفحه می‌آید.

<ol class="options">
  <li><b>الف)</b> WebSocket</li>
  <li><b>ب)</b> polling تند</li>
  <li v-mark.box.orange="1"><b>ج)</b> پاسخی بی‌پایان</li>
  <li><b>د)</b> Server Push</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ج)</strong> API مدل‌ها با <code>stream: true</code> یک پاسخ HTTP معمولی می‌دهد که بدنه‌اش تمام نمی‌شود و رویدادها را یکی‌یکی می‌فرستد: server-sent events (<a href="https://platform.claude.com/docs/en/build-with-claude/streaming">Claude docs</a>). فقط سرور حرف می‌زند؛ WebSocket لازم نیست.</div>

::punch::

<div v-click="1">برای حرف زدن سرور لازم نیست HTTP را کنار بگذاریم؛ گاهی کافی است پاسخ را تمام نکنیم.</div>

---
module: M0
minutes: 2
link: http
corner: نگاهی از دور
---

# نگاهی از دور: چهار راه برای رساندن خبر

<Modes />

::punch::

هر سازوکار یک معامله است: جهت، سازگاری با واسطه‌ها، و هزینهٔ اتصالی که باز می‌ماند.

---
layout: section
type: section
module: M1
minutes: 0
link: http
---

# پرسیدنِ پیاپی: polling و long polling

<p class="since">در HTTP همیشه کلاینت شروع می‌کند؛ سرور فقط جواب می‌دهد.</p>

<p class="question">اگر خبر تازه در سرور است، کلاینت چطور باخبر شود؟</p>

---
module: M1
minutes: 2
link: http
corner: polling
---

# ساده‌ترین راه: هر چند ثانیه بپرس

<Modes :show="['poll']" />

- کلاینت هر چند ثانیه `GET /updates?since=42` می‌فرستد؛ بیشتر وقت‌ها جواب [«هیچ»]{.mark} است
- تأخیر هر خبر، به‌طور میانگین، نصف فاصلهٔ پرسیدن است
- هر پاسخ یک پاسخ HTTP کامل است: از هر proxy رد می‌شود و با `ETag` و `304` ارزان می‌شود (جلسهٔ ۵)

::punch::

polling ساده‌ترین راه است، و برای خبری که کم می‌آید اغلب کافی.

---
type: interactive
module: M1
minutes: 3
link: http
corner: polling
---

# هر پنج ثانیه بپرسیم؛ چند درصد پاسخ‌ها خالی است؟

سامانهٔ درس با polling به ده هزار کاربر خبر می‌دهد. برای هر کاربر، به‌طور میانگین هر ده دقیقه یک خبر هست.

<ol class="options">
  <li><b>الف)</b> ۱۰ درصد</li>
  <li><b>ب)</b> ۵۰ درصد</li>
  <li><b>ج)</b> ۹۰ درصد</li>
  <li v-mark.box.orange="1"><b>د)</b> بیش از ۹۹ درصد</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: د)</strong> ده دقیقه یعنی ۱۲۰ بار پرسیدن برای یک خبر: ۱۱۹ پاسخ خالی. سرور ۲۰۰۰ درخواست در ثانیه می‌گیرد تا در هر ثانیه حدود ۱۷ خبر برساند.</div>

::punch::

<div v-click="1">بهای سادگی polling، درخواست‌های خالی است.</div>

---
module: M1
minutes: 2
link: http
corner: polling
---

# پاسخ را نگه دار تا خبری باشد: long polling

<Modes :show="['long']" />

- سرور درخواست را [باز نگه می‌دارد]{.mark} تا خبری برسد یا مهلتش تمام شود؛ کلاینت بی‌درنگ درخواست بعدی را می‌فرستد
- تأخیر کم می‌شود و پاسخ خالی تقریباً حذف؛ ولی هر خبر هنوز یک درخواست و پاسخ کامل است، با همهٔ header‌ها
- کلاینت باید بگوید تا کجا را گرفته (`?since=42`) تا خبرِ میان دو درخواست گم نشود

::punch::

long polling همان درخواست و پاسخ است؛ فقط سرور پاسخ دادن را عقب می‌اندازد.

---
module: M1
minutes: 2
link: http
corner: polling
---

# وقتی «کلاینت» خودش یک سرور است: webhook

- اگر گیرندهٔ خبر یک سرور باشد، می‌شود نقش‌ها را برگرداند: فرستنده برای هر رویداد یک `POST` به نشانی‌ای می‌فرستد که گیرنده از پیش ثبت کرده است
- درگاه‌های پرداخت و سرویس‌هایی مثل GitHub همین کار را می‌کنند
- گیرنده سه چیز را باید بسنجد: [امضای پیام]{.mark}، چون هر کسی می‌تواند به آن نشانی POST بفرستد؛ تکرار، چون همان رویداد دو بار هم می‌رسد (کلید idempotency در جلسهٔ ۲)؛ و ترتیب

::punch::

push میان دو سرور یک درخواست HTTP معمولی است، در جهت برعکس.

---
layout: section
type: section
module: M2
minutes: 0
link: http
---

# پاسخی که تمام نمی‌شود: SSE

<p class="since">long polling پاسخ را نگه می‌دارد، ولی با هر خبر تمامش می‌کند.</p>

<p class="question">اگر پاسخ را اصلاً تمام نکنیم، چه به دست می‌آید و چه چیزهایی می‌شکند؟</p>

---
module: M2
minutes: 2
link: http
corner: SSE
---

# یک پاسخ HTTP که بسته نمی‌شود

<div class="cols">
<div>

- پاسخ با نوع `text/event-stream` شروع می‌شود و [بسته نمی‌شود]{.mark}؛ هر خبر چند خط متن است که با یک خط خالی تمام می‌شود ([HTML Standard](https://html.spec.whatwg.org/multipage/server-sent-events.html))
- فقط از سرور به کلاینت، و فقط متن
- همچنان HTTP است: کوکی و TLS و HTTP/2 سر جایشان‌اند

</div>

```http
GET /events HTTP/1.1
Accept: text/event-stream

HTTP/1.1 200 OK
Content-Type: text/event-stream

data: first

data: second
```

</div>

::punch::

SSE پروتکل تازه نیست؛ قالبی است برای بدنهٔ پاسخی که ادامه دارد.

---
module: M2
minutes: 2
link: http
corner: SSE
---

# هر event از چه ساخته شده؟

| خط | کار |
| --- | --- |
| `data:` | خودِ پیام |
| `event:` | نام نوع رویداد؛ کلاینت برای هر نام شنوندهٔ جدا می‌گذارد |
| `id:` | شناسهٔ این رویداد؛ برای [ادامه دادن بعد از قطعی]{.mark} |
| `retry:` | بعد از قطعی، چند میلی‌ثانیه صبر کن و دوباره وصل شو |
| خطی که با `:` شروع شود | توضیح؛ برای زنده نگه داشتن اتصال |

<p class="small">شرح فیلدها در <a href="https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events">MDN</a>.</p>

::punch::

قالب آن‌قدر ساده است که با `curl` خوانده و با `print` نوشته می‌شود.

---
type: interactive
module: M2
minutes: 3
link: http
corner: SSE
---

# اتصال ده ثانیه قطع شد و سه خبر جا ماند؛ چه می‌شود؟

مرورگر با `EventSource` به `/events` وصل بود و آخرین رویدادی که گرفت `id: 42` داشت.

<ol class="options">
  <li><b>الف)</b> از دست رفتند</li>
  <li v-mark.box.orange="1"><b>ب)</b> مرورگر جایش را می‌گوید</li>
  <li><b>ج)</b> سرور خودش می‌داند</li>
  <li><b>د)</b> صفحه دوباره بار می‌شود</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ب)</strong> <code>EventSource</code> خودش دوباره وصل می‌شود و در درخواست تازه <code>Last-Event-ID: 42</code> می‌فرستد. ولی فرستادن خبرهای ۴۳ به بعد کار سرور است: اگر تاریخچه نگه نداشته باشد، آن سه خبر رفته‌اند.</div>

::punch::

<div v-click="1">ادامه دادن از جای قطع‌شده یک قرارداد دوطرفه است، نه یک قابلیت رایگان.</div>

---
type: demo
module: M2
minutes: 6
link: http
corner: SSE
lab: 06-server-push
status: executed
---

# یک جریان SSE را با curl بخوانیم

<dl class="run">
  <dt>سؤال</dt><dd>پاسخ SSE در شبکه چه شکلی است؟ بعد از قطع شدن از کجا ادامه می‌دهد؟ و از پشت واسطه‌ای که پاسخ را کامل می‌خواهد چه می‌شود؟</dd>
  <dt>مشاهده</dt><dd>خط‌هایی که هر ثانیه می‌رسند؛ اثر <code>Last-Event-ID</code>؛ و همان جریان از پشت proxy جلسهٔ ۵</dd>
  <dt>تصمیم</dt><dd>در هر واسطهٔ مسیر، جلوی جمع کردن پاسخ را بگیر</dd>
</dl>

```sh
node server.mjs                                    # http://127.0.0.1:8801
curl -sN http://127.0.0.1:8801/events
curl -sN -H 'Last-Event-ID: 2' http://127.0.0.1:8801/events
ORIGIN_PORT=8801 node ../05-intermediaries/proxy.mjs    # then /events on :8790
```

<p class="status">کد در <code>labs/06-server-push</code>. گزینهٔ <code>-N</code> یعنی خروجی را جمع نکن و فوراً نشان بده.</p>

---
type: reserve
module: M2
minutes: 0
link: http
corner: SSE
---

# خروجی دمو: هر ثانیه یک event

<div class="cols">

```text
retry: 2000

id: 5
event: news
data: news 5 at 12:00:02

id: 6
event: news
data: news 6 at 12:00:03
```

<div>

- با `Last-Event-ID: 2` سرور اول خبرهای ۳ تا آخر را فرستاد و بعد ادامه داد
- از پشت proxy جلسهٔ ۵، در چهار ثانیه [هیچ بایتی نرسید]{.mark}: proxy منتظر پایان پاسخی است که پایان ندارد

</div>
</div>

---
module: M2
minutes: 2
link: http
corner: SSE
---

# SSE کجا می‌شکند؟

| کجا | چه می‌شود | راه |
| --- | --- | --- |
| واسطه‌ای که پاسخ را جمع می‌کند | خبرها دیر و با هم می‌رسند، یا هرگز | `X-Accel-Buffering: no` و `Cache-Control: no-store` |
| اتصال ساکت | واسطه اتصال بی‌کار را می‌بندد | هر چند ثانیه یک خط توضیح |
| HTTP/1.1 | مرورگر به هر دامنه فقط [شش اتصال]{.mark} می‌دهد؛ با شش تب، سایت قفل می‌شود | HTTP/2 |

<p class="small">راه دو سطر اول در <a href="https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http">مشخصات MCP</a> هم آمده است؛ سطر سوم در MDN.</p>

::punch::

SSE از واسطه‌ها رد می‌شود، به شرطی که واسطه منتظر پایان پاسخ نماند.

---
module: M2
minutes: 2
link: http
corner: SSE
---

# EventSource یا fetch؟

| | `EventSource` | `fetch` و خواندن جریان |
| --- | --- | --- |
| متد و header | فقط GET؛ بدون header دلخواه | هر متد و هر header |
| وصل شدن دوباره | خودکار، با `Last-Event-ID` | با خودتان |
| نمونه | اعلان‌ها و داشبورد | API مدل‌ها: `POST` با بدنهٔ JSON و `Authorization` |

- قالب `text/event-stream` یک چیز است و رابط `EventSource` مرورگر چیزی دیگر؛ [همان جریان را هر کلاینت HTTP می‌خواند]{.mark}

::punch::

قالب را از رابط جدا کنید: `EventSource` فقط یکی از خواننده‌های این قالب است.

---
module: M2
minutes: 2
link: http
corner: هوش مصنوعی
---

# پیوند با هوش مصنوعی: استریم token

```text
event: content_block_delta
data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"Hello"}}

event: message_stop
data: {"type":"message_stop"}
```

- هر تکهٔ متن یک event است و کلاینت تکه‌ها را به هم می‌چسباند ([Claude docs](https://platform.claude.com/docs/en/build-with-claude/streaming))؛ رویداد `ping` هم برای زنده نگه داشتن اتصال هست
- کل پاسخ همان‌قدر طول می‌کشد، ولی کاربر [اولین کلمه]{.mark} را خیلی زودتر می‌بیند

::punch::

استریم پاسخ را سریع‌تر نمی‌کند؛ انتظار را قابل‌تحمل می‌کند.

---
layout: section
type: section
module: M3
minutes: 0
link: http
---

# دوطرفه، و بیرون از HTTP: WebSocket

<p class="since">SSE یک‌طرفه است، و هر پیام کلاینت یک درخواست HTTP جداست.</p>

<p class="question">اگر هر دو طرف بخواهند هر لحظه حرف بزنند، چطور از HTTP بیرون برویم بی‌آنکه واسطه‌ها را بشکنیم؟</p>

---
module: M3
minutes: 2
link: http
corner: WebSocket
---

# درخواستی که می‌گوید «پروتکل را عوض کنیم»

<HttpMsg :lines="[
  { t: 'GET /chat HTTP/1.1', l: 'درخواست HTTP', c: 2 },
  { t: 'Upgrade: websocket', l: 'پروتکل تازه', c: 4 },
  { t: 'Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==', l: 'عدد تصادفی', c: 4 },
]" />

<HttpMsg :lines="[
  { t: 'HTTP/1.1 101 Switching Protocols', l: 'پذیرفتم', c: 3 },
  { t: 'Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=', l: 'هشِ همان عدد', c: 4 },
]" />

- بعد از `101` بایت‌های این اتصال [دیگر HTTP نیستند]{.mark} ([RFC 6455](https://www.rfc-editor.org/rfc/rfc6455))؛ ولی پورت و سرور و گواهی همان است

::punch::

WebSocket با HTTP وارد می‌شود و بعد اتصال را برای خودش برمی‌دارد.

---
type: interactive
module: M3
minutes: 3
link: http
corner: WebSocket
---

# فیلد Sec-WebSocket-Key برای چیست؟

کلاینت یک عدد تصادفی می‌فرستد و سرور هشِ آن را، همراه یک رشتهٔ ثابت که در RFC نوشته شده، برمی‌گرداند.

<ol class="options">
  <li><b>الف)</b> رمز کردن پیام‌ها</li>
  <li><b>ب)</b> شناختن کاربر</li>
  <li v-mark.box.orange="1"><b>ج)</b> اثبات فهمیدن WebSocket</li>
  <li><b>د)</b> دفاع از CSRF</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ج)</strong> فقط سروری که WebSocket را واقعاً پیاده کرده این پاسخ را درست می‌سازد؛ یک سرور HTTP معمولی، یا پاسخی که از cache آمده، نه. رازی در کار نیست: کلید و پاسخ هر دو آشکار می‌روند.</div>

::punch::

<div v-click="1">این فیلد امنیتی نیست؛ فقط جلوی اشتباه گرفتن دو پروتکل را می‌گیرد.</div>

---
module: M3
minutes: 2
link: http
corner: WebSocket
---

# بعد از handshake، روی اتصال چه می‌رود؟

<div class="anatomy">
  <span class="seg" style="--c: var(--seg-2)"><span>&nbsp;&nbsp;81&nbsp;&nbsp;</span><span class="lbl" dir="rtl">متن</span></span>
  <span class="seg" style="--c: var(--seg-4)"><span>&nbsp;&nbsp;&nbsp;&nbsp;85&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="lbl" dir="rtl">با mask، طول ۵</span></span>
  <span class="seg" style="--c: var(--seg-3)"><span>&nbsp;37 fa 21 3d&nbsp;</span><span class="lbl" dir="rtl">کلید mask</span></span>
  <span class="seg" style="--c: var(--seg-5)"><span>&nbsp;7f 9f 4d 51 58&nbsp;</span><span class="lbl" dir="rtl">متنِ mask‌شده: Hello</span></span>
</div>

- هر پیام یک یا چند frame است. سربار هر frame از [دو بایت]{.mark} شروع می‌شود؛ در برابر صدها بایت header در هر درخواست HTTP
- نوع frame در بایت اول است: متن، باینری، بستن اتصال، و ping و pong برای سنجیدن زنده بودن

::punch::

اینجا نه درخواستی هست و نه پاسخی؛ فقط پیام، از هر طرف، هر وقت.

---
module: M3
minutes: 2
link: http
corner: WebSocket
---

# سناریوی واقعی: چرا کلاینت باید بایت‌هایش را mask کند؟

- بعضی proxyهای «شفاف» `Upgrade` را نمی‌فهمیدند و بایت‌های بعد از آن را هم HTTP می‌خواندند
- پژوهشی در [۱۳۹۰](https://www.ieee-security.org/TC/W2SP/2011/papers/websocket.pdf) نشان داد صفحهٔ مهاجم می‌تواند بایت‌هایی بفرستد که برای چنین proxyای شبیه HTTP باشد، و [cache آن را برای همه آلوده کند]{.mark} (جلسهٔ ۵)
- راه RFC: مرورگر هر frame را با یک کلید تصادفی تازه XOR می‌کند؛ اسکریپت صفحه دیگر نمی‌تواند بایت‌های فرستاده‌شده را انتخاب کند

::punch::

masking رمزنگاری نیست، چون کلیدش در همان frame است؛ برای گیج نشدن واسطه‌هاست.

---
type: demo
module: M3
minutes: 6
link: http
corner: WebSocket
lab: 06-server-push
status: executed
---

# handshake و frame را با دست بسازیم

<dl class="run">
  <dt>سؤال</dt><dd>مقدار <code>Sec-WebSocket-Accept</code> از کجا می‌آید، و بعد از <code>101</code> چه بایت‌هایی رد و بدل می‌شود؟</dd>
  <dt>مشاهده</dt><dd>خروجی <code>openssl</code> برای کلید نمونهٔ RFC؛ و بایت‌های frame کلاینت و سرور</dd>
  <dt>تصمیم</dt><dd>در عمل کتابخانه به کار ببر؛ ولی بایت‌ها را بشناس تا عیب‌یابی بتوانی</dd>
</dl>

```sh
printf '%s' 'dGhlIHNhbXBsZSBub25jZQ==258EAFA5-E914-47DA-95CA-C5AB0DC85B11' \
  | openssl sha1 -binary | base64
node server.mjs
MASK=37fa213d node wsclient.mjs Hello
```

<p class="status">سرور و کلاینت در <code>labs/06-server-push</code> بدون هیچ کتابخانهٔ WebSocket نوشته شده‌اند.</p>

---
type: reserve
module: M3
minutes: 0
link: http
corner: WebSocket
---

# خروجی دمو: بایت‌های یک گفتگوی WebSocket

```text
s3pPLMBiTxaQ9kYGzzhZRbK+xOo=                      (openssl, RFC sample key)

< HTTP/1.1 101 Switching Protocols
> frame  81 85 37 fa 21 3d 7f 9f 4d 51 58          (masked "Hello")
< frame  81 05 48 65 6c 6c 6f                      ("Hello")
< frame  81 0b 65 63 68 6f 3a 20 48 65 6c 6c 6f    ("echo: Hello")
> frame  88 80 00 00 00 00                         (close)
```

- frame سرور mask ندارد: بایت دومش `05` است، نه `85`، و متنش [آشکار]{.mark} خوانده می‌شود
- همان بایت‌هایی که در مثال RFC 6455 آمده است

---
module: M3
minutes: 2
link: http
corner: WebSocket
---

# SOP اینجا نیست: چه کسی به WebSocket شما وصل می‌شود؟

- مرورگر handshake را از هر صفحه‌ای می‌فرستد و [کوکی را هم همراهش]{.mark}؛ نه SOP جلویش را می‌گیرد و نه preflight در کار است (جلسهٔ ۳)
- صفحهٔ مهاجم با نشست قربانی وصل می‌شود و، برخلاف CSRF، پاسخ‌ها را هم می‌خواند. نام این حمله [CSWSH](https://pentest-tools.com/blog/cross-site-websocket-hijacking-cswsh) است
- دفاع: سرور فیلد `Origin` را در handshake بسنجد، و اتصال همیشه `wss` باشد

::punch::

در WebSocket مرز origin را مرورگر نمی‌کشد؛ سرور شما باید بکشد.

---
module: M3
minutes: 2
link: http
corner: WebSocket
---

# WebSocket روی HTTP/2 و HTTP/3 چه می‌شود؟

- فیلد `Upgrade` فقط در HTTP/1.1 هست. در HTTP/2 [یک جریان]{.mark} با متد `CONNECT` به WebSocket تبدیل می‌شود ([RFC 8441](https://www.rfc-editor.org/rfc/rfc8441)) و بقیهٔ جریان‌ها HTTP می‌مانند؛ در HTTP/3 هم همین ([RFC 9220](https://www.rfc-editor.org/rfc/rfc9220))
- [WebTransport](https://webrtc.ventures/2026/04/webtransport-is-now-baseline-what-it-means-for-real-time-media/) طراحی تازه‌ای روی HTTP/3 است: چند جریان مستقل، و پیام بی‌تضمین برای صدا و بازی؛ از حدود نوروز ۱۴۰۵ در همهٔ مرورگرهای اصلی

::punch::

«با HTTP شروع می‌شود و ارتقا می‌یابد» فقط دربارهٔ HTTP/1.1 درست است.

---
layout: section
type: section
module: M4
minutes: 0
link: http
---

# مقیاس و انتخاب

<p class="since">سه سازوکار داریم که اتصال را باز نگه می‌دارند.</p>

<p class="question">اتصالی که ساعت‌ها باز می‌ماند در یک سیستم واقعی چه خرجی دارد، و کدام سازوکار را کِی انتخاب کنیم؟</p>

---
module: M4
minutes: 2
link: http
corner: مقیاس
---

# اتصال باز، پشت load balancer

| مشکل | چرا | راه |
| --- | --- | --- |
| پیام برای کاربری که به سرور دیگری وصل است | اتصال در حافظهٔ [یک سرور]{.mark} است | کانال مشترک میان سرورها (pub/sub) |
| به‌روزرسانی سرور | همهٔ اتصال‌ها با هم می‌افتند | بستن تدریجی؛ کلاینتی که دوباره وصل می‌شود |
| سکوت طولانی | واسطه اتصال بی‌کار را می‌بندد | ping و pong، یا خط توضیح |
| هزاران اتصال بی‌کار | هر اتصال حافظه می‌گیرد | سرور بی‌انسداد (فصل بعد) |

::punch::

اتصال باز یعنی state در یک سرور مشخص؛ همان چیزی که HTTP بی‌حالت از آن دوری می‌کرد.

---
module: M4
minutes: 2
link: http
corner: مقیاس
---

# وقتی همه با هم برمی‌گردند

- سرور یک لحظه می‌افتد؛ صد هزار کلاینت [هم‌زمان]{.mark} دوباره وصل می‌شوند و سرورِ تازه‌بلندشده را دوباره می‌اندازند
- راه: بعد از هر ناکامی فاصله را بیشتر کن (backoff) و به آن [مقداری تصادفی]{.mark} بیفزا (jitter) تا کلاینت‌ها از هم پخش شوند ([AWS](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/))
- در SSE سرور با خط `retry:` می‌تواند این فاصله را خودش تعیین کند

::punch::

کلاینتی که بی‌فاصله دوباره وصل می‌شود، در بدترین لحظه به سرور فشار می‌آورد.

---
type: interactive
module: M4
minutes: 3
link: http
corner: مقیاس
---

# کلاینتِ کُند: پیام‌های نخوانده کجا می‌مانند؟

سرور روی WebSocket صد پیام در ثانیه می‌فرستد؛ گوشی کاربر، روی شبکهٔ ضعیف، فقط ده تا در ثانیه می‌گیرد.

<ol class="options">
  <li><b>الف)</b> دور ریخته می‌شوند</li>
  <li v-mark.box.orange="1"><b>ب)</b> در حافظهٔ سرور</li>
  <li><b>ج)</b> در مرورگر</li>
  <li><b>د)</b> در proxy</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ب)</strong> TCP به فرستنده می‌گوید صبر کن؛ پیام‌هایی که برنامه باز هم می‌نویسد در صف همان اتصال در حافظهٔ سرور می‌مانند. سیاست لازم است: دور ریختن پیام کهنه، خلاصه کردن، یا بستن اتصال.</div>

::punch::

<div v-click="1">اتصال باز یعنی صف باز؛ برای کلاینت کُند از پیش تصمیم بگیرید.</div>

---
module: M4
minutes: 2
link: http
corner: هوش مصنوعی
---

# پیوند با هوش مصنوعی: MCP سه بار راهش را عوض کرد

| نسخه | راه رساندن پیام | چرا عوض شد |
| --- | --- | --- |
| آبان ۱۴۰۳ | یک جریان SSE همیشه‌باز، و `POST` برای پیام‌های کلاینت | اتصال همیشه‌باز با سرور بی‌حالت جور نبود |
| فروردین ۱۴۰۴ | یک نشانی؛ پاسخ هر `POST` یا JSON یا SSE؛ session اختیاری | session یعنی مسیریابی چسبنده و حافظهٔ مشترک |
| مرداد ۱۴۰۵ | هر درخواست یک `POST` مستقل؛ session و جریان GET [حذف شد]{.mark} | هر درخواست به هر سرور برسد |

<p class="small">منبع: <a href="https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http">مشخصات Streamable HTTP</a> و <a href="https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/">یادداشت انتشار</a>.</p>

::punch::

پروتکلی که با اتصال همیشه‌باز شروع کرد، قدم‌به‌قدم به درخواست و پاسخ برگشت.

---
module: M4
minutes: 2
link: http
corner: انتخاب
---

# هر خبر در شبکه چند بایت خرج دارد؟

| سازوکار | هزینهٔ یک‌باره | هر خبر | هر بار «خبری نیست» |
| --- | --- | --- | --- |
| polling | — | ۳۱۶ بایت | ۲۸۱ بایت |
| SSE | ۲۹۵ بایت | ۴۴ بایت | صفر |
| WebSocket | حدود ۳۰۰ بایت | [۲۱ بایت]{.mark} | صفر |

- اندازه‌گیری با سرور دموی همین جلسه و HTTP/1.1؛ در HTTP/2 فشرده شدن header فاصله را کمتر می‌کند
- یک خبر ۱۹ بایتی: در polling شانزده برابر خودش سربار دارد

::punch::

بایت کمتر، به قیمت اتصال باز؛ این معامله برای خبرِ پرتکرار می‌ارزد.

---
module: M4
minutes: 2
link: http
corner: انتخاب
---

# تصمیم: کدام را کِی؟

| نیاز | انتخاب |
| --- | --- |
| خبر کم‌تکرار، یا پاسخی که می‌شود نگهش داشت | polling با `ETag` |
| جریان یک‌طرفه از سرور: اعلان، لاگ، token مدل | [SSE]{.mark} |
| گفتگوی دوطرفه با تأخیر کم: چت، ویرایش هم‌زمان، بازی | WebSocket |
| صدا و تصویر زنده | WebRTC یا WebTransport |
| حسگر و دستگاه کم‌توان | [MQTT](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html): انتشار و اشتراک از راه یک واسطه؛ استاندارد OASIS |

::punch::

ساده‌ترین سازوکاری را بردارید که نیاز را برآورده می‌کند.

---
type: interactive
module: M4
minutes: 3
link: http
corner: انتخاب
---

# کدام‌یک واقعاً WebSocket می‌خواهد؟

۱) خبر دادن نمرهٔ تازه در سامانهٔ درس  ۲) ویرایش هم‌زمان یک سند توسط چند نفر  ۳) نمایش پاسخ مدل زبانی هنگام تولید

<ol class="options">
  <li><b>الف)</b> هر سه</li>
  <li v-mark.box.orange="1"><b>ب)</b> فقط ۲</li>
  <li><b>ج)</b> ۲ و ۳</li>
  <li><b>د)</b> هیچ‌کدام</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ب)</strong> فقط در ویرایش هم‌زمان، هر دو طرف پیاپی و با تأخیر کم پیام می‌فرستند. خبر نمره یک‌طرفه و کم‌تکرار است: SSE، یا حتی polling. پاسخ مدل هم یک‌طرفه است و درخواستش یک <code>POST</code> معمولی.</div>

::punch::

<div v-click="1">«بلادرنگ» یعنی WebSocket نیست؛ اول بپرسید چه کسی، چند وقت یک‌بار، حرف می‌زند.</div>

---
layout: section
type: section
module: M5
minutes: 0
link: http
---

# جمع‌بندی

<p class="since">polling و SSE و WebSocket، و هزینهٔ اتصال باز را بررسی کردیم.</p>

<p class="question">پاسخ مدل زبانی وسط راه خطا خورد؛ کلاینت از کجا بفهمد؟</p>

---
type: interactive
module: M5
minutes: 3
link: http
corner: جمع‌بندی
---

# پاسخ وسط جریان خطا خورد؛ کلاینت چه کد وضعیتی می‌بیند؟

agent شما با `stream: true` درخواست فرستاده و نیمی از پاسخ را گرفته است. همان لحظه سرور مدل از کار می‌افتد.

<ol class="options">
  <li><b>الف)</b> <code>500</code></li>
  <li><b>ب)</b> <code>529</code></li>
  <li v-mark.box.orange="1"><b>ج)</b> <code>200</code></li>
  <li><b>د)</b> <code>408</code></li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ج)</strong> خط وضعیت پیش از اولین تکه فرستاده شده و دیگر عوض‌شدنی نیست. خطا به‌صورت یک رویداد درون همان جریان می‌آید: <code>event: error</code> (<a href="https://platform.claude.com/docs/en/build-with-claude/streaming">Claude docs</a>). کلاینتی که فقط کد وضعیت را ببیند، پاسخ نیمه‌کاره را کامل حساب می‌کند.</div>

::punch::

<div v-click="1">در پاسخ جریانی، موفقیت را پایان جریان می‌گوید، نه خط اول آن.</div>

---
module: M5
minutes: 1
link: http
corner: جمع‌بندی
---

# چهار مدل ذهنی، چهار تصمیم

| مدل ذهنی | تصمیم مهندسی |
| --- | --- |
| SSE پاسخی است که تمام نمی‌شود | برای جریان یک‌طرفه SSE؛ جلوی buffering را بگیر |
| ادامه دادن بعد از قطعی یک قرارداد است | `id` برای هر رویداد؛ backoff با jitter |
| WebSocket بعد از `101` دیگر HTTP نیست | بررسی `Origin` در handshake؛ همیشه `wss` |
| اتصال باز یعنی state و صف در یک سرور | pub/sub میان سرورها؛ سیاست برای کلاینت کُند |

::punch::

جلسهٔ بعد: اگر آن سوی اتصال انسان نباشد و یک agent باشد، چه چیزی عوض می‌شود؟

---
type: exercise
module: M5
minutes: 4
link: http
corner: تمرین
---

# تمرین ۶: سه راه برای خبر گرفتن

<Exercise ex="06-three-ways" due="تا شب پیش از جلسهٔ ۷">
<dl class="run">
  <dt>چالش</dt><dd>یک خوراک خبر را با سه سازوکار برسانید: اول polling، بعد SSE با ادامه از جای قطع‌شده، و آخر WebSocket. برای هر کدام تأخیر و بایتِ هر خبر را اندازه بگیرید.</dd>
  <dt>پیش‌بینی</dt><dd>همین حالا روی کاغذ: از پشت proxy تمرین ۵، که پاسخ را کامل می‌گیرد و بعد می‌فرستد، کدام‌یک از این سه کار می‌کند؟ چرا؟</dd>
  <dt>پل</dt><dd>کلاینتی که بعد از هر قطعی خودکار دوباره وصل می‌شود، دیگر مثل انسان رفتار نمی‌کند. جلسهٔ ۷ دربارهٔ همین کلاینت‌هاست.</dd>
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
  <li>ping و pong در WebSocket را چه کسی می‌فرستد، و چرا رابط مرورگر به آن دسترسی نمی‌دهد؟<span class="hint">RFC 6455 بخش ۵.۵؛ در DevTools زبانهٔ Messages را ببینید.</span></li>
  <li>فشرده‌سازی پیام‌های WebSocket چه خویشاوندی‌ای با حملهٔ CRIME در جلسهٔ ۴ دارد؟<span class="hint">افزونهٔ permessage-deflate در RFC 7692، بخش ملاحظات امنیتی.</span></li>
  <li>MQTT روی WebSocket یعنی چه، و چرا مرورگر MQTT را مستقیم حرف نمی‌زند؟<span class="hint">بخش ۶ مشخصات MQTT 5.0؛ مرورگر به TCP خام دسترسی ندارد.</span></li>
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
  <li>درخواست <code>subscriptions/listen</code> در MCP چه شباهتی به SSE دارد و چه فرقی؟<span class="hint">صفحهٔ Streamable HTTP در مشخصات ۲۰۲۶؛ ببینید چرا ادامه با <code>Last-Event-ID</code> را برداشتند.</span></li>
  <li>رابط صوتی مدل‌های زبانی در مرورگر چرا WebRTC را به WebSocket ترجیح می‌دهد؟<span class="hint">صف TCP در جلسهٔ ۴؛ برای صدا، بستهٔ دیررسیده از بستهٔ گم‌شده بدتر است.</span></li>
  <li>اگر سرور SSE شما پشت nginx باشد، کدام تنظیم‌ها را باید عوض کنید؟<span class="hint"><code>proxy_buffering</code> و <code>proxy_read_timeout</code>؛ و همان <code>X-Accel-Buffering</code>.</span></li>
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
  <li><a href="https://html.spec.whatwg.org/multipage/server-sent-events.html">HTML Standard: Server-sent events</a></li>
  <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events">MDN: Using server-sent events</a></li>
  <li><a href="https://www.rfc-editor.org/rfc/rfc6455">RFC 6455: WebSocket</a> · <a href="https://www.rfc-editor.org/rfc/rfc8441">RFC 8441</a> · <a href="https://www.rfc-editor.org/rfc/rfc9220">RFC 9220</a></li>
  <li><a href="https://platform.claude.com/docs/en/build-with-claude/streaming">Claude: streaming messages</a></li>
  <li><a href="https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http">MCP: Streamable HTTP</a></li>
  <li><a href="https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/">MCP blog: 2026-07-28 revision</a></li>
  <li><a href="https://www.ieee-security.org/TC/W2SP/2011/papers/websocket.pdf">Huang et al.: Talking to Yourself for Fun and Profit</a></li>
  <li><a href="https://pentest-tools.com/blog/cross-site-websocket-hijacking-cswsh">Pentest-Tools: CSWSH</a></li>
  <li><a href="https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/">AWS: exponential backoff and jitter</a></li>
  <li><a href="https://webrtc.ventures/2026/04/webtransport-is-now-baseline-what-it-means-for-real-time-media/">WebTransport is now Baseline</a></li>
  <li><a href="https://developers.openai.com/api/docs/guides/realtime-conversations">OpenAI: Realtime conversations</a></li>
  <li><a href="https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html">OASIS: MQTT 5.0</a></li>
</ul>
