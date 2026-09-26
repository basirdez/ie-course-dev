<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
// کروم مرورگر: تب با عنوان جلسه، نوار نشانی با URL واقعی (fragment = شمارهٔ اسلاید) و chip نوع اسلاید
const props = defineProps<{ type?: string, module?: string }>()
const { $slidev, $page } = useSlideContext()
const chips: Record<string, string> = { interactive: 'نوبت شما', demo: 'دمو', reserve: 'پشتیبان', optional: 'اختیاری', extra: 'کنجکاوی بیشتر', exercise: 'تمرین' }
const file = computed(() => $slidev.configs.exportFilename || 'slides')
const chapter = computed(() => $slidev.configs.chapter || 'ch1')
const slug = computed(() => (props.module && $slidev.configs.modules?.[props.module]?.slug) || '')
</script>

<template>
  <div class="br-frame">
    <div class="br-tabs"><div class="br-tab"><i class="br-fav" />{{ $slidev.configs.title }}</div></div>
    <div class="br-bar">
      <svg class="br-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      <svg class="br-ico dim" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
      <svg class="br-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12a7 7 0 1 1-2.05-4.95M19 4v4h-4" /></svg>
      <div class="br-omni">
        <span v-if="props.type && chips[props.type]" class="br-chip" :data-type="props.type">{{ chips[props.type] }}</span>
        <span class="br-url" dir="ltr"><svg class="br-lock" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="11" width="12" height="9" rx="1.5" /><path d="M9 11V8a3 3 0 0 1 6 0v3" /></svg><b>ie.scu.ac.ir</b>/{{ chapter }}/{{ file }}<span v-if="slug">/{{ slug }}</span><span v-if="$page > 1">#{{ $page }}</span></span>
      </div>
    </div>
  </div>
</template>
