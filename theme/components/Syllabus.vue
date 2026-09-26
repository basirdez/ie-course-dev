<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
// رئوس مطالب فصل؛ وضعیت هر جلسه از شمارهٔ جلسهٔ جاری (ابتدای exportFilename) حساب می‌شود
const props = defineProps<{ items: { s: number, t: string, n?: string }[], title?: string }>()
const { $slidev } = useSlideContext()
const cur = computed(() => Number.parseInt($slidev.configs.exportFilename || '0'))
const fa = (n: number) => Number(n).toLocaleString('fa-IR')
const rows = computed(() => props.items.map(it => ({
  label: `جلسهٔ ${fa(it.s)}: ${it.t}`,
  note: it.n,
  state: it.s < cur.value ? 'done' : it.s === cur.value ? 'now' : 'todo',
})))
</script>

<template>
  <TaskList :items="rows" :title="title" now-label="جلسهٔ امروز" compact />
</template>
