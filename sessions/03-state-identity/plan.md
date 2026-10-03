<!-- طرح جلسه: ساختار، بودجه، نمونه‌های واقعی و یادداشت‌های باز. متن اسلایدها در 03-state-identity.md است. -->

## جلسهٔ ۳ — state و هویت

- **سؤال محوری:** پروتکلی که بی‌حالت است، شما را چطور می‌شناسد؟
- **مدل ذهنی اصلی:** پروتکل هر درخواست را جدا می‌بیند؛ state را برنامه می‌سازد، با برچسبی (کوکی) که سرور می‌دهد و مرورگر **خودکار** به مقصدش پس می‌فرستد. همین خودکار بودن هم قدرت است هم خطر.
- **مدل‌های ذهنی فرعی:** هر که کوکی را داشته باشد، خودِ شماست · SOP خواندن را می‌بندد، نه فرستادن را · CORS را مرورگر اجرا می‌کند، نه سرور · `SameSite` مرز site را می‌کشد، نه origin را · agent درون مرورگر با همهٔ کوکی‌های شما کار می‌کند.
- **تصمیم‌های مهندسی:** در کوکی شناسه بگذاریم یا خود داده · `Domain` بنویسیم یا نه · `SameSite=Lax` یا `Strict`، و چه چیزی کنارش · session cookie یا bearer token · token در مرورگر کجا بماند.
- **قلاب شروع و پایان:** شمارندهٔ بدون کوکی تمرین ۲ کجا اشتباه شمرد؟ در M0 باز می‌شود و در M5 با یک خط `Set-Cookie` کامل جواب می‌گیرد.

**وضعیت:** دک نوشته شد (در انتظار بازبینی مدرس). ساختار این جلسه بدون دروازهٔ تأیید و با پیش‌فرض‌ها نوشته شده است؛ مدرس خواسته بود کل فصل یک‌جا آماده شود.

| ماژول | موضوع | دقیقه | پیامد یادگیری | مدل ذهنی | تصمیم مهندسی |
| --- | --- | --- | --- | --- | --- |
| M0 | نگاهی از دور: چهار پرسش دربارهٔ هویت | ۵ | بگوید چرا IP و `User-Agent` برای شناختن کاربر کافی نیست و چهار پرسش جلسه را نام ببرد | پروتکل بی‌حالت است، برنامه نه | — |
| M1 | cookie | ۱۹ | تبادل `Set-Cookie` و `Cookie` را بخواند؛ هر attribute را به پرسشی که جواب می‌دهد وصل کند؛ بگوید دزدیدن کوکی چه معنایی دارد | کوکی برچسبی است که مرورگر خودکار پس می‌فرستد؛ دارندهٔ کوکی خودِ کاربر است | شناسه یا داده در کوکی؛ `Domain` ننویس و `__Host-` بگذار؛ عمر کوتاه |
| M2 | SOP و CORS | ۱۹ | بگوید SOP جلوی چه چیزی را می‌گیرد و جلوی چه چیزی را نمی‌گیرد؛ یک تبادل CORS و preflight را بخواند؛ خطای بازتاب `Origin` را تشخیص دهد | فرستادن آزاد، خواندن ممنوع؛ CORS اجازهٔ خواندن است و مرورگر اجرایش می‌کند | فهرست مجاز دقیق به‌جای بازتاب `Origin`؛ CORS جای کنترل دسترسی سرور را نمی‌گیرد |
| M3 | CSRF و `SameSite` | ۱۹ | سازوکار CSRF را توضیح دهد؛ برای هر مقدار `SameSite` پیش‌بینی کند کوکی همراه کدام درخواست می‌رود؛ site را از origin جدا کند | مرورگر نمایندهٔ فریب‌خورده است؛ `SameSite` مرز site را می‌کشد | `Lax` یا `Strict`؛ token ضد CSRF یا بررسی `Origin` کنار آن |
| M4 | احراز هویت از دور | ۱۳ | چارچوب `401` و `WWW-Authenticate` و `Authorization` را بخواند؛ بین کوکی و bearer token انتخاب کند | کوکی را مرورگر می‌چسباند، token را کد شما | session cookie یا bearer token؛ token در `HttpOnly` cookie، نه در `localStorage` |
| M5 | جمع‌بندی و تمرین ۳ | ۹ | یک خط `Set-Cookie` درست برای سامانهٔ دانشگاه بنویسد؛ پیش‌بینی تمرین ۳ را بنویسد | — | — |

