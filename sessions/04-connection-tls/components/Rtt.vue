<script setup lang="ts">
// چند رفت‌وبرگشت تا رسیدن اولین بایت پاسخ؟ هر خانه یک رفت‌وبرگشت (RTT) است.
defineProps<{ show: string[] }>()
const rows = [
  { k: 'tls12', name: 'TCP + TLS 1.2', steps: ['TCP', 'TLS', 'TLS', 'HTTP'] },
  { k: 'tls13', name: 'TCP + TLS 1.3', steps: ['TCP', 'TLS', 'HTTP'] },
  { k: 'quic', name: 'QUIC', steps: ['QUIC + TLS', 'HTTP'] },
  { k: '0rtt', name: 'QUIC, 0-RTT', steps: ['HTTP'] },
]
const fa = (n: number) => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])
</script>

<template>
  <div class="rtt" role="img" aria-label="تعداد رفت‌وبرگشت تا اولین بایت پاسخ در چهار حالت">
    <template v-for="r in rows.filter(r => show.includes(r.k))" :key="r.k">
      <div class="rtt-name">{{ r.name }}</div>
      <div class="rtt-bar"><span v-for="(s, i) in r.steps" :key="i" class="rtt-step" :class="{ http: s === 'HTTP' }">{{ s }}</span></div>
      <div class="rtt-n">{{ fa(r.steps.length) }} رفت‌وبرگشت</div>
    </template>
  </div>
</template>

<style scoped>
.rtt { display: grid; grid-template-columns: 220px 1fr 170px; gap: 10px 16px; align-items: center; margin: 6px 0 16px; direction: ltr; }
.rtt-name { font: 700 21px/1.3 "JetBrains Mono", monospace; text-align: left; }
.rtt-bar { display: flex; gap: 6px; }
.rtt-step { flex: 0 0 23.5%; text-align: center; font: 700 18px/38px "JetBrains Mono", monospace; background: var(--code-bg); border-bottom: 5px solid var(--seg-1); border-radius: 6px; }
.rtt-step.http { border-bottom-color: var(--seg-5); }
.rtt-n { direction: rtl; font-size: 20px; font-weight: 700; text-align: right; }
</style>
