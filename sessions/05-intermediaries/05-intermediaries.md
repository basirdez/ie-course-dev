---
theme: ../../theme
title: "جلسهٔ ۵: واسطه‌ها"
exportFilename: 05-intermediaries
chapter: ch1
modules:
  M0: { slug: overview, title: نگاهی از دور }
  M1: { slug: freshness, title: تازگی }
  M2: { slug: cache-key, title: کلید cache }
  M3: { slug: proxy, title: proxy و اعتماد }
  M4: { slug: cdn, title: CDN }
  M5: { slug: wrap-up, title: جمع‌بندی }
---

<p class="course">مهندسی اینترنت، فصل ۱: پروتکل‌ها</p>

# واسطه‌ها: cache و proxy و CDN

<p class="lede">جلسهٔ ۵: چه کسی بین شما و سرور نشسته، و چه چیزی را می‌بیند؟</p>

<Chain :today="['tls', 'http']" />

<p class="byline">محمد بصیرزاده<br>دانشگاه شهید چمران اهواز، دانشکدهٔ مهندسی، پاییز ۱۴۰۵</p>

---
type: interactive
module: M0
minutes: 3
link: http
corner: نگاهی از دور
---

# سناریوی واقعی: صفحهٔ حساب یک غریبه را می‌بینید؛ چرا؟

۴ دی ۱۳۹۴، فروشگاه بازی Steam: هزاران کاربر به‌جای صفحهٔ حساب خودشان، صفحهٔ کاربر دیگری را دیدند؛ با نشانی و سابقهٔ خرید او.

<ol class="options">
  <li><b>الف)</b> پایگاه‌داده هک شد</li>
  <li><b>ب)</b> کوکی‌ها جابه‌جا شد</li>
  <li v-mark.box.orange="1"><b>ج)</b> یک cache میان راه</li>
  <li><b>د)</b> DNS دستکاری شد</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ج)</strong> در میانهٔ یک حمله، شریک cache شرکت پیکربندی‌ای گذاشت که صفحهٔ کاربرانِ واردشده را هم نگه می‌داشت؛ صفحه‌ای که برای یک نفر ساخته شده بود به نفر بعدی رسید. حدود ۳۴ هزار کاربر (<a href="https://store.steampowered.com/oldnews/19852">بیانیهٔ Valve</a>).</div>

::punch::

<div v-click="1">گاهی پاسخ را سرور شما نمی‌دهد، و برای شما هم ساخته نشده است.</div>

---
module: M0
minutes: 2
link: http
corner: نگاهی از دور
---

# نگاهی از دور: میان مرورگر و سرور چه کسانی نشسته‌اند؟

<Path />

- هر واسطه برای طرف پیش از خودش سرور است و برای طرف بعدی کلاینت؛ [هر دو پیام از دستش رد می‌شود]{.mark}
- امروز: نگه‌داشتن پاسخ (بخش ۱ و ۲)، نمایندگی و اعتماد (بخش ۳)، و لبهٔ شبکه (بخش ۴)

::punch::

هر واسطه سه کار می‌تواند بکند: ببیند، نگه دارد، عوض کند.

---
layout: section
type: section
module: M1
minutes: 0
link: http
---

# تازگی: کِی درخواست نفرستیم؟

<p class="since">در جلسهٔ ۴ دیدیم هر رفت‌وبرگشت گران است.</p>

<p class="question">چه وقت می‌شود اصلاً درخواست نفرستاد، و این را چه کسی تعیین می‌کند؟</p>

---
module: M1
minutes: 2
link: http
corner: cache
---

# سریع‌ترین درخواست کدام است؟

