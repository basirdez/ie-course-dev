# یادداشت تصحیح تمرین کوتاه ۱ (خصوصی)

اجراشده با Node v22.22.2 و curl 8.5.0 و Python 3.11 روی Linux (۱۴۰۵/۰۷/۰۶):

| URL | Node: `host pathname` | curl: خط درخواست و `Host` |
| --- | --- | --- |
| `http://example.com@evil.test/login` | `evil.test /login` | `GET /login` و `Host: evil.test` |
| `http://evil.test\@example.com/` | `evil.test /@example.com/` | `GET /` و `Host: example.com` |
| `http://EXAMPLE.com:80/a/./b/../c` | `example.com /a/c` | `GET /a/c` و `Host: EXAMPLE.com` |

- در URL ۱، هر دو `example.com` را userinfo می‌دانند و به `evil.test` می‌روند؛ curl آن را به‌صورت نام کاربری Basic هم برمی‌دارد.
- در URL ۲ دو parser **اختلاف واقعی** دارند: استاندارد WHATWG در schemeهای ویژه `\` را مثل `/` می‌بیند، پس host پیش از آن تمام می‌شود؛ curl `evil.test\` را userinfo می‌داند و به `example.com` می‌رود. این همان تفاوتی است که بررسی با یک parser و ارسال با دیگری را خطرناک می‌کند (نسخهٔ کامل در `exercises/w01-tricky-urls/`).
- در URL ۳ مقصد یکی است؛ Node نام host را کوچک می‌کند و curl نه. نام host به بزرگی و کوچکی حساس نیست، ولی مقایسهٔ رشته‌ای در کد هست؛ اگر دانشجو این را در «سؤال» آورد، سؤال خوبی است.
- اشتباه رایج: «`@` همیشه userinfo را از host جدا می‌کند». نمره را کم نکنید؛ در شروع جلسهٔ ۲ به آن اشاره کنید.
