---
theme: ../../theme
title: "جلسهٔ صفر: اینترنت چطور به اینجا رسید؟"
exportFilename: 00-how-we-got-here
chapter: course
modules:
  M0: { slug: intro, title: پیش‌درآمد }
  M1: { slug: arpanet, title: ۱۹۶۹ تا ۱۹۸۳ }
  M2: { slug: web, title: ۱۹۸۹ تا ۱۹۹۳ }
  M3: { slug: browser-war, title: ۱۹۹۴ تا ۲۰۰۱ }
  M4: { slug: open-web, title: ۲۰۰۴ تا ۲۰۱۲ }
  M5: { slug: secure-web, title: ۲۰۱۱ تا ۲۰۲۲ }
  M6: { slug: ai, title: ۲۰۲۲ تا امروز }
  M7: { slug: next, title: از اینجا به بعد }
---

<p class="course">مهندسی اینترنت</p>

# جلسهٔ صفر: اینترنت چطور به اینجا رسید؟

<p class="lede">داستان تصمیم‌های مهندسی‌ای که هر روز از آن‌ها استفاده می‌کنید</p>

<p class="byline">محمد بصیرزاده<br>دانشگاه شهید چمران اهواز، دانشکدهٔ مهندسی، پاییز ۱۴۰۵</p>

---
type: interactive
module: M0
minutes: 3
link: none
corner: پیش‌درآمد
---

# چه چیزی Signal و Zoom و Duolingo را هم‌زمان از کار انداخت؟

۲۸ مهر ۱۴۰۴، حدود ده صبح به وقت تهران: هزاران سایت و برنامهٔ بی‌ربط در سراسر دنیا با هم از کار افتادند و بعضی تا نیمه‌شب برنگشتند. یک دقیقه حدس بزنید علت چه بود.

<div v-click="1" class="answer"><strong>آنچه واقعاً رخ داد:</strong> هیچ‌کدام خودشان خراب نشده بودند. همه، مستقیم یا غیرمستقیم، <span class="mark">به سرویس‌های مشترکی در Amazon</span> تکیه داشتند و یک خطای خودکار، نام یکی از آن سرویس‌ها را از DNS پاک کرد؛ DNS دفترچهٔ نام‌های اینترنت است که نام را به نشانی عددی ترجمه می‌کند (جلسهٔ ۱). سرورها روشن بودند، ولی کسی نشانی‌شان را پیدا نمی‌کرد (<a href="https://aws.amazon.com/message/101925/">گزارش رسمی AWS</a>).</div>

::punch::

<div v-click="1">اینترنت زنجیره‌ای از قراردادهای نامرئی است و هرکدام روزی یک تصمیم مهندسی بوده؛ این جلسه داستان همین تصمیم‌هاست.</div>

---
module: M0
minutes: 3
link: none
corner: پیش‌درآمد
clicks: 7
---

# هشت ایستگاه در یک نگاه

<History />

::punch::

<div v-click="7">هر ایستگاه یک تصمیم است؛ در ادامهٔ جلسه چند تا از آن‌ها را از نزدیک بررسی می‌کنیم.</div>

---
layout: section
type: section
module: M1
minutes: 0
link: none
---

# شبکهٔ شبکه‌ها

<p class="since">دهه‌های ۱۹۶۰ و ۱۹۷۰؛ هنوز نه وبی بود، نه مرورگری.</p>

<p class="question">چطور کامپیوترها و شبکه‌های ناهمگون را به هم وصل کنیم، بی‌آنکه یک مرکز همه را اداره کند؟</p>

---
module: M1
minutes: 2
link: none
corner: ARPANET
---

# چرا شبکه‌ای که هیچ مرکزی ندارد؟

<div class="cols">
<div>

