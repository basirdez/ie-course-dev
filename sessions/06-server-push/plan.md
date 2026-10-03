<!-- طرح جلسه: ساختار، بودجه، نمونه‌های واقعی و یادداشت‌های باز. متن اسلایدها در 06-server-push.md است. -->

## جلسهٔ ۶ — وقتی سرور باید اول حرف بزند

- **سؤال محوری:** push از سرور به کلاینت با چه سازوکارهایی ممکن است و هرکدام کجا می‌شکند؟
- **مدل ذهنی اصلی:** در HTTP همیشه کلاینت شروع می‌کند. برای اینکه سرور حرف بزند یا پاسخ را کش می‌دهیم (long polling و SSE) یا از HTTP بیرون می‌رویم (WebSocket). هر انتخاب معامله‌ای است میان جهت، سازگاری با واسطه‌ها، و هزینهٔ اتصالی که باز می‌ماند.
- **مدل‌های ذهنی فرعی:** کد وضعیت پیش از بدنه فرستاده می‌شود و وسط جریان عوض‌شدنی نیست · ادامه دادن از جای قطع‌شده یک قرارداد است، نه یک قابلیت رایگان · masking رمزنگاری نیست؛ برای گیج نشدن واسطه‌هاست · SOP روی WebSocket نیست · اتصال باز یعنی state در یک سرور مشخص.
- **تصمیم‌های مهندسی:** polling یا SSE یا WebSocket · بررسی `Origin` در handshake · heartbeat و backoff با jitter · سیاست برای کلاینت کُند · اتصال طولانی پشت load balancer.
- **قلاب شروع و پایان:** «پاسخ مدل زبانی کلمه‌به‌کلمه می‌آید؛ با کدام سازوکار؟» در M0، و «همان پاسخ وسط راه خطا خورد؛ کلاینت چه کدی می‌بیند؟» در M5.

**وضعیت:** دک نوشته شد (در انتظار بازبینی مدرس). بدون دروازهٔ تأیید و با پیش‌فرض‌ها.

| ماژول | موضوع | دقیقه | پیامد یادگیری | مدل ذهنی | تصمیم مهندسی |
| --- | --- | --- | --- | --- | --- |
| M0 | نگاهی از دور: چهار راه برای رساندن خبر | ۵ | چهار سازوکار را روی خط زمان از هم تشخیص دهد | کلاینت شروع می‌کند؛ یا پاسخ را کش می‌دهیم یا از HTTP بیرون می‌رویم | — |
| M1 | polling و long polling | ۹ | هزینهٔ polling را حساب کند؛ بگوید long polling کجا کم می‌آورد؛ webhook را بشناسد | بهای سادگی، درخواست خالی است | کِی polling کافی است |
| M2 | SSE | ۱۹ | یک جریان `text/event-stream` را بخواند؛ سازوکار ادامه با `Last-Event-ID` را توضیح دهد؛ سه جای شکستن SSE را بگوید | یک پاسخ HTTP که تمام نمی‌شود؛ ادامه دادن قرارداد است | `EventSource` یا `fetch`؛ heartbeat؛ خاموش کردن buffering |
| M3 | WebSocket | ۱۹ | handshake را بخواند و `Sec-WebSocket-Accept` را حساب کند؛ بایت‌های یک frame را بخواند؛ دلیل masking و خطر CSWSH را بگوید | بعد از `101` دیگر HTTP نیست؛ masking برای واسطه‌هاست؛ SOP اینجا نیست | بررسی `Origin`؛ همیشه `wss` |
| M4 | مقیاس و انتخاب | ۱۶ | هزینه‌های اتصال طولانی را نام ببرد؛ برای یک سرویس سازوکار مناسب را انتخاب کند | اتصال باز یعنی state و صف در یک سرور مشخص | sticky یا pub/sub؛ backoff با jitter؛ سیاست کلاینت کُند |
| M5 | جمع‌بندی و تمرین ۶ | ۹ | بگوید خطای وسط جریان چطور به کلاینت می‌رسد؛ پیش‌بینی تمرین ۶ را بنویسد | — | — |