- [cache](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching) پاسخ را نگه می‌دارد تا درخواست بعدی به سرور نرسد؛ [درخواستی که فرستاده نشود]{.mark} رفت‌وبرگشت ندارد
- cache خصوصی درون مرورگر است، برای یک کاربر؛ cache مشترک در proxy یا CDN است، برای همهٔ کاربرانی که از آن رد می‌شوند
- معمولاً فقط پاسخ GET نگه داشته می‌شود (جلسهٔ ۲)؛ قاعده‌ها در [RFC 9111](https://www.rfc-editor.org/rfc/rfc9111)

::punch::

cache یعنی جواب دیروز را امروز دادن؛ همهٔ بحث این است که کِی این کار درست است.

---
module: M1
minutes: 2
link: http
corner: cache
---

# پاسخ تا کِی تازه است؟

```http
HTTP/1.1 200 OK
Cache-Control: max-age=3600
Age: 120
```

- سرور عمر تازگی را می‌گوید: تا یک ساعت [بی‌پرسش]{.mark} از همین استفاده کن. `Age` یعنی این پاسخ ۱۲۰ ثانیه در یک cache بوده است
- `s-maxage` همان است، فقط برای cache مشترک
- اگر سرور چیزی نگوید، cache خودش حدس می‌زند؛ مثلاً ده درصدِ زمانی که از `Last-Modified` گذشته است

::punch::

اگر عمر پاسخ را شما تعیین نکنید، cache به‌جای شما تعیین می‌کند.

---
module: M1
minutes: 2
link: http
corner: cache
---

# هر directive به چه پرسشی جواب می‌دهد؟

| در `Cache-Control` | معنا |
| --- | --- |
| `max-age=N` و `s-maxage=N` | تا N ثانیه تازه است |
| `private` | فقط در مرورگر همان کاربر؛ نه در cache مشترک |
| `no-cache` | نگه دار، ولی [پیش از هر استفاده از سرور بپرس]{.mark} |
| `no-store` | هیچ‌جا نگه ندار |
| `immutable` | تا پایان عمرش، حتی با reload هم نپرس |

::punch::

`no-cache` یعنی «بپرس»، نه «نگه ندار»؛ «نگه ندار» یعنی `no-store`.

---
type: interactive
module: M1
minutes: 3
link: http
corner: cache
---

# صفحهٔ «حساب من» چه Cache-Control می‌خواهد؟

صفحه‌ای با موجودی و نشانی کاربر، در فروشگاهی که پشت یک CDN است.

<ol class="options">
  <li><b>الف)</b> <code>max-age=60</code></li>
  <li><b>ب)</b> <code>no-cache</code></li>
  <li v-mark.box.orange="1"><b>ج)</b> <code>no-store</code></li>
  <li><b>د)</b> هیچ؛ کوکی دارد</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ج)</strong> با <code>max-age=60</code> یک cache مشترک آن را به نفر بعد می‌دهد. <code>no-cache</code> فقط می‌گوید پیش از استفاده بپرس؛ پاسخ هنوز نگه داشته می‌شود. کوکی هم جلوی نگه‌داری را نمی‌گیرد، چون جزء کلید cache نیست (بخش ۲).</div>

::punch::

<div v-click="1">برای دادهٔ شخصی صریح بگویید؛ پیش‌فرض cache محافظه‌کار نیست.</div>

---
module: M1
minutes: 2
link: http
corner: cache
---

# چه چیزی را یک سال نگه داریم، و چه چیزی را هیچ؟

```http
GET /assets/app.3f9a1c.js    →   Cache-Control: max-age=31536000, immutable
GET /index.html              →   Cache-Control: no-cache
```

- نام فایل اثر انگشت محتوای آن است: محتوا عوض شود، نام عوض می‌شود. پس خودِ فایل را می‌شود [یک سال]{.mark} نگه داشت
- صفحهٔ HTML که نام فایل‌ها را می‌گوید، هر بار از سرور پرسیده می‌شود
- cache هزاران مرورگر را نمی‌شود پاک کرد؛ نشانی را می‌شود عوض کرد

::punch::

چیزی را که نمی‌توانید از cache دیگران پاک کنید، با نشانی تازه دور بزنید.

---
module: M1
minutes: 2
link: http
corner: cache
---

# سرور از کار افتاده؛ پاسخ کهنه بهتر از هیچ است؟

```http
Cache-Control: max-age=60, stale-while-revalidate=30, stale-if-error=86400
```

- `stale-while-revalidate`: پاسخ کهنه را فوراً بده و [در پس‌زمینه]{.mark} تازه‌اش کن؛ کاربر منتظر نمی‌ماند
- `stale-if-error`: اگر سرور خطا داد یا در دسترس نبود، تا یک روز همان پاسخ کهنه را بده ([RFC 5861](https://www.rfc-editor.org/rfc/rfc5861))
- برای صفحهٔ خبر خوب است؛ برای موجودی حساب نه

::punch::

تازگی و در دسترس بودن با هم معامله می‌شوند؛ نرخ این معامله را شما تعیین می‌کنید.

---
layout: section
type: section
module: M2
minutes: 0
link: http
---

# اعتبارسنجی و کلید cache

<p class="since">پاسخ تازه، بی‌پرسش از سرور استفاده می‌شود.</p>

<p class="question">وقتی پاسخ کهنه شد چه کنیم، و cache از کجا می‌داند دو درخواست «یکی» هستند؟</p>

---
module: M2
minutes: 2
link: http
corner: اعتبارسنجی
---

# پاسخ کهنه شد؛ همه را دوباره بگیریم؟

<HttpMsg :lines="[
  { t: 'GET /report HTTP/1.1', l: 'پرسش cache', c: 2 },
  { t: 'If-None-Match: &quot;r1&quot;', l: 'نسخه‌ای که دارم', c: 4 },
]" />

<HttpMsg :lines="[
  { t: 'HTTP/1.1 304 Not Modified', l: 'همان است', c: 3 },
  { t: 'Cache-Control: max-age=5', l: 'عمر تازه', c: 4 },
]" />

