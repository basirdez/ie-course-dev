<script lang="ts">
// اعتبار تصویرها (صاحب اثر، مجوز، صفحهٔ منبع) را scripts/images.mjs در public/images/credits.json می‌نویسد.
// یک بار برای همهٔ تصویرهای دک خوانده می‌شود.
let credits: Promise<Record<string, { artist?: string, license?: string, page?: string }>> | undefined
function loadCredits() {
  return credits ??= fetch('images/credits.json').then(r => (r.ok ? r.json() : {})).catch(() => ({}))
}
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
// تصویر شاهد: سند، عکس یا نمودار واقعی که ادعای اسلاید را نشان می‌دهد؛ نه تزئین.
// فایل در public/ پوشهٔ جلسه قرار می‌گیرد. با wiki="<نام فایل در ویکی‌پدیا یا Commons>"، دستور npm run images آن را دریافت می‌کند.
// تا وقتی فایل نیست، یک کادر راهنما نشان داده می‌شود: چه چیزی، از کجا، و کجا ذخیره شود.
const props = defineProps<{ src: string, alt: string, caption?: string, how?: string, h?: number | string, wiki?: string }>()
const missing = ref(false)
const credit = ref<{ artist?: string, license?: string, page?: string }>()
const file = props.src.split('/').pop() || props.src
// صفحهٔ فایل در ویکی‌پدیای انگلیسی، فایل‌های Commons را هم نشان می‌دهد
const wikiPage = props.wiki ? `https://en.wikipedia.org/wiki/File:${encodeURIComponent(props.wiki.replace(/ /g, '_'))}` : undefined
onMounted(async () => { credit.value = (await loadCredits())[file] })
</script>

<template>
  <figure class="shot" :style="props.h ? { '--h': `${props.h}px` } : {}">
    <img v-if="!missing" :src="props.src" :alt="props.alt" @error="missing = true">
    <div v-else class="shot-ph" role="img" :aria-label="props.alt">
      <div class="shot-cam" aria-hidden="true" />
      <strong>جای تصویر: {{ props.alt }}</strong>
      <span v-if="props.wiki"><a :href="wikiPage" dir="ltr">{{ props.wiki }}</a> · با <code dir="ltr">npm run images</code></span>
      <template v-else>
        <span v-if="props.how">{{ props.how }}</span>
        <code dir="ltr">public/{{ props.src }}</code>
      </template>
    </div>
    <figcaption v-if="props.caption || credit || props.wiki">
      <span v-if="props.caption">{{ props.caption }}</span>
      <small v-if="credit || props.wiki" class="shot-credit">
        <a :href="credit?.page || wikiPage">منبع</a><template v-if="credit?.artist || credit?.license">: <bdi dir="ltr">{{ [credit?.artist, credit?.license].filter(Boolean).join(' · ') }}</bdi></template>
      </small>
    </figcaption>
  </figure>
</template>
