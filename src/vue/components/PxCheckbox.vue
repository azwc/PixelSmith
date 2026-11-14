<script setup lang="ts">
import { computed, ref, useId, watchEffect } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    label?: string
    hint?: string
    id?: string
    name?: string
    value?: string
    disabled?: boolean
    indeterminate?: boolean
  }>(),
  {
    modelValue: false,
    label: '',
    hint: '',
    id: '',
    name: '',
    value: 'on',
    disabled: false,
    indeterminate: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [event: Event]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const reactId = useId()
const inputId = computed(() => props.id || `pix-checkbox-${reactId}`)
const hintId = computed(() => `${inputId.value}-hint`)

watchEffect(() => {
  if (inputRef.value) inputRef.value.indeterminate = props.indeterminate
})

const onChange = (event: Event): void => {
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
  emit('change', event)
}
</script>

<template>
  <label class="pix-check">
    <input
      ref="inputRef"
      class="pix-check__input"
      type="checkbox"
      :id="inputId"
      :name="name || undefined"
      :value="value"
      :checked="modelValue"
      :disabled="disabled"
      :aria-describedby="hint ? hintId : undefined"
      @change="onChange"
    />
    <span class="pix-check__box" aria-hidden="true"></span>
    <span class="pix-check__text">
      <span v-if="label || $slots.default" class="pix-check__label">
        <slot>{{ label }}</slot>
      </span>
      <span v-if="hint" :id="hintId" class="pix-check__hint">{{ hint }}</span>
    </span>
  </label>
</template>