- `ETag` برچسب نسخهٔ پاسخ است. cache آن را پس می‌فرستد و اگر چیزی عوض نشده، سرور [`304` بی‌بدنه]{.mark} می‌دهد ([RFC 9110 §13](https://www.rfc-editor.org/rfc/rfc9110#section-13))

::punch::

اعتبارسنجی یک رفت‌وبرگشت خرج دارد، ولی بدنه را دوباره نمی‌فرستد.

---
type: demo
module: M2
minutes: 6
link: http
corner: اعتبارسنجی
lab: 05-intermediaries
status: executed
---

# cache را از بیرون ببینیم

<dl class="run">
  <dt>سؤال</dt><dd>درخواست دوم و سوم به سرور اصلی می‌رسند یا نه؟</dd>
  <dt>مشاهده</dt><dd>فیلدهای <code>Cache-Status</code> و <code>Age</code> در پاسخ، و لاگ سرور اصلی</dd>
  <dt>تصمیم</dt><dd>برای عیب‌یابی، اول ببین پاسخ از cache آمده یا از سرور</dd>
</dl>

```sh
node origin.mjs        # origin        http://127.0.0.1:8791
node proxy.mjs         # shared cache  http://127.0.0.1:8790
curl -si http://127.0.0.1:8790/report      # now, after 2 s, after 6 s
```

<p class="status">کد در <code>labs/05-intermediaries</code>. پاسخ <code>/report</code> پنج ثانیه تازه است و <code>ETag</code> دارد.</p>

---
type: reserve
module: M2
minutes: 0
link: http
corner: اعتبارسنجی
---

# خروجی دمو: یک نشانی، چهار سرنوشت

| کِی | `Cache-Status` در پاسخ | سرور اصلی چه دید |
| --- | --- | --- |
| بار اول | `fwd=uri-miss; stored` | `GET /report` |
| دو ثانیه بعد | `hit; ttl=3` با `Age: 2` | [هیچ]{.mark} |
| شش ثانیه بعد | `fwd=stale; fwd-status=304` | پرسش با `If-None-Match: "r1"`؛ جواب `304` |
| بعد از تغییر گزارش | `fwd=stale; stored` | همان پرسش؛ این بار `200` با `ETag: "r2"` |

- قالب `Cache-Status` استاندارد است ([RFC 9211](https://www.rfc-editor.org/rfc/rfc9211))؛ CDNهای واقعی هم چیزی شبیه آن می‌فرستند

---
module: M2
minutes: 2
link: http
corner: کلید cache
---

# cache از کجا می‌داند دو درخواست یکی‌اند؟

- کلید cache [متد و نشانی]{.mark} است؛ نه کوکی، نه `User-Agent`
- اگر پاسخ به فیلدی از درخواست بستگی دارد، سرور باید بگوید: `Vary: Accept-Language` آن فیلد را به کلید اضافه می‌کند (جلسهٔ ۲)
- یک استثنا در مشخصات: پاسخِ درخواستی که `Authorization` دارد، در cache مشترک نمی‌ماند، مگر با اجازهٔ صریح ([RFC 9111 §3.5](https://www.rfc-editor.org/rfc/rfc9111#section-3.5)). برای کوکی چنین قاعده‌ای نیست

::punch::

هر چه پاسخ را عوض کند و در کلید نباشد، باگی است که منتظر مانده.

---
type: interactive
module: M2
minutes: 3
link: http
corner: کلید cache
---

# دو کاربر، یک نشانی: نفر دوم چه می‌بیند؟

سارا و علی پشت یک cache مشترک‌اند. هر دو `GET /account` می‌فرستند، هر کدام با کوکی خودش. پاسخ سرور `Cache-Control: max-age=30` دارد.

<ol class="options">
  <li><b>الف)</b> صفحهٔ خودش</li>
  <li v-mark.box.orange="1"><b>ب)</b> صفحهٔ سارا</li>
  <li><b>ج)</b> خطای <code>403</code></li>
  <li><b>د)</b> صفحهٔ خالی</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ب)</strong> کلید فقط <code>GET /account</code> است و کوکی جزء آن نیست. پاسخ سارا نگه داشته می‌شود و تا ۳۰ ثانیه به هر که همان نشانی را بخواهد داده می‌شود. حادثهٔ Steam همین سازوکار بود.</div>

::punch::

<div v-click="1">کوکی هویت را به سرور می‌گوید، نه به cache.</div>

---
type: demo
module: M2
minutes: 5
link: http
corner: کلید cache
lab: 05-intermediaries
status: executed
---

# همان باگ، روی میز خودمان

<dl class="run">
  <dt>سؤال</dt><dd>علی صفحهٔ چه کسی را می‌گیرد، و یک کلمه در <code>Cache-Control</code> چه چیزی را عوض می‌کند؟</dd>
  <dt>مشاهده</dt><dd>بدنهٔ پاسخ و <code>Cache-Status</code> برای دو کاربر؛ یک بار بی‌اصلاح و یک بار با <code>FIX=1</code></dd>
  <dt>تصمیم</dt><dd>هر پاسخ شخصی <code>private</code> یا <code>no-store</code> بگیرد، حتی اگر CDN «نباید» آن را نگه دارد</dd>
</dl>

```sh
P=http://127.0.0.1:8790
curl -s -H 'Cookie: user=sara' $P/account
curl -s -H 'Cookie: user=ali'  $P/account
FIX=1 node origin.mjs          # restart the origin, then repeat
```

<p class="status">همان سرور و proxy دموی قبل؛ بدون <code>FIX</code> پاسخ فقط <code>max-age=30</code> دارد.</p>

---
type: reserve
module: M2
minutes: 0
link: http
corner: کلید cache
---

# خروجی دمو: علی صفحهٔ سارا را گرفت

```text
Cookie: user=sara   →  account page of sara     cache-status: lab; fwd=uri-miss; stored
Cookie: user=ali    →  account page of sara     cache-status: lab; hit; ttl=30

FIX=1  (Cache-Control: private, max-age=30)
Cookie: user=sara   →  account page of sara     cache-status: lab; fwd=uri-miss
Cookie: user=ali    →  account page of ali      cache-status: lab; fwd=uri-miss
```

- در حالت اول، سرور اصلی [فقط درخواست سارا را دید]{.mark}؛ درخواست علی اصلاً به او نرسید
- با `private`، مرورگر هر کاربر هنوز می‌تواند صفحهٔ خودش را ۳۰ ثانیه نگه دارد

---
module: M2
minutes: 2
link: http
corner: کلید cache
---

# سناریوی واقعی: نشانی‌ای که CDN را گول زد

- فروردین ۱۴۰۲، ChatGPT: یک نشانی، token نشست کاربر را برمی‌گرداند و نباید نگه داشته می‌شد
- مهاجم لینکی به قربانی می‌داد که همان نشانی بود، با پسوند `.css` در انتها. سرور پسوند را نادیده می‌گرفت و token را می‌داد؛ CDN از روی پسوند آن را [فایل ثابت]{.mark} حساب می‌کرد و نگه می‌داشت
- بعد مهاجم همان نشانی را باز می‌کرد و token قربانی را از cache می‌گرفت ([گزارش](https://securityaffairs.com/?p=144184))

::punch::

وقتی cache و سرور یک نشانی را دو جور بفهمند، مرز خصوصی و عمومی جابه‌جا می‌شود.

---
module: M2
minutes: 2
link: http
corner: کلید cache
---

# سناریوی واقعی: ورودی‌ای که در کلید نبود

- پژوهشی در [مرداد ۱۳۹۷](https://portswigger.net/research/practical-web-cache-poisoning): صفحهٔ اصلی Red Hat مقدار فیلد `X-Forwarded-Host` درخواست را در HTML پاسخ می‌نوشت
- این فیلد [جزء کلید cache نبود]{.mark}: مهاجم یک بار درخواست را با مقدار دلخواه می‌فرستاد، و پاسخ آلوده برای همهٔ بازدیدکنندگان بعدی نگه داشته می‌شد
- نام این حمله cache poisoning است

::punch::

cache خطای یک درخواست را به همهٔ کاربران می‌رساند.

---
layout: section
type: section
module: M3
minutes: 0
link: http
---

# proxy و مرز اعتماد

<p class="since">cache مشترک روی یک واسطه نشسته است.</p>

<p class="question">این واسطه به نمایندگی از چه کسی کار می‌کند، و سرور به حرف او دربارهٔ کاربر چقدر اعتماد کند؟</p>

---
module: M3
minutes: 2
link: http
corner: proxy
---

# forward proxy یا reverse proxy: نمایندهٔ چه کسی؟

| | forward proxy | reverse proxy |
| --- | --- | --- |
| نمایندهٔ | کلاینت | سرور |
| کلاینت از وجودش | خبر دارد؛ خودش تنظیمش کرده | خبر ندارد؛ آن را خودِ سرور می‌بیند |
| نمونه | proxy شبکهٔ سازمان | load balancer و CDN و درگاه API |
| با HTTPS | یک تونل با `CONNECT`؛ [محتوا را نمی‌بیند]{.mark} | TLS را خودش تمام می‌کند؛ [محتوا را می‌بیند]{.mark} |

<p class="small">تعریف‌ها در <a href="https://www.rfc-editor.org/rfc/rfc9110#section-3.7">RFC 9110 §3.7</a>.</p>

::punch::

پرسش اول دربارهٔ هر واسطه: به نمایندگی از چه کسی آنجاست؟

---
module: M3
minutes: 2
link: http
corner: proxy
---

# سرور پشت proxy نشانی کاربر را از کجا بداند؟

```http
GET /limited HTTP/1.1
X-Forwarded-For: 203.0.113.9, 10.0.0.5
Forwarded: for=203.0.113.9;proto=https
Via: 1.1 edge
```

- اتصال TCP سرور با proxy است، نه با کاربر؛ نشانی کاربر فقط در header می‌آید
- هر proxy نشانی طرف قبلی را [به انتهای فهرست]{.mark} می‌افزاید. فیلد استاندارد `Forwarded` است ([RFC 7239](https://www.rfc-editor.org/rfc/rfc7239))، ولی `X-Forwarded-For` همه‌جا مانده (جلسهٔ ۲)

::punch::

نشانی کاربر پشت proxy یک header است، و header را هر کسی می‌تواند بنویسد.

---
type: interactive
module: M3
minutes: 3
link: http
corner: proxy
---

# کدام نشانی را باور کنیم؟

سرور شما پشت یک proxy خودتان است و این را می‌بیند: `X-Forwarded-For: 1.2.3.4, 203.0.113.9`. برای محدودیت نرخ، نشانی کلاینت کدام است؟

<ol class="options">
  <li><b>الف)</b> <code>1.2.3.4</code></li>
  <li v-mark.box.orange="1"><b>ب)</b> <code>203.0.113.9</code></li>
  <li><b>ج)</b> هر دو</li>
  <li><b>د)</b> هیچ‌کدام</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ب)</strong> فقط مقداری معتبر است که proxy خودتان افزوده: آخرین مقدار. هر چه پیش از آن است از بیرون آمده، و کلاینت می‌تواند هر چه بخواهد در آن بنویسد (<a href="https://adam-p.ca/blog/2022/03/x-forwarded-for/">adam-p</a>).</div>

::punch::

<div v-click="1">از سمت راست بشمارید: به تعداد proxyهای خودتان، نه بیشتر.</div>

---
type: demo
module: M3
minutes: 5
link: http
corner: proxy
lab: 05-intermediaries
status: executed
---

# محدودیت نرخ را با یک header دور بزنیم

<dl class="run">
  <dt>سؤال</dt><dd>سروری که کلاینت را از اولین مقدار <code>X-Forwarded-For</code> می‌شناسد، چطور فریب می‌خورد؟</dd>
  <dt>مشاهده</dt><dd>پاسخ درخواست چهارم، و پاسخ همان درخواست با یک header ساختگی</dd>
  <dt>تصمیم</dt><dd>فقط مقداری را بخوان که proxy خودت افزوده است</dd>
</dl>

```sh
P=http://127.0.0.1:8790/limited
for i in 1 2 3 4; do curl -s $P; done
curl -s -H 'X-Forwarded-For: 1.2.3.4' $P
```

<p class="status">همان سرور و proxy؛ مسیر <code>/limited</code> به هر کلاینت سه درخواست اجازه می‌دهد.</p>

---
type: reserve
module: M3
minutes: 0
link: http
corner: proxy
---

# خروجی دمو: سه درخواست، و بعد هر چند تا که بخواهید

```text
request 1 of 3 from 127.0.0.1
request 2 of 3 from 127.0.0.1
request 3 of 3 from 127.0.0.1
too many requests from 127.0.0.1         (429)
request 1 of 3 from 1.2.3.4              origin saw  XFF: 1.2.3.4, 127.0.0.1
```

- سرور اولین مقدار فهرست را خواند، که [مهاجم نوشته بود]{.mark}؛ proxy فقط نشانی واقعی را به انتهایش افزوده بود
- با `FIX=1` سرور آخرین مقدار را می‌خواند و درخواست پنجم هم `429` می‌گیرد

---
module: M3
minutes: 2
link: http
corner: proxy
---

# این خطا را کدام واسطه ساخته است؟

| نشانه در پاسخ | معنا |
| --- | --- |
| `502 Bad Gateway` | واسطه نتوانست از سرور پشتش پاسخ درست بگیرد |
| `504 Gateway Timeout` | سرور پشتی دیر کرد |
| `Via` و `Server` | پاسخ از کدام واسطه‌ها گذشته |
| `Cache-Status` و `Age` | از cache آمده یا از سرور اصلی |
| [`Proxy-Status`](https://www.rfc-editor.org/rfc/rfc9209) | واسطه می‌گوید [خودش چه خطایی دید]{.mark} |

::punch::

کد وضعیت نمی‌گوید چه کسی پاسخ داده؛ header‌های واسطه‌ها می‌گویند.

---
layout: section
type: section
module: M4
minutes: 0
link: tls
---

# لبهٔ شبکه: CDN

<p class="since">reverse proxy به‌جای سرور پاسخ می‌دهد و می‌تواند پاسخ را نگه دارد.</p>

<p class="question">اگر این proxy را در صدها شهر بگذاریم و به شرکت دیگری بسپاریم، چه به دست می‌آوریم و چه از دست می‌دهیم؟</p>

---
module: M4
minutes: 2
link: tls
corner: CDN
---

# CDN چه می‌دهد و چه می‌گیرد؟

- همان reverse proxy با cache مشترک، ولی [نزدیک کاربر]{.mark}: handshake و پاسخ‌های نگه‌داشته‌شده با رفت‌وبرگشت کوتاه (جلسهٔ ۴)
- کاربر با DNS یا anycast به نزدیک‌ترین نقطه می‌رسد (جلسهٔ ۱)
- حمله‌ها و اوج ترافیک پیش از رسیدن به سرور شما گرفته می‌شوند
- در عوض: شرکت دیگری همهٔ ترافیک شما را می‌بیند، و اگر بیفتد شما هم افتاده‌اید

::punch::

CDN سرعت و تاب‌آوری می‌دهد، و در عوض اعتماد و وابستگی می‌گیرد.

---
type: interactive
module: M4
minutes: 3
link: tls
corner: CDN
---

# سایت پشت CDN است و قفل مرورگر بسته؛ CDN چه می‌بیند؟

کاربر در `https://shop.example` وارد می‌شود و خرید می‌کند. سایت پشت یک CDN است.

<ol class="options">
  <li><b>الف)</b> فقط نام سایت</li>
  <li><b>ب)</b> نام و حجم</li>
  <li v-mark.box.orange="1"><b>ج)</b> همه‌چیز</li>
  <li><b>د)</b> هیچ‌چیز</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ج)</strong> TLS مرورگر در لبهٔ CDN تمام می‌شود؛ گواهی سایت و کلید خصوصی‌اش دست CDN است. CDN درخواست را باز می‌کند، تصمیم می‌گیرد و با اتصال دومی به سرور شما می‌فرستد: مسیر، header‌ها، کوکی و بدنه را می‌بیند.</div>

