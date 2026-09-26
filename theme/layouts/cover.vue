<template>
  <div class="slidev-layout title-slide br" dir="rtl">
    <BrowserChrome />
    <!-- «به نام خدا» در جای سنتی سرلوحه: وسط و بالای عنوان، با فاصلهٔ کافی از نوار مرورگر.
         قالب کامنت HTML است؛ ظرف چپ‌به‌راست است تا علامت‌های کامنت جابه‌جا نشوند. -->
    <p class="br-bism" dir="ltr"><span class="c">&lt;!--</span><bdi dir="rtl">به نام خدا</bdi><span class="c">--&gt;</span></p>
    <div class="br-cover"><slot /></div>
  </div>
</template>
