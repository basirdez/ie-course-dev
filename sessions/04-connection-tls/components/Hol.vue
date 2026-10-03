<script setup lang="ts">
// صف‌بندی (head-of-line blocking) در سه نسخه: یک بستهٔ گم‌شده چه چیزهایی را نگه می‌دارد؟
// هر خانه یک بسته است با حرف جریانش؛ ✗ بستهٔ گم‌شده، خانهٔ هاشورخورده بسته‌ای که رسیده ولی تحویل نمی‌شود.
defineProps<{ show: string[] }>()
type P = { s: string, k?: 'lost' | 'wait' }
const row = (spec: string): P[] => spec.split(' ').map(x => ({ s: x[0], k: x[1] === 'x' ? 'lost' : x[1] === 'w' ? 'wait' : undefined }))
const h1 = [row('A A A A A A'), row('B Bx Bw Bw Bw Bw'), row('C C C C C C')]
const h2 = [row('A B C A Bx Cw Aw Bw Cw Aw Bw Cw')]
const h3 = [row('A A A A A A'), row('B Bx Bw Bw Bw Bw'), row('C C C C C C')]
</script>

<template>
  <div class="hol">
    <div v-if="show.includes('h1')" class="hol-row">
      <div class="hol-name"><b>HTTP/1.1</b><small>هر پاسخ روی یک اتصال TCP جدا</small></div>
      <div class="hol-lanes">
        <div v-for="(r, i) in h1" :key="i" class="hol-lane tcp"><span v-for="(p, j) in r" :key="j" class="hol-p" :class="[p.s, p.k]">{{ p.k === 'lost' ? '✗' : p.s }}</span></div>
      </div>
      <div class="hol-note">فقط B معطل می‌ماند</div>
    </div>
    <div v-if="show.includes('h2')" class="hol-row">
      <div class="hol-name"><b>HTTP/2</b><small>سه جریان روی یک اتصال TCP</small></div>
      <div class="hol-lanes">
        <div class="hol-lane tcp wide"><span v-for="(p, j) in h2[0]" :key="j" class="hol-p" :class="[p.s, p.k]">{{ p.k === 'lost' ? '✗' : p.s }}</span></div>
      </div>
      <div class="hol-note bad">A و B و C هر سه معطل می‌مانند</div>
    </div>
    <div v-if="show.includes('h3')" class="hol-row">
      <div class="hol-name"><b>HTTP/3</b><small>سه جریان روی یک اتصال QUIC</small></div>
      <div class="hol-lanes quic">
        <div v-for="(r, i) in h3" :key="i" class="hol-lane"><span v-for="(p, j) in r" :key="j" class="hol-p" :class="[p.s, p.k]">{{ p.k === 'lost' ? '✗' : p.s }}</span></div>
      </div>
      <div class="hol-note">فقط B معطل می‌ماند</div>
    </div>
    <div class="hol-key"><span class="hol-p lost">✗</span> بستهٔ گم‌شده <span class="hol-p wait A">A</span> رسیده، ولی تا پر شدن جای خالی تحویل برنامه نمی‌شود</div>
  </div>
</template>

<style scoped>
.hol { margin: 2px 0 12px; }
.hol-row { display: grid; grid-template-columns: 260px 1fr 260px; gap: 18px; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--rule); }
.hol-name b { display: block; font: 700 27px/1.3 "JetBrains Mono", monospace; direction: ltr; text-align: right; }
.hol-name small { display: block; font-size: 18px; color: var(--muted); line-height: 1.4; }
.hol-lanes { direction: ltr; display: flex; flex-direction: column; gap: 5px; }
.hol-lanes.quic { border: 2px dashed var(--seg-5); border-radius: 8px; padding: 5px; }
.hol-lane { display: flex; gap: 4px; }
.hol-lane.tcp { border: 2px solid var(--seg-1); border-radius: 8px; padding: 4px; }
.hol-p { flex: 1; text-align: center; font: 700 19px/34px "JetBrains Mono", monospace; border-radius: 4px; color: #fff; }
.hol-p.A { background: var(--seg-2); } .hol-p.B { background: var(--seg-4); } .hol-p.C { background: var(--seg-5); }
.hol-p.lost { background: #fff; color: var(--seg-6); border: 2px solid var(--seg-6); line-height: 30px; }
.hol-p.wait { opacity: .55; background-image: repeating-linear-gradient(135deg, transparent 0 5px, rgba(255,255,255,.75) 5px 8px); }
.hol-note { font-size: 22px; font-weight: 700; line-height: 1.4; color: var(--demo); }
.hol-note.bad { color: var(--seg-6); }
.hol-key { direction: rtl; font-size: 18px; color: var(--muted); margin-top: 8px; display: flex; align-items: center; gap: 8px; }
.hol-key .hol-p { flex: 0 0 34px; display: inline-block; }
</style>