::punch::

<div v-click="1">قفل مرورگر یعنی «تا لبهٔ CDN رمز است»، نه «تا سرور شما».</div>

---
module: M4
minutes: 2
link: tls
corner: CDN
---

# از لبه تا سرور شما: اتصال دوم

<Path tls />

- اتصال دوم هم باید TLS با [گواهی سنجیده‌شده]{.mark} باشد؛ وگرنه نیمی از مسیر بی‌رمز است
- سرور اصلی فقط از CDN درخواست بپذیرد؛ وگرنه می‌شود لبه را دور زد

::punch::

امنیت مسیر به ضعیف‌ترین تکه‌اش است، و کاربر فقط تکهٔ اول را می‌بیند.

---
module: M4
minutes: 2
link: tls
corner: CDN
---

# سناریوی واقعی: یک فایل پیکربندی، و بخش بزرگی از وب

- ۲۷ آبان ۱۴۰۴، Cloudflare: تغییر مجوزهای یک پایگاه‌داده، فایل پیکربندی سامانهٔ ضدبات را دو برابر کرد؛ فایل از سقف نرم‌افزار proxy گذشت و proxy از کار افتاد ([گزارش رسمی](https://blog.cloudflare.com/18-november-2025-outage/))
- سایت‌های پشت آن چند ساعت [خطای 5xx]{.mark} دادند؛ حمله‌ای در کار نبود
- Cloudflare جلوی ۲۶ درصد سایت‌های دنیاست ([W3Techs](https://w3techs.com/technologies/comparison/cn-cloudflare)). خرداد ۱۴۰۰ هم یک پیکربندی مشتری، ۸۵ درصد شبکهٔ [Fastly](https://www.fastly.com/blog/summary-of-june-8-outage) را خطادار کرد

::punch::

تمرکز روی چند واسطه یعنی خطای یکی، خطای بخش بزرگی از وب است.

---
module: M4
minutes: 2
link: tls
corner: CDN
---

# سناریوی واقعی: این 403 را سرور نفرستاده

- پژوهشی در [۱۳۹۷](https://research.cloudflare.com/publications/McDonald2018) از ۱۷۷ کشور نشان داد CDNها و سرویس‌های ابری کاربران بعضی کشورها را، از روی نشانی IP، با `403` برمی‌گردانند
- ایران، سوریه، سودان و کوبا [بیشترین مسدودی]{.mark} را داشتند؛ دلیل اصلی، تحریم‌ها
- درخواست اصلاً به سرور اصلی نمی‌رسد و در لاگ او هم نیست

::punch::

واسطه تصمیم هم می‌گیرد، و پاسخش همان شکلی است که پاسخ سرور.

---
module: M4
minutes: 2
link: tls
corner: هوش مصنوعی
---

# پیوند با هوش مصنوعی: cache برای prompt

```json
{ "type": "text", "text": "<long system prompt>",
  "cache_control": { "type": "ephemeral" } }
```

- در API مدل Claude، بخش ثابت و طولانی prompt در سرور نگه داشته می‌شود تا هر بار از نو پردازش نشود ([prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching))
- همان سه پرسش: کلید، [پیشوندِ دقیقاً یکسان]{.mark}؛ عمر، پنج دقیقه یا یک ساعت؛ دامنه، فقط همان سازمان
- خواندن از cache یک‌دهمِ قیمت ورودی است، و نوشتن در آن ۲۵ درصد گران‌تر

::punch::

هر cache سه پرسش دارد: کلید چیست، تا کِی تازه است، و برای چه کسانی.

---
module: M4
minutes: 2
link: tls
corner: CDN
---

# تصمیم: چه چیزی را به cache مشترک بسپاریم؟

| پاسخ | `Cache-Control` | چرا |
| --- | --- | --- |
| فایل با اثر انگشت در نام | `max-age=31536000, immutable` | هرگز عوض نمی‌شود |
| صفحهٔ عمومی، مثل خبر | `s-maxage=60, stale-while-revalidate=30` | کمی کهنگی پذیرفتنی است |
| صفحه یا API شخصی | [`private`]{.mark} یا `no-store` | نباید به دیگری برسد |
| پاسخ وابسته به یک header | همراه `Vary` | کلید باید کامل باشد |

::punch::

پیش‌فرض را محافظه‌کار بگیرید: اول `private`؛ بعد فقط آنچه می‌دانید عمومی است.

---
layout: section
type: section
module: M5
minutes: 0
link: all
---

# جمع‌بندی

<p class="since">تازگی و کلید cache را بررسی کردیم، و بعد proxy و CDN را.</p>

<p class="question">حالا با یک خط header، جلوی حادثه‌ای مثل Steam را چطور می‌گیریم؟</p>

---
type: interactive
module: M5
minutes: 3
link: all
corner: جمع‌بندی
---

# کدام یکی جلوی رسیدن صفحهٔ یک کاربر به دیگری را می‌گیرد؟

صفحهٔ `/account` شما پشت یک CDN است.

<ol class="options">
  <li><b>الف)</b> <code>ETag</code></li>
  <li><b>ب)</b> کوکی <code>HttpOnly</code></li>
  <li v-mark.box.orange="1"><b>ج)</b> <code>private</code></li>
  <li><b>د)</b> <code>max-age=0</code></li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ج)</strong> <code>Cache-Control: private</code> به cache مشترک می‌گوید این پاسخ را نگه ندار. <code>ETag</code> فقط پرسیدن را ارزان می‌کند و <code>HttpOnly</code> به cache ربطی ندارد. با <code>max-age=0</code> پاسخ می‌تواند نگه داشته شود، و اگر سرور به پرسش cache بی‌توجه به کوکی <code>304</code> بدهد، همان صفحه به نفر بعد می‌رسد.</div>

