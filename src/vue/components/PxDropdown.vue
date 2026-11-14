<script setup lang="ts">
import {
  nextTick,
  onBeforeUnmount,
  ref,
  useId,
  watch
} from 'vue'
import type { PxDropdownDetail } from '../types'
import type { PxButtonTone, PxSize } from '../types'
import PxButton from './PxButton.vue'

const props = withDefaults(
  defineProps<{
    label?: string
    tone?: PxButtonTone
    size?: PxSize
    align?: 'left' | 'right'
    disabled?: boolean
    menuLabel?: string
  }>(),
  {
    label: 'Menu',
    tone: 'secondary',
    size: 'md',
    align: 'left',
    disabled: false,
    menuLabel: 'Menu'
  }
)

const emit = defineEmits<{
  select: [detail: PxDropdownDetail]
  open: []
  close: []
}>()

const rootRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const open = ref(false)
const menuId = `pix-menu-${useId()}`

const getItems = (): HTMLElement[] => {
  const menu = menuRef.value
  if (!menu) return []
  return Array.from(
    menu.querySelectorAll<HTMLElement>('.pix-menu__item, [data-pix-menu-item]')
  ).filter((item) => !item.hasAttribute('disabled') && item.getAttribute('aria-disabled') !== 'true')
}

const prepareItems = (): HTMLElement[] => {
  const items = getItems()
  items.forEach((item) => {
    if (!item.hasAttribute('role')) item.setAttribute('role', 'menuitem')
    item.tabIndex = -1
  })
  return items
}

const focusFirst = (): void => {
  const first = prepareItems()[0]
  if (first) {
    try {
      first.focus({ preventScroll: true })
    } catch {
      first.focus()
    }
  }
}

const openMenu = async (): Promise<void> => {
  if (props.disabled || open.value) return
  open.value = true
  await nextTick()
  focusFirst()
  emit('open')
}

const close = (restoreFocus = false): void => {
  if (!open.value) return
  open.value = false
  emit('close')
  if (restoreFocus) {
    const trigger = rootRef.value?.querySelector<HTMLElement>('button')
    try {
      trigger?.focus({ preventScroll: true })
    } catch {
      trigger?.focus()
    }
  }
}

const toggle = (): void => {
  if (open.value) close(true)
  else void openMenu()
}

const onDocumentClick = (event: Event): void => {
  if (!open.value) return
  const target = event.target
  if (target instanceof Node && rootRef.value?.contains(target)) return
  close()
}

const onMenuClick = (event: Event): void => {
  const target = event.target
  if (!(target instanceof Element)) return
  const item = target.closest<HTMLElement>('.pix-menu__item, [data-pix-menu-item]')
  if (!item || !menuRef.value?.contains(item)) return
  if (item.hasAttribute('disabled') || item.getAttribute('aria-disabled') === 'true') {
    event.preventDefault()
    return
  }
  const detail: PxDropdownDetail = {
    value:
      item.dataset.pixValue ??
      item.dataset.value ??
      item.textContent?.trim() ??
      '',
    item,
    dropdown: rootRef.value as HTMLElement
  }
  emit('select', detail)
  close(true)
}

const onMenuKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    event.preventDefault()
    close(true)
    return
  }

  if (event.key === 'Tab') {
    close()
    return
  }

  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return

  const items = getItems()
  if (!items.length) return
  const active = document.activeElement as HTMLElement | null
  const index = active ? items.indexOf(active) : -1
  let next = index

  if (event.key === 'ArrowDown') next = index < 0 ? 0 : (index + 1) % items.length
  else if (event.key === 'ArrowUp') next = index <= 0 ? items.length - 1 : index - 1
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = items.length - 1

  event.preventDefault()
  items[next]?.focus()
}

watch(open, (value) => {
  if (value) document.addEventListener('click', onDocumentClick)
  else document.removeEventListener('click', onDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
})

defineExpose({ open: openMenu, close: () => close(true) })
</script>

<template>
  <div
    ref="rootRef"
    class="pix-dropdown"
    :class="{ 'is-open': open }"
    @keydown.esc.prevent="close(true)"
    @keydown.down.prevent="openMenu"
  >
    <PxButton
      :tone="tone"
      :size="size"
      :disabled="disabled"
      aria-haspopup="menu"
      :aria-expanded="open"
      :aria-controls="menuId"
      @click="toggle"
    >
      <slot name="trigger">{{ label }}</slot>
      <span class="pix-btn__caret" aria-hidden="true">▾</span>
    </PxButton>

    <div
      :id="menuId"
      ref="menuRef"
      class="pix-menu"
      :class="{ 'pix-menu--right': align === 'right' }"
      :hidden="!open"
      role="menu"
      :aria-label="menuLabel"
      @click="onMenuClick"
      @keydown="onMenuKeydown"
    >
      <slot :close="close" :open="open"></slot>
    </div>
  </div>
</template>
