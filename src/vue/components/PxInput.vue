<script setup lang="ts">
import { computed, ref, useId } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    label?: string
    placeholder?: string
    hint?: string
    error?: string
    type?: string
    size?: 'sm' | 'md' | 'lg'
    id?: string
    name?: string
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    autocomplete?: string
  }>(),
  {
    modelValue: '',
    label: '',
    placeholder: '',
    hint: '',
    error: '',
    type: 'text',
    size: 'md',
    id: '',
    name: '',
    disabled: false,
    readonly: false,
    required: false,
    autocomplete: 'off'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: [event: Event]
  change: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const reactId = useId()
const inputId = computed(() => props.id || `pix-input-${reactId}`)
const hintId = computed(() => `${inputId.value}-hint`)
const errorId = computed(() => `${inputId.value}-error`)
const describedBy = computed(() => {
  if (props.error) return errorId.value
  if (props.hint) return hintId.value
  return undefined
})

const classes = computed(() => [
  'pix-input',
  props.size !== 'md' ? `pix-input--${props.size}` : ''
])

const onInput = (event: Event): void => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
  emit('input', event)
}

defineExpose({ focus: () => inputRef.value?.focus() })
</script>

<template>
  <div class="pix-field">
    <label v-if="label" class="pix-field__label" :for="inputId">
      {{ label }}
      <span v-if="required" class="pix-field__required" aria-hidden="true">*</span>
    </label>
    <input
      ref="inputRef"
      v-bind="$attrs"
      :id="inputId"
      :class="classes"
      :name="name || undefined"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder || undefined"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :autocomplete="autocomplete"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
      @input="onInput"
      @change="emit('change', $event)"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    />
    <p v-if="error" :id="errorId" class="pix-field__error">{{ error }}</p>
    <p v-else-if="hint" :id="hintId" class="pix-field__hint">{{ hint }}</p>
  </div>
</template>
