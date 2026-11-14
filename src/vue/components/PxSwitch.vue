<script setup lang="ts">
import { computed, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    label?: string
    hint?: string
    id?: string
    name?: string
    value?: string
    disabled?: boolean
  }>(),
  {
    modelValue: false,
    label: '',
    hint: '',
    id: '',
    name: '',
    value: 'on',
    disabled: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [event: Event]
}>()

const reactId = useId()
const inputId = computed(() => props.id || `pix-switch-${reactId}`)
const hintId = computed(() => `${inputId.value}-hint`)

const onChange = (event: Event): void => {
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
  emit('change', event)
}
</script>

<template>
  <label class="pix-switch">
    <input
      class="pix-switch__input"
      type="checkbox"
      role="switch"
      :id="inputId"
      :name="name || undefined"
      :value="value"
      :checked="modelValue"
      :aria-checked="modelValue"
      :disabled="disabled"
      :aria-describedby="hint ? hintId : undefined"
      @change="onChange"
    />
    <span class="pix-switch__track" aria-hidden="true">
      <span class="pix-switch__thumb"></span>
    </span>
    <span class="pix-switch__text">
      <span v-if="label || $slots.default" class="pix-switch__label">
        <slot>{{ label }}</slot>
      </span>
      <span v-if="hint" :id="hintId" class="pix-switch__hint">{{ hint }}</span>
    </span>
  </label>
</template>
