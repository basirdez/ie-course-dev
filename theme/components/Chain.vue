<script setup lang="ts">
defineProps<{ active?: string; today?: string[] }>()
const links = [
  { k: 'parse', t: 'parse' }, { k: 'hsts', t: 'HSTS' }, { k: 'dns', t: 'DNS' },
  { k: 'conn', t: 'اتصال' }, { k: 'tls', t: 'TLS', box: true }, { k: 'http', t: 'HTTP' },
]
</script>

<template>
  <ol class="chain" :data-active="active">
    <li
      v-for="l in links" :key="l.k"
      :class="{ blackbox: l.box, on: active === l.k || (today || []).includes(l.k), lit: active === 'all' }"
    ><span class="t">{{ l.t }}</span></li>
  </ol>
</template>
