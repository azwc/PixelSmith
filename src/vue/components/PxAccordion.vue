<script setup lang="ts">
import { ref, useId, watch } from 'vue'
import type { PxAccordionItem } from '../types'

const props = withDefaults(
  defineProps<{
    items?: PxAccordionItem[]
    modelValue?: string[]
    exclusive?: boolean
    name?: string
  }>(),
  { items: () => [], modelValue: undefined, exclusive: false, name: '' }
)

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  change: [value: string[]]
}>()

const group = useId()
const open = ref<string[]>([...(props.modelValue ?? [])])

watch(
  () => props.modelValue,
  (value) => {
    if (Array.isArray(value)) open.value = [...value]
  }
)

const onToggle = (item: PxAccordionItem, event: Event): void => {
  const details = event.currentTarget as HTMLDetailsElement
  const next = new Set(open.value)
  if (details.open) next.add(item.id)
  else next.delete(item.id)
  open.value = props.exclusive && details.open ? [item.id] : [...next]
  emit('update:modelValue', [...open.value])
  emit('change', [...open.value])
}
</script>

<template>
  <div class="pix-accordion">
    <details
      v-for="item in items"
      :key="item.id"
      class="pix-accordion__item"
      :class="{ 'pix-accordion__item--disabled': item.disabled }"
      :name="exclusive ? name || 'pix-accordion-' + group : undefined"
      :open="open.includes(item.id)"
      :aria-disabled="item.disabled ? 'true' : undefined"
      @toggle="onToggle(item, $event)"
    >
      <summary class="pix-accordion__trigger">
        {{ item.label }}
        <span class="pix-accordion__mark" aria-hidden="true"></span>
      </summary>
      <div class="pix-accordion__panel">
        <slot :name="'panel-' + item.id">{{ item.panel }}</slot>
      </div>
    </details>
  </div>
</template>
