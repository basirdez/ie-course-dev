<script setup lang="ts">
import { onMounted, ref } from 'vue'
import QRCode from 'qrcode'
import course from '../../course.json'
// تمرین پایان جلسه: فقط اصل چالش روی اسلاید؛ صورت کامل در exercises/<ex>/ و در سایت درس.
// نشانی از course.json ساخته می‌شود؛ با عوض کردن site در آن، همهٔ اسلایدها و QRها درست می‌شوند.
const props = defineProps<{ ex: string, due?: string }>()
const url = `${course.site.replace(/\/?$/, '/')}exercises/${props.ex}/`
const qr = ref('')
onMounted(async () => { qr.value = await QRCode.toString(url, { type: 'svg', margin: 0, errorCorrectionLevel: 'M' }) })
</script>

<template>
  <div class="exr">
    <div class="exr-body"><slot /></div>
    <a class="exr-card" :href="url">
      <span class="exr-qr" aria-hidden="true" v-html="qr" />
      <span class="exr-due">{{ props.due || 'مهلت: یک هفته' }}</span>
      <span class="exr-url" dir="ltr">{{ url.replace(/^https?:\/\//, '') }}</span>
    </a>
  </div>
</template>
