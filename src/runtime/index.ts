import type { PixelUIInstance, ToastHandle, ToastOptions } from '../types'
import { bindTabs } from './tabs'
import { bindDropdown } from './dropdown'
import { createModalManager } from './modal'
import { createToastManager } from './toast'
import { canUseDOM, isDisabled } from './utils'

type Cleanup = () => void

export function createPixelUI(): PixelUIInstance {
  const modal = createModalManager()
  const toasts = createToastManager()
  const cleanups = new Set<Cleanup>()
  const docCleanups: Cleanup[] = []
  let bound = new WeakSet<Element>()
  let listening = false

  const scan = (root: ParentNode, selector: string, bind: (el: HTMLElement) => Cleanup): void => {
    const elements: HTMLElement[] = []
    if (root instanceof HTMLElement && root.matches(selector)) elements.push(root)
    root.querySelectorAll<HTMLElement>(selector).forEach((el) => elements.push(el))

    elements.forEach((el) => {
      if (bound.has(el)) return
      bound.add(el)
      cleanups.add(bind(el))
    })
  }

  const onDocumentClick = (event: Event): void => {
    const target = event.target
    if (!(target instanceof Element)) return

    const opener = target.closest<HTMLElement>('[data-pix-open]')
    if (opener && !isDisabled(opener)) {
      const targetId =
        opener.dataset.pixOpen ||
        opener.getAttribute('href')?.replace(/^#/, '') ||
        ''
      if (targetId) {
        event.preventDefault()
        modal.open(targetId)
      }
      return
    }

    const closer = target.closest<HTMLElement>('[data-pix-close]')
    if (closer) {
      const modalRoot = closer.closest<HTMLElement>('[data-pix="modal"], .pix-modal')
      if (modalRoot) {
        event.preventDefault()
        modal.close(modalRoot)
        return
      }
    }

    modal.handleBackdrop(target)
  }

  const onDocumentKeydown = (event: KeyboardEvent): void => {
    modal.handleKeydown(event)
  }

  const ensureListeners = (): void => {
    if (!canUseDOM || listening) return
    document.addEventListener('click', onDocumentClick)
    document.addEventListener('keydown', onDocumentKeydown, true)
    docCleanups.push(() => {
      document.removeEventListener('click', onDocumentClick)
      document.removeEventListener('keydown', onDocumentKeydown, true)
    })
    listening = true
  }

  const mount = (root: ParentNode = document): void => {
    if (!canUseDOM) return
    ensureListeners()
    modal.initAll(root)
    scan(root, '[data-pix="tabs"]', bindTabs)
    scan(root, '[data-pix="dropdown"]', bindDropdown)
  }

  const destroy = (): void => {
    cleanups.forEach((cleanup) => {
      try {
        cleanup()
      } catch {
        /* no-op */
      }
    })
    cleanups.clear()
    docCleanups.forEach((cleanup) => {
      try {
        cleanup()
      } catch {
        /* no-op */
      }
    })
    docCleanups.length = 0
    listening = false
    modal.destroy()
    toasts.destroy()
    bound = new WeakSet()
  }

  const openModal = (target: string | Element): void => {
    ensureListeners()
    modal.open(target)
  }

  const closeModal = (target?: string | Element): void => {
    modal.close(target)
  }

  const toast = (options: string | ToastOptions): ToastHandle => {
    return toasts.toast(options)
  }

  const closeAllToasts = (): void => {
    toasts.dismissAll()
  }

  return {
    mount,
    destroy,
    openModal,
    closeModal,
    toast,
    closeAllToasts
  }
}
