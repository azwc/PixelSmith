<script setup lang="ts">
import { computed } from 'vue'
import type { PixelTone } from '../../types'

const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    initials?: string
    tone?: PixelTone
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { src: '', alt: '', initials: '', tone: 'primary', size: 'md' }
)

const classes = computed(() => [
  'pix-avatar',
  `pix-avatar--${props.tone}`,
  props.size !== 'md' ? `pix-avatar--${props.size}` : ''
])
</script>

<template>
  <span :class="classes">
    <img v-if="src" :src="src" :alt="alt" />
    <slot v-else>{{ initials }}</slot>
  </span>
</template>
