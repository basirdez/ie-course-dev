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
  M5: { slug: secure-web, title: ۲۰۱۳ تا ۲۰۲۲ }
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

# اگر فردا DNS همهٔ دنیا خاموش شود، چه چیزهایی از کار می‌افتد؟

یک دقیقه فکر کنید و فهرست بدهید؛ بعد با هم ببینیم.

<div v-click="1" class="answer"><strong>آنچه واقعاً می‌افتد:</strong> تقریباً همه‌چیز؛ وب‌سایت‌ها، پیام‌رسان‌ها، بانک‌ها، به‌روزرسانی گوشی، و حتی بخشی از زیرساخت خود ابرها. در مهر ۱۴۰۴ فقط خالی شدن یک رکورد DNS در AWS هزاران سرویس را از کار انداخت.</div>

::punch::

<div v-click="1">اینترنت مجموعه‌ای از قراردادهاست که هرکدام روزی یک تصمیم مهندسی بوده؛ این جلسه داستان همین تصمیم‌هاست.</div>

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

# شبکه‌ای برای روز مبادا

<p class="since">دهه‌های ۱۹۶۰ و ۱۹۷۰؛ هنوز نه وبی بود، نه مرورگری.</p>

<p class="question">چطور شبکه‌ای بسازیم که با از کار افتادن هر بخشش، از کار نیفتد؟</p>

---
module: M1
minutes: 2
link: none
corner: ARPANET
---

# چرا شبکه‌ای که هیچ مرکزی ندارد؟

<div class="cols">
<div>

- در اوایل دههٔ ۱۹۶۰ [پل باران](https://en.wikipedia.org/wiki/Paul_Baran) نشان داد شبکهٔ [توزیع‌شده]{.mark} با از دست دادن بخشی از گره‌ها هنوز کار می‌کند، ولی شبکهٔ متمرکز با یک خرابی می‌میرد
- دانلد دیویس در بریتانیا نام [packet](https://en.wikipedia.org/wiki/Packet_switching) را گذاشت: پیام را تکه‌تکه کن و هر تکه را جدا بفرست
- همین ایده پایهٔ ARPANET شد که در ۱۹۶۹ چهار مرکز پژوهشی و دانشگاهی آمریکا را به هم وصل کرد

</div>
<EraArt art="mesh" label="شبکهٔ متمرکز در برابر توزیع‌شده" />
</div>

::punch::

طراحی بدون مرکز یعنی هیچ‌کس نمی‌تواند کل اینترنت را خاموش کند؛ ولی هیچ‌کس هم کل آن را اداره نمی‌کند.

---
type: interactive
module: M1
minutes: 3
link: none
---

# اولین پیام اینترنت چه بود؟

۲۹ اکتبر ۱۹۶۹، از UCLA به SRI.

<ol class="options">
  <li><b>الف)</b> HELLO</li>
  <li v-mark.box.orange="1"><b>ب)</b> LO</li>
  <li><b>ج)</b> TEST</li>
  <li><b>د)</b> LOGIN</li>
</ol>

<div v-click="1" class="cols">
<div class="answer"><strong>پاسخ: ب)</strong> قرار بود LOGIN فرستاده شود؛ سیستم بعد از دو حرف از کار افتاد و «LO» اولین پیام شد. حدود یک ساعت بعد پیام کامل رسید (<a href="https://en.wikipedia.org/wiki/ARPANET">ARPANET</a>).</div>
<Shot src="images/imp-log-1969.jpg" wiki="First-arpanet-imp-log.jpg" alt="دفتر ثبت IMP در UCLA، شب ۲۹ اکتبر ۱۹۶۹" caption="دفتر ثبت UCLA، شب ۲۹ اکتبر ۱۹۶۹" h="170" />
</div>

::punch::

<div v-click="1">اولین پیام اینترنت با یک خرابی ثبت شد؛ از همان روز، هر حلقه‌ای می‌توانست وسط کار بشکند.</div>

---
module: M1
minutes: 2
link: none
corner: TCP/IP
---

# چطور یک شبکهٔ کامل را در یک شب عوض کنیم؟

