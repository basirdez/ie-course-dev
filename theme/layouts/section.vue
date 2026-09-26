<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
// اسلاید آغاز بخش: تغییر موضوع را محسوس می‌کند و پیش‌زمینه می‌دهد (تا اینجا / سؤال این بخش / نقشهٔ بخش‌های جلسه)
const { $slidev, $frontmatter } = useSlideContext()
const fa = (n: number) => Number(n).toLocaleString('fa-IR')
const mods = computed(() => Object.entries($slidev.configs.modules || {}).filter(([k]) => k !== 'M0') as [string, any][])
const idx = computed(() => mods.value.findIndex(([k]) => k === $frontmatter.module))
const items = computed(() => mods.value.map(([, v], i) => ({ label: v.title, state: i < idx.value ? 'done' : i === idx.value ? 'now' : 'todo' })))
</script>

<template>
  <div class="slidev-layout lecture br sec" dir="rtl" data-type="section">
    <BrowserChrome :module="$frontmatter.module" />
    <PageNav :module="$frontmatter.module" :link="$frontmatter.link" />
    <div class="body sec-body">
      <div class="sec-main">
        <p class="sec-kicker">بخش {{ fa(idx + 1) }} از {{ fa(mods.length) }}</p>
        <slot />
      </div>
      <TaskList :items="items" :title="($slidev.configs.exportFilename || 'session') + '.todo'" now-label="بخش فعلی" />
    </div>
  </div>
</template>