::punch::

<div v-click="1">دربارهٔ هر پاسخ بپرسید: کلیدش چیست، تا کِی تازه است، و برای چه کسانی.</div>

---
module: M5
minutes: 1
link: all
corner: جمع‌بندی
---

# چهار مدل ذهنی، چهار تصمیم

| مدل ذهنی | تصمیم مهندسی |
| --- | --- |
| کلید cache متد و نشانی است، نه کوکی | `private` برای پاسخ شخصی؛ `Vary` برای هر وابستگی |
| پاسخ یا تازه است، یا باید پرسیده شود | اثر انگشت در نام فایل؛ `no-cache` برای HTML |
| هر چه از بیرون آمده ادعاست | فقط `X-Forwarded-For` که proxy خودتان افزوده |
| CDN یک reverse proxy است و TLS در لبه تمام می‌شود | TLS تا origin؛ برنامه برای روزی که CDN بیفتد |

::punch::

جلسهٔ بعد: واسطه‌ها پاسخ کامل را دوست دارند. اگر سرور بخواهد اول حرف بزند چه می‌شود؟

---
type: exercise
module: M5
minutes: 4
link: all
corner: تمرین
---

# تمرین ۵: باگ‌های cache را پیدا کنید

<Exercise ex="05-cache-bugs" due="تا شب پیش از جلسهٔ ۶">
<dl class="run">
  <dt>چالش</dt><dd>فروشگاه کوچکی پشت یک cache مشترک به شما داده می‌شود که چهار باگ دارد. با curl و لاگ سرور پیدایشان کنید و فقط با header درستشان کنید.</dd>
  <dt>پیش‌بینی</dt><dd>همین حالا روی کاغذ: پاسخ <code>/search?q=book</code> برای کاربر فارسی‌زبان و انگلیسی‌زبان فرق دارد، ولی <code>Vary</code> ندارد. کاربر انگلیسی‌زبان، بعد از کاربر فارسی‌زبان، چه می‌بیند؟ کدام یک خط درستش می‌کند؟</dd>
  <dt>پل</dt><dd>پاسخی که ذره‌ذره و طی چند ثانیه می‌رسد، در این cache چه می‌شود؟ بخش امتیازی همین را نشان می‌دهد؛ جلسهٔ ۶.</dd>
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
link: all
corner: جمع‌بندی
---

