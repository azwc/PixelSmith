<script setup lang="ts">
import { computed, ref, useId } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: number
    min?: number
    max?: number
    step?: number
    label?: string
    hint?: string
    error?: string
    id?: string
    name?: string
    disabled?: boolean
    required?: boolean
    showValue?: boolean
    format?: (value: number) => string
  }>(),
  {
    modelValue: 0,
    min: 0,
    max: 100,
    step: 1,
    label: '',
    hint: '',
    error: '',
    id: '',
    name: '',
    disabled: false,
    required: false,
    showValue: false,
    format: undefined
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
  input: [event: Event]
  change: [event: Event]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const reactId = useId()
const inputId = computed(() => props.id || 'pix-slider-' + reactId)
const hintId = computed(() => inputId.value + '-hint')
const errorId = computed(() => inputId.value + '-error')
const describedBy = computed(() => {
  if (props.error) return errorId.value
  if (props.hint) return hintId.value
  return undefined
})

const classes = computed(() => ['pix-slider'])
const readout = computed(() =>
  props.format ? props.format(props.modelValue) : String(props.modelValue)
)

const onInput = (event: Event): void => {
  emit('update:modelValue', Number((event.target as HTMLInputElement).value))
  emit('input', event)
}

defineExpose({ focus: () => inputRef.value?.focus() })
</script>

<template>
  <div class="pix-field">
    <label v-if="label" class="pix-field__label" :for="inputId">
      {{ label }}
      <span v-if="required" class="pix-field__required" aria-hidden="true">*</span>
      <span v-if="showValue" class="pix-slider__readout" aria-hidden="true">{{ readout }}</span>
    </label>
    <input
      ref="inputRef"
      v-bind="$attrs"
      :id="inputId"
      :class="classes"
      type="range"
      :name="name || undefined"
      :value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :required="required"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
      @input="onInput"
      @change="emit('change', $event)"
    />
    <p v-if="error" :id="errorId" class="pix-field__error">{{ error }}</p>
    <p v-else-if="hint" :id="hintId" class="pix-field__hint">{{ hint }}</p>
  </div>
</template>
