<script setup lang="ts">
import { computed } from 'vue'
import type { PixelTone } from '../../types'

const props = withDefaults(
  defineProps<{
    tone?: PixelTone
    title?: string
    dismissible?: boolean
  }>(),
  { tone: 'info', title: '', dismissible: false }
)

const emit = defineEmits<{
  close: []
}>()

const icons: Record<PixelTone, string> = {
  primary: '★',
  secondary: '◆',
  success: '✓',
  danger: '!',
  warning: '!',
  info: 'i',
  accent: '✦',
  neutral: '·'
}

const classes = computed(() => ['pix-alert', `pix-alert--${props.tone}`])
const role = computed(() =>
  props.tone === 'danger' || props.tone === 'warning' ? 'alert' : 'status'
)
</script>

<template>
  <div :class="classes" :role="role">
    <span class="pix-alert__icon" aria-hidden="true">{{ icons[tone] }}</span>
    <div class="pix-alert__body">
      <p v-if="title || $slots.title" class="pix-alert__title">
        <slot name="title">{{ title }}</slot>
      </p>
      <div class="pix-alert__message"><slot></slot></div>
    </div>
    <button
      v-if="dismissible"
      type="button"
      class="pix-alert__close"
      aria-label="Dismiss alert"
      @click="emit('close')"
    >
      ×
    </button>
  </div>
</template>
