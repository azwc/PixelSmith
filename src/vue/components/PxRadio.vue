<script setup lang="ts">
import { computed, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | boolean | null
    value: string | number | boolean
    label?: string
    hint?: string
    name?: string
    id?: string
    disabled?: boolean
  }>(),
  {
    modelValue: null,
    label: '',
    hint: '',
    name: '',
    id: '',
    disabled: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
  change: [event: Event]
}>()

const reactId = useId()
const inputId = computed(() => props.id || `pix-radio-${reactId}`)
const hintId = computed(() => `${inputId.value}-hint`)
const checked = computed(() => props.modelValue === props.value)

const onChange = (event: Event): void => {
  emit('update:modelValue', props.value)
  emit('change', event)
}
</script>

<template>
  <label class="pix-radio">
    <input
      class="pix-radio__input"
      type="radio"
      :id="inputId"
      :name="name || inputId"
      :value="String(value)"
      :checked="checked"
      :disabled="disabled"
      :aria-describedby="hint ? hintId : undefined"
      @change="onChange"
    />
    <span class="pix-radio__box" aria-hidden="true"></span>
    <span class="pix-radio__text">
      <span v-if="label || $slots.default" class="pix-radio__label">
        <slot>{{ label }}</slot>
      </span>
      <span v-if="hint" :id="hintId" class="pix-radio__hint">{{ hint }}</span>
    </span>
  </label>
</template>