### دموها (کدشان در `labs/03-state-identity/`)

- دموی **cookie** (M1) · سؤال: سرور از کجا می‌فهمد درخواست دوم از همان کاربر است، و اگر کوکی را به ماشین دیگری ببریم چه می‌شود؟ · مشاهده: `401` بدون کوکی، `Set-Cookie` در پاسخ ورود، `200` با کوکی، و همان `200` وقتی کوکی دستی در درخواست دیگری گذاشته شود · تصمیم: کوکی نشست را مثل رمز عبور نگه دار. اجراشده با Node 22 و curl 8.5.0.
- دموی **cors** (M2) · سؤال: آیا CORS جلوی رسیدن درخواست به سرور را می‌گیرد؟ · مشاهده: سرور به origin ناشناس هم `200` می‌دهد و فقط `Access-Control-Allow-Origin` را نمی‌فرستد؛ POST از origin ناشناس اجرا شد و موجودی کم شد · تصمیم: CORS کنترل دسترسی سرور نیست. اجراشده با Node 22 و curl 8.5.0.
- دموی **csrf** (M3) · سؤال: با هر مقدار `SameSite`، کوکی همراه کدام درخواست بین‌سایتی می‌رود؟ · مشاهده: جدول چهار حالت کوکی در چهار نوع درخواست؛ کوکی بدون `SameSite` در POST بین‌سایتی هم رفت (استثنای دو دقیقه‌ای Chromium)؛ از `localhost:8772` حتی کوکی `Strict` هم رفت · تصمیم: `SameSite` را صریح بنویس و کنارش دفاع دوم بگذار. اجراشده با Chromium 141 بدون رابط (`bank/auto.mjs`).

### نمونه‌های واقعی (راستی‌آزمایی‌شده)