# برای کنجکاوی بیشتر (۱ از ۲)

<ol class="curious">
  <li>چرا CDNها <code>Vary: User-Agent</code> را دوست ندارند، و <code>Vary: *</code> چه می‌گوید؟<span class="hint">تعداد کلیدها را بشمارید؛ RFC 9110 بخش ۱۲.۵.۵.</span></li>
  <li>مرورگرها چرا cache را به ازای هر سایتِ سطح بالا جدا کرده‌اند؟<span class="hint">دنبال «cache partitioning» و «XS-Leaks» بگردید؛ کلید دوتایی مثل کوکی <code>Partitioned</code> در جلسهٔ ۳.</span></li>
  <li>فیلد <code>CDN-Cache-Control</code> چه مشکلی را حل می‌کند که <code>s-maxage</code> حل نمی‌کرد؟<span class="hint">RFC 9213؛ وقتی دو لایه cache مشترک دارید.</span></li>
</ol>

---
type: extra
module: M5
minutes: 0
link: all
corner: جمع‌بندی
---

# برای کنجکاوی بیشتر (۲ از ۲)

<ol class="curious" start="4" style="counter-reset: q 3">
  <li>proxy شبکهٔ یک سازمان چطور می‌تواند محتوای HTTPS کارمندان را ببیند؟<span class="hint">گواهی ریشه‌ای که روی دستگاه نصب شده است؛ زنجیرهٔ اعتماد در جلسهٔ ۴.</span></li>
  <li>MCP در بازنگری ۱۴۰۵ دو فیلد <code>ttlMs</code> و <code>cacheScope</code> آورد؛ معادل HTTP هر کدام چیست؟<span class="hint">صفحهٔ Caching در مشخصات MCP؛ جلسهٔ ۷.</span></li>
  <li>«خروج از حساب» با پاسخ‌هایی که در cache مرورگر مانده چه کند؟<span class="hint">هدر <code>Clear-Site-Data</code> در MDN.</span></li>
