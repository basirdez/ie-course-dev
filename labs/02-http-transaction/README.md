# دموهای جلسهٔ ۲

> پیش‌نویس فاز ۲. اجراشده با Node 22.22 و Python 3.11 و curl 8.5.0 روی Linux. خروجی‌ها در اسلایدهای پشتیبان دک آمده است.

## دموی h1-vs-h2: همان درخواست در HTTP/1.1 و HTTP/2

```sh
node h1-vs-h2/server.mjs          # HTTP/1.1 روی 8767 و HTTP/2 بی‌رمز (h2c) روی 8766
curl -sv http://127.0.0.1:8767/hello?x=1
curl -sv --http2-prior-knowledge http://127.0.0.1:8766/hello?x=1
```

- سؤال: وقتی همان درخواست را با HTTP/2 بفرستیم، سرور چه می‌بیند؟
- مشاهده: خط‌های `[:method: GET]` و `[:authority: …]` در خروجی، `HTTP/2 200` بدون reason phrase، و اینکه سرور `host` ندارد و `:authority` دارد.
- دام: خروجی `-v` پیام HTTP/2 را هم به شکل متنی HTTP/1.1 نشان می‌دهد؛ روی سیم frame باینری است.

## دموی redirect-method: متد و بدنه بعد از redirect

```sh
python3 redirect-method/server.py        # /r/<code> با Location: /new ؛ /new متد و بدنه را برمی‌گرداند
for c in 301 302 303 307 308; do curl -s -L -d 'x=1' http://127.0.0.1:8765/r/$c; done
```

- دام: با `-X POST -L` روش در درخواست دوم هم POST می‌ماند ولی بدنه حذف می‌شود؛ `-X` را با `-L` به کار نبرید.
- رفتار curl بعد از 303 با PUT: PUT می‌ماند و فقط بدنه حذف می‌شود؛ این رفتار ابزار است، نه پروتکل.

## دموی negotiation: یک منبع، چند بازنمایی

```sh
node negotiation/server.mjs
curl -s -D - -o /dev/null -H 'Accept: text/markdown' http://127.0.0.1:8768/report
curl -s -D - -o /dev/null -H 'Accept: application/json' -H 'Accept-Encoding: gzip' http://127.0.0.1:8768/report
```

- مشاهده: `Content-Type` با `Accept` عوض می‌شود و `Vary` در هر پاسخ هست. بدنهٔ ۳۲ بایتی JSON با gzip به ۵۳ بایت رسید: فشرده‌سازی برای بدنهٔ کوچک ضرر دارد.
