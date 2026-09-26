<script setup lang="ts">
// تصویرسازی هر دورهٔ تاریخ اینترنت؛ SVG سیاه‌وسفیدپسند که خودش روایت را نشان می‌دهد.
defineProps<{ art: string, label?: string }>()
</script>

<template>
  <svg class="era-art" viewBox="0 0 320 210" role="img" :aria-label="label || art">
        <!-- ۱۹۶۹: ترمینالی که بعد از LO از کار افتاد -->
        <g v-if="art === 'lo'">
          <rect x="20" y="20" width="280" height="170" rx="12" fill="#111" />
          <text style="font-family:JetBrains Mono, monospace;font-size:16px" x="44" y="70" fill="#8a8a8a">UCLA → SRI</text>
          <text style="font-family:JetBrains Mono, monospace;font-size:52px" x="44" y="130" fill="#fff">LO</text>
          <text style="font-family:JetBrains Mono, monospace;font-size:52px" x="124" y="130" fill="#555">GIN</text>
          <line x1="122" y1="114" x2="232" y2="114" stroke="#777" stroke-width="3" />
          <text style="font-family:JetBrains Mono, monospace;font-size:15px" x="44" y="168" fill="#8a8a8a">system crashed_</text>
        </g>
        <!-- ۱۹۸۳: فایل HOSTS.TXT کنار گذاشته می‌شود و درخت DNS جایش را می‌گیرد -->
        <g v-else-if="art === 'tcp'" style="font-family:JetBrains Mono, monospace">
          <rect x="24" y="40" width="96" height="120" rx="6" fill="#fff" stroke="#111" stroke-width="2" />
          <text x="36" y="62" style="font-size:13px" fill="#111">HOSTS.TXT</text>
          <line x1="36" y1="78" x2="108" y2="78" stroke="#bbb" stroke-width="3" /><line x1="36" y1="92" x2="100" y2="92" stroke="#bbb" stroke-width="3" /><line x1="36" y1="106" x2="104" y2="106" stroke="#bbb" stroke-width="3" /><line x1="36" y1="120" x2="92" y2="120" stroke="#bbb" stroke-width="3" />
          <line x1="20" y1="36" x2="124" y2="164" stroke="#111" stroke-width="4" /><line x1="124" y1="36" x2="20" y2="164" stroke="#111" stroke-width="4" />
          <text x="140" y="108" style="font-size:26px" fill="#111">→</text>
          <circle cx="238" cy="50" r="16" fill="#111" /><text x="232" y="56" style="font-size:14px" fill="#fff">.</text>
          <line x1="238" y1="66" x2="198" y2="118" stroke="#111" stroke-width="2" /><line x1="238" y1="66" x2="278" y2="118" stroke="#111" stroke-width="2" />
          <rect x="172" y="118" width="52" height="28" rx="5" fill="#fff" stroke="#111" stroke-width="2" /><text x="182" y="137" style="font-size:13px">com</text>
          <rect x="252" y="118" width="52" height="28" rx="5" fill="#fff" stroke="#111" stroke-width="2" /><text x="264" y="137" style="font-size:13px">edu</text>
          <text x="206" y="186" style="font-size:14px" fill="#555">DNS</text>
        </g>
        <!-- ۱۹۹۱: صفحه‌ای ساده با پیوندهای آبی -->
        <g v-else-if="art === 'web'" style="font-family:Georgia, serif">
          <rect x="20" y="16" width="280" height="180" rx="6" fill="#fff" stroke="#111" stroke-width="2" />
          <rect x="20" y="16" width="280" height="22" rx="6" fill="#ddd" />
          <text x="40" y="70" style="font-size:24px" fill="#111">World Wide Web</text>
          <line x1="40" y1="92" x2="262" y2="92" stroke="#bbb" stroke-width="3" />
          <line x1="40" y1="106" x2="240" y2="106" stroke="#bbb" stroke-width="3" />
          <text x="40" y="134" style="font-size:17px" fill="#1a0dab" text-decoration="underline">What's out there?</text>
          <text x="40" y="160" style="font-size:17px" fill="#1a0dab" text-decoration="underline">Help</text>
          <text x="96" y="160" style="font-size:17px" fill="#1a0dab" text-decoration="underline">Software</text>
          <text style="font-size:13px;font-family:JetBrains Mono, monospace" x="40" y="186" fill="#666">info.cern.ch</text>
        </g>
        <!-- ۱۹۹۳: تهران ← وین ← اینترنت -->
        <g v-else-if="art === 'iran'">
          <circle cx="262" cy="105" r="30" fill="#111" /><text style="font-size:17px;font-family:Vazirmatn, sans-serif" x="262" y="111" fill="#fff" text-anchor="middle">تهران</text>
          <line x1="232" y1="105" x2="176" y2="105" stroke="#111" stroke-width="3" stroke-dasharray="6 5" />
          <circle cx="150" cy="105" r="26" fill="#fff" stroke="#111" stroke-width="3" /><text style="font-size:17px;font-family:Vazirmatn, sans-serif" x="150" y="111" fill="#111" text-anchor="middle">وین</text>
          <line x1="124" y1="105" x2="92" y2="105" stroke="#111" stroke-width="3" />
          <path d="M20 118 q-2 -26 22 -28 q6 -22 30 -16 q14 -12 28 4 q24 0 20 24 q0 18 -20 18 h-60 q-20 0 -20 -2z" fill="#eee" stroke="#111" stroke-width="2" />
          <text style="font-size:13px;font-family:JetBrains Mono, monospace" x="58" y="112" fill="#111" text-anchor="middle">Internet</text>
          <text style="font-size:14px;font-family:Vazirmatn, sans-serif" x="206" y="150" fill="#555" text-anchor="middle">چند کیلوبیت بر ثانیه</text>
        </g>
        <!-- ۱۹۹۵: مرورگر دههٔ ۹۰ و سه اختراع Netscape -->
        <g v-else-if="art === 'war1'">
          <rect x="20" y="16" width="280" height="180" rx="4" fill="#c9c9c9" stroke="#111" stroke-width="2" />
          <rect x="20" y="16" width="280" height="22" fill="#1f3a8a" /><rect x="30" y="46" width="48" height="22" fill="#e6e6e6" stroke="#666" /><rect x="84" y="46" width="48" height="22" fill="#e6e6e6" stroke="#666" />
          <rect x="30" y="76" width="260" height="110" fill="#fff" stroke="#666" />
          <circle cx="80" cy="130" r="24" fill="#d9a25b" stroke="#111" stroke-width="2" /><circle cx="72" cy="122" r="3" fill="#111" /><circle cx="88" cy="128" r="3" fill="#111" /><circle cx="76" cy="140" r="3" fill="#111" />
          <rect x="138" y="124" width="40" height="32" rx="4" fill="#111" /><path d="M146 124 v-10 a12 12 0 0 1 24 0 v10" fill="none" stroke="#111" stroke-width="4" />
          <text style="font-size:26px;font-family:JetBrains Mono, monospace" x="248" y="142" fill="#111" text-anchor="middle">{ }</text>
          <text style="font-size:12px;font-family:JetBrains Mono, monospace" x="80" y="178" text-anchor="middle">cookie</text><text style="font-size:12px;font-family:JetBrains Mono, monospace" x="158" y="178" text-anchor="middle">SSL</text><text style="font-size:12px;font-family:JetBrains Mono, monospace" x="248" y="178" text-anchor="middle">JavaScript</text>
        </g>
        <!-- ۲۰۰۴–۲۰۰۸: چند مرورگر و یک گوشی -->
        <g v-else-if="art === 'war2'">
          <rect x="20" y="30" width="170" height="120" rx="8" fill="#fff" stroke="#111" stroke-width="2" /><rect x="20" y="30" width="170" height="20" rx="8" fill="#e5e5e5" />
          <rect x="60" y="62" width="170" height="120" rx="8" fill="#fff" stroke="#111" stroke-width="2" /><rect x="60" y="62" width="170" height="20" rx="8" fill="#e5e5e5" />
          <rect x="72" y="100" width="120" height="8" rx="4" fill="#bbb" /><rect x="72" y="118" width="90" height="8" rx="4" fill="#bbb" />
          <rect x="248" y="54" width="54" height="104" rx="10" fill="#111" /><rect x="254" y="66" width="42" height="74" rx="3" fill="#fff" /><circle cx="275" cy="148" r="4" fill="#fff" />
        </g>
        <!-- ۲۰۱۵–۲۰۲۲: قفل HTTPS و نسخه‌های تازهٔ HTTP -->
        <g v-else-if="art === 'secure'" style="font-family:JetBrains Mono, monospace">
          <rect x="112" y="92" width="96" height="80" rx="10" fill="#111" /><path d="M130 92 v-24 a30 30 0 0 1 60 0 v24" fill="none" stroke="#111" stroke-width="10" />
          <circle cx="160" cy="126" r="9" fill="#fff" /><rect x="156" y="130" width="8" height="20" fill="#fff" />
          <text x="160" y="196" style="font-size:18px" text-anchor="middle" fill="#111">https://</text>
          <rect x="228" y="60" width="62" height="32" rx="16" fill="#fff" stroke="#111" stroke-width="2" /><text x="259" y="82" style="font-size:16px" text-anchor="middle">h2</text>
          <rect x="228" y="104" width="62" height="32" rx="16" fill="#111" /><text x="259" y="126" style="font-size:16px" text-anchor="middle" fill="#fff">h3</text>
        </g>
        <!-- شبکهٔ متمرکز در برابر توزیع‌شده (پل باران) -->
        <g v-else-if="art === 'mesh'">
          <g stroke="#111" stroke-width="2">
            <line x1="80" y1="105" x2="80" y2="45" /><line x1="80" y1="105" x2="80" y2="165" /><line x1="80" y1="105" x2="28" y2="75" /><line x1="80" y1="105" x2="132" y2="75" /><line x1="80" y1="105" x2="28" y2="135" /><line x1="80" y1="105" x2="132" y2="135" />
          </g>
          <circle cx="80" cy="105" r="11" fill="#111" /><g fill="#fff" stroke="#111" stroke-width="2"><circle cx="80" cy="45" r="8" /><circle cx="80" cy="165" r="8" /><circle cx="28" cy="75" r="8" /><circle cx="132" cy="75" r="8" /><circle cx="28" cy="135" r="8" /><circle cx="132" cy="135" r="8" /></g>
          <line x1="64" y1="89" x2="96" y2="121" stroke="#b00" stroke-width="4" /><line x1="96" y1="89" x2="64" y2="121" stroke="#b00" stroke-width="4" />
          <g stroke="#111" stroke-width="2">
            <line x1="200" y1="50" x2="250" y2="40" /><line x1="250" y1="40" x2="296" y2="70" /><line x1="200" y1="50" x2="214" y2="104" /><line x1="250" y1="40" x2="262" y2="96" /><line x1="296" y1="70" x2="262" y2="96" /><line x1="214" y1="104" x2="262" y2="96" /><line x1="214" y1="104" x2="206" y2="160" /><line x1="262" y1="96" x2="258" y2="150" /><line x1="296" y1="70" x2="300" y2="130" /><line x1="300" y1="130" x2="258" y2="150" /><line x1="206" y1="160" x2="258" y2="150" />
          </g>
          <g fill="#fff" stroke="#111" stroke-width="2"><circle cx="200" cy="50" r="8" /><circle cx="250" cy="40" r="8" /><circle cx="296" cy="70" r="8" /><circle cx="214" cy="104" r="8" /><circle cx="206" cy="160" r="8" /><circle cx="258" cy="150" r="8" /><circle cx="300" cy="130" r="8" /></g>
          <circle cx="262" cy="96" r="8" fill="#ddd" stroke="#b00" stroke-width="2" /><line x1="255" y1="89" x2="269" y2="103" stroke="#b00" stroke-width="3" /><line x1="269" y1="89" x2="255" y2="103" stroke="#b00" stroke-width="3" />
          <text x="80" y="198" text-anchor="middle" style="font-size:14px;font-family:Vazirmatn, sans-serif" fill="#111">متمرکز: یک خرابی کافی است</text>
          <text x="250" y="198" text-anchor="middle" style="font-size:14px;font-family:Vazirmatn, sans-serif" fill="#111">توزیع‌شده: راه دیگری هست</text>
        </g>
        <!-- ۲۰۲۲–: گفتگو، agent، MCP و ۴۰۲ -->
        <g v-else style="font-family:JetBrains Mono, monospace">
          <path d="M24 40 h120 a12 12 0 0 1 12 12 v46 a12 12 0 0 1 -12 12 h-80 l-22 18 v-18 h-18 a12 12 0 0 1 -12 -12 v-46 a12 12 0 0 1 12 -12z" fill="#fff" stroke="#111" stroke-width="2" />
          <circle cx="66" cy="75" r="5" fill="#111" /><circle cx="84" cy="75" r="5" fill="#111" /><circle cx="102" cy="75" r="5" fill="#111" />
          <rect x="190" y="44" width="80" height="64" rx="14" fill="#111" /><circle cx="214" cy="74" r="7" fill="#fff" /><circle cx="246" cy="74" r="7" fill="#fff" /><line x1="230" y1="30" x2="230" y2="44" stroke="#111" stroke-width="4" /><circle cx="230" cy="28" r="5" fill="#111" />
          <line x1="230" y1="108" x2="230" y2="140" stroke="#111" stroke-width="4" />
          <rect x="196" y="140" width="68" height="30" rx="6" fill="#fff" stroke="#111" stroke-width="2" /><text x="230" y="161" style="font-size:15px" text-anchor="middle">MCP</text>
          <rect x="40" y="140" width="96" height="40" rx="6" fill="#fff" stroke="#111" stroke-width="2" stroke-dasharray="5 4" /><text x="88" y="166" style="font-size:18px" text-anchor="middle">402</text>
        </g>
      </svg>
</template>

<style scoped>
.era-art { width: 100%; max-width: 400px; height: auto; direction: ltr; unicode-bidi: isolate; }
</style>
