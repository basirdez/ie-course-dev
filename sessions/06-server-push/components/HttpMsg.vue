<script setup lang="ts">
// کالبدشکافی پیام HTTP/1.1: هر خط با رنگ نقشش و برچسب فارسی کنارش. c = شمارهٔ رنگ (--seg-N).
// خط خالی (t: '') پایان header‌هاست؛ با crlf، پایان هر خط با ␍␊ نشان داده می‌شود.
defineProps<{ lines: { t: string, l?: string, c?: number }[], crlf?: boolean }>()
</script>

<template>
  <div class="hmsg" role="img" :aria-label="lines.map(x => x.t).join(' / ')">
    <template v-for="(x, i) in lines" :key="i">
      <div class="hmsg-l" :style="{ '--c': x.c ? `var(--seg-${x.c})` : 'var(--muted)' }">{{ x.l }}</div>
      <div class="hmsg-t" dir="ltr" :style="{ '--c': x.c ? `var(--seg-${x.c})` : 'var(--rule)' }">
        <span v-if="x.t">{{ x.t }}</span><span v-else class="hmsg-empty">(خط خالی)</span><span v-if="crlf" class="hmsg-crlf">␍␊</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.hmsg { display: grid; grid-template-columns: 170px 1fr; column-gap: 20px; margin: 4px 0 18px; }
.hmsg-l { font-size: 20px; font-weight: 700; color: var(--c); text-align: left; align-self: center; line-height: 1.3; }
.hmsg-t { font: 25px/1.55 "JetBrains Mono", monospace; font-variant-ligatures: none; background: var(--code-bg); border-left: 6px solid var(--c); padding: 1px 14px; white-space: pre; text-align: left; }
.hmsg-empty { font-family: Vazirmatn, sans-serif; font-size: 18px; color: var(--muted); }
.hmsg-crlf { color: var(--muted); opacity: .6; font-size: 18px; margin-left: 6px; }
</style>