### نقد دک ترم پیش (`02- WEBSOCKET - v1.pdf`، ۴۲ اسلاید)

- **دامنه:** هجده اسلاید از ۴۲ (اسلایدهای ۲ تا ۱۹) دربارهٔ برنامه‌نویسی async در Python و JavaScript است: `asyncio` و event loop و SQLAlchemy و ASGI و WSGI. این‌ها تصمیم پیاده‌سازی سرورند، نه پروتکل؛ در این فصل فقط یک پیامد می‌ماند (اتصال باز، سرور بی‌انسداد می‌خواهد) و بقیه به فصل backend می‌رود.
- **مدل ذهنی:** دک قدیم polling و long polling را «راه‌حل قلابی» می‌نامد و WebSocket را پاسخ نهایی. دک تازه هر چهار سازوکار را معامله می‌بیند و SSE را هم‌وزن WebSocket می‌آورد، چون امروز پرکاربردترین نمونهٔ push (استریم token در API مدل‌ها) با SSE است.
- **خطاهای فنی:** در جدول «اصلاحات دک ترم پیش» در `00-chapter-map.md` ثبت شد (اتصال HTTP کوتاه‌عمر نیست؛ `Sec-WebSocket-Key` امنیتی نیست؛ مدل مقیاس‌پذیری ویژگی پروتکل نیست؛ SSE در RFC 8895 نیست؛ WebSocket با MQTT هم‌سطح نیست؛ و چند مورد دیگر).
- **کمبودها:** امنیت WebSocket (نبودن SOP و حملهٔ CSWSH)، ادامه با `Last-Event-ID`، buffering در واسطه‌ها، WebSocket روی HTTP/2 و HTTP/3، نمونهٔ واقعی، سؤال کلاسی و پیوند با هوش مصنوعی هیچ‌کدام نبود.
- **چه ماند:** ترتیب «مسئله، بعد handshake و frame و masking، بعد چالش‌های مقیاس» خوب بود و حفظ شد؛ مثال بایت‌های frame و جدول چالش‌ها بازنویسی شد.

### دموها (کدشان در `labs/06-server-push/`)

- دموی **sse** (M2) · سؤال: یک پاسخ SSE در شبکه چه شکلی است، و بعد از قطع شدن از کجا ادامه می‌دهد؟ · مشاهده: خط‌های `id` و `event` و `data` که هر ثانیه می‌رسند؛ با `Last-Event-ID: 2` خبرهای ۳ به بعد دوباره فرستاده شد؛ از پشت proxy جلسهٔ ۵ در چهار ثانیه هیچ بایتی نرسید (curl با خطای ۲۸ تمام شد) · تصمیم: جلوی buffering را در هر واسطه بگیر. اجراشده با curl 8.5.0 و Node 22.
- دموی **ws** (M3) · سؤال: بعد از `101` روی اتصال چه بایت‌هایی می‌رود؟ · مشاهده: `Sec-WebSocket-Accept` برای کلید نمونهٔ RFC برابر `s3pPLMBiTxaQ9kYGzzhZRbK+xOo=`؛ frame کلاینت `81 85 37 fa 21 3d 7f 9f 4d 51 58` و frame سرور `81 05 48 65 6c 6c 6f` · تصمیم: WebSocket را با کتابخانه بنویس، ولی بایت‌ها را بشناس. اجراشده با Node 22 و OpenSSL 3.0.13؛ سرور و کلاینت بدون کتابخانه.
- اندازه‌گیری هزینهٔ هر خبر (اسلاید M4): polling با HTTP/1.1 برای هر خبر ۳۱۶ بایت (۸۹ درخواست، ۱۸۸ header پاسخ، ۳۹ بدنه) و برای هر پاسخ خالی ۲۸۱ بایت؛ باز کردن جریان SSE یک بار ۲۹۵ بایت و بعد هر event ۴۴ بایت؛ یک frame در WebSocket ۲۱ بایت. اجراشده با `curl -w`.

### نمونه‌های واقعی (راستی‌آزمایی‌شده)

