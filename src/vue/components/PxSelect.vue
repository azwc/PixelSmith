<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import type { PxSelectOption } from '../types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    options?: PxSelectOption[]
    label?: string
    placeholder?: string
    hint?: string
    error?: string
    size?: 'sm' | 'md' | 'lg'
    id?: string
    name?: string
    disabled?: boolean
    required?: boolean
  }>(),
  {
    modelValue: '',
    options: () => [],
    label: '',
    placeholder: '',
    hint: '',
    error: '',
    size: 'md',
    id: '',
    name: '',
    disabled: false,
    required: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const selectRef = ref<HTMLSelectElement | null>(null)
const reactId = useId()
const inputId = computed(() => props.id || `pix-select-${reactId}`)
const hintId = computed(() => `${inputId.value}-hint`)
const errorId = computed(() => `${inputId.value}-error`)
const describedBy = computed(() => {
  if (props.error) return errorId.value
  if (props.hint) return hintId.value
  return undefined
})

const classes = computed(() => [
  'pix-select',
  props.size !== 'md' ? `pix-select--${props.size}` : ''
])

const onChange = (event: Event): void => {
  emit('update:modelValue', (event.target as HTMLSelectElement).value)
  emit('change', event)
}

defineExpose({ focus: () => selectRef.value?.focus() })
</script>

<template>
  <div class="pix-field">
    <label v-if="label" class="pix-field__label" :for="inputId">
      {{ label }}
      <span v-if="required" class="pix-field__required" aria-hidden="true">*</span>
    </label>
    <div class="pix-select-wrap">
      <select
        ref="selectRef"
        v-bind="$attrs"
        :id="inputId"
        :class="classes"
        :name="name || undefined"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="describedBy"
        @change="onChange"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
    <p v-if="error" :id="errorId" class="pix-field__error">{{ error }}</p>
    <p v-else-if="hint" :id="hintId" class="pix-field__hint">{{ hint }}</p>
  </div>
</template>
