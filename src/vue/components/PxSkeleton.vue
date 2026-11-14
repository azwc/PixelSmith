<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'block' | 'text' | 'circle'
    size?: 'sm' | 'md' | 'lg'
    width?: string
    height?: string
    lines?: number
    label?: string
  }>(),
  { variant: 'block', size: 'md', width: '', height: '', lines: 1, label: '' }
)

const classes = computed(() => [
  'pix-skeleton',
  'pix-skeleton--' + props.variant,
  props.variant === 'block' ? 'pix-skeleton--' + props.size : ''
])

const box = computed(() => ({
  width: props.width || undefined,
  height: props.height || undefined
}))

const count = computed(() => Math.max(1, Math.round(props.lines)))

const lineStyle = (index: number): Record<string, string | undefined> => ({
  ...box.value,
  width: index === count.value - 1 && count.value > 1 ? '68%' : props.width || undefined
})
</script>

<template>
  <div
    v-if="variant === 'text' && count > 1"
    class="pix-skeleton-stack"
    :role="label ? 'status' : undefined"
    :aria-label="label || undefined"
  >
    <span
      v-for="line in count"
      :key="line"
      :class="classes"
      :style="lineStyle(line - 1)"
      :aria-hidden="label ? undefined : 'true'"
    ></span>
  </div>
  <span
    v-else
    :class="classes"
    :style="box"
    :role="label ? 'status' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
  ></span>
</template>