<div class="cols">
<div>

- در [یکم ژانویهٔ ۱۹۸۳](https://en.wikipedia.org/wiki/Flag_day_(computing)) همهٔ ARPANET باید هم‌زمان به [TCP/IP](https://en.wikipedia.org/wiki/Internet_protocol_suite) کوچ می‌کرد؛ هر میزبانی که آماده نبود، قطع می‌شد
- در همان سال [DNS](https://developer.mozilla.org/en-US/docs/Glossary/DNS) طراحی شد تا جای فایل مشترک HOSTS.TXT را بگیرد (جلسهٔ ۱)
- آن روز شبکه آن‌قدر کوچک بود که می‌شد همه را یک‌جا عوض کرد؛ امروز IPv6 با وجود بیش از ۲۵ سال عمر، هنوز [همه‌جا جای IPv4 را نگرفته]{.mark}

</div>
<Shot src="images/arpanet-map-1977.png" wiki="Arpanet logical map, march 1977.png" alt="نقشهٔ منطقی ARPANET در مارس ۱۹۷۷" caption="کل ARPANET در مارس ۱۹۷۷ در یک صفحه جا می‌شد" h="330" />
</div>

::punch::

هرچه یک پروتکل پرکاربردتر شود، عوض کردنش سخت‌تر می‌شود.

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

دو تا از این سه اختراع، موضوع همین درس‌اند.

---
module: M2
minutes: 2
link: none
corner: وب
---

# چرا وب برنده شد و Gopher نه؟

- در ۱۹۹۳ [Gopher](https://en.wikipedia.org/wiki/Gopher_(protocol)) از وب محبوب‌تر بود
- همان سال دانشگاه مینه‌سوتا اعلام کرد برای استفادهٔ تجاری از سرور Gopher [هزینهٔ مجوز]{.mark} می‌گیرد
- کمی بعد، در ۳۰ آوریل ۱۹۹۳، CERN نرم‌افزار وب را [رایگان و برای همه](https://en.wikipedia.org/wiki/History_of_the_World_Wide_Web) اعلام کرد؛ توسعه‌دهندگان به سمت وب رفتند

::punch::

در پروتکل‌ها، باز بودن اغلب از بهتر بودن مهم‌تر است.

---
module: M2
minutes: 2
link: none
corner: ایران
---

# ایران کِی به اینترنت وصل شد؟

<div class="cols">
<div>

- ۱۳۶۸: پژوهشگاه دانش‌های بنیادی (IPM) به شبکهٔ علمی BITNET وصل شد؛ بیشتر برای ایمیل
- ۱۳۷۲: نخستین اتصال اینترنتی ایران از همان پژوهشگاه و از راه دانشگاه وین، با [پهنای باندی در حد ایمیل]{.mark}
- ۱۳۷۳: دامنهٔ ملی `.ir` در IPM راه افتاد و ندا رایانه نخستین اینترنت شماره‌گیر عمومی را عرضه کرد

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
- سازندگانش [Netscape](https://en.wikipedia.org/wiki/Netscape) را ساختند؛ عرضهٔ سهام آن در اوت ۱۹۹۵ آغاز تب دات‌کام بود
- وب از ابزار دانشگاهی به [محصولی برای همه]{.mark} تبدیل شد

</div>
<Shot src="images/mosaic.png" wiki="NCSA Mosaic Browser Screenshot.png" alt="نمای مرورگر NCSA Mosaic" caption="مرورگر NCSA Mosaic: متن و تصویر در یک صفحه" h="320" />
</div>

::punch::

رابط کاربری خوب، یک پروتکل را از آزمایشگاه به خانه‌ها برد.

---
type: interactive
module: M3
minutes: 3
link: none
---

# JavaScript در چند روز ساخته شد؟

<ol class="options">
  <li v-mark.box.orange="1"><b>الف)</b> ۱۰ روز</li>
  <li><b>ب)</b> ۱۰ هفته</li>
  <li><b>ج)</b> ۶ ماه</li>
  <li><b>د)</b> ۲ سال</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: الف)</strong> برندن آیک در مه ۱۹۹۵ نسخهٔ اول <a href="https://developer.mozilla.org/en-US/docs/Glossary/JavaScript">JavaScript</a> را در حدود ده روز در Netscape نوشت؛ بعضی تصمیم‌های عجولانهٔ همان ده روز هنوز در زبان مانده‌اند.</div>

