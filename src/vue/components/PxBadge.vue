<script setup lang="ts">
import { computed } from 'vue'
import type { PixelTone } from '../../types'

const props = withDefaults(
  defineProps<{
    tone?: PixelTone
    size?: 'sm' | 'md' | 'lg'
    outline?: boolean
    dot?: boolean
    live?: boolean
  }>(),
  { tone: 'primary', size: 'md', outline: false, dot: false, live: false }
)

const classes = computed(() => [
  'pix-badge',
  `pix-badge--${props.tone}`,
  {
    'pix-badge--outline': props.outline,
    'pix-badge--lg': props.size === 'lg',
    'pix-badge--live': props.live
  }
])
</script>

<template>
  <span :class="classes">
    <span v-if="dot || live" class="pix-badge__dot" aria-hidden="true"></span>
    <slot></slot>
  </span>
</template>
