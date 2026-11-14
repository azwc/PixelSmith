import { emit, isDisabled } from './utils'

type Cleanup = () => void

interface OpenMenu {
  root: HTMLElement
  close: () => void
}

const openMenus = new Set<OpenMenu>()

export function bindDropdown(root: HTMLElement): Cleanup {
  const trigger = root.querySelector<HTMLElement>('[data-pix-dropdown-trigger]')
  const menu = root.querySelector<HTMLElement>(
    '[data-pix-dropdown-menu], .pix-menu'
  )

  if (!trigger || !menu) return () => {}

  let open = false
  let entry: OpenMenu

  trigger.setAttribute('aria-haspopup', 'menu')
  trigger.setAttribute('aria-expanded', 'false')
  if (!menu.id) menu.id = `${trigger.id || 'pix-dropdown'}-menu`
  if (!trigger.hasAttribute('aria-controls')) trigger.setAttribute('aria-controls', menu.id)
  menu.setAttribute('role', menu.getAttribute('role') || 'menu')
  menu.hidden = true

  const getItems = (): HTMLElement[] => {
    return Array.from(
      menu.querySelectorAll<HTMLElement>(
        '.pix-menu__item, [data-pix-menu-item]'
      )
    ).filter((item) => !item.hidden)
  }

  const prepareItems = (): HTMLElement[] => {
    const items = getItems()
    items.forEach((item) => {
      if (!item.hasAttribute('role')) item.setAttribute('role', 'menuitem')
      if (item.tabIndex > -1) item.tabIndex = -1
      if (
        item.tagName === 'BUTTON' &&
        !item.hasAttribute('type') &&
        !item.closest('form')
      ) {
        item.setAttribute('type', 'button')
      }
    })
    return items
  }

  const close = (restoreFocus = false): void => {
    if (!open) return
    open = false
    root.classList.remove('is-open')
    menu.hidden = true
    trigger.setAttribute('aria-expanded', 'false')
    openMenus.delete(entry)
    if (restoreFocus) {
      try {
        trigger.focus({ preventScroll: true })
      } catch {
        trigger.focus()
      }
    }
  }

  const openMenu = (): void => {
    if (open) return
    openMenus.forEach((other) => {
      if (other.root !== root) other.close()
    })
    open = true
    root.classList.add('is-open')
    menu.hidden = false
    trigger.setAttribute('aria-expanded', 'true')
    openMenus.add(entry)

    const items = prepareItems()
    const first = items.find((item) => !isDisabled(item))
    if (first) {
      try {
        first.focus({ preventScroll: true })
      } catch {
        first.focus()
      }
    }

    emit(root, 'pix:dropdown-open', { root, menu })
  }

  const toggle = (): void => {
    if (open) close(true)
    else openMenu()
  }

  const moveFocus = (direction: 1 | -1): void => {
    const items = prepareItems().filter((item) => !isDisabled(item))
    if (!items.length) return
    const active = document.activeElement as HTMLElement | null
    const index = active ? items.indexOf(active) : -1
    const next =
      (index + direction + items.length) % items.length
    const target = items[next]
    if (target) {
      try {
        target.focus({ preventScroll: true })
      } catch {
        target.focus()
      }
    }
  }

  const onClick = (event: Event): void => {
    const target = event.target
    if (!(target instanceof Element)) return

    if (target.closest('[data-pix-dropdown-trigger]') === trigger) {
      event.preventDefault()
      toggle()
      return
    }

    const item = target.closest<HTMLElement>('.pix-menu__item, [data-pix-menu-item]')
    if (!item || !menu.contains(item)) return
    if (isDisabled(item)) {
      event.preventDefault()
      return
    }

    emit(root, 'pix:select', {
      value: item.dataset.pixValue ?? item.dataset.value ?? item.textContent?.trim() ?? '',
      item,
      dropdown: root
    })
    close(true)
  }

  const onKeydown = (event: KeyboardEvent): void => {
    const target = event.target
    if (!(target instanceof HTMLElement)) return

    if (event.key === 'Escape' && open) {
      event.preventDefault()
      close(true)
      return
    }

    if (target === trigger && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault()
      openMenu()
      if (event.key === 'ArrowUp') {
        const items = prepareItems().filter((item) => !isDisabled(item))
        const last = items[items.length - 1]
        if (last) last.focus()
      }
      return
    }

    if (!open || !menu.contains(target)) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        moveFocus(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        moveFocus(-1)
        break
      case 'Home': {
        event.preventDefault()
        const first = prepareItems().find((item) => !isDisabled(item))
        if (first) first.focus()
        break
      }
      case 'End': {
        event.preventDefault()
        const items = prepareItems().filter((item) => !isDisabled(item))
        const last = items[items.length - 1]
        if (last) last.focus()
        break
      }
      case 'Tab':
        close()
        break
      default:
        break
    }
  }

  const onDocumentClick = (event: Event): void => {
    if (!open) return
    const target = event.target
    if (target instanceof Node && root.contains(target)) return
    close()
  }

  root.addEventListener('click', onClick)
  root.addEventListener('keydown', onKeydown)
  document.addEventListener('click', onDocumentClick)

  entry = {
    root,
    close: () => close()
  }

  if (root.hasAttribute('data-pix-dropdown-open')) openMenu()

  return () => {
    close()
    root.removeEventListener('click', onClick)
    root.removeEventListener('keydown', onKeydown)
    document.removeEventListener('click', onDocumentClick)
    openMenus.delete(entry)
  }
}
