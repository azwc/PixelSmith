import {
  ensureId,
  emit,
  focusFirst,
  getFocusable,
  resolveElement,
  setBodyLocked,
  setInert,
  uid
} from './utils'

interface ModalRecord {
  root: HTMLElement
  dialog: HTMLElement
  returnFocus: HTMLElement | null
}

export interface ModalManager {
  initAll: (root?: ParentNode) => void
  open: (target: string | Element) => void
  close: (target?: string | Element) => void
  closeTop: () => void
  handleKeydown: (event: KeyboardEvent) => void
  handleBackdrop: (target: EventTarget | null) => boolean
  destroy: () => void
}

export function createModalManager(): ModalManager {
  let records = new WeakMap<HTMLElement, ModalRecord>()
  let stack: ModalRecord[] = []

  const ensure = (root: HTMLElement): ModalRecord => {
    const existing = records.get(root)
    if (existing) return existing

    const dialog =
      root.querySelector<HTMLElement>('.pix-modal__dialog, [data-pix-modal-dialog]') ??
      root

    if (!dialog.id) dialog.id = uid('pix-modal-dialog')
    dialog.setAttribute('role', 'dialog')
    dialog.setAttribute('aria-modal', 'true')
    if (!dialog.hasAttribute('tabindex')) dialog.tabIndex = -1

    if (
      !dialog.hasAttribute('aria-label') &&
      !dialog.hasAttribute('aria-labelledby')
    ) {
      if (root.dataset.pixLabel) {
        dialog.setAttribute('aria-label', root.dataset.pixLabel)
      } else {
        const title = root.querySelector<HTMLElement>(
          '.pix-panel__title, [data-pix-modal-title]'
        )
        if (title) {
          dialog.setAttribute('aria-labelledby', ensureId(title, 'pix-modal-title'))
        }
      }
    }

    const isOpen = root.classList.contains('is-open')
    root.setAttribute('aria-hidden', isOpen ? 'false' : 'true')
    setInert(root, !isOpen)

    const record: ModalRecord = {
      root,
      dialog,
      returnFocus: null
    }
    records.set(root, record)
    return record
  }

  const resolve = (target?: string | Element): ModalRecord | null => {
    if (!target) return stack[stack.length - 1] ?? null
    const root = resolveElement(target)
    if (!root) return null
    const modal = root.matches('[data-pix="modal"], .pix-modal')
      ? root
      : root.closest<HTMLElement>('[data-pix="modal"], .pix-modal')
    if (!modal) return null
    return ensure(modal)
  }

  const open = (target: string | Element): void => {
    const record = resolve(target)
    if (!record) return

    if (stack.includes(record)) {
      focusFirst(record.dialog)
      return
    }

    const active = document.activeElement
    record.returnFocus =
      active instanceof HTMLElement && active !== document.body
        ? active
        : null

    record.root.classList.add('is-open')
    record.root.removeAttribute('hidden')
    record.root.setAttribute('aria-hidden', 'false')
    setInert(record.root, false)
    document.body.classList.add('pix-modal-open')
    stack.push(record)

    focusFirst(record.dialog)

    emit(record.root, 'pix:modal-open', {
      modal: record.root,
      dialog: record.dialog
    })
  }

  const close = (target?: string | Element): void => {
    const record = resolve(target)
    if (!record) return

    const index = stack.indexOf(record)
    if (index < 0) {
      record.root.classList.remove('is-open')
      record.root.setAttribute('aria-hidden', 'true')
      setInert(record.root, true)
      return
    }

    stack.splice(index, 1)
    record.root.classList.remove('is-open')
    record.root.setAttribute('aria-hidden', 'true')
    setInert(record.root, true)

    if (stack.length === 0) document.body.classList.remove('pix-modal-open')

    const restore = record.returnFocus
    record.returnFocus = null
    if (restore && restore.isConnected) {
      try {
        restore.focus({ preventScroll: true })
      } catch {
        restore.focus()
      }
    }

    emit(record.root, 'pix:modal-close', {
      modal: record.root,
      dialog: record.dialog
    })
  }

  const closeTop = (): void => {
    const top = stack[stack.length - 1]
    if (top) close(top.root)
  }

  const handleKeydown = (event: KeyboardEvent): void => {
    const top = stack[stack.length - 1]
    if (!top) return

    if (event.key === 'Escape') {
      event.preventDefault()
      close(top.root)
      return
    }

    if (event.key !== 'Tab') return

    const focusables = getFocusable(top.dialog)
    if (!focusables.length) {
      event.preventDefault()
      top.dialog.focus()
      return
    }

    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = document.activeElement

    if (event.shiftKey) {
      if (active === first || !top.dialog.contains(active)) {
        event.preventDefault()
        last?.focus()
      }
    } else if (active === last || !top.dialog.contains(active)) {
      event.preventDefault()
      first?.focus()
    }
  }

  const handleBackdrop = (target: EventTarget | null): boolean => {
    if (!(target instanceof Element)) return false
    if (!target.classList.contains('pix-modal__backdrop')) return false
    const modal = target.closest<HTMLElement>('[data-pix="modal"], .pix-modal')
    if (!modal || modal.hasAttribute('data-pix-static')) return false
    close(modal)
    return true
  }

  const initAll = (root: ParentNode = document): void => {
    const modals: HTMLElement[] = []
    if (root instanceof HTMLElement && root.matches('[data-pix="modal"], .pix-modal')) {
      modals.push(root)
    }
    root.querySelectorAll<HTMLElement>('[data-pix="modal"], .pix-modal').forEach((el) => {
      modals.push(el)
    })
    modals.forEach(ensure)
  }

  const destroy = (): void => {
    stack.forEach((record) => {
      record.root.classList.remove('is-open')
      record.root.setAttribute('aria-hidden', 'true')
      setInert(record.root, true)
      record.returnFocus = null
    })
    stack = []
    records = new WeakMap()
    setBodyLocked(false)
    document.body.classList.remove('pix-modal-open')
  }

  return {
    initAll,
    open,
    close,
    closeTop,
    handleKeydown,
    handleBackdrop,
    destroy
  }
}