| ماژول | نمونه | منبع |
| --- | --- | --- |
| M1 | نفوذ به سامانهٔ پشتیبانی Okta در مهر ۱۴۰۲: فایل‌های HAR مشتریان، کوکی و token نشست داشتند؛ با همان‌ها به نشست مدیران Cloudflare و دیگران وارد شدند | [Cloudflare: HAR sanitizer](https://blog.cloudflare.com/introducing-har-sanitizer-secure-har-sharing/) |
| M1 | کوکی نشستِ گره‌خورده به دستگاه (DBSC) در Chrome روی Windows، بهار ۱۴۰۵ | [BleepingComputer](https://www.bleepingcomputer.com/news/security/google-chrome-adds-session-cookie-theft-protection-for-all-users/) |
| M1 | عقب‌نشینی Google از حذف کوکی شخص ثالث (۲ اردیبهشت ۱۴۰۴) و بازنشستگی بیشتر Privacy Sandbox (۲۵ مهر ۱۴۰۴)؛ CHIPS و FedCM ماندند | [Privacy Sandbox، آوریل](https://privacysandbox.google.com/blog/privacy-sandbox-next-steps) · [Privacy Sandbox، اکتبر](https://privacysandbox.google.com/blog/update-on-plans-for-privacy-sandbox-technologies) |
| M2 | بازتاب `Origin` همراه `Access-Control-Allow-Credentials: true` در صرافی‌های بیت‌کوین؛ سرقت کلید API | [PortSwigger در ۲۰۱۶](https://portswigger.net/research/exploiting-cors-misconfigurations-for-bitcoins-and-bounties) |
| M3 | حفره‌های CSRF در ING Direct و YouTube و New York Times، مهر ۱۳۸۷ | [Zeller و Felten](https://blog.citp.princeton.edu/2008/09/29/popular-websites-vulnerable-cross-site-request-forgery-attacks) |
| M3 | پیش‌فرض `SameSite=Lax` در Chrome 80 (بهمن ۱۳۹۸)، عقب‌گرد موقت در فروردین ۱۳۹۹ برای پایداری سرویس‌های ضروری در همه‌گیری، و استثنای «Lax + POST» دو دقیقه‌ای | [Chromium blog](https://blog.chromium.org/2020/04/temporarily-rolling-back-samesite.html) · [Chromium SameSite FAQ](https://www.chromium.org/updates/same-site/faq/) |
| M3 | تزریق دستور در مرورگر Comet (۲۹ مرداد ۱۴۰۴): agent با نشست‌های واردشدهٔ کاربر، نشانی ایمیل و رمز یک‌بارمصرف را بیرون داد؛ «SOP و CORS عملاً بی‌اثرند» | [Brave](https://brave.com/blog/comet-prompt-injection/) |
| M4 | احراز هویت در MCP: سرور MCP یک resource server در OAuth 2.1 است؛ `401` با `WWW-Authenticate` و نشانی فرادادهٔ RFC 9728؛ token فقط برای همان سرور | [MCP Authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization) |

### منتقل به جلسه‌های دیگر

- جزئیات OAuth و OpenID Connect و passkey و مدیریت نشست در backend ← فصل بعد (اینجا فقط «از دور»)
- رمز شدن کوکی در مسیر و معنای `Secure` ← جلسهٔ ۴ (TLS)
- کوکی و cache مشترک (`Cache-Control: private` و `Vary: Cookie`) ← جلسهٔ ۵
- حملهٔ CSWSH، یعنی CSRF روی WebSocket ← جلسهٔ ۶

### یادداشت‌های باز جلسهٔ ۳

- بودجهٔ ۸۴ دقیقه، با ۴ دقیقهٔ پیش‌بینی تمرین؛ ۶ دقیقه ذخیره برای بحث
- `[فرض]` ترتیب ماژول‌ها: cookie، بعد SOP و CORS، بعد CSRF. دلیل: CSRF بدون دانستن «فرستادن آزاد است» فهمیدنی نیست
- `[در انتظار تأیید]` منبع کوکی: RFC 6265 و پیش‌نویس 6265bis (نسخهٔ ۲۲ در صف انتشار RFC است) و دادهٔ سازگاری مرورگر؛ `SameSite` و پیشوند `__Host-` در 6265 نیستند `[volatile: بررسی ۱۴۰۵/۱۰]`
- رفتار پیش‌فرض `SameSite` بین مرورگرها یکسان نیست و استثنای دو دقیقه‌ای Chromium «موقت» اعلام شده است `[volatile: بررسی ۱۴۰۵/۱۰]`
- وضعیت DBSC (فقط Chrome روی Windows) `[volatile: بررسی ۱۴۰۵/۱۰]`
- `[تصویر لازم]` یک اسکرین‌شات: زبانهٔ Application در DevTools، بخش Cookies، با ستون‌های `HttpOnly` و `Secure` و `SameSite` (اسلاید «هر attribute به چه پرسشی جواب می‌دهد؟»)
- `[بررسی‌نشده: پیوندهای MDN و RFC]` در محیط آماده‌سازی فقط پیوند نمونه‌های واقعی باز و خوانده شد؛ پیوندهای مرجع (MDN و rfc-editor و WHATWG) از روی الگوی نشانی نوشته شده‌اند
- دموی csrf در کلاس با مرورگر واقعی اجرا می‌شود؛ خروجی اسلاید پشتیبان از Chromium 141 بدون رابط است و در Firefox و Safari فرق دارد
