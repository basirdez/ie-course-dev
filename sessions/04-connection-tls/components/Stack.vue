<script setup lang="ts">
// تصویر کلی جلسه: سه نسخهٔ HTTP، یک معنا، سه پشته. هر ردیف با بخشی که بررسی‌اش می‌کند.
</script>

<template>
  <div class="stk" role="img" aria-label="سه پشتهٔ HTTP/1.1 و HTTP/2 و HTTP/3: معنای مشترک، قالب انتقال، امنیت و لایهٔ انتقال">
    <div class="stk-lbl" />
    <div class="stk-h">HTTP/1.1</div><div class="stk-h">HTTP/2</div><div class="stk-h">HTTP/3</div>

    <div class="stk-lbl">معنا<small>جلسهٔ ۲</small></div>
    <div class="stk-c sem">متد، کد وضعیت، header: برای هر سه یکی است (RFC 9110)</div>

    <div class="stk-lbl">قالب انتقال<small>بخش ۱ و ۲</small></div>
    <div class="stk-c" style="--c: var(--seg-2)">متن؛ یک پاسخ در هر لحظه</div>
    <div class="stk-c" style="--c: var(--seg-2)">frame باینری؛ چند جریان</div>
    <div class="stk-c" style="--c: var(--seg-2)">frame باینری؛ چند جریان</div>

    <div class="stk-lbl">امنیت<small>بخش ۴</small></div>
    <div class="stk-c" style="--c: var(--seg-3)">TLS</div>
    <div class="stk-c" style="--c: var(--seg-3)">TLS</div>
    <div class="stk-c quic" style="--c: var(--seg-5)">QUIC<small>TLS 1.3 درون آن؛ روی UDP</small></div>

    <div class="stk-lbl">انتقال<small>بخش ۱ و ۳</small></div>
    <div class="stk-c" style="--c: var(--seg-1)">TCP</div>
    <div class="stk-c" style="--c: var(--seg-1)">TCP</div>
  </div>
</template>

<style scoped>
.stk { display: grid; grid-template-columns: 150px repeat(3, 1fr); gap: 8px 12px; margin: 4px 0 16px; align-items: stretch; }
.stk-h { text-align: center; font: 700 24px/1.4 "JetBrains Mono", monospace; direction: ltr; }
.stk-lbl { font-size: 20px; font-weight: 700; line-height: 1.3; align-self: center; }
.stk-lbl small { display: block; font-weight: 400; font-size: 15px; color: var(--muted); }
.stk-c { background: var(--code-bg); border-bottom: 5px solid var(--c, var(--muted)); border-radius: 6px; padding: 8px 10px; text-align: center; font-size: 21px; line-height: 1.4; display: flex; flex-direction: column; justify-content: center; }
.stk-c small { font-size: 16px; color: var(--muted); }
.stk-c.sem { grid-column: 2 / span 3; border-bottom-color: var(--seg-4); }
.stk-c.quic { grid-row: span 2; }
</style>
