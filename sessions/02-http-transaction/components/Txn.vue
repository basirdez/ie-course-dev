<script setup lang="ts">
// تصویر کلی یک تراکنش: کلاینت (راست) و سرور (چپ)؛ هر جزء پیام با ماژولی که بررسی‌اش می‌کند
</script>

<template>
  <div class="txn">
    <div class="txn-end">کلاینت<small>مرورگر، curl، agent</small></div>
    <div class="txn-mid">
      <div class="txn-row">
        <span class="txn-lbl">درخواست</span>
        <span class="txn-part" style="--c: var(--seg-2)">متد<em>M2</em></span>
        <span class="txn-part" style="--c: var(--seg-1)">هدف<em>path و query</em></span>
        <span class="txn-part" style="--c: var(--seg-4)">فیلدها<em>M4</em></span>
        <span class="txn-part" style="--c: var(--seg-5)">محتوا<em>اختیاری</em></span>
        <span class="txn-arrow" aria-hidden="true">←</span>
      </div>
      <div class="txn-row">
        <span class="txn-arrow" aria-hidden="true">→</span>
        <span class="txn-part" style="--c: var(--seg-3)">کد وضعیت<em>M3</em></span>
        <span class="txn-part" style="--c: var(--seg-4)">فیلدها<em>M4</em></span>
        <span class="txn-part" style="--c: var(--seg-5)">محتوا<em>بازنمایی منبع</em></span>
        <span class="txn-lbl">پاسخ</span>
      </div>
      <div class="txn-note">شکل پیام روی اتصال: M1</div>
    </div>
    <div class="txn-end">سرور<small>یا هر واسطه‌ای که جایش پاسخ دهد</small></div>
  </div>
</template>

<style scoped>
.txn { display: flex; align-items: stretch; gap: 20px; margin: 10px 0 20px; }
.txn-end { flex: 0 0 150px; border: 2px solid var(--ink); border-radius: 10px; padding: 12px; text-align: center; font-weight: 700; font-size: 28px; display: flex; flex-direction: column; justify-content: center; }
.txn-end small { font-weight: 400; font-size: 16px; color: var(--muted); margin-top: 6px; line-height: 1.4; }
.txn-mid { flex: 1; display: flex; flex-direction: column; gap: 18px; justify-content: center; }
.txn-row { display: flex; align-items: center; gap: 10px; }
.txn-lbl { font-weight: 700; font-size: 22px; width: 90px; text-align: center; }
.txn-part { flex: 1; text-align: center; padding: 10px 6px; border-radius: 8px; border-bottom: 5px solid var(--c); background: var(--code-bg); font-size: 23px; font-weight: 700; line-height: 1.3; }
.txn-part em { display: block; font-style: normal; font-weight: 400; font-size: 16px; color: var(--muted); }
.txn-arrow { font-size: 34px; color: var(--muted); }
.txn-note { text-align: center; font-size: 18px; color: var(--muted); }
</style>
