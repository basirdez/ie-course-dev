<template>
  <div class="slidev-layout lecture br" dir="rtl" :data-type="$frontmatter.type || 'core'">
    <BrowserChrome :type="$frontmatter.type" :module="$frontmatter.module" />
    <PageNav :module="$frontmatter.module" :link="$frontmatter.link" />
    <div class="body">
      <p v-if="$frontmatter.lead" class="lead">{{ $frontmatter.lead }}</p>
      <slot />
    </div>
    <div v-if="$slots.punch" class="punch"><slot name="punch" /></div>
  </div>
</template>
