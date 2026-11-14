<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: number
    pages?: number
    siblings?: number
    disabled?: boolean
    ariaLabel?: string
    href?: (page: number) => string
  }>(),
  {
    modelValue: 1,
    pages: 1,
    siblings: 1,
    disabled: false,
    ariaLabel: 'Pagination',
    href: undefined
  }
)

const emit = defineEmits<{
  'update:modelValue': [page: number]
  change: [page: number]
}>()

const total = computed(() => Math.max(1, Math.round(props.pages)))
const current = computed(() => Math.min(Math.max(1, Math.round(props.modelValue)), total.value))

/** 0 renders as an ellipsis; real page numbers are always >= 1. */
const entries = computed<number[]>(() => {
  if (total.value <= 5) return Array.from({ length: total.value }, (_, index) => index + 1)
  const pages = new Set<number>([1, total.value, current.value])
  for (let offset = 1; offset <= Math.max(0, props.siblings); offset += 1) {
    pages.add(current.value - offset)
    pages.add(current.value + offset)
  }
  const sorted = [...pages].filter((page) => page >= 1 && page <= total.value).sort((a, b) => a - b)
  const out: number[] = []
  let previous = 0
  for (const page of sorted) {
    if (previous && page - previous > 1) out.push(0)
    out.push(page)
    previous = page
  }
  return out
})

const go = (page: number, event: Event): void => {
  if (props.disabled || page < 1 || page > total.value || page === current.value) {
    event.preventDefault()
    return
  }
  emit('update:modelValue', page)
  emit('change', page)
}
</script>

<template>
  <nav class="pix-pagination" :aria-label="ariaLabel">
    <ul class="pix-pagination__list">
      <li>
        <component
          :is="href ? 'a' : 'button'"
          class="pix-pagination__item"
          :href="href ? href(Math.max(1, current - 1)) : undefined"
          :type="href ? undefined : 'button'"
          :disabled="href ? undefined : disabled || current === 1"
          :aria-disabled="current === 1 ? 'true' : undefined"
          aria-label="Previous page"
          @click="go(current - 1, $event)"
        >PREV</component>
      </li>
      <li v-for="(entry, index) in entries" :key="'p' + index">
        <span v-if="entry === 0" class="pix-pagination__ellipsis" aria-hidden="true">...</span>
        <component
          v-else
          :is="href ? 'a' : 'button'"
          class="pix-pagination__item"
          :href="href ? href(entry) : undefined"
          :type="href ? undefined : 'button'"
          :disabled="href ? undefined : disabled"
          :aria-current="entry === current ? 'page' : undefined"
          @click="go(entry, $event)"
        >{{ entry }}</component>
      </li>
      <li>
        <component
          :is="href ? 'a' : 'button'"
          class="pix-pagination__item"
          :href="href ? href(Math.min(total, current + 1)) : undefined"
          :type="href ? undefined : 'button'"
          :disabled="href ? undefined : disabled || current === total"
          :aria-disabled="current === total ? 'true' : undefined"
          aria-label="Next page"
          @click="go(current + 1, $event)"
        >NEXT</component>
      </li>
    </ul>
  </nav>
</template>
