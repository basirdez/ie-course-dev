# کلید تمرین ۴ (خصوصی)

بخش‌های اول تا سوم با OpenSSL 3.0.13 و curl 8.5.0 و Node 22.22 روی Linux اجرا شده‌اند. چالش (بازکردن با Wireshark) در محیط آماده‌سازی اجرا نشده است `[اجرانشده]`: ابزار ضبط بسته در دسترس نبود. پیش از انتشار تمرین، یک بار آن را با Wireshark روی رایانهٔ خودتان امتحان کنید.

## پیش‌بینی

فقط **نام سرور** دیده می‌شود (SNI در ClientHello). گواهی سرور در TLS 1.3 بعد از ServerHello و رمزشده فرستاده می‌شود؛ مسیر و کوکی جزء پیام HTTP‌اند و رمز می‌شوند. دانشجویی که بگوید «گواهی هم دیده می‌شود» با مدل TLS 1.2 فکر کرده است؛ اگر استدلالش روشن باشد نمرهٔ پیش‌بینی کامل است.

## بخش اول (خروجی مرجع)

```text
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384 / X25519 / id-ecPublicKey
* ALPN: server accepted h2
*  subject: CN=shop.test
*  subjectAltName: host "shop.test" matched cert's "shop.test"
*  issuer: CN=IE Class Test CA
*  SSL certificate verify ok.
```

## بخش دوم (خطاهای مرجع)

| حالت | خطای curl 8.5.0 | بررسی ردشده |
| --- | --- | --- |
| بدون `--cacert` | `(60) SSL certificate problem: unable to get local issuer certificate` | زنجیرهٔ امضا به ریشهٔ مورداعتماد نمی‌رسد |
| نام `bank.test` | `(60) SSL: no alternative certificate subject name matches target host name 'bank.test'` | نام گواهی با نام URL یکی نیست |
| `CERT=old` | `(60) SSL certificate problem: certificate has expired` | تاریخ اعتبار |

متن خطا در نسخه‌های دیگر curl یا با کتابخانهٔ TLS دیگر (مثلاً Schannel در Windows) فرق دارد؛ شمارهٔ ۶۰ و معنای خطا ملاک است.

## بخش سوم (جدول مرجع، خروجی `find.mjs`)

| رشته | TLS 1.3 | TLS 1.2 |
| --- | --- | --- |
| `shop.test` | فقط در جهت کلاینت به سرور (SNI) | در هر دو جهت (SNI، و گواهی در پاسخ سرور) |
| `IE Class Test CA` | دیده نشد | در جهت سرور به کلاینت (گواهی بی‌رمز است) |
| `secret-path` | دیده نشد | دیده نشد |
| `TOPSECRET` | دیده نشد | دیده نشد |
| `h2` | فقط کلاینت به سرور (فهرست ALPN در ClientHello) | در هر دو جهت (انتخاب سرور در ServerHello بی‌رمز است) |

نکتهٔ `h2` در TLS 1.3: انتخاب سرور در EncryptedExtensions می‌آید و رمز است؛ ناظر فقط پیشنهادهای کلاینت را می‌بیند.

## چالش

- برچسب‌های `keys.log` در TLS 1.3: `CLIENT_HANDSHAKE_TRAFFIC_SECRET` و `SERVER_HANDSHAKE_TRAFFIC_SECRET` (کلیدهای بخش رمزشدهٔ handshake)، `CLIENT_TRAFFIC_SECRET_0` و `SERVER_TRAFFIC_SECRET_0` (کلیدهای دادهٔ برنامه)، و `EXPORTER_SECRET`. ستون دوم هر خط همان client random است که Wireshark با آن خط را به اتصال وصل می‌کند.
- پاسخ forward secrecy: نه. کلید خصوصی `shop.key` فقط `CertificateVerify` را امضا کرده است؛ راز مشترک از سهم‌های یک‌بارمصرف X25519 ساخته شده و در هیچ فایلی نیست. در Wireshark، معرفی کلید خصوصی سرور چیزی را باز نمی‌کند (این روش فقط برای تبادل کلید RSA در TLS 1.2 و قدیمی‌تر کار می‌کرد).

## اشتباه‌های رایج

- خاموش کردن بررسی با `-k` و گزارش «درست شد».
- افزودن CA آزمایشی به فهرست اعتماد سیستم؛ در بازخورد تذکر دهید که بعد از تمرین حذفش کنند.
- یکی گرفتن «رمز بودن گواهی در TLS 1.3» با «مخفی بودن نام سرور»: نام در SNI هست، مگر با ECH.
