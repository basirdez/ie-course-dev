# دموهای جلسهٔ ۷

> اجراشده با Node 22.22 و curl 8.5.0 روی Linux. خروجی‌ها در اسلایدهای پشتیبان دک آمده است.

اگر در محیط شما متغیر `HTTP_PROXY` تنظیم است، پیش از اجرا `export NO_PROXY='*'` بزنید؛ وگرنه `fetch` و curl درخواست‌های محلی را به proxy می‌فرستند.

## دموی retry: بیست agent و یک سقف نرخ

```sh
SHARED=1 node limited.mjs      # http://127.0.0.1:8821    پنج درخواست در هر ثانیه، برای همه با هم
curl -si http://127.0.0.1:8821/work
node clients.mjs               # سه رفتار: naive و wait و jitter
```

- مشاهده در پاسخ: `RateLimit-Policy: "default";q=5;w=1` و `RateLimit: "default";r=4;t=1`؛ و بعد از پر شدن سقف، `429` با `Retry-After: 1`.
- خروجی `clients.mjs` در یک اجرا:

```text
strategy   time      requests seen by server   rejected (429)   biggest retry wave (per 100 ms)   worst agent
naive      3.0 s     11478                     11458            651                               1328 tries
wait       3.0 s     50                        30               15                                4 tries
jitter     4.4 s     50                        30               7                                 4 tries
```

- نکتهٔ کلاس: تلاش دوبارهٔ بی‌درنگ زودتر تمام نشد. سقف پنج در ثانیه برای بیست کار چهار نوبت می‌خواهد، هر قدر هم که عجله کنید.
- عددهای ردیف اول در هر اجرا فرق می‌کند (به سرعت دستگاه بستگی دارد)؛ دو ردیف دیگر ثابت‌اند، جز اندازهٔ موج در ردیف آخر که تصادفی است.
- بدون `SHARED=1` سقف برای هر کلاینت جداست (از روی `Authorization`، وگرنه نشانی).

## دموی mcp: یک tool call با curl

```sh
node mcp.mjs                   # POST http://127.0.0.1:8822/mcp
U=http://127.0.0.1:8822/mcp
H='-H Content-Type:application/json -H MCP-Protocol-Version:2026-07-28'
curl -s  $H -H 'Mcp-Method: tools/list' -d @list.json $U
curl -s  $H -H 'Mcp-Method: tools/call' -H 'Mcp-Name: get_grade' -d @call.json $U
curl -si $H -H 'Mcp-Method: tools/call' -H 'Mcp-Name: get_grade' -d @delete.json $U
```

- مشاهده: پاسخ `tools/list` فیلدهای `ttlMs: 300000` و `cacheScope: "public"` دارد. پاسخ `tools/call` متن `sara: 18.5` را برمی‌گرداند. درخواست سوم، که header آن `get_grade` می‌گوید و بدنه‌اش `delete_grades`، پاسخ `400` با خطای `-32020` می‌گیرد.
- لاگ سرور برای هر درخواست دو خط دارد: آنچه از header دیده می‌شود (`header view`) و آنچه در بدنه است (`body view`). برای درخواست ناهمخوان فقط خط اول چاپ می‌شود.
- با `-H 'Origin: http://evil.test'` پاسخ `403` است، و با `MCP-Protocol-Version: 2025-03-26` پاسخ `400`.
- سرور `mcp.mjs` آموزشی است: شکل پیام‌ها را از مشخصات ۲۰۲۶-۰۷-۲۸ گرفته، ولی پیاده‌سازی کامل آن نیست (نه مجوزدهی دارد، نه `_meta`، نه جریان SSE).
