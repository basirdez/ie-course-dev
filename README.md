<div dir="rtl">

# درس مهندسی اینترنت: مخزن خصوصی مدرس

این مخزن **خصوصی** است: پیش‌نویس‌ها، طرح جلسه‌ها، پاسخ مرجع و آزمون‌های پنهان تمرین‌ها اینجاست. فقط آنچه در `course.json` منتشرشده علامت بخورد، با یک workflow به مخزن **عمومی** و سایت درس می‌رود.

## ساختار

- فایل `course.json`: فهرست جلسه‌ها و تمرین‌ها، نشانی سایت و مخزن عمومی، و اینکه چه چیزی منتشر شده است. نشانی تمرین روی اسلایدها و QR آن‌ها از همین فایل ساخته می‌شود
- فایل `00-chapter-map.md`: نقشهٔ فصل، ستون فقرات، اصلاحات دک ترم پیش
- پوشهٔ `sessions/NN-slug/`: منبع دک (`NN-slug.md`) و طرح جلسه (`plan.md`)
- پوشهٔ `exercises/NN-slug/`: صورت تمرین (`README.md`)، `starter/` و `check/` (عمومی)؛ `solution/` و `grader/` (خصوصی)
- پوشهٔ `labs/`: کد دموهای کلاس
- فایل `course-policy.md`: قواعد تمرین و نمره برای دانشجو (عمومی)
- پوشهٔ `theme/`: تم مشترک اسلایدها
- پوشهٔ `scripts/`: ساخت سایت، بررسی، انتشار و جمع‌آوری تمرین

## کار روزمره

</div>

```sh
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm ci        # یک بار
npm run images                                   # یک بار: تصویرهای ویکی‌مدیا؛ بعد commit کنید
npm run dev -- sessions/02-http-transaction/02-http-transaction.md
node scripts/site.mjs                            # همهٔ جلسه‌ها و سایت → dist/ (با --pdf، PDF هم)
npm run check -- sessions/02-http-transaction/02-http-transaction.md   # متن و بودجه
npm run check -- dist/02-http-transaction        # اسکرین‌شات و بررسی هم‌پوشانی
npx serve dist                                   # دیدن سایت ساخته‌شده
```

<div dir="rtl">

برای PDF و `check` روی اسلایدها، مسیر Chrome را بدهید: `CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"`.

## راه‌اندازی دو مخزن (یک بار)

۱. در GitHub دو مخزن بسازید: `ie-course` (خصوصی) و `internet-engineering` (عمومی، خالی).

۲. محتوای این zip را در مخزن خصوصی بگذارید:

</div>

```sh
cd internet-engineering-course
git init -b main && git add . && git commit -m "شروع"
git remote add origin git@github.com:<نام کاربری>/ie-course.git
git push -u origin main
```

<div dir="rtl">

۳. کلید انتشار: یک جفت کلید بسازید، نیمهٔ عمومی را به مخزن عمومی و نیمهٔ خصوصی را به مخزن خصوصی بدهید، و فایل‌هایش را پاک کنید.

</div>

```sh
ssh-keygen -t ed25519 -N "" -C ie-publish -f ie-publish
# internet-engineering › Settings › Deploy keys › Add: محتوای ie-publish.pub، با Allow write access
# ie-course › Settings › Secrets and variables › Actions › New secret: نام PUBLIC_DEPLOY_KEY، محتوای ie-publish
rm ie-publish ie-publish.pub
```

<div dir="rtl">

۴. در `course.json` مقدار `publicRepo` را `<نام کاربری>/internet-engineering` و `site` را `https://<نام کاربری>.github.io/internet-engineering/` بگذارید. نشانی موقت فعلی (`ie.scu.ac.ir`) با همین تغییر روی همهٔ اسلایدها و QRها عوض می‌شود. در `course-policy.md` هم نام کاربری دستیار آموزشی را جای `TA-USERNAME` بنویسید.

۵. اولین انتشار (پایین) را اجرا کنید؛ بعد در مخزن عمومی: Settings › Pages › Deploy from a branch › شاخهٔ `gh-pages` و پوشهٔ `/`.

## انتشار یک جلسه

۱. در `course.json` برای آن جلسه `"published": true` بگذارید و push کنید.
۲. در مخزن خصوصی: Actions › Publish › Run workflow.
۳. سایت (اسلایدها، PDF، صفحهٔ تمرین، قواعد درس) روی شاخهٔ `gh-pages` و فایل‌های دانشجو (صورت تمرین و `starter/` و `check/`) روی `main` مخزن عمومی می‌روند.

