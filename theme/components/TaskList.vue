<script setup lang="ts">
// فهرست پیشرفت به سبک task list در markdown:  [x] گذشته  [>] الان  [ ] آینده
// در چاپ سیاه‌وسفید هم با علامت داخل کروشه و زمینهٔ معکوس ردیف فعلی از هم جدا می‌شوند.
defineProps<{ items: { label: string, note?: string, state: 'done' | 'now' | 'todo' }[], title?: string, nowLabel?: string, compact?: boolean }>()
const box: Record<string, string> = { done: '[x]', now: '[>]', todo: '[ ]' }
</script>

<template>
  <div class="tasks" :class="{ compact }">
    <div v-if="title" class="tasks-head" dir="ltr">{{ title }}</div>
    <ul>
      <li v-for="(it, i) in items" :key="i" :class="it.state">
        <code class="box" dir="ltr">{{ box[it.state] }}</code>
        <span class="lbl">{{ it.label }}<small v-if="it.note">{{ it.note }}</small></span>
        <span v-if="it.state === 'now'" class="now-mark" role="img" :aria-label="nowLabel || 'اکنون'" />
      </li>
    </ul>
  </div>
</template>