</ol>

---
type: reserve
module: M5
minutes: 0
link: all
corner: منابع
---

# منابع

<ul class="src two">
  <li><a href="https://www.rfc-editor.org/rfc/rfc9111">RFC 9111: HTTP Caching</a> · <a href="https://www.rfc-editor.org/rfc/rfc5861">RFC 5861</a></li>
  <li><a href="https://www.rfc-editor.org/rfc/rfc9110#section-13">RFC 9110 §13: Conditional Requests</a></li>
  <li><a href="https://www.rfc-editor.org/rfc/rfc9211">RFC 9211: Cache-Status</a> · <a href="https://www.rfc-editor.org/rfc/rfc9209">RFC 9209: Proxy-Status</a></li>
  <li><a href="https://www.rfc-editor.org/rfc/rfc7239">RFC 7239: Forwarded</a></li>
  <li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching">MDN: HTTP caching</a></li>
  <li><a href="https://store.steampowered.com/oldnews/19852">Valve: Christmas 2015 caching issue</a></li>
  <li><a href="https://securityaffairs.com/?p=144184">Security Affairs: ChatGPT cache deception</a></li>
  <li><a href="https://portswigger.net/research/practical-web-cache-poisoning">PortSwigger: web cache poisoning</a></li>
  <li><a href="https://adam-p.ca/blog/2022/03/x-forwarded-for/">adam-p: the “real” client IP</a></li>
  <li><a href="https://blog.cloudflare.com/18-november-2025-outage/">Cloudflare: 18 November 2025 outage</a></li>
  <li><a href="https://www.fastly.com/blog/summary-of-june-8-outage">Fastly: June 8 outage</a> · <a href="https://w3techs.com/technologies/comparison/cn-cloudflare">W3Techs</a></li>
  <li><a href="https://research.cloudflare.com/publications/McDonald2018">McDonald et al.: CDN geoblocking</a></li>
  <li><a href="https://platform.claude.com/docs/en/build-with-claude/prompt-caching">Claude: prompt caching</a></li>
</ul>
