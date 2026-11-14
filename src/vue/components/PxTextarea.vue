<script setup lang="ts">
import { computed, ref, useId } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    placeholder?: string
    hint?: string
    error?: string
    rows?: number
    id?: string
    name?: string
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    resize?: 'vertical' | 'horizontal' | 'both' | 'none'
  }>(),
  {
    modelValue: '',
    label: '',
    placeholder: '',
    hint: '',
    error: '',
    rows: 4,
    id: '',
    name: '',
    disabled: false,
    readonly: false,
    required: false,
    resize: 'vertical'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: [event: Event]
  change: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const reactId = useId()
const inputId = computed(() => props.id || `pix-textarea-${reactId}`)
const hintId = computed(() => `${inputId.value}-hint`)
const errorId = computed(() => `${inputId.value}-error`)
const describedBy = computed(() => {
  if (props.error) return errorId.value
  if (props.hint) return hintId.value
  return undefined
})

const onInput = (event: Event): void => {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
  emit('input', event)
}

defineExpose({ focus: () => textareaRef.value?.focus() })
</script>

<template>
  <div class="pix-field">
    <label v-if="label" class="pix-field__label" :for="inputId">
      {{ label }}
      <span v-if="required" class="pix-field__required" aria-hidden="true">*</span>
    </label>
    <textarea
      ref="textareaRef"
      v-bind="$attrs"
      :id="inputId"
      class="pix-textarea"
      :style="{ resize }"
      :name="name || undefined"
      :rows="rows"
      :value="modelValue"
      :placeholder="placeholder || undefined"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
      @input="onInput"
      @change="emit('change', $event)"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    ></textarea>
    <p v-if="error" :id="errorId" class="pix-field__error">{{ error }}</p>
    <p v-else-if="hint" :id="hintId" class="pix-field__hint">{{ hint }}</p>
  </div>
</template>
