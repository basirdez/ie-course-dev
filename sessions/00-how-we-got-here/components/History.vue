<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
// پیش‌درآمد درس: هشت ایستگاه از ARPANET تا عصر هوش مصنوعی؛ هر click یک ایستگاه.
// ایستگاه‌های گذشته پر و کم‌رنگ، ایستگاه فعلی پر و پررنگ، آینده توخالی (در چاپ سیاه‌وسفید هم پیدا).
const { $clicks } = useSlideContext()
const cur = computed(() => Math.min(Math.max($clicks.value, 0), eras.length - 1))
const W = 'https://en.wikipedia.org/wiki/'
const eras = [
  { y: '۱۹۶۹', s: '۱۳۴۸', t: 'ARPANET و پیام «LO»', link: `${W}ARPANET`, art: 'lo',
    d: 'اولین پیام شبکه قرار بود LOGIN باشد؛ سیستم بعد از دو حرف از کار افتاد و «LO» اولین پیام تاریخ اینترنت شد.',
    k: 'زنجیره‌ای که هر حلقه‌اش می‌تواند وسط کار بشکند' },
  { y: '۱۹۸۳', s: '۱۳۶۱', t: 'TCP/IP و DNS', link: `${W}Internet_protocol_suite`, art: 'tcp',
    d: 'در یکم ژانویهٔ ۱۹۸۳ همهٔ ARPANET یک‌شبه به TCP/IP کوچ کرد، و در همان سال DNS جای فایل مشترکی به نام HOSTS.TXT را گرفت.',
    k: 'DNS در جلسهٔ ۱ و TCP در جلسهٔ ۴' },
  { y: '۱۹۹۱', s: '۱۳۷۰', t: 'وب متولد می‌شود', link: 'https://info.cern.ch', art: 'web',
    d: 'تیم برنرز-لی در CERN سه چیز را با هم ساخت: URL برای نام‌گذاری، HTTP برای گفتگو و HTML برای نمایش. نخستین وب‌سایت هنوز روی info.cern.ch باز می‌شود.',
    k: 'URL در جلسهٔ ۱ و HTTP در جلسهٔ ۲' },
  { y: '۱۹۹۳', s: '۱۳۷۱', t: 'ایران به اینترنت وصل می‌شود', link: 'https://nsrc.org/regions/MIDEAST/IR/internet-iran-2001.pdf', art: 'iran',
    d: 'در دی ۱۳۷۱ پژوهشگاه دانش‌های بنیادی (IPM) با یک خط ۹۶۰۰ baud به دانشگاه وین وصل شد؛ نخست فقط برای ایمیل، و سپس اتصال کامل اینترنت با ۵۰۰ نشانی IP.',
    k: 'مسیر بین‌الملل و DNS داخلی هنوز مسئلهٔ مهندسی ماست' },
  { y: '۱۹۹۵', s: '۱۳۷۴', t: 'جنگ اول مرورگرها', link: `${W}Browser_wars`, art: 'war1',
    d: 'Netscape در دو سال کوکی و SSL و JavaScript را ساخت و Microsoft با Internet Explorer رایگان جواب داد؛ در اوایل دههٔ ۲۰۰۰ سهم IE از بازار از ۹۰ درصد گذشت.',
    k: 'کوکی در جلسهٔ ۳، و TLS که نوادهٔ SSL است در جلسهٔ ۴' },
  { y: '۲۰۰۴', s: '۱۳۸۳', t: 'جنگ دوم مرورگرها و وب همراه', link: 'https://whatwg.org/', art: 'war2',
    d: 'Firefox (۲۰۰۴) و Chrome (۲۰۰۸) انحصار را شکستند؛ سازندگان مرورگر WHATWG را تشکیل دادند تا استاندارد را از روی رفتار واقعی مرورگرها بنویسند، و iPhone (۲۰۰۷) وب را به جیب آورد.',
    k: 'استاندارد URL در جلسهٔ ۱ کار همین WHATWG است' },
  { y: '۲۰۱۵', s: '۱۳۹۴', t: 'وب امن و سریع', link: `${W}Let%27s_Encrypt`, art: 'secure',
    d: 'Let\'s Encrypt گواهی HTTPS را رایگان و خودکار کرد؛ HTTP/2 در ۲۰۱۵ و HTTP/3 روی QUIC در ۲۰۲۲ پروتکل را برای وب امروز بازنویسی کردند.',
    k: 'HTTP/2 و HTTP/3 و TLS در جلسهٔ ۴' },
  { y: '۲۰۲۲', s: '۱۴۰۱', t: 'عصر هوش مصنوعی', link: 'https://modelcontextprotocol.io', art: 'ai',
    d: 'ChatGPT (آذر ۱۴۰۱) گفتگو با مدل‌ها را همه‌گیر کرد؛ حالا agentها خودشان وب را می‌خوانند و با MCP به ابزارها وصل می‌شوند، و کد وضعیت ۴۰۲ ابزار پرداخت agentها شده است.',
    k: 'کلاینت‌های ماشینی و MCP در جلسهٔ ۷' },
]
const era = computed(() => eras[cur.value])
</script>