::punch::

<div v-click="1">تصمیمی که در ده روز گرفته شود، ممکن است سی سال بماند.</div>

---
module: M3
minutes: 2
link: none
corner: مرورگرها
---

# سه اختراع Netscape که هنوز با ماست

<div class="cols">
<div>

- [کوکی](https://developer.mozilla.org/en-US/docs/Glossary/Cookie) (۱۹۹۴): راهی برای اینکه پروتکل بی‌حالت، کاربر را به یاد بیاورد (جلسهٔ ۳)
- [SSL](https://en.wikipedia.org/wiki/Transport_Layer_Security) (۱۹۹۵): رمزنگاری برای خرید اینترنتی؛ نوادهٔ امروزی‌اش TLS است (جلسهٔ ۴)
- JavaScript (۱۹۹۵): برنامه‌ای که [داخل صفحه اجرا می‌شود]{.mark}

</div>
<EraArt art="war1" label="کوکی و SSL و JavaScript" />
</div>

::punch::

هر سه برای حل یک مشکل تجاری فوری ساخته شدند و هر سه امروز استاندارد جهانی‌اند.

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
- [Chrome](https://en.wikipedia.org/wiki/Google_Chrome) (۲۰۰۸) هر زبانه را در یک پردازهٔ جدا اجرا کرد و موتور JavaScript سریعی به نام V8 آورد
- چند سال بعد ترافیک وب از گوشی‌ها از رایانه‌های رومیزی بیشتر شد و [کندی شبکه]{.mark} دوباره مسئلهٔ اصلی شد

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

<div v-click="1" class="answer"><strong>پاسخ: الف)</strong> Chrome و Edge و Opera و Brave، و حتی مرورگرهای هوش مصنوعی مثل Comet و ChatGPT Atlas، همه روی Chromium ساخته شده‌اند؛ Edge در ۲۰۲۰ موتور خودش را کنار گذاشت.</div>

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
corner: امنیت
---

# وقتی معلوم شد چه کسی گوش می‌دهد

<div class="cols">
<div>

- در ۲۰۱۳ اسناد [اسنودن](https://en.wikipedia.org/wiki/Edward_Snowden) نشان داد شنود گستردهٔ اینترنت واقعی است
- رمزنگاری Google فقط تا لبهٔ شبکه‌اش بود و ترافیک بین مراکز داده‌اش [بدون رمز]{.mark} شنود می‌شد ([MUSCULAR](https://www.washingtonpost.com/world/national-security/nsa-infiltrates-links-to-yahoo-google-data-centers-worldwide-snowden-documents-say/2013/10/30/e51d661e-4166-11e3-8b74-d89d714ca4dd_story.html))؛ Google و Yahoo بعد از آن این ترافیک را هم رمز کردند
- نهاد استانداردهای اینترنت، [IETF](https://www.ietf.org/)، در [RFC 7258](https://www.rfc-editor.org/rfc/rfc7258) اعلام کرد [شنود فراگیر یک حمله است]{.mark} و رمزنگاری پیش‌فرض پروتکل‌های تازه شد

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
- هزینه و زحمت گواهی حذف شد و فشار مرورگر بقیهٔ کار را کرد

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
- SPDY پایهٔ [HTTP/2](https://www.rfc-editor.org/rfc/rfc9113) در ۲۰۱۵ شد، و آزمایش بعدی، QUIC، پایهٔ [HTTP/3](https://www.rfc-editor.org/rfc/rfc9114) در ۲۰۲۲
- [معنای HTTP ثابت ماند]{.mark} و فقط قالب انتقال عوض شد؛ برای همین هیچ سایتی نشکست (جلسهٔ ۴)

::punch::

پروتکلی که معنایش را از قالب انتقالش جدا کند، می‌تواند بدون شکستن گذشته تغییر کند.

---
type: interactive
module: M5
minutes: 3
link: none
---

# چرا HTTP/3 روی UDP ساخته شد، نه روی یک پروتکل انتقال تازه؟

<ol class="options">
  <li><b>الف)</b> UDP ذاتاً از هر پروتکلی سریع‌تر است</li>
  <li v-mark.box.orange="1"><b>ب)</b> فایروال‌ها و NATها پروتکل ناشناخته را می‌اندازند</li>
  <li><b>ج)</b> TCP منسوخ و ممنوع شده است</li>
  <li><b>د)</b> UDP رمزنگاری داخلی دارد</li>
</ol>

<div v-click="1" class="answer"><strong>پاسخ: ب)</strong> تجهیزات میان راه فقط TCP و UDP را می‌شناسند و پروتکل تازه از آن‌ها رد نمی‌شد. QUIC روی UDP سوار شد و بقیهٔ کار را خودش، رمزشده، انجام داد. نام این پدیده <a href="https://en.wikipedia.org/wiki/Protocol_ossification">ossification</a> است.</div>

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
- APIهای مدل‌ها پاسخ را با [SSE](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) تکه‌تکه می‌فرستند، و همین است که متن را کلمه‌به‌کلمه می‌بینید (جلسهٔ ۶)
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

<div v-click="1" class="answer"><strong>پاسخ: ج)</strong> طبق <a href="https://www.imperva.com/resources/resource-library/reports/2025-bad-bot-report/">گزارش Imperva</a>، در ۲۰۲۴ برای اولین بار در یک دهه ترافیک خودکار از انسان بیشتر شد: ۵۱ درصد؛ و ۳۷ درصد کل ترافیک بات‌های مخرب بودند.</div>

::punch::

<div v-click="1">پروتکلی که برای انسان طراحی شد، حالا بیشتر با ماشین حرف می‌زند.</div>

---
module: M6
minutes: 2
link: none
corner: هوش مصنوعی
---

# سایت‌ها با خزنده‌های هوش مصنوعی چه می‌کنند؟

- فایل [robots.txt](https://en.wikipedia.org/wiki/Robots.txt) از ۱۹۹۴ فقط یک «خواهش» است، نه قفل
- در تیر ۱۴۰۴ Cloudflare خزنده‌های هوش مصنوعی را [به‌طور پیش‌فرض مسدود کرد]{.mark} و «پرداخت به ازای خزیدن» را معرفی کرد
- کد وضعیت [402](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/402)، «پرداخت لازم است»، که نزدیک سه دهه بی‌استفاده مانده بود دوباره زنده شد (جلسهٔ ۷)

::punch::

یک کد وضعیت فراموش‌شده، ابزار یک مدل اقتصادی تازه شد.

---
module: M6
minutes: 2
link: none
corner: هوش مصنوعی
---

# وقتی agent به‌جای شما مرور می‌کند

- مرورگرهای هوش مصنوعی مثل Comet (تیر ۱۴۰۴) و ChatGPT Atlas (مهر ۱۴۰۴) خودشان صفحه باز می‌کنند، فرم پر می‌کنند و حتی خرید می‌کنند
- [MCP](https://modelcontextprotocol.io) (آذر ۱۴۰۳) پروتکلی است که agentها با آن به ابزارها و داده‌ها وصل می‌شوند
- پژوهشگران امنیتی در همان ماه‌های اول، [prompt injection](https://simonwillison.net/tags/prompt-injection/) را در مرورگر Comet نشان دادند؛ [صفحه‌ای که agent می‌خواند، می‌تواند به او دستور بدهد]{.mark} (جلسهٔ ۱)

::punch::

کلاینت تازه، حمله‌های تازه می‌آورد؛ ولی روی همان پروتکل‌های قدیمی.

---
module: M6
minutes: 2
link: none
corner: هوش مصنوعی
---

# تاریخ تکرار می‌شود: MCP چه چیزی را دوباره کشف کرد؟

- [بازنگری ۲۰۲۶ مشخصات MCP](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) session سطح پروتکل را حذف کرد: [بی‌حالتی]{.mark}، همان تصمیم HTTP در دههٔ ۱۹۹۰
- نتیجه‌ها زمان اعتبار قابل‌cache گرفتند، با الگوبرداری از `Cache-Control` در HTTP (جلسهٔ ۵)
- هدرهایی اضافه شد تا load balancer بدون خواندن body درخواست را مسیریابی کند (جلسهٔ ۷)

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
| باز بودن معمولاً برنده می‌شود | وب در برابر Gopher؛ TCP/IP |
| انحصار، استاندارد را متوقف می‌کند | IE6؛ نگرانی امروز از یک‌دستی Chromium |
| هرچه پرکاربردتر، عوض کردنش سخت‌تر | کوچ یک‌شبهٔ ۱۹۸۳؛ IPv6؛ QUIC روی UDP |
| امنیتی که دیر اضافه شود گران تمام می‌شود | SSL به‌عنوان افزونه؛ HTTPS همه‌جا بعد از ۲۰۱۳ |

::punch::

در طول این درس، هر جا یکی از این چهار الگو را دیدید، علامتش بزنید.

---
module: M7
minutes: 2
link: none
corner: قواعد درس
---

# کار شما در این درس چه ریتمی دارد؟

- **هر جلسه، تمرین کوتاه:** [پیش‌بینی روی کاغذ سر کلاس]{.mark}، بدون ابزار؛ بعد آزمایشی حداکثر ۳۰ دقیقه‌ای در خانه
- **هر هفته، تمرین هفته:** کاری عمیق‌تر در مخزن git خصوصی خودتان
- **هر ماه، یک گام پروژه:** دونفره؛ یک سرویس برای دو نوع کاربر، انسان و agent
- **و یک ارائه:** یک یا دونفره. جزئیات تمرین هفته، پروژه و ارائه در کانال درس اعلام می‌شود

<p class="small">چرا پیش‌بینی بدون ابزار؟ آزمایشی روی حدود ۱۰۰۰ دانش‌آموز ریاضی: <a href="https://www.pnas.org/doi/10.1073/pnas.2422633122">Bastani و همکاران، PNAS ۲۰۲۵</a></p>

::punch::

در آن آزمایش، دسترسی آزاد به ChatGPT نمرهٔ تمرین را ۴۸٪ بالا برد، ولی در امتحانِ بدون ابزار ۱۷٪ عقب‌تر از گروه کنترل.

---
module: M7
minutes: 1
link: none
corner: قواعد درس
---

# نمره از کجا می‌آید؟

<div class="cols">
<div>

| بخش | نمره |
| --- | --- |
| تمرین‌های کوتاه | ۲ |
| تمرین‌های هفته | ۳ |
| پروژه | ۴ + ۱ امتیازی |
| ارائه | ۱ + ۱ امتیازی |
| میان‌ترم | ۲ |
| پایان‌ترم | ۸ |

</div>
<div>

- برای قبولی، [نیمی از نمرهٔ کتبی]{.mark} (۵ از ۱۰) لازم است
- تمرین کوتاه برای کامل بودن نمره می‌گیرد، نه درست بودن: پیش‌بینی غلطِ خوب‌استدلال‌شده نمرهٔ کامل دارد
- هوش مصنوعی مجاز است، با اعلام در هر تحویل؛ آنچه نتوانید توضیح دهید نمره ندارد

<p class="small">جزئیات: <CourseLink path="policy/" /></p>

</div>
</div>

---
type: exercise
module: M7
minutes: 4
link: none
corner: تمرین
---

# تمرین کوتاه ۰: یک درخواست کجا وقت می‌گذراند؟

<Exercise ex="00-toolbox" due="تا شب پیش از جلسهٔ ۱">
<dl class="run">
  <dt>چالش</dt><dd>مخزن تحویل را بسازید؛ بعد با <code>curl</code> زمان هر مرحلهٔ رسیدن به دو سایت را، هرکدام دو بار پشت‌سرهم، بسنجید.</dd>
  <dt>پیش‌بینی</dt><dd>همین حالا روی کاغذ: در اولین درخواست کدام مرحله کندتر است، پیدا کردن نشانی یا اتصال یا TLS یا انتظار برای پاسخ؟ در درخواست دوم چه عوض می‌شود؟</dd>
  <dt>پل</dt><dd>همین مرحله‌ها موضوع جلسهٔ ۱ است.</dd>
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
  <li>چرا اولین پیام اینترنت بعد از دو حرف قطع شد، و در آن سال‌ها «از کار افتادن» یک گره چه معنایی داشت؟<span class="hint">روایت لئونارد کلاینراک از شب ۲۹ اکتبر ۱۹۶۹.</span></li>
  <li>چرا Gopher با وجود محبوبیت بیشتر در ۱۹۹۳ کنار رفت؟<span class="hint">اعلام هزینهٔ مجوز دانشگاه مینه‌سوتا، و بیانیهٔ ۳۰ آوریل ۱۹۹۳ CERN.</span></li>
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
  <li>چرا IPv6 بعد از ربع قرن هنوز همه‌جا نیست؟<span class="hint">آمار پذیرش IPv6 در Google، و نقش NAT.</span></li>
  <li>اگر یک agent به‌جای شما خرید کند، سایت از کجا بفهمد آن agent مجاز است؟<span class="hint">Web Bot Auth و امضای درخواست‌های HTTP.</span></li>
</ol>

---
type: reserve
module: M7
minutes: 0
link: none
corner: منابع
---

# منابع

<ul class="src two">
  <li><a href="https://en.wikipedia.org/wiki/ARPANET">ARPANET</a> · <a href="https://en.wikipedia.org/wiki/Paul_Baran">Paul Baran</a> · <a href="https://www.americanhistory.si.edu/explore/stories/internet-uttered-lo-forty-years-ago">Smithsonian: LO</a></li>
  <li><a href="https://en.wikipedia.org/wiki/Flag_day_(computing)">Flag day (computing)</a></li>
  <li><a href="https://info.cern.ch">info.cern.ch: نخستین وب‌سایت</a></li>
  <li><a href="https://en.wikipedia.org/wiki/History_of_the_World_Wide_Web">History of the World Wide Web</a> · <a href="https://www.w3.org/History/1989/proposal.html">پیشنهاد ۱۹۸۹</a></li>
  <li><a href="https://fa.wikipedia.org/wiki/%D8%A7%DB%8C%D9%86%D8%AA%D8%B1%D9%86%D8%AA_%D8%AF%D8%B1_%D8%A7%DB%8C%D8%B1%D8%A7%D9%86">ویکی‌پدیا: اینترنت در ایران</a></li>
  <li><a href="https://barghchi.com/mag/history-of-internet/">برقچی: تاریخچهٔ اینترنت در ایران</a></li>
  <li><a href="https://en.wikipedia.org/wiki/Browser_wars">Browser wars</a></li>
  <li><a href="https://whatwg.org/">WHATWG</a></li>
  <li><a href="https://www.rfc-editor.org/rfc/rfc7258">RFC 7258</a> · <a href="https://www.rfc-editor.org/rfc/rfc9114">RFC 9114</a></li>
  <li><a href="https://www.washingtonpost.com/world/national-security/nsa-infiltrates-links-to-yahoo-google-data-centers-worldwide-snowden-documents-say/2013/10/30/e51d661e-4166-11e3-8b74-d89d714ca4dd_story.html">Washington Post: MUSCULAR</a></li>
  <li><a href="https://en.wikipedia.org/wiki/Protocol_ossification">Protocol ossification</a></li>
  <li><a href="https://www.imperva.com/resources/resource-library/reports/2025-bad-bot-report/">Imperva: 2025 Bad Bot Report</a></li>
  <li><a href="https://blog.cloudflare.com/introducing-pay-per-crawl/">Cloudflare: pay per crawl</a></li>
  <li><a href="https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/">MCP: 2026-07-28 release</a></li>
  <li><a href="https://www.pnas.org/doi/10.1073/pnas.2422633122">Bastani et al., PNAS 2025: Generative AI without guardrails can harm learning</a></li>
  <li>تصویرها: ویکی‌مدیا؛ صاحب اثر و مجوز زیر هر تصویر</li>
</ul>
