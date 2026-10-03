<script setup lang="ts">
// مسیر یک درخواست از مرورگر تا سرور اصلی، با واسطه‌ها. tls: دو تکهٔ رمزشده را زیر مسیر نشان می‌دهد.
defineProps<{ tls?: boolean }>()
</script>

<template>
  <div class="pth" role="img" aria-label="مرورگر با cache خصوصی، proxy شبکهٔ سازمان، لبهٔ CDN با cache مشترک، و سرور اصلی">
    <div class="pth-row">
      <div class="pth-node"><b>مرورگر</b><span class="pth-tag priv">cache خصوصی</span><small>فقط برای همین کاربر</small></div>
      <div class="pth-arrow" aria-hidden="true">←</div>
      <div class="pth-node opt"><b>forward proxy</b><small>شبکهٔ سازمان؛ نمایندهٔ کلاینت</small></div>
      <div class="pth-arrow" aria-hidden="true">←</div>
      <div class="pth-node edge"><b>لبهٔ CDN</b><span class="pth-tag shared">cache مشترک</span><small>reverse proxy؛ نمایندهٔ سرور</small></div>
      <div class="pth-arrow" aria-hidden="true">←</div>
      <div class="pth-node"><b>سرور اصلی</b><small>origin</small></div>
    </div>
    <div v-if="tls" class="pth-tls">
      <div class="pth-seg one">اتصال TLS اول: مرورگر تا لبه<small>proxy سازمان فقط یک تونل می‌بیند</small></div>
      <div class="pth-open">اینجا باز می‌شود</div>
      <div class="pth-seg two">اتصال دوم: لبه تا origin<small>رمز هست؟ گواهی سنجیده می‌شود؟</small></div>
    </div>
  </div>
</template>

<style scoped>
.pth { margin: 4px 0 16px; }
.pth-row { display: flex; align-items: stretch; gap: 8px; }
.pth-node { flex: 1; border: 2px solid var(--ink); border-radius: 10px; padding: 10px 8px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; }
.pth-node b { font-size: 23px; line-height: 1.3; }
.pth-node small { font-size: 16px; color: var(--muted); line-height: 1.4; }
.pth-node.opt { border-style: dashed; border-color: var(--muted); }
.pth-node.edge { border-color: var(--wire); border-width: 3px; }
.pth-tag { font-size: 16px; font-weight: 700; border-radius: 4px; padding: 1px 10px; }
.pth-tag.priv { border: 2px solid var(--demo); color: var(--demo); }
.pth-tag.shared { background: var(--wire); color: #fff; }
.pth-arrow { align-self: center; font-size: 26px; color: var(--muted); }
.pth-tls { display: flex; align-items: stretch; gap: 0; margin-top: 12px; }
.pth-seg { text-align: center; font-size: 19px; font-weight: 700; line-height: 1.4; padding: 6px 8px; border-bottom: 6px solid var(--seg-5); background: var(--code-bg); }
.pth-seg small { display: block; font-weight: 400; font-size: 15px; color: var(--muted); }
.pth-seg.one { flex: 2.35; border-radius: 0 6px 6px 0; }
.pth-seg.two { flex: 1; border-bottom-style: dashed; border-bottom-color: var(--seg-4); border-radius: 6px 0 0 6px; }
.pth-open { flex: 0 0 130px; align-self: center; text-align: center; font-size: 16px; font-weight: 700; color: var(--seg-6); }
</style>
