<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  useId,
  watch
} from 'vue'
import { getFocusable } from '../../runtime/utils'
import { lockBodyScroll, unlockBodyScroll } from '../utils'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    closeOnBackdrop?: boolean
    closeOnEsc?: boolean
    hideClose?: boolean
    ariaLabel?: string
  }>(),
  {
    title: '',
    size: 'md',
    closeOnBackdrop: true,
    closeOnEsc: true,
    hideClose: false,
    ariaLabel: 'Dialog'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  open: []
  close: []
}>()

const dialogRef = ref<HTMLElement | null>(null)
const titleId = `pix-modal-title-${useId()}`
let previousFocus: HTMLElement | null = null
let bodyLocked = false
let listening = false
let wasOpen = false

const sizeClass = computed(() =>
  props.size === 'md' ? '' : `pix-modal--${props.size}`
)

const close = (): void => {
  emit('update:modelValue', false)
}

const focusDialog = (): void => {
  const dialog = dialogRef.value
  if (!dialog) return
  const preferred = dialog.querySelector<HTMLElement>('[data-pix-autofocus], [autofocus]')
  const focusables = getFocusable(dialog)
  const target =
    preferred ??
    focusables.find((el) => !el.classList.contains('pix-modal__close')) ??
    focusables[0] ??
    dialog
  try {
    target.focus({ preventScroll: true })
  } catch {
    target.focus()
  }
}

const onKeydown = (event: KeyboardEvent): void => {
  if (!props.modelValue) return

  if (event.key === 'Escape' && props.closeOnEsc) {
    event.preventDefault()
    close()
    return
  }

  if (event.key !== 'Tab') return
  const dialog = dialogRef.value
  if (!dialog) return

  const focusables = getFocusable(dialog)
  if (!focusables.length) {
    event.preventDefault()
    dialog.focus()
    return
  }
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  const active = document.activeElement

  if (event.shiftKey) {
    if (active === first || !dialog.contains(active)) {
      event.preventDefault()
      last?.focus()
    }
  } else if (active === last || !dialog.contains(active)) {
    event.preventDefault()
    first?.focus()
  }
}

const listen = (): void => {
  if (listening) return
  document.addEventListener('keydown', onKeydown, true)
  listening = true
}

const unlisten = (): void => {
  if (!listening) return
  document.removeEventListener('keydown', onKeydown, true)
  listening = false
}

const lock = (): void => {
  if (bodyLocked) return
  lockBodyScroll()
  bodyLocked = true
}

const unlock = (): void => {
  if (!bodyLocked) return
  unlockBodyScroll()
  bodyLocked = false
}

watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      wasOpen = true
      previousFocus =
        document.activeElement instanceof HTMLElement &&
        document.activeElement !== document.body
          ? document.activeElement
          : null
      lock()
      listen()
      await nextTick()
      focusDialog()
      emit('open')
    } else if (wasOpen) {
      wasOpen = false
      unlisten()
      unlock()
      const restore = previousFocus
      previousFocus = null
      if (restore?.isConnected) {
        try {
          restore.focus({ preventScroll: true })
        } catch {
          restore.focus()
        }
      }
      emit('close')
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  unlisten()
  unlock()
})

const onBackdropClick = (): void => {
  if (props.closeOnBackdrop) close()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="pix-modal-vue">
      <div
        v-if="modelValue"
        class="pix-modal is-open"
        :class="sizeClass"
      >
        <div
          class="pix-modal__backdrop"
          aria-hidden="true"
          @click="onBackdropClick"
        ></div>
        <div
          ref="dialogRef"
          class="pix-modal__dialog"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title || $slots.title ? titleId : undefined"
          :aria-label="!title && !$slots.title ? ariaLabel : undefined"
          tabindex="-1"
        >
          <section class="pix-panel pix-modal__panel">
            <header
              v-if="title || $slots.title || !hideClose"
              class="pix-panel__titlebar"
            >
              <span class="pix-panel__dots" aria-hidden="true">
                <span class="pix-panel__dot"></span>
                <span class="pix-panel__dot"></span>
                <span class="pix-panel__dot"></span>
              </span>
              <h2 v-if="title || $slots.title" :id="titleId" class="pix-panel__title">
                <slot name="title">{{ title }}</slot>
              </h2>
              <span class="pix-panel__titlebar-spacer"></span>
              <button
                v-if="!hideClose"
                type="button"
                class="pix-modal__close"
                aria-label="Close dialog"
                @click="close"
              >
                ×
              </button>
            </header>
            <div class="pix-panel__body">
              <slot></slot>
            </div>
            <footer v-if="$slots.footer" class="pix-panel__footer">
              <slot name="footer"></slot>
            </footer>
          </section>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
