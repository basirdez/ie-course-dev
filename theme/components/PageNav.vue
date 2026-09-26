<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
// ردیف راهبری زیر نوار نشانی: برچسب بخش (module)، زنجیرهٔ فصل، شمارهٔ اسلاید
const props = defineProps<{ module?: string, link?: string }>()
const { $slidev, $page, $nav } = useSlideContext()
const fa = (n: number) => Number(n).toLocaleString('fa-IR')
const tag = computed(() => props.module ? $slidev.configs.modules?.[props.module]?.title : '')
</script>

<template>
  <nav class="br-crumbs" aria-label="راهبری">
    <span v-if="tag" class="mod-tag">{{ tag }}</span>
    <Chain v-if="props.link && props.link !== 'none'" :active="props.link" />
    <span class="br-fill" />
    <span class="page-no">{{ fa($page) }} از {{ fa($nav.total) }}</span>
  </nav>
</template>