| ماژول | نمونه | منبع |
| --- | --- | --- |
| M0 و M2 و M5 | استریم پاسخ در API مدل Claude با SSE: رویدادهای `message_start` و `content_block_delta` و `message_stop`؛ خطا بعد از `200` به‌صورت `event: error` می‌آید | [Claude docs](https://platform.claude.com/docs/en/build-with-claude/streaming) |
| M2 | سقف شش اتصال SSE به ازای هر دامنه روی HTTP/1.1؛ فیلدهای `event` و `data` و `id` و `retry`؛ خط توضیح برای زنده نگه داشتن اتصال | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) |
| M2 و M4 | مشخصات MCP از سرور می‌خواهد `X-Accel-Buffering: no` بفرستد و با خط توضیح اتصال را زنده نگه دارد | [MCP Streamable HTTP](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http) |
| M3 | پژوهش «Talking to Yourself for Fun and Profit» (۱۳۹۰): آلوده کردن cache واسطه‌های شفاف با بایت‌های دلخواه؛ ریشهٔ masking | [Huang و همکاران](https://www.ieee-security.org/TC/W2SP/2011/papers/websocket.pdf) |
| M3 | حملهٔ CSWSH: handshake کوکی را می‌برد و SOP جلویش را نمی‌گیرد | [Pentest-Tools](https://pentest-tools.com/blog/cross-site-websocket-hijacking-cswsh) |
| M3 | رسیدن WebTransport به همهٔ مرورگرهای اصلی با Safari 26.4 (حدود نوروز ۱۴۰۵) | [WebRTC.ventures](https://webrtc.ventures/2026/04/webtransport-is-now-baseline-what-it-means-for-real-time-media/) |
| M4 | سه نسل transport در MCP: HTTP+SSE (آبان ۱۴۰۳)، Streamable HTTP با session و جریان GET (فروردین ۱۴۰۴)، و حذف جریان GET و session (مرداد ۱۴۰۵) | [MCP Streamable HTTP](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http) · [MCP blog](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) |
| M4 | backoff نمایی با jitter | [AWS Architecture Blog](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/) |
| M4 | رابط صوتی مدل‌ها: WebRTC در مرورگر و WebSocket میان دو سرور | [OpenAI Realtime](https://developers.openai.com/api/docs/guides/realtime-conversations) |

### منتقل به جلسه‌های دیگر

- برنامه‌نویسی async و event loop و ASGI ← فصل backend
- رفتار درست کلاینت هنگام `429` و retry ← جلسهٔ ۷
- جزئیات MQTT و WebRTC ← بیرون از این فصل (فقط یک اسلاید «از دور»)

### یادداشت‌های باز جلسهٔ ۶

- بودجهٔ ۷۷ دقیقه، با ۴ دقیقهٔ پیش‌بینی تمرین؛ ۱۳ دقیقه ذخیره
- پرسش باز نقشهٔ فصل دربارهٔ WebRTC `[فرض]`: فقط در یک سطر جدول انتخاب آمده است، نه بیشتر
- متن پست AWS دربارهٔ jitter در محیط آماده‌سازی باز نشد `[بررسی‌نشده: متن منبع]`؛ فقط وجود صفحه با جستجو تأیید شد
- وضعیت WebTransport در مرورگرها و نسخهٔ جاری مشخصات MCP تغییرپذیرند `[volatile: بررسی ۱۴۰۵/۱۰]`
- پیوندهای MDN و RFC و WHATWG با ابزار بررسی نشده‌اند `[بررسی‌نشده: پیوندهای مرجع]`
- تمرین ۶ (`exercises/06-three-ways`) اجرا شده است: خودآزمایی روی starter نتیجهٔ ۲ از ۱۲ و روی پاسخ مرجع ۱۲ از ۱۲ می‌دهد؛ بخش امتیازیِ مرورگر (`EventSource` در DevTools) اجرا نشده `[اجرانشده]`
- کامپوننت‌های این جلسه: `Modes.vue` (خط زمان چهار سازوکار) و رونوشت `HttpMsg.vue`
- سرور دمو فقط frame تک‌تکه و کوتاه‌تر از ۱۲۶ بایت را می‌خواند؛ برای کلاس کافی است و در README گفته شده
