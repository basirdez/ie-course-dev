<script setup lang="ts">
// چهار راه برای رساندن خبر از سرور به کلاینت، روی یک خط زمان مشترک (زمان از چپ به راست).
// سه خبر در لحظه‌های یکسان می‌رسد؛ هر ردیف نشان می‌دهد اتصال در آن لحظه در چه حالی است.
defineProps<{ show?: string[] }>()
type Seg = { w: number, k: 'idle' | 'req' | 'empty' | 'wait' | 'evt' | 'open' | 'up' | 'hs', t?: string }
const rows: { k: string, name: string, note: string, segs: Seg[] }[] = [
  { k: 'poll', name: 'polling', note: 'بیشترِ پاسخ‌ها خالی‌اند', segs: [
    { w: 1, k: 'empty', t: '∅' }, { w: 3, k: 'idle' }, { w: 1, k: 'empty', t: '∅' }, { w: 3, k: 'idle' }, { w: 1, k: 'evt', t: '۱' }, { w: 3, k: 'idle' }, { w: 1, k: 'empty', t: '∅' }, { w: 3, k: 'idle' },
    { w: 1, k: 'evt', t: '۲' }, { w: 3, k: 'idle' }, { w: 1, k: 'empty', t: '∅' }, { w: 3, k: 'idle' }, { w: 1, k: 'evt', t: '۳' }, { w: 3, k: 'idle' }] },
  { k: 'long', name: 'long polling', note: 'هر خبر، یک درخواست کامل', segs: [
    { w: 7, k: 'wait' }, { w: 1, k: 'evt', t: '۱' }, { w: 7, k: 'wait' }, { w: 1, k: 'evt', t: '۲' }, { w: 7, k: 'wait' }, { w: 1, k: 'evt', t: '۳' }, { w: 4, k: 'wait' }] },
  { k: 'sse', name: 'SSE', note: 'یک پاسخ که تمام نمی‌شود', segs: [
    { w: 1, k: 'hs', t: 'GET' }, { w: 6, k: 'open' }, { w: 1, k: 'evt', t: '۱' }, { w: 7, k: 'open' }, { w: 1, k: 'evt', t: '۲' }, { w: 7, k: 'open' }, { w: 1, k: 'evt', t: '۳' }, { w: 4, k: 'open' }] },
  { k: 'ws', name: 'WebSocket', note: 'دوطرفه؛ دیگر HTTP نیست', segs: [
    { w: 1, k: 'hs', t: '101' }, { w: 3, k: 'open' }, { w: 1, k: 'up', t: '↑' }, { w: 2, k: 'open' }, { w: 1, k: 'evt', t: '۱' }, { w: 4, k: 'open' }, { w: 1, k: 'up', t: '↑' }, { w: 2, k: 'open' }, { w: 1, k: 'evt', t: '۲' },
    { w: 7, k: 'open' }, { w: 1, k: 'evt', t: '۳' }, { w: 2, k: 'open' }, { w: 1, k: 'up', t: '↑' }, { w: 1, k: 'open' }] },
]
</script>

<template>
  <div class="mds" role="img" aria-label="خط زمان چهار سازوکار: polling، long polling، SSE و WebSocket">
    <template v-for="r in rows.filter(r => !show || show.includes(r.k))" :key="r.k">
      <div class="mds-name">{{ r.name }}</div>
      <div class="mds-lane"><span v-for="(s, i) in r.segs" :key="i" class="mds-seg" :class="s.k" :style="{ flex: s.w }">{{ s.t }}</span></div>
      <div class="mds-note">{{ r.note }}</div>
    </template>
    <div class="mds-key">
      <span class="mds-seg evt">۱</span> خبر به کلاینت رسید
      <span class="mds-seg empty">∅</span> درخواست و پاسخ خالی
      <span class="mds-seg wait" /> درخواست باز، منتظر
      <span class="mds-seg open" /> اتصال باز
      <span class="mds-seg up">↑</span> پیام از کلاینت
    </div>
  </div>
</template>

<style scoped>
.mds { display: grid; grid-template-columns: 170px 1fr 240px; gap: 12px 16px; align-items: center; margin: 4px 0 14px; direction: ltr; }
.mds-name { font: 700 21px/1.3 "JetBrains Mono", monospace; text-align: left; }
.mds-lane { display: flex; gap: 2px; height: 36px; }
.mds-seg { display: inline-flex; align-items: center; justify-content: center; min-width: 0; border-radius: 4px; font: 700 17px/1 Vazirmatn, "JetBrains Mono", sans-serif; color: #fff; }
.mds-seg.idle { background: transparent; }
.mds-seg.empty { background: #fff; border: 2px solid var(--muted); color: var(--muted); }
.mds-seg.wait { background: repeating-linear-gradient(135deg, var(--code-bg) 0 6px, #d5dbe1 6px 9px); border: 1px solid var(--rule); }
.mds-seg.open { background: var(--code-bg); border-top: 3px solid var(--seg-1); border-bottom: 3px solid var(--seg-1); border-radius: 0; }
.mds-seg.evt { background: var(--seg-5); }
.mds-seg.up { background: var(--seg-2); }
.mds-seg.hs { background: var(--ink); font: 700 12px/1 "JetBrains Mono", monospace; }
.mds-note { direction: rtl; font-size: 19px; font-weight: 700; text-align: right; line-height: 1.4; }
.mds-key { grid-column: 1 / -1; direction: rtl; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; font-size: 16px; color: var(--muted); margin-top: 2px; }
.mds-key .mds-seg { width: 30px; height: 24px; margin-right: 10px; font-size: 14px; }
</style>