<template>
  <div class="hist">
    <ol class="hist-line">
      <li v-for="(e, i) in eras" :key="i" :class="i < cur ? 'done' : i === cur ? 'now' : 'todo'">
        <i /><b>{{ e.y }}</b><small>{{ e.s }}</small>
      </li>
    </ol>
    <div class="hist-panel">
      <div class="hist-text">
        <h3><a :href="era.link">{{ era.t }}</a></h3>
        <p>{{ era.d }}</p>
        <p class="hist-k"><span>در این درس</span>{{ era.k }}</p>
      </div>
      <EraArt class="hist-art" :art="era.art" :label="era.t" />
    </div>
  </div>
</template>

<style scoped>
.hist { display: flex; flex-direction: column; gap: 18px; }
.hist-line { list-style: none; display: flex; margin: 4px 0 0 !important; padding: 0 !important; position: relative; }
.hist-line::before { content: ""; position: absolute; top: 8px; right: 3%; left: 3%; border-top: 2px solid var(--rule); }
.hist-line li { list-style: none; flex: 1; display: flex; flex-direction: column; align-items: center; margin: 0; position: relative; }
.hist-line li::marker { content: none; }
.hist-line i { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--ink); background: var(--bg); margin-bottom: 6px; }
.hist-line b { font: 400 18px/1.2 "JetBrains Mono", Vazirmatn, monospace; color: var(--muted); }
.hist-line small { font-size: 13px; color: var(--muted); }
.hist-line li.done i { background: var(--muted); border-color: var(--muted); }
.hist-line li.now i { background: var(--ink); transform: scale(1.3); }
.hist-line li.now b { color: var(--ink); font-weight: 700; }
.hist-line li.todo i { border-color: var(--rule); }
.hist-panel { display: grid; grid-template-columns: 1fr 400px; gap: 30px; align-items: center; }
.hist-text h3 { font-size: 32px; font-weight: 800; margin: 0 0 10px; }
.hist-text h3 a { color: inherit; text-decoration: underline dotted; text-decoration-thickness: 1.5px; text-underline-offset: 6px; text-decoration-color: var(--wire); }
.hist-text p { font-size: 25px; line-height: 1.75; margin: 0 0 12px; }
.hist-k { font-size: 21px !important; color: var(--ink); }
.hist-k span { display: inline-block; font-size: 15px; font-weight: 700; border: 1.5px solid var(--ink); border-radius: 4px; padding: 2px 8px; margin-left: 10px; vertical-align: 2px; }
.hist-art { width: 400px; height: 262px; direction: ltr; unicode-bidi: isolate; }
</style>
