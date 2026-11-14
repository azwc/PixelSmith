<script setup lang="ts">
import { computed, useId } from 'vue'
import type { PxSegmentedOption } from '../types'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    options?: PxSegmentedOption[]
    name?: string
    size?: 'sm' | 'md' | 'lg'
    ariaLabel?: string
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    options: () => [],
    name: '',
    size: 'md',
    ariaLabel: 'Segmented control',
    disabled: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
}>()

const baseId = useId()
const group = computed(() => props.name || 'pix-segmented-' + baseId)
const classes = computed(() => [
  'pix-segmented',
  props.size !== 'md' ? 'pix-segmented--' + props.size : ''
])

const select = (option: PxSegmentedOption, event: Event): void => {
  if (props.disabled || option.disabled) {
    event.preventDefault()
    return
  }
  emit('update:modelValue', option.value)
  emit('change', option.value)
}
</script>

<template>
  <div :class="classes" role="radiogroup" :aria-label="ariaLabel">
    <span
      v-for="(option, index) in options"
      :key="String(option.value) + index"
      class="pix-segmented__item"
    >
      <input
        :id="group + '-' + index"
        class="pix-segmented__input"
        type="radio"
        :name="group"
        :value="option.value"
        :checked="option.value === modelValue"
        :disabled="disabled || option.disabled"
        @change="select(option, $event)"
      />
      <label class="pix-segmented__label" :for="group + '-' + index">{{ option.label }}</label>
    </span>
  </div>
</template>
