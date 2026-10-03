# دموهای جلسهٔ ۵

> اجراشده با Node 22.22 و curl 8.5.0 روی Linux. خروجی‌ها در اسلایدهای پشتیبان دک آمده است.

```sh
node origin.mjs        # سرور اصلی:      http://127.0.0.1:8791    (با اصلاح‌ها: FIX=1 node origin.mjs)
node proxy.mjs         # cache مشترک:    http://127.0.0.1:8790
```

فایل `proxy.mjs` یک cache آموزشی است، نه پیاده‌سازی کامل RFC 9111: فقط GET، کلید از متد و نشانی و فیلدهای `Vary`، و directiveهای `max-age` و `s-maxage` و `private` و `no-store` و `no-cache`. در هر پاسخ `Cache-Status` (به قالب RFC 9211) و `Via` می‌گذارد و به درخواست `X-Forwarded-For` می‌افزاید. برای خالی کردن cache: `curl -X POST http://127.0.0.1:8790/__purge`.

## دموی freshness: تازگی و اعتبارسنجی

```sh
curl -si http://127.0.0.1:8790/report      # سه بار: الان، دو ثانیه بعد، شش ثانیه بعد
curl -s  http://127.0.0.1:8790/report/update && sleep 6 && curl -si http://127.0.0.1:8790/report
```

- مشاهده: `cache-status: lab; fwd=uri-miss; stored`، بعد `lab; hit; ttl=3` با `age: 2`، بعد `lab; fwd=stale; fwd-status=304; stored`؛ و بعد از تغییر گزارش، `lab; fwd=stale; stored` با `etag: "r2"`.
- لاگ سرور اصلی فقط درخواست اول و پرسش‌های `If-None-Match` را نشان می‌دهد.
- دام: اگر میان درخواست‌ها بیش از پنج ثانیه فاصله بیفتد، حالت «hit» را نمی‌بینید.

## دموی account: پاسخ شخصی در cache مشترک

```sh
P=http://127.0.0.1:8790
curl -s -H 'Cookie: user=sara' $P/account
curl -s -H 'Cookie: user=ali'  $P/account      # بدون FIX: account page of sara
```

- با `FIX=1` سرور `Cache-Control: private, max-age=30` می‌فرستد و هر کاربر صفحهٔ خودش را می‌گیرد (`cache-status: lab; fwd=uri-miss`).
- دام: پیش از تکرار، cache را خالی کنید یا سی ثانیه صبر کنید.

## دموی xff: کدام نشانی را باور کنیم

```sh
P=http://127.0.0.1:8790/limited
for i in 1 2 3 4; do curl -s $P; done            # چهارمی: too many requests (429)
curl -s -H 'X-Forwarded-For: 1.2.3.4' $P          # بدون FIX: request 1 of 3 from 1.2.3.4
```

- سرور اصلی این را می‌بیند: `XFF: 1.2.3.4, 127.0.0.1`. بدون `FIX` اولین مقدار را می‌خواند؛ با `FIX=1` آخرین مقدار را.
- اگر سرور اصلی را ببندید، proxy پاسخ `502` با `proxy-status: lab; error=connection_refused` می‌دهد؛ برای اسلاید «این خطا را کدام واسطه ساخته است؟».
