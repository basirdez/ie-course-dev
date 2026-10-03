# دموهای جلسهٔ ۳

> اجراشده با Node 22.22 و curl 8.5.0 و Chromium 141 روی Linux. خروجی‌ها در اسلایدهای پشتیبان دک آمده است.

## دموی cookie: یک کوکی، دو کلاینت

```sh
node bank/bank.mjs                                   # http://localhost:8771
curl -si -c jar.txt -d 'user=ali' 'http://localhost:8771/login?samesite=lax'
curl -s -b jar.txt http://localhost:8771/me
curl -s -H 'Cookie: sid=<value from jar.txt>' http://localhost:8771/me
curl -s -b jar.txt -X POST http://localhost:8771/logout
```

- سؤال: سرور از کجا می‌فهمد درخواست دوم از همان کاربر است، و اگر کوکی را به ماشین دیگری ببریم چه می‌شود؟
- مشاهده: `401` بدون کوکی؛ `Set-Cookie` در پاسخ ورود؛ `200` با cookie jar؛ و همان `200` وقتی مقدار کوکی دستی در header گذاشته شود. بعد از `/logout` همان مقدار دیگر کار نمی‌کند.
- دام: `-c` کوکی را در فایل می‌نویسد و `-b` آن را می‌خواند؛ بدون `-b` curl هیچ کوکی‌ای نمی‌فرستد. curl کوکی `HttpOnly` را هم می‌بیند؛ `HttpOnly` فقط برای JavaScript صفحه است.

## دموی cors: CORS را مرورگر اجرا می‌کند

```sh
node cors/server.mjs                                 # http://127.0.0.1:8773
U=http://127.0.0.1:8773/api
curl -si -H 'Origin: https://app.example'  $U/balance
curl -si -H 'Origin: https://evil.example' $U/balance
curl -si -X OPTIONS -H 'Origin: https://evil.example' -H 'Access-Control-Request-Method: DELETE' $U/transfer
curl -si -X POST -H 'Origin: https://evil.example' $U/transfer
curl -s $U/balance
```

- مشاهده: سرور به origin ناشناس هم `200` می‌دهد و فقط `Access-Control-Allow-Origin` را نمی‌فرستد. POST از origin ناشناس اجرا شد و موجودی از ۱۰۰۰ به ۹۰۰ رسید.
- دام: curl مرورگر نیست و SOP ندارد؛ پاسخ را در هر حال چاپ می‌کند. فیلد `Origin` را هم خودمان می‌نویسیم؛ در مرورگر، اسکریپت نمی‌تواند آن را تعیین کند.

## دموی csrf: `SameSite` در عمل

```sh
node bank/bank.mjs     # بانک:   http://localhost:8771
node bank/evil.mjs     # مهاجم:  http://127.0.0.1:8772/post  (سایت دیگر)   http://localhost:8772/post  (همان سایت، پورت دیگر)
CHROME_PATH=/path/to/chrome node bank/auto.mjs     # همان آزمایش، خودکار؛ از ریشهٔ مخزن اجرا شود
```

- در کلاس: در مرورگر در `http://localhost:8771` با مقدار دلخواه `SameSite` وارد شوید، بعد صفحهٔ مهاجم را باز کنید و به بانک برگردید؛ موجودی را مقایسه کنید.
- مشاهده با Chromium 141 (خروجی `auto.mjs`):

| cookie | cross-site POST form | same-site POST form | cross-site `<img>` | cross-site link (GET) |
| --- | --- | --- | --- | --- |
| (none set) | sent | sent | - | sent |
| `SameSite=Lax` | - | sent | - | sent |
| `SameSite=Strict` | - | sent | - | - |
| `SameSite=None; Secure` | sent | sent | sent | sent |

- دام اول: کوکی بدون `SameSite` در POST بین‌سایتی هم رفت. Chromium برای چنین کوکی‌ای تا دو دقیقه پس از ساخته شدن، POST سطح بالا را مجاز می‌داند («Lax + POST»). اگر دو دقیقه صبر کنید، نتیجه مثل `Lax` می‌شود.
- دام دوم: `localhost` و `127.0.0.1` دو site جدا هستند، ولی `localhost:8771` و `localhost:8772` یک site‌اند؛ پورت در site نیست.
- دام سوم: مرورگر کوکی `Secure` را از `http://localhost` می‌پذیرد، چون localhost را مبدأ قابل‌اعتماد حساب می‌کند؛ روی نشانی دیگری بدون HTTPS این دمو کار نمی‌کند.
- نتیجه در Firefox و Safari فرق دارد: پیش‌فرض `Lax` و استثنای دو دقیقه‌ای رفتار Chromium است.
