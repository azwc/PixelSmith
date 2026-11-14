<script setup lang="ts">
import { computed } from 'vue'
import type { PxButtonTone, PxSize } from '../types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    tone?: PxButtonTone
    size?: PxSize
    type?: 'button' | 'submit' | 'reset'
    block?: boolean
    iconOnly?: boolean
    loading?: boolean
    disabled?: boolean
  }>(),
  {
    tone: 'primary',
    size: 'md',
    type: 'button',
    block: false,
    iconOnly: false,
    loading: false,
    disabled: false
  }
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const classes = computed(() => [
  'pix-btn',
  `pix-btn--${props.tone}`,
  props.size !== 'md' ? `pix-btn--${props.size}` : '',
  { 'pix-btn--block': props.block, 'pix-btn--icon': props.iconOnly }
])

const isDisabled = computed(() => props.disabled || props.loading)

const onClick = (event: MouseEvent): void => {
  if (isDisabled.value) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<template>
  <button
    v-bind="$attrs"
    :type="type"
    :class="classes"
    :disabled="isDisabled"
    :aria-busy="loading ? 'true' : undefined"
    @click="onClick"
  >
    <span v-if="loading" class="pix-loader" aria-hidden="true">
      <span></span><span></span><span></span>
    </span>
    <span v-if="$slots.icon && !loading" class="pix-btn__icon" aria-hidden="true">
      <slot name="icon"></slot>
    </span>
    <span class="pix-btn__label"><slot></slot></span>
  </button>
</template>
