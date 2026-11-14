<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import type { PxTabItem } from '../types'

const props = withDefaults(
  defineProps<{
    tabs?: PxTabItem[]
    modelValue?: string
    defaultValue?: string
    ariaLabel?: string
  }>(),
  {
    tabs: () => [],
    modelValue: undefined,
    defaultValue: '',
    ariaLabel: 'Tabs'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const baseId = useId()
const tabEls = new Map<string, HTMLElement>()
const current = ref('')

const firstEnabled = (list: PxTabItem[]): PxTabItem | undefined =>
  list.find((tab) => !tab.disabled)

watch(
  () => props.tabs,
  (tabs) => {
    const requested = props.modelValue ?? props.defaultValue
    const valid = tabs.some((tab) => tab.id === current.value && !tab.disabled)
    if (!valid) {
      const requestedTab = tabs.find((tab) => tab.id === requested && !tab.disabled)
      current.value = requestedTab?.id ?? firstEnabled(tabs)?.id ?? ''
    }
  },
  { immediate: true, deep: true }
)

watch(
  () => props.modelValue,
  (value) => {
    if (typeof value === 'string') current.value = value
  }
)

const tabId = (id: string): string => `${baseId}-tab-${id}`
const panelId = (id: string): string => `${baseId}-panel-${id}`

const setTabRef = (id: string, el: unknown): void => {
  if (el instanceof HTMLElement) tabEls.set(id, el)
  else tabEls.delete(id)
}

const select = (tab: PxTabItem, focus = false): void => {
  if (tab.disabled) return
  if (current.value === tab.id) {
    if (focus) tabEls.get(tab.id)?.focus()
    return
  }
  current.value = tab.id
  emit('update:modelValue', tab.id)
  emit('change', tab.id)
  if (focus) {
    nextTick(() => tabEls.get(tab.id)?.focus())
  }
}

const enabledTabs = computed(() => props.tabs.filter((tab) => !tab.disabled))

const onKeydown = (event: KeyboardEvent): void => {
  const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End']
  if (!keys.includes(event.key)) return

  const tabs = enabledTabs.value
  if (!tabs.length) return
  const index = tabs.findIndex((tab) => tab.id === current.value)
  const safeIndex = index < 0 ? 0 : index

  let next = safeIndex
  if (event.key === 'ArrowRight') next = (safeIndex + 1) % tabs.length
  else if (event.key === 'ArrowLeft') next = (safeIndex - 1 + tabs.length) % tabs.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = tabs.length - 1

  event.preventDefault()
  const tab = tabs[next]
  if (tab) select(tab, true)
}

defineExpose({
  select: (id: string) => {
    const tab = props.tabs.find((item) => item.id === id)
    if (tab) select(tab)
  }
})
</script>

<template>
  <div class="pix-tabs">
    <div class="pix-tabs__list" role="tablist" :aria-label="ariaLabel">
      <button
        v-for="tab in tabs"
        :id="tabId(tab.id)"
        :key="tab.id"
        :ref="(el) => setTabRef(tab.id, el)"
        type="button"
        role="tab"
        class="pix-tab"
        :class="{ 'is-active': current === tab.id }"
        :aria-selected="current === tab.id"
        :aria-controls="panelId(tab.id)"
        :tabindex="current === tab.id ? 0 : -1"
        :disabled="tab.disabled"
        @click="select(tab)"
        @keydown="onKeydown"
      >
        <span v-if="tab.icon" class="pix-tab__icon" aria-hidden="true">{{ tab.icon }}</span>
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <div
      v-for="tab in tabs"
      v-show="current === tab.id"
      :id="panelId(tab.id)"
      :key="`panel-${tab.id}`"
      class="pix-tab-panel"
      role="tabpanel"
      :aria-labelledby="tabId(tab.id)"
      tabindex="0"
    >
      <slot :name="`panel-${tab.id}`" :tab="tab">
        <slot name="panel" :tab="tab"></slot>
      </slot>
    </div>
  </div>
</template>