- دههٔ ۱۹۶۰: [پل باران](https://en.wikipedia.org/wiki/Paul_Baran) برای بقا در جنگ، شبکهٔ توزیع‌شده را پیشنهاد داد و دیویس نامش را [packet](https://en.wikipedia.org/wiki/Packet_switching) گذاشت
- ARPANET (۱۹۶۹) این ایده را برای اشتراک کامپیوترهای گران به کار برد؛ «شبکهٔ ضد بمب اتمی» [افسانه است](https://www.internetsociety.org/internet/history-internet/brief-history-internet/)
- ۱۹۷۴: [Cerf و Kahn](https://www.cs.princeton.edu/courses/archive/fall06/cos561/papers/cerf74.pdf) با TCP/IP شبکه‌ها را به هم وصل کردند: [شبکهٔ شبکه‌ها]{.mark}؛ شبکه فقط بسته می‌رساند و هوشمندی در دو سر است ([end-to-end](https://web.mit.edu/Saltzer/www/publications/endtoend/endtoend.pdf))

</div>
<EraArt art="mesh" label="شبکهٔ متمرکز در برابر توزیع‌شده" />
</div>

::punch::

شبکهٔ ساده و دو سرِ هوشمند: برای همین هر برنامهٔ تازه، از وب تا agent، بدون اجازهٔ شبکه روی اینترنت ساخته شد.

---
module: M1
minutes: 2
link: none
corner: TCP/IP
---

# چطور یک شبکهٔ کامل را در یک شب عوض کنیم؟

<div class="cols">
<div>

- در [یکم ژانویهٔ ۱۹۸۳](https://en.wikipedia.org/wiki/Flag_day_(computing)) همهٔ ARPANET باید هم‌زمان به [TCP/IP](https://en.wikipedia.org/wiki/Internet_protocol_suite) کوچ می‌کرد؛ [هر میزبانی که آماده نبود، قطع می‌شد]{.mark}
- تاریخ کوچ را [RFC 801](https://www.rfc-editor.org/rfc/rfc801)، یکی از سندهای رسمی اینترنت، از نوامبر ۱۹۸۱ اعلام کرده بود؛ بیش از یک سال فرصت برای همه
- در همان سال [DNS](https://developer.mozilla.org/en-US/docs/Glossary/DNS) طراحی شد تا جای HOSTS.TXT را بگیرد، فهرست مشترکی از نام‌ها و نشانی‌ها که همه دستی کپی‌اش می‌کردند؛ همان DNS که در قطعی AWS یک نامش پاک شد (جلسهٔ ۱)

</div>
<Shot src="images/arpanet-map-1977.png" wiki="Arpanet logical map, march 1977.png" alt="نقشهٔ منطقی ARPANET در مارس ۱۹۷۷" caption="کل ARPANET در مارس ۱۹۷۷ در یک صفحه جا می‌شد" h="330" />
</div>

::punch::

وقتی یک فهرست مرکزی دیگر مقیاس ندارد، باید توزیعش کرد؛ DNS همین تصمیم بود.

---
type: interactive
module: M1
minutes: 3
link: none
---

# چرا IPv6 را نمی‌شود مثل ۱۹۸۳ یک‌شبه جایگزین کرد؟

IPv6، نسخهٔ تازهٔ نشانی‌های اینترنت، از ۱۹۹۸ استاندارد است؛ سهمش در آمار Google تازه اردیبهشت ۱۴۰۵ به ۵۰٪ رسید.

<ol class="options">
  <li><b>الف)</b> IPv6 هنوز کامل نشده</li>
  <li><b>ب)</b> IPv6 کندتر است</li>
  <li v-mark.box.orange="1"><b>ج)</b> کسی نیست که روز کوچ را تعیین کند</li>
  <li><b>د)</b> قانون جلویش را گرفته</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ج)</strong> در ۱۹۸۳ یک متولی برای شبکه‌ای کوچک تاریخ گذاشت؛ امروز هزاران اپراتور مستقل هست و هرکدام هزینهٔ کوچ خودش را می‌دهد، و NAT (چند دستگاه پشت یک نشانی) کمبود را موقتاً پوشانده است (<a href="https://blog.apnic.net/2026/04/28/google-hits-50-ipv6/">APNIC</a>).</div>

::punch::

<div v-click="1">شبکهٔ بی‌مرکز را هیچ‌کس به‌تنهایی اداره نمی‌کند؛ پس با یک دستور هم نمی‌شود عوضش کرد.</div>

---
layout: section
type: section
module: M2
minutes: 0
link: none
---

# تولد وب

<p class="since">اینترنت برای ایمیل و انتقال فایل بود؛ پیدا کردن اطلاعات سخت بود.</p>

<p class="question">چطور سندهای پراکنده روی هزاران کامپیوتر را به هم وصل کنیم؟</p>

---
module: M2
minutes: 2
link: none
corner: وب
---

# «مبهم ولی هیجان‌انگیز»

<div class="cols">
<div>

- مارس ۱۹۸۹: [تیم برنرز-لی](https://en.wikipedia.org/wiki/Tim_Berners-Lee) در CERN پیشنهادی برای مدیریت اطلاعات نوشت
- رئیسش، مایک سندال، بالای آن نوشت [«مبهم ولی هیجان‌انگیز»]{.mark} و اجازهٔ ادامهٔ کار را داد
- این پیشنهاد دو سال بعد به [وب جهان‌گستر](https://en.wikipedia.org/wiki/World_Wide_Web) تبدیل شد

</div>
<Proposal />
</div>

::punch::

وب یک پروژهٔ جانبی بود که یک مدیر اجازهٔ ادامه‌اش را داد.

---
module: M2
minutes: 2
link: none
corner: وب
---

# سه اختراع در یک پروژه

<div class="cols">
<div>

- [URL](https://url.spec.whatwg.org/): نشانی یکتا برای هر سند، روی هر کامپیوتری (جلسهٔ ۱)
- [HTTP](https://developer.mozilla.org/en-US/docs/Glossary/HTTP): قرارداد درخواست و پاسخ برای گرفتن سند (جلسهٔ ۲)
- [HTML](https://developer.mozilla.org/en-US/docs/Glossary/HTML): قالب سند، با پیوند به سندهای دیگر
- نخستین وب‌سایت در ۱۹۹۱ منتشر شد و [هنوز روی info.cern.ch باز می‌شود](https://info.cern.ch)

</div>
<Shot src="images/first-web-server.jpg" wiki="First Web Server.jpg" alt="رایانهٔ NeXT برنرز-لی، نخستین وب‌سرور، با برچسب هشدار روی آن" caption="نخستین وب‌سرور؛ روی برچسبش نوشته‌اند: «خاموشش نکنید!»" h="300" />
</div>

::punch::

وب یک برنامه روی اینترنت است، مثل ایمیل؛ و دو تا از این سه اختراع موضوع همین درس‌اند.

---
type: interactive
module: M2
minutes: 3
link: none
---

# چرا وب برنده شد و Gopher نه؟

در ۱۹۹۳ [Gopher](https://en.wikipedia.org/wiki/Gopher_(protocol))، سامانهٔ منویی دانشگاه مینه‌سوتا برای پیدا کردن سند، از وب محبوب‌تر بود.

<ol class="options">
  <li><b>الف)</b> سرعت بیشتر وب</li>
  <li><b>ب)</b> نمایش تصویر در وب</li>
  <li v-mark.box.orange="1"><b>ج)</b> مجوز: Gopher پولی شد، وب رایگان</li>
  <li><b>د)</b> پشتیبانی یک شرکت بزرگ</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ج)</strong> در ۱۹۹۳ دانشگاه مینه‌سوتا برای استفادهٔ تجاری از سرور Gopher هزینهٔ مجوز خواست؛ در ۳۰ آوریل همان سال CERN نرم‌افزار وب را <a href="https://en.wikipedia.org/wiki/History_of_the_World_Wide_Web">رایگان و برای همه</a> اعلام کرد. تصویر هم کمک کرد، ولی نقطهٔ برگشت مجوز بود.</div>

::punch::

<div v-click="1">در پروتکل‌ها، هزینهٔ پذیرش اغلب از بهتر بودن مهم‌تر است.</div>

---
module: M2
minutes: 2
link: none
corner: ایران
---

# ایران کِی به اینترنت وصل شد؟

<div class="cols">
<div>

- دی ۱۳۷۱ (ژانویهٔ ۱۹۹۳): پژوهشگاه دانش‌های بنیادی (IPM) با یک خط اجاره‌ای [۹۶۰۰ baud]{.mark} به دانشگاه وین وصل شد؛ نخست روی شبکهٔ علمی BITNET و برای ایمیل ([NSRC](https://nsrc.org/regions/MIDEAST/IR/internet-iran-2001.pdf))
- سپس همین خط اتصال کامل اینترنت شد و ایران ۵۰۰ نشانی IP گرفت؛ با این سرعت، دریافت یک عکس یک‌مگابایتی حدود ربع ساعت طول می‌کشید
- فروردین ۱۳۷۳: دامنهٔ [`.ir`](https://en.wikipedia.org/wiki/.ir) با متولی‌گری IPM ثبت شد، و از بهار همان سال [ندا رایانه](https://iranian.com/WebGuide/InternetIran/InternetIran.html) خدمات اینترنت را به عموم عرضه کرد

</div>
<EraArt art="iran" label="تهران، وین، اینترنت" />
</div>

::punch::

از روز اول، مسیر بین‌الملل برای ما یک تصمیم مهندسی بوده است، نه یک فرض.

---
layout: section
type: section
module: M3
minutes: 0
link: none
---

# جنگ اول مرورگرها

<p class="since">وب رایگان شد؛ حالا کسی باید آن را به خانه‌ها می‌برد.</p>

<p class="question">وقتی یک شرکت مرورگر بازار را می‌گیرد، چه بر سر استانداردها می‌آید؟</p>

---
module: M3
minutes: 2
link: none
corner: مرورگرها
---

# کدام مرورگر وب را برای همه ساخت؟

<div class="cols">
<div>

- [Mosaic](https://en.wikipedia.org/wiki/Mosaic_(web_browser)) (۱۹۹۳) اولین مرورگر پرطرفداری بود که تصویر را کنار متن نشان می‌داد
- سازندگانش [Netscape](https://en.wikipedia.org/wiki/Netscape) را ساختند؛ عرضهٔ سهام آن در اوت ۱۹۹۵ آغاز تب دات‌کام بود، و یک ماه بعد [پی‌یر امیدیار](https://en.wikipedia.org/wiki/Pierre_Omidyar)، ایرانی‌تبار، eBay را راه انداخت
- وب از ابزار دانشگاهی به [محصولی برای همه]{.mark} تبدیل شد

</div>
<Shot src="images/mosaic.png" wiki="NCSA Mosaic Browser Screenshot.png" alt="نمای مرورگر NCSA Mosaic" caption="مرورگر NCSA Mosaic: متن و تصویر در یک صفحه" h="320" />
</div>

::punch::

رابط کاربری خوب، یک پروتکل را از آزمایشگاه به خانه‌ها برد.

---
module: M3
minutes: 2
link: none
corner: مرورگرها
---

# سه اختراع Netscape که هنوز با ماست

<div class="cols">
<div>

- [کوکی](https://developer.mozilla.org/en-US/docs/Glossary/Cookie) (۱۹۹۴): راهی برای اینکه برنامهٔ وب، روی پروتکلی بی‌حالت، کاربر را به یاد بیاورد (جلسهٔ ۳)
- [SSL](https://en.wikipedia.org/wiki/Transport_Layer_Security) (۱۹۹۵): رمزنگاری برای خرید اینترنتی؛ نوادهٔ امروزی‌اش TLS است (جلسهٔ ۴)
- [JavaScript](https://developer.mozilla.org/en-US/docs/Glossary/JavaScript) (۱۹۹۵): برنامه‌ای که [داخل صفحه اجرا می‌شود]{.mark}؛ نسخهٔ اولش در حدود ده روز نوشته شد

</div>
<EraArt art="war1" label="کوکی و SSL و JavaScript" />
</div>

::punch::

هر سه برای حل یک مشکل تجاری فوری ساخته شدند و هر سه امروز استاندارد جهانی‌اند.

---
type: interactive
module: M3
minutes: 3
link: none
---

# چرا `flatten` در JavaScript به `flat` تغییر نام داد؟

بهار ۱۳۹۷ قرار بود آرایه‌های JavaScript متد `flatten` بگیرند؛ در آخرین لحظه نامش `flat` شد.

<ol class="options">
  <li><b>الف)</b> <code>flat</code> کوتاه‌تر بود</li>
  <li v-mark.box.orange="1"><b>ب)</b> سایت‌های قدیمی می‌شکستند</li>
  <li><b>ج)</b> <code>flatten</code> ثبت تجاری داشت</li>
  <li><b>د)</b> هماهنگی با Python</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ب)</strong> کتابخانهٔ قدیمی MooTools خودش <code>flatten</code> را به آرایه‌ها اضافه کرده بود و نسخهٔ استاندارد سایت‌هایی را که دیگر کسی به‌روزشان نمی‌کرد می‌شکست؛ کمیته نام را عوض کرد، نه وب را (<a href="https://developer.chrome.com/blog/smooshgate">SmooshGate</a>).</div>

::punch::

<div v-click="1">«وب را نشکن»: تصمیمی که یک بار در وب پخش شد، دیگر پس گرفته نمی‌شود.</div>

---
module: M3
minutes: 2
link: none
corner: مرورگرها
---

# Microsoft چطور جواب داد؟

<div class="cols">
<div>

- Internet Explorer را [رایگان و همراه Windows]{.mark} عرضه کرد
- در اوایل دههٔ ۲۰۰۰ سهم IE از بازار از ۹۰ درصد گذشت
- دولت آمریکا Microsoft را برای همین همراه‌سازی به دادگاه برد ([پروندهٔ ضدانحصار](https://en.wikipedia.org/wiki/United_States_v._Microsoft_Corp.))، و Netscape در ۱۹۹۸ کد مرورگرش را متن‌باز کرد؛ بذر Mozilla و Firefox

</div>
<Shot src="images/browser-wars.png" wiki="Browser Wars (en).svg" alt="نمودار سهم بازار Netscape و Internet Explorer در جنگ اول مرورگرها" caption="سهم بازار مرورگرها: سقوط Netscape و اوج IE" h="320" />
</div>

::punch::

وقتی رقابت روی توزیع باشد نه کیفیت، بهترین محصول لزوماً برنده نمی‌شود.

---
module: M3
minutes: 2
link: none
corner: مرورگرها
---

# وقتی یک مرورگر برنده شد، چه اتفاقی افتاد؟

- [IE6](https://en.wikipedia.org/wiki/Internet_Explorer_6) در ۲۰۰۱ منتشر شد و نسخهٔ بعدی، IE7، [پنج سال بعد]{.mark} در ۲۰۰۶ آمد
- توسعه‌دهندگان برای رفتارهای خاص یک مرورگر کد می‌نوشتند، نه برای استاندارد
- جملهٔ «این سایت فقط با Internet Explorer درست دیده می‌شود» روی صفحه‌ها رایج شد

::punch::

انحصار استاندارد را متوقف می‌کند؛ رفتار یک پیاده‌سازی جای مشخصات را می‌گیرد.

---
layout: section
type: section
module: M4
minutes: 0
link: none
---

# وب دوباره باز می‌شود

<p class="since">IE6 سال‌ها بی‌رقیب ماند و استانداردها ایستادند.</p>

<p class="question">چطور می‌شود وبی را که در یک مرورگر قفل شده، دوباره باز کرد؟</p>

---
module: M4
minutes: 2
link: none
corner: وب باز
---

# چه کسی استاندارد را از رفتار واقعی مرورگرها نوشت؟

- [Firefox](https://en.wikipedia.org/wiki/Firefox) (۲۰۰۴)، وارث متن‌باز Netscape، رقابت را دوباره زنده کرد
- همان سال Apple و Mozilla و Opera گروه [WHATWG](https://whatwg.org/) را ساختند تا استاندارد را [از روی رفتار واقعی مرورگرها]{.mark} بنویسند
- استاندارد URL که در جلسهٔ ۱ می‌بینیم، کار همین گروه است

::punch::

استانداردی که با رفتار واقعی نخواند، فقط روی کاغذ استاندارد است.

---
type: interactive
module: M4
minutes: 3
link: none
---

# چرا Chrome خودش را Mozilla هم معرفی می‌کند؟

هدر `User-Agent` که Chrome 143 روی Windows در هر درخواست HTTP می‌فرستد (جلسهٔ ۲)، در اصل یک خط:

```text
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
    (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36
```


<div v-click="1" class="answer"><strong>پاسخ:</strong> سایت‌های دههٔ ۹۰ صفحهٔ کامل را فقط به Netscape می‌دادند، که خودش را Mozilla می‌نامید؛ IE خودش را سازگار با Mozilla معرفی کرد و هر مرورگر بعدی ادای قبلی را درآورد (<a href="https://webaim.org/blog/user-agent-string-history/">تاریخچه</a>). امروز <code>navigator.appName</code> در <span class="mark">هر مرورگری <code>"Netscape"</code></span> است.</div>

::punch::

<div v-click="1">وقتی سایت به‌جای قابلیت، نام مرورگر را بسنجد، هر مرورگر تازه مجبور به دروغ می‌شود.</div>

---
module: M4
minutes: 2
link: none
corner: وب باز
---

# صفحه‌ای که دیگر reload نمی‌شد

- [Gmail](https://en.wikipedia.org/wiki/Gmail) (۲۰۰۴) و Google Maps (۲۰۰۵) صفحه را بدون بارگذاری دوباره به‌روز می‌کردند
- سازوکارش، [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)، را Microsoft ساخته بود؛ در ۲۰۰۵ این شیوه نام [Ajax](https://en.wikipedia.org/wiki/Ajax_(programming)) گرفت
- نیاز به اینکه [سرور خودش خبر بدهد]{.mark}، به WebSocket در ۲۰۱۱ رسید (جلسهٔ ۶)

::punch::

هر بار کاربر چیز تازه‌ای خواست، پروتکل هم یک قدم جلو رفت.

---
module: M4
minutes: 2
link: none
corner: وب باز
---

# وب چطور به جیب رسید؟

<div class="cols">
<div>

- [iPhone](https://en.wikipedia.org/wiki/IPhone_(1st_generation)) (۲۰۰۷) یک مرورگر کامل را به گوشی آورد
- [Chrome](https://en.wikipedia.org/wiki/Google_Chrome) (۲۰۰۸) هر زبانه را در پردازه‌ای جدا اجرا کرد و موتور JavaScript سریع V8 را آورد
- چند سال بعد ترافیک وب از گوشی‌ها از رایانه‌های رومیزی بیشتر شد و [کندی شبکه]{.mark} دوباره مسئلهٔ اصلی شد
- در ایران، ایرانسل اینترنت ۳G و ۴G را [۴ شهریور ۱۳۹۳](https://irancell.ir/en/p/4852/irancell-background) به‌صورت تجاری عرضه کرد؛ هفت سال بعد از iPhone

</div>
<Shot src="images/iphone-2007.jpg" wiki="IPhone First Generation.jpg" alt="نخستین iPhone" caption="نخستین iPhone (۲۰۰۷): مرورگر کامل در جیب" h="320" />
</div>

::punch::

وب از میز کار به جیب رفت و پروتکل‌ها باید با شبکه‌های کند و ناپایدار کنار می‌آمدند.

---
type: interactive
module: M4
minutes: 3
link: none
---

# امروز بیشتر صفحه‌های وب را کدام موتور مرورگر نشان می‌دهد؟

<ol class="options">
  <li v-mark.box.orange="1"><b>الف)</b> Blink (Chromium)</li>
  <li><b>ب)</b> Gecko (Firefox)</li>
  <li><b>ج)</b> WebKit (Safari)</li>
  <li><b>د)</b> Trident (IE)</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: الف)</strong> Chrome و Edge و Opera و Brave، و حتی مرورگرهای هوش مصنوعی مثل Comet و ChatGPT Atlas، همه روی Chromium ساخته شده‌اند؛ Edge در ۲۰۲۰ موتور خودش را کنار گذاشت. فقط روی iPhone، بیرون از اتحادیهٔ اروپا، <a href="https://developer.apple.com/app-store/review/guidelines/#software-requirements">قاعدهٔ Apple</a> همه را، حتی Chrome، به WebKit مجبور می‌کند. در ۱۱ شهریور ۱۴۰۴ دادگاهی در آمریکا حکم به فروش اجباری Chrome نداد و یکی از دلیل‌هایش رقابت تازهٔ هوش مصنوعی بود (<a href="https://www.npr.org/2025/09/02/nx-s1-5478625/google-chrome-doj-antitrust-ruling">NPR</a>).</div>

::punch::

<div v-click="1">جنگ دوم با برندهٔ تازه تمام شد؛ پرسش امروز این است که آیا داستان IE6 تکرار می‌شود.</div>

---
layout: section
type: section
module: M5
minutes: 0
link: none
---

# وب امن و سریع

<p class="since">وب همه‌جا بود، ولی بیشترش رمز نشده بود.</p>

<p class="question">وقتی بفهمیم کسی گوش می‌دهد، پروتکل‌ها چه باید بکنند؟</p>

---
module: M5
minutes: 2
link: none
corner: ایران
---

# سناریوی واقعی: گواهی جعلی Gmail در ایران

- گواهی را یک CA، یعنی صادرکنندهٔ مورد اعتماد، امضا می‌کند تا مرورگر بداند با خود `google.com` حرف می‌زند (جلسهٔ ۴)
- تیر ۱۳۹۰ نفوذگری از DigiNotar هلندی گواهی جعلی `*.google.com` گرفت؛ به گزارش [Fox-IT](https://www.bitsoffreedom.nl/wp-content/uploads/rapport-fox-it-operation-black-tulip-v1-0.pdf) حدود ۳۰۰ هزار نشانی IP که ۹۹٪ از ایران بودند با آن به میانجی وصل شدند
- ۵ شهریور ۱۳۹۰ کاربری در ایران [گزارش داد](https://slate.com/technology/2016/12/how-the-2011-hack-of-diginotar-changed-the-internets-infrastructure.html) Chrome اتصال به Gmail را قطع می‌کند: Chrome برای Google [فقط گواهی‌های مشخصی را می‌پذیرفت]{.mark} (certificate pinning)

::punch::

یک CA خراب کافی بود؛ پاسخ صنعت [Certificate Transparency](https://certificate.transparency.dev/) شد: هر گواهی در فهرستی عمومی ثبت می‌شود.

---
module: M5
minutes: 2
link: none
corner: امنیت
---

# وقتی معلوم شد چه کسی گوش می‌دهد

<div class="cols">
<div>

- در ۲۰۱۳ اسناد [اسنودن](https://en.wikipedia.org/wiki/Edward_Snowden) نشان داد شنود گستردهٔ اینترنت واقعی است
- رمزنگاری Google فقط تا لبهٔ شبکه‌اش بود و ترافیک بین مراکز داده‌اش [بدون رمز]{.mark} شنود می‌شد ([MUSCULAR](https://www.washingtonpost.com/world/national-security/nsa-infiltrates-links-to-yahoo-google-data-centers-worldwide-snowden-documents-say/2013/10/30/e51d661e-4166-11e3-8b74-d89d714ca4dd_story.html))؛ Google و Yahoo بعد از آن این ترافیک را هم رمز کردند
- نهاد استانداردهای اینترنت، [IETF](https://www.ietf.org/)، در [RFC 7258](https://www.rfc-editor.org/rfc/rfc7258) اعلام کرد [شنود فراگیر یک حمله است]{.mark}؛ پس از آن پروتکل‌های تازه مثل QUIC رمزنگاری را اجباری کردند

</div>
<Shot src="images/nsa-muscular.jpg" wiki="NSA Muscular Google Cloud.jpg" alt="اسلاید سند NSA با یادداشت SSL added and removed here" caption="سند NSA در ۲۰۱۳: «SSL added and removed here»" h="300" />
</div>

::punch::

امنیت از یک افزونه به یک پیش‌فرض تبدیل شد.

---
module: M5
minutes: 2
link: none
corner: امنیت
---

# HTTPS چطور همه‌گیر شد؟

<div class="cols">
<div>

- [Let's Encrypt](https://en.wikipedia.org/wiki/Let%27s_Encrypt) از ۲۰۱۵ گواهی HTTPS را [رایگان و خودکار]{.mark} کرد
- از Chrome 68 در مرداد ۱۳۹۷، هر صفحهٔ http با برچسب «Not secure» نشان داده می‌شود
- از ۲۴ اسفند ۱۴۰۴ عمر گواهی حداکثر ۲۰۰ روز است و تا ۲۰۲۹ به [۴۷ روز](https://www.digicert.com/blog/tls-certificate-lifetimes-will-officially-reduce-to-47-days) می‌رسد؛ تمدید دستی عملاً ناممکن و [خودکارسازی اجباری]{.mark} می‌شود

</div>
<EraArt art="secure" label="قفل HTTPS و HTTP/2 و HTTP/3" />
</div>

::punch::

وقتی کار درست آسان و کار نادرست قابل‌دیدن شود، رفتار همه عوض می‌شود.

---
module: M5
minutes: 2
link: none
corner: سرعت
---

# چطور HTTP را بدون شکستن وب بازنویسی کنیم؟

- Google در ۲۰۰۹ پروتکل آزمایشی [SPDY](https://en.wikipedia.org/wiki/SPDY) را روی Chrome و سرورهای خودش امتحان کرد
- SPDY پایهٔ [HTTP/2](https://www.rfc-editor.org/rfc/rfc7540) در ۲۰۱۵ شد، و آزمایش بعدی، QUIC، پایهٔ [HTTP/3](https://www.rfc-editor.org/rfc/rfc9114) در ۲۰۲۲
- [معنای HTTP ثابت ماند]{.mark} و فقط قالب انتقال عوض شد؛ مرورگر و سرور نسخه را با هم توافق می‌کنند و اگر یکی بلد نبود به HTTP/1.1 برمی‌گردند، پس سایت‌ها مجبور به تغییر نشدند (جلسهٔ ۴)

::punch::

پروتکلی که معنایش را از قالب انتقالش جدا کند، می‌تواند بدون شکستن گذشته تغییر کند.

---
type: interactive
module: M5
minutes: 3
link: none
---

# چرا HTTP/3 روی UDP ساخته شد، نه روی یک پروتکل انتقال تازه؟

TCP و UDP دو پروتکل انتقال اصلی‌اند؛ HTTP/3 روی QUIC و QUIC روی UDP ساخته شد.

<ol class="options">
  <li><b>الف)</b> UDP ذاتاً سریع‌تر است</li>
  <li v-mark.box.orange="1"><b>ب)</b> تجهیزات میان راه پروتکل ناشناخته را می‌اندازند</li>
  <li><b>ج)</b> TCP منسوخ شده است</li>
  <li><b>د)</b> UDP رمزنگاری داخلی دارد</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ب)</strong> فایروال و NAT بیشتر فقط TCP و UDP را می‌شناسند (<a href="https://en.wikipedia.org/wiki/Protocol_ossification">ossification</a>). TCP در هستهٔ سیستم‌عامل هم دیر عوض می‌شود ولی QUIC در خود مرورگر است (<a href="https://dl.acm.org/doi/10.1145/3098822.3098842">مقالهٔ طراحان</a>)، و سرآیندش را رمز می‌کند تا دوباره گیر نیفتد.</div>

::punch::

<div v-click="1">زیرساختی که همه به آن تکیه کرده‌اند، خودش مانع تغییر می‌شود.</div>

---
layout: section
type: section
module: M6
minutes: 0
link: none
---

# عصر هوش مصنوعی

<p class="since">وب امن و سریع شد؛ حالا خوانندهٔ تازه‌ای از راه رسید.</p>

<p class="question">وقتی کلاینت دیگر انسان نیست، چه چیزی در پروتکل‌ها عوض می‌شود؟</p>

---
module: M6
minutes: 2
link: none
corner: هوش مصنوعی
---

# گفتگو با یک مدل، رابط تازهٔ وب

<div class="cols">
<div>

- [ChatGPT](https://en.wikipedia.org/wiki/ChatGPT) در آذر ۱۴۰۱ منتشر شد و گفتگو با مدل زبانی را همه‌گیر کرد
- مدل متن را توکن‌به‌توکن تولید می‌کند و API هر تکه را همان لحظه با [SSE](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) می‌فرستد؛ برای همین پاسخ کم‌کم ظاهر می‌شود (جلسهٔ ۶)
- مدل‌ها برای یادگیری و پاسخ دادن [وب را می‌خوانند]{.mark}، و این رابطهٔ سایت‌ها با خواننده‌هایشان را عوض کرد

</div>
<EraArt art="ai" label="گفتگو و agent و MCP و ۴۰۲" />
</div>

::punch::

خوانندهٔ وب دیگر فقط انسان نیست.

---
type: interactive
module: M6
minutes: 3
link: none
---

# امروز چه کسی بیشتر وب را می‌خواند: انسان یا بات؟

<ol class="options">
  <li><b>الف)</b> انسان، با فاصلهٔ زیاد</li>
  <li><b>ب)</b> تقریباً نصف‌نصف، با برتری انسان</li>
  <li v-mark.box.orange="1"><b>ج)</b> بات‌ها، کمی بیشتر از نصف</li>
  <li><b>د)</b> بات‌ها، بیش از ۹۰ درصد</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ج)</strong> در ۲۰۲۴ برای اولین بار در یک دهه ترافیک خودکار از انسان بیشتر شد (۵۱ درصد)، و طبق <a href="https://www.imperva.com/blog/bad-bot-report-2026-bots-agentic-age/">گزارش ۱۴۰۵ Imperva</a> در ۲۰۲۵ به ۵۳ درصد رسید؛ agentهای هوش مصنوعی، یعنی برنامه‌هایی که به‌جای کاربر وب را می‌گردند و کار انجام می‌دهند، حالا دستهٔ تازه‌ای از این ترافیک‌اند.</div>

::punch::

<div v-click="1">پروتکلی که برای انسان طراحی شد، حالا بیشتر با ماشین حرف می‌زند.</div>

---
module: M6
minutes: 2
link: none
corner: هوش مصنوعی
---

# سایت‌ها با خزنده‌های هوش مصنوعی چه می‌کنند؟

- فایل robots.txt از ۱۹۹۴ هست و از ۲۰۲۲ با [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309) استاندارد شد؛ ولی هنوز فقط یک «خواهش» است، نه قفل
- در تیر ۱۴۰۴ Cloudflare برای دامنه‌های تازه خزنده‌های هوش مصنوعی را [پیش‌فرض مسدود کرد]{.mark}؛ در [تیر ۱۴۰۵](https://blog.cloudflare.com/content-independence-day-ai-options/) بات جستجو و agent و آموزش را از هم جدا کرد
- کد وضعیت [402](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/402)، «پرداخت لازم است»، نزدیک سه دهه بی‌استفاده ماند تا [x402](https://www.infoq.com/news/2026/07/cloudflare-aws-x402-micropayment/): سرور 402 و قیمت را برمی‌گرداند و agent می‌پردازد؛ AWS از خرداد ۱۴۰۵ آن را ارائه می‌دهد (جلسهٔ ۷)

::punch::

یک کد وضعیت فراموش‌شده، ابزار یک مدل اقتصادی تازه شد.

---
module: M6
minutes: 2
link: none
corner: هوش مصنوعی
---

# وقتی بات هم خودش را Chrome معرفی می‌کند

- مرداد ۱۴۰۴ Cloudflare [گزارش داد](https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/) خزندهٔ اعلام‌نشدهٔ Perplexity، وقتی مسدود می‌شد، با این User-Agent روزی میلیون‌ها درخواست می‌فرستاد؛ Perplexity ادعا را رد کرد:

```text
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36
    (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36
```

- خود Chrome از ۱۴۰۱ User-Agent را [یخ زد](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/User-agent_reduction) و جزئیات را به هدرهای `Sec-CH-UA-*` برد
- راه تازه [هویت با امضا، نه با ادعا]{.mark} است: [Web Bot Auth](https://datatracker.ietf.org/doc/draft-ietf-webbotauth-httpsig-protocol/) در IETF (جلسهٔ ۷)

::punch::

هدری که هرکس می‌تواند بنویسد، هویت نیست؛ همان درس دههٔ ۹۰، این بار برای بات‌ها.

---
module: M6
minutes: 2
link: none
corner: هوش مصنوعی
---

# وقتی agent به‌جای شما مرور می‌کند

- مرورگرهای هوش مصنوعی مثل Comet (تیر ۱۴۰۴) و ChatGPT Atlas (مهر ۱۴۰۴) خودشان صفحه باز می‌کنند، فرم پر می‌کنند و حتی خرید می‌کنند؛ از [بهمن ۱۴۰۴](https://techcrunch.com/2026/01/28/chrome-takes-on-ai-browsers-with-tighter-gemini-integration-agentic-features-for-autonomous-tasks/) خود Chrome هم با auto browse همین کار را می‌کند
- [MCP](https://modelcontextprotocol.io) (آذر ۱۴۰۳) پروتکلی است که agentها با آن به ابزارها و داده‌ها وصل می‌شوند
- پژوهشگران امنیتی در همان ماه‌های اول، [prompt injection](https://brave.com/blog/comet-prompt-injection/) را در مرورگر Comet نشان دادند؛ [صفحه‌ای که agent می‌خواند، می‌تواند به او دستور بدهد]{.mark} (جلسهٔ ۱)

::punch::

کلاینت تازه، حمله‌های تازه می‌آورد؛ ولی روی همان پروتکل‌های قدیمی.

---
module: M6
minutes: 2
link: none
corner: هوش مصنوعی
---

# تاریخ تکرار می‌شود: MCP چه چیزی را دوباره کشف کرد؟

- [مشخصات تازهٔ MCP](https://blog.modelcontextprotocol.io/posts/2026-07-28/) (مرداد ۱۴۰۵) session، یعنی حافظهٔ سرور از گفتگو، را حذف کرد: [بی‌حالتی]{.mark} مثل HTTP
- state به برنامه رفت: سرور شناسه‌ای می‌دهد و مدل آن را پس می‌فرستد، مثل کوکی (جلسهٔ ۳)
- پاسخ‌ها زمان اعتبار گرفتند، شبیه `max-age` در `Cache-Control` (جلسهٔ ۵)
- هدر `Mcp-Method` آمد تا واسطه‌ها بدون خواندن بدنهٔ درخواست مسیریابی کنند (جلسهٔ ۷)

::punch::

پروتکل‌های تازه اغلب همان درس‌های قدیمی را دوباره یاد می‌گیرند؛ این درس برای این است که شما آن‌ها را از قبل بدانید.

---
layout: section
type: section
module: M7
minutes: 0
link: none
---

# از اینجا به بعد

<p class="since">از «LO» تا agentها را دیدیم.</p>

<p class="question">از این داستان‌ها چه الگوهایی برای مهندسی می‌ماند؟</p>

---
module: M7
minutes: 3
link: none
corner: جمع‌بندی
---

# چهار الگو در همهٔ این داستان‌ها

| الگو | نمونه‌ها |
| --- | --- |
| هزینهٔ پذیرش کمتر معمولاً برنده می‌شود | وب رایگان در برابر Gopher، و IE همراه Windows و Let's Encrypt |
| انحصار و تمرکز شکننده است | IE6 و Chromium و قطعی AWS در مهر ۱۴۰۴ |
| هرچه پرکاربردتر، عوض کردنش سخت‌تر | IPv6 و SmooshGate و User-Agent و QUIC روی UDP |
| امنیت دیرهنگام گران است | DigiNotar؛ و این بار زودتر، رمزنگاری [پساکوانتومی](https://blog.cloudflare.com/post-quantum-roadmap/) |

::punch::

هر جا یکی از این الگوها را دیدید علامتش بزنید؛ اولین بار در تمرین ۰.

---
module: M7
minutes: 3
link: none
corner: قواعد درس
---

# قواعد بازی: تمرین، پروژه و نمره

<div class="cols">
<div>

- هر جلسه یک تمرین دارد: [پیش‌بینی سر کلاس]{.mark}، آزمایش در خانه، توضیح اختلاف، و یک تصمیم مهندسی
- تحویل در مخزن git خصوصی خودتان (مثلاً `ie1405-401234567`)؛ مهلت شب پیش از جلسهٔ بعد، و در کل ترم ۴ روز تأخیر مجاز
- پروژهٔ دونفره: یک سرویس برای دو نوع کاربر، انسان و agent
- استفاده از هوش مصنوعی مجاز است، با اعلام در `AI.md`؛ آنچه نتوانید توضیح دهید نمره ندارد

</div>
<div>

| بخش | نمره |
| --- | --- |
| تمرین‌ها (۶ بهتر از ۷) | ۵ |
| پروژه، با دفاع فردی | ۶ |
| پایان‌ترم | ۸ |
| مشارکت در سؤال‌های کلاسی | ۱ |

<p class="small">جزئیات: <CourseLink path="policy/" /></p>

</div>
</div>

::punch::

پیش‌بینی غلطِ خوب‌استدلال‌شده نمرهٔ کامل دارد؛ آنچه نمره می‌گیرد استدلال است.

---
type: exercise
module: M7
minutes: 4
link: none
corner: تمرین
---

# تمرین ۰: یک درخواست به چه کسانی وابسته است؟

<Exercise ex="00-toolbox" due="تا شب پیش از جلسهٔ ۱">
<dl class="run">
  <dt>چالش</dt><dd>برای سه سایت، یکی ایرانی، زمان هر مرحلهٔ رسیدن را با <code>curl</code> بسنجید و نقشهٔ وابستگی‌اش را بکشید: چه کسی نام‌هایش را پاسخ می‌دهد، سرورش مال کیست و گواهی‌اش را چه کسی صادر کرده.</dd>
  <dt>پیش‌بینی</dt><dd>همین حالا روی کاغذ: در اولین درخواست به سایت ایرانی‌تان کدام مرحله کندتر است، و اگر قطعی ۲۸ مهر تکرار شود آن سایت از کار می‌افتد؟</dd>
  <dt>پل</dt><dd>همین حلقه‌ها و وابستگی‌ها موضوع جلسهٔ ۱ است.</dd>
</dl>
</Exercise>

---
src: ../ch1-syllabus.md
type: core
module: M7
minutes: 1
---



---
type: extra
module: M7
minutes: 0
link: none
corner: جمع‌بندی
---

# برای کنجکاوی بیشتر (۱ از ۲)

<ol class="curious">
  <li>چرا اولین پیام ARPANET بعد از دو حرف قطع شد، و در آن سال‌ها «از کار افتادن» یک گره چه معنایی داشت؟<span class="hint">روایت لئونارد کلاینراک از شب ۲۹ اکتبر ۱۹۶۹.</span></li>
  <li>چرا در بعضی سایت‌های فارسی جستجوی «کیک» نتیجهٔ «كيك» را پیدا نمی‌کند، با اینکه روی صفحه یکی به نظر می‌رسند؟<span class="hint">«ی» فارسی و «ي» عربی در Unicode دو نویسهٔ جدا هستند (<code>U+06CC</code> و <code>U+064A</code>)؛ استاندارد صفحه‌کلید فارسی ISIRI 9147 (فروردین ۱۳۸۶) را هم ببینید.</span></li>
  <li>RFC 7258 دقیقاً از طراحان پروتکل چه می‌خواهد؟<span class="hint">متن خود RFC را بخوانید؛ فقط چند صفحه است.</span></li>
</ol>

---
type: extra
module: M7
minutes: 0
link: none
corner: جمع‌بندی
---

# برای کنجکاوی بیشتر (۲ از ۲)

<ol class="curious" style="counter-reset: q 3">
  <li>چرا یک خطای DNS در یک منطقهٔ AWS، سرویس‌هایی را در سراسر دنیا انداخت و چرا بازگشت کامل ساعت‌ها بیشتر از رفع خود خطا طول کشید؟<span class="hint">بخش‌های DynamoDB و EC2 در گزارش رسمی AWS، و نقش منطقهٔ us-east-1.</span></li>
  <li>مرورگر شما الان چه User-Agentی می‌فرستد، و Chrome کدام جزئیات را فقط وقتی می‌دهد که سرور بخواهد؟<span class="hint">زبانهٔ Network در DevTools؛ هدرهای <code>Accept-CH</code> و <code>Sec-CH-UA</code> در MDN.</span></li>
  <li>اصل Postel می‌گوید «در فرستادن سخت‌گیر و در پذیرفتن آسان‌گیر باش». چرا IETF در ۲۰۲۳ نوشت این اصل در بلندمدت به پروتکل‌ها آسیب می‌زند، و چه ربطی به IE6 و User-Agent دارد؟<span class="hint">RFC 9413، و GREASE در RFC 8701.</span></li>
</ol>

---
type: reserve
module: M7
minutes: 0
link: none
corner: منابع
---

# منابع (۱ از ۲)

<ul class="src two">
  <li><a href="https://aws.amazon.com/message/101925/">گزارش AWS از قطعی ۲۸ مهر ۱۴۰۴ <bdi>(20 Oct 2025)</bdi></a></li>
  <li><a href="https://en.wikipedia.org/wiki/ARPANET">ARPANET</a> · <a href="https://en.wikipedia.org/wiki/Paul_Baran">Paul Baran</a> · <a href="https://www.americanhistory.si.edu/explore/stories/internet-uttered-lo-forty-years-ago">Smithsonian: LO</a></li>
  <li><a href="https://www.internetsociety.org/internet/history-internet/brief-history-internet/">ISOC: Brief History of the Internet</a></li>
  <li><a href="https://www.cs.princeton.edu/courses/archive/fall06/cos561/papers/cerf74.pdf">مقالهٔ TCP/IP (۱۹۷۴)</a> · <a href="https://web.mit.edu/Saltzer/www/publications/endtoend/endtoend.pdf">مقالهٔ end-to-end</a></li>
  <li><a href="https://en.wikipedia.org/wiki/Flag_day_(computing)">Flag day (computing)</a> · <a href="https://www.rfc-editor.org/rfc/rfc801">RFC 801</a></li>
  <li><a href="https://blog.apnic.net/2026/04/28/google-hits-50-ipv6/">APNIC: IPv6 در آمار Google</a></li>
  <li><a href="https://info.cern.ch">info.cern.ch: نخستین وب‌سایت</a> · <a href="https://www.w3.org/History/1989/proposal.html">پیشنهاد ۱۹۸۹</a></li>
  <li><a href="https://en.wikipedia.org/wiki/History_of_the_World_Wide_Web">History of the World Wide Web</a></li>
  <li><a href="https://nsrc.org/regions/MIDEAST/IR/internet-iran-2001.pdf">NSRC: Iran's Telecom and Internet Sector</a></li>
  <li><a href="https://iranian.com/WebGuide/InternetIran/InternetIran.html">The Iranian: The Internet in Iran (۱۹۹۷)</a> · <a href="https://en.wikipedia.org/wiki/.ir">.ir</a></li>
  <li><a href="https://en.wikipedia.org/wiki/Browser_wars">Browser wars</a> · <a href="https://en.wikipedia.org/wiki/Pierre_Omidyar">Pierre Omidyar</a></li>
  <li><a href="https://developer.chrome.com/blog/smooshgate">SmooshGate</a> · <a href="https://whatwg.org/">WHATWG</a> · <a href="https://webaim.org/blog/user-agent-string-history/">تاریخچهٔ User-Agent</a></li>
  <li><a href="https://irancell.ir/en/p/4852/irancell-background">Irancell: تاریخچه</a> · <a href="https://www.npr.org/2025/09/02/nx-s1-5478625/google-chrome-doj-antitrust-ruling">NPR: حکم Chrome</a></li>
  <li>تصویرها: ویکی‌مدیا؛ صاحب اثر و مجوز زیر هر تصویر</li>
</ul>

---
type: reserve
module: M7
minutes: 0
link: none
corner: منابع
---

# منابع (۲ از ۲)

<ul class="src two">
  <li><a href="https://www.bitsoffreedom.nl/wp-content/uploads/rapport-fox-it-operation-black-tulip-v1-0.pdf">Fox-IT: Operation Black Tulip</a> · <a href="https://slate.com/technology/2016/12/how-the-2011-hack-of-diginotar-changed-the-internets-infrastructure.html">Slate: DigiNotar</a></li>
  <li><a href="https://certificate.transparency.dev/">Certificate Transparency</a> · <a href="https://www.rfc-editor.org/rfc/rfc6962">RFC 6962</a></li>
  <li><a href="https://www.washingtonpost.com/world/national-security/nsa-infiltrates-links-to-yahoo-google-data-centers-worldwide-snowden-documents-say/2013/10/30/e51d661e-4166-11e3-8b74-d89d714ca4dd_story.html">Washington Post: MUSCULAR</a> · <a href="https://www.rfc-editor.org/rfc/rfc7258">RFC 7258</a></li>
  <li><a href="https://www.digicert.com/blog/tls-certificate-lifetimes-will-officially-reduce-to-47-days">DigiCert: گواهی ۴۷ روزه</a> · <a href="https://blog.cloudflare.com/post-quantum-roadmap/">Cloudflare: پساکوانتومی</a></li>
  <li><a href="https://www.rfc-editor.org/rfc/rfc7540">RFC 7540</a> · <a href="https://www.rfc-editor.org/rfc/rfc9114">RFC 9114</a> · <a href="https://dl.acm.org/doi/10.1145/3098822.3098842">مقالهٔ QUIC</a></li>
  <li><a href="https://en.wikipedia.org/wiki/Protocol_ossification">Protocol ossification</a></li>
  <li><a href="https://www.imperva.com/blog/bad-bot-report-2026-bots-agentic-age/">Imperva: Bad Bot Report 2026</a></li>
  <li><a href="https://blog.cloudflare.com/content-independence-day-ai-options/">Cloudflare: ترافیک هوش مصنوعی (۱۴۰۵)</a></li>
  <li><a href="https://www.infoq.com/news/2026/07/cloudflare-aws-x402-micropayment/">InfoQ: x402 در Cloudflare و AWS</a></li>
  <li><a href="https://www.rfc-editor.org/rfc/rfc9309">RFC 9309</a> · <a href="https://brave.com/blog/comet-prompt-injection/">پژوهش Brave دربارهٔ Comet</a></li>
  <li><a href="https://developer.apple.com/app-store/review/guidelines/#software-requirements">قاعدهٔ WebKit در Apple</a></li>
  <li><a href="https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/">Cloudflare: خزندهٔ Perplexity</a> · <a href="https://datatracker.ietf.org/doc/draft-ietf-webbotauth-httpsig-protocol/">Web Bot Auth</a></li>
  <li><a href="https://techcrunch.com/2026/01/28/chrome-takes-on-ai-browsers-with-tighter-gemini-integration-agentic-features-for-autonomous-tasks/">TechCrunch: auto browse در Chrome</a></li>
  <li><a href="https://blog.modelcontextprotocol.io/posts/2026-07-28/">MCP: مشخصات مرداد ۱۴۰۵</a></li>
</ul>

---
type: reserve
module: M7
minutes: 0
link: none
corner: تمرین
---

# نمونهٔ خروجی تمرین ۰

<Shot src="images/ex00-sample.png" alt="خروجی curl و dig برای scu.ac.ir" how="از شبکهٔ دانشگاه با VPN خاموش: دستور curl تمرین ۰ دو بار برای scu.ac.ir، سپس dig NS scu.ac.ir؛ اسکرین‌شات ترمینال." h="380" />

::punch::

عددهای شما فرق می‌کند؛ مهم این است که بگویید چرا.
