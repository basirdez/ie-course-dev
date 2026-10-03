# دموهای جلسهٔ ۴

> اجراشده با Node 22.22 و curl 8.5.0 و OpenSSL 3.0.13 روی Linux. خروجی‌ها در اسلایدهای پشتیبان دک آمده است.

## دموی mux: شش درخواست در سه حالت

```sh
node mux/server.mjs      # HTTP/1.1 روی 8782 و HTTP/2 بی‌رمز روی 8781؛ هر پاسخ ۳۰۰ میلی‌ثانیه
U1='http://127.0.0.1:8782/slow?i=[1-6]'; U2='http://127.0.0.1:8781/slow?i=[1-6]'
time curl -s -o /dev/null    --http1.1 "$U1"                     # ۱۸۲۹ میلی‌ثانیه؛ یک اتصال، پشت‌سرهم
time curl -s -o /dev/null -Z --http1.1 "$U1"                     # ۳۱۱ میلی‌ثانیه؛ شش اتصال
time curl -s -o /dev/null -Z --http2-prior-knowledge "$U2"       # ۳۱۲ میلی‌ثانیه؛ یک اتصال، جریان‌های ۱ تا ۱۱
```

- سؤال: شش درخواست ۳۰۰ میلی‌ثانیه‌ای روی یک اتصال HTTP/1.1، روی شش اتصال، و روی یک اتصال HTTP/2 چقدر طول می‌کشد؟
- مشاهده: لاگ سرور شمارهٔ اتصال هر درخواست را می‌نویسد؛ در حالت سوم همهٔ درخواست‌ها `connection #1` با شمارهٔ جریان فرد هستند.
- دام: نشانی را در گیومه بگذارید؛ `[1-6]` بدون گیومه را پوسته تفسیر می‌کند. گزینهٔ `-Z` بدون `--http2-prior-knowledge` روی HTTP بی‌رمز، HTTP/1.1 می‌ماند.
- دام: روی loopback هزینهٔ handshake تقریباً صفر است و حالت دوم و سوم مساوی دیده می‌شوند؛ این برابری در شبکهٔ واقعی نیست.

## دموی tls: خواندن handshake

```sh
sh tls/make-certs.sh && node tls/server.mjs       # https://shop.test:8443
R='--resolve shop.test:8443:127.0.0.1'
curl -sv $R --cacert tls/certs/ca.pem https://shop.test:8443/
curl -sS $R https://shop.test:8443/                                              # خطای ۶۰: امضاکنندهٔ ناشناس
curl -sS --resolve bank.test:8443:127.0.0.1 --cacert tls/certs/ca.pem https://bank.test:8443/   # خطای ۶۰: نام ناهمخوان
openssl s_client -connect 127.0.0.1:8443 -servername shop.test -CAfile tls/certs/ca.pem -alpn h2 </dev/null
```

- مشاهده: `TLSv1.3` و `X25519` و `ALPN: server accepted h2` و `SSL certificate verify ok`؛ در خروجی `s_client` خط‌های `Server Temp Key: X25519, 253 bits` و `Verify return code: 0 (ok)`.
- دام: اگر متغیر `HTTPS_PROXY` در محیط شما تنظیم است، `--noproxy shop.test,bank.test` را اضافه کنید؛ وگرنه curl به‌جای سرور محلی سراغ proxy می‌رود.
- پوشهٔ `tls/certs` در git نمی‌رود. CA آزمایشی را به فهرست اعتماد سیستم اضافه نکنید.
