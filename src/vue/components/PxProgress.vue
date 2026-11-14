<script setup lang="ts">
import { computed } from 'vue'
import type { PixelTone } from '../../types'

const props = withDefaults(
  defineProps<{
    value?: number
    max?: number
    label?: string
    showValue?: boolean
    tone?: PixelTone
    size?: 'sm' | 'md' | 'lg'
    indeterminate?: boolean
    striped?: boolean
  }>(),
  {
    value: 0,
    max: 100,
    label: '',
    showValue: false,
    tone: 'primary',
    size: 'md',
    indeterminate: false,
    striped: false
  }
)

const percent = computed(() => {
  if (props.max <= 0) return 0
  return Math.min(100, Math.max(0, (props.value / props.max) * 100))
})

const classes = computed(() => [
  'pix-progress',
  `pix-progress--${props.tone}`,
  props.size !== 'md' ? `pix-progress--${props.size}` : '',
  {
    'pix-progress--indeterminate': props.indeterminate,
    'pix-progress--striped': props.striped
  }
])

const barStyle = computed<Record<string, string>>(() => ({
  '--pix-progress-value': `${percent.value}%`
}))
</script>

<template>
  <div
    :class="classes"
    role="progressbar"
    :aria-label="label || 'Progress'"
    :aria-valuemin="0"
    :aria-valuemax="max"
    :aria-valuenow="indeterminate ? undefined : Math.round(percent)"
  >
    <div v-if="label || showValue || $slots.label" class="pix-progress__head">
      <span class="pix-progress__label"><slot name="label">{{ label }}</slot></span>
      <span v-if="showValue" class="pix-progress__value">{{ Math.round(percent) }}%</span>
    </div>
    <div class="pix-progress__track">
      <div class="pix-progress__bar" :style="barStyle"></div>
    </div>
  </div>
</template>
