# تمرین کوتاه ۱: یک URL، دو parser

> جلسهٔ ۱ · تحویل: `short/s01.md` · مهلت: ساعت ۲۳:۵۹ شب پیش از جلسهٔ ۲

## هدف

ببینید parser مرورگر و curl می‌توانند یک URL را متفاوت بفهمند، و اولین بار خط درخواستی را که curl واقعاً می‌فرستد ببینید.

## پیش‌بینی (سر کلاس نوشتید؛ همان را در فایل بیاورید)

برای `http://evil.test\@example.com/`، مرورگر به کدام host وصل می‌شود؟ curl چطور؟

## آزمایش (حداکثر ۳۰ دقیقه)

این سه URL را با هر دو parser بسنجید:

```text
1  http://example.com@evil.test/login
2  http://evil.test\@example.com/
3  http://EXAMPLE.com:80/a/./b/../c
```

برای parser مرورگر، Node 22 همان استاندارد URL مرورگرها را پیاده کرده است:

```sh
node -e "const u=new URL(process.argv[1]); console.log(u.host, u.pathname)" 'http://evil.test\@example.com/'
```

برای curl، در یک پنجره یک سرور محلی بالا بیاورید (`python3 -m http.server 8080`؛ در Windows: `python -m http.server 8080`) و در پنجرهٔ دیگر:

```sh
curl -sv --connect-to ::127.0.0.1:8080 'http://evil.test\@example.com/' -o /dev/null
```

گزینهٔ `--connect-to` فقط مقصد TCP را به سرور محلی شما عوض می‌کند؛ خط درخواست و فیلد `Host` همان است که curl از URL فهمیده. از خروجی curl فقط خط‌هایی که با `> GET` و `> Host` شروع می‌شوند لازم است. در Windows از PowerShell و `curl.exe` استفاده کنید و به‌جای `/dev/null` بنویسید `NUL`.

در بخش «شواهد» برای هر URL خروجی Node و آن دو خط curl را بگذارید.

## پل به جلسهٔ ۲

خط `GET … HTTP/1.1` و فیلد `Host` که در خروجی curl دیدید، اولین خط‌های یک پیام HTTP‌اند. جلسهٔ ۲ همین پیام را کالبدشکافی می‌کند.
