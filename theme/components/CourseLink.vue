<script setup lang="ts">
import course from '../../course.json'
// پیوند به صفحه‌ای از سایت درس؛ نشانی پایه فقط در course.json است
const props = defineProps<{ path: string }>()
const url = `${course.site.replace(/\/?$/, '/')}${props.path}`
</script>

<template>
  <a :href="url"><slot /><span v-if="!$slots.default" dir="ltr">{{ url.replace(/^https?:\/\//, '') }}</span></a>
</template>
