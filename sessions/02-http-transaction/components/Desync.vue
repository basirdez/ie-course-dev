<script setup lang="ts">
// request smuggling: یک رشته بایت، دو برداشت از مرز پیام
</script>

<template>
  <div class="dsy" dir="ltr" role="img" aria-label="proxy با Content-Length کل بایت‌ها را یک درخواست می‌بیند؛ سرور با chunked درخواست را زودتر تمام می‌کند و باقی‌مانده را آغاز درخواست بعدی می‌گیرد">
    <div class="dsy-bytes">
      <span class="dsy-a">POST / HTTP/1.1␍␊Host: shop.example.com␍␊<b>Content-Length: 29</b>␍␊<b>Transfer-Encoding: chunked</b>␍␊␍␊0␍␊␍␊</span><span class="dsy-b">GET /admin HTTP/1.1␍␊X: </span>
    </div>
    <div class="dsy-row"><span class="dsy-who" dir="rtl">proxy جلو<small>با Content-Length</small></span><span class="dsy-bar one" dir="rtl">یک درخواست کامل</span></div>
    <div class="dsy-row"><span class="dsy-who" dir="rtl">سرور پشت<small>با chunked</small></span><span class="dsy-bar a" dir="rtl">درخواست ۱ تمام شد</span><span class="dsy-bar b" dir="rtl">آغاز درخواست کاربر بعدی</span></div>
  </div>
</template>

<style scoped>
.dsy { margin: 6px 0 16px; --wa: 64%; }
.dsy-bytes { display: flex; font: 18px/1.5 "JetBrains Mono", monospace; font-variant-ligatures: none; margin-left: 150px; }
.dsy-bytes span { padding: 6px 8px; word-break: break-all; }
.dsy-a { width: var(--wa); background: var(--code-bg); }
.dsy-b { flex: 1; background: #FDE7E7; color: #8A1C1C; }
.dsy-bytes b { color: var(--seg-6); }
.dsy-row { display: flex; align-items: center; margin-top: 10px; }
.dsy-who { width: 150px; font: 700 19px/1.3 Vazirmatn, sans-serif; text-align: center; }
.dsy-who small { display: block; font-weight: 400; font-size: 15px; color: var(--muted); }
.dsy-bar { font: 700 18px/1 Vazirmatn, sans-serif; padding: 10px; border-radius: 6px; text-align: center; }
.dsy-bar.one { flex: 1; border: 3px solid var(--wire); color: var(--wire); }
.dsy-bar.a { width: var(--wa); border: 3px solid var(--demo); color: var(--demo); }
.dsy-bar.b { flex: 1; border: 3px dashed var(--seg-6); color: var(--seg-6); margin-left: 4px; }
</style>