فهرست مجاز است: `plan.md` و نقشهٔ فصل و `grader/` هرگز منتشر نمی‌شوند؛ `solution/` هر تمرین فقط وقتی نامش را به `solutions` در `course.json` اضافه کنید.

برای پیش‌نمایش پیش از انتشار، هر push به `main` مخزن خصوصی همهٔ جلسه‌ها را با PDF می‌سازد: Actions › CI › آخرین اجرا › Artifacts › `site-preview`.

## گردش کار تمرین

۱. **تحویل:** هر دانشجو مخزن خصوصی `ie1405-` و شمارهٔ دانشجویی (مثلاً `ie1405-401234567`) دارد و دستیار را دعوت کرده است (تمرین صفر). فهرست را در `grading/students.csv` با ستون‌های `id,name,repo` نگه دارید؛ پوشهٔ `grading/` در git نمی‌رود.
۲. **جمع‌آوری سر مهلت:** دستور زیر آخرین commit پیش از مهلت هر دانشجو را برمی‌دارد، آزمون خودکار را اجرا می‌کند و `grading/w02/scores.csv` و یک پیش‌نویس بازخورد برای هر نفر می‌سازد. برای تمرین کوتاه (`s01` یعنی فایل `short/s01.md`) نمرهٔ ۰ و ۱ و ۲ خودکار از روی پنج بخش قالب داده می‌شود و دستیار فقط نمونه‌ای را دستی می‌بیند. آزمون خودکار کد دانشجو را اجرا می‌کند؛ آن را در VM یا container جدا اجرا کنید.

</div>

```sh
node scripts/collect.mjs s01 --deadline 2026-10-04T23:59+03:30   # تمرین کوتاه جلسهٔ ۱: نمرهٔ ۰ و ۱ و ۲ از روی ساختار
node scripts/collect.mjs w02 --deadline 2026-10-16T23:59+03:30   # تمرین هفتهٔ ۲
node scripts/collect.mjs w02 --deadline 2026-10-18T23:59+03:30 --only 401234567   # روز تأخیر
node scripts/collect.mjs w02 --sample 0.2     # فهرست تصادفی گفتگوی کوتاه
node scripts/collect.mjs w02 --send           # بازخوردها را با gh به‌صورت issue می‌فرستد
```

<div dir="rtl">

۳. **نمره‌گذاری تمرین هفته:** ستون‌های پیش‌بینی و تحلیل و تصمیم را دستیار پر می‌کند؛ ستون شواهد با نمرهٔ خودکار پر شده و قابل اصلاح است.
۴. **پاسخ مرجع:** چهار روز پس از مهلت، نام تمرین را به `solutions` اضافه و Publish را اجرا کنید.

اگر GitHub Classroom در دسترس‌تان است، می‌تواند ساخت مخزن دانشجوها و فهرست آن‌ها را خودکار کند؛ بقیهٔ این گردش کار همان می‌ماند.

## کار با Claude: هر جلسه در یک چت جدا

**یک بار:** در claude.ai به Settings › Connectors بروید و GitHub را وصل کنید، و به برنامهٔ GitHub اجازهٔ دسترسی به مخزن `ie-course` بدهید. از آن به بعد Claude مخزن را مستقیم clone می‌کند، روی یک شاخهٔ تازه کار می‌کند و pull request می‌فرستد؛ شما فقط بازبینی و merge می‌کنید. دیگر zip لازم نیست.

**شروع هر چت** (در همین پروژه، با skill درس):

- ساختن جلسهٔ تازه: «جلسهٔ ۳ را شروع کن. مخزن: `<نام کاربری>/ie-course`. اول ساختار `plan.md` را کامل کن و منتظر تأیید بمان؛ بعد دک و تمرین.»
- بازبینی جلسهٔ موجود: «جلسهٔ ۲ را بازبینی کن. مخزن: `<نام کاربری>/ie-course`. این اصلاحات را اعمال کن: …»
- اصلاح سراسری (تم، قواعد، سایت): «در مخزن `<نام کاربری>/ie-course` این را در همهٔ جلسه‌ها عوض کن: …»

در هر چت فقط یک جلسه؛ Claude فقط `plan.md` همان جلسه، جدول جلسه‌ها در نقشهٔ فصل و قواعد skill را می‌خواند و توکن کمتری مصرف می‌شود. اگر GitHub را وصل نکرده‌اید، zip تازهٔ مخزن را در شروع چت بارگذاری کنید.

</div>
