export const canUseDOM =
  typeof window !== 'undefined' && typeof document !== 'undefined'

let idCounter = 0

export function uid(prefix = 'pix'): string {
  idCounter += 1
  return `${prefix}-${idCounter}`
}

export function ensureId(el: HTMLElement, prefix = 'pix'): string {
  if (!el.id) el.id = uid(prefix)
  return el.id
}

export function resolveElement(
  target: string | Element | null | undefined,
  root: ParentNode = document
): HTMLElement | null {
  if (!target || !canUseDOM) return null
  if (typeof target !== 'string') {
    return target instanceof HTMLElement ? target : null
  }

  const raw = target.trim()
  if (!raw) return null

  if (raw.startsWith('#')) {
    const byId = document.getElementById(raw.slice(1))
    if (byId) return byId
  }

  const byId = document.getElementById(raw)
  if (byId) return byId

  try {
    const found = root.querySelector(raw)
    return found instanceof HTMLElement ? found : null
  } catch {
    return null
  }
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button',
  'input',
  'select',
  'textarea',
  'iframe',
  'object',
  'embed',
  '[contenteditable="true"]',
  '[tabindex]'
].join(',')

export function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((el) => {
    if (el.hasAttribute('disabled')) return false
    if (el.getAttribute('aria-disabled') === 'true') return false
    if (el.getAttribute('tabindex') === '-1') return false
    if (el instanceof HTMLInputElement && el.type === 'hidden') return false
    if (el.hidden || el.closest('[hidden]')) return false
    if (el.closest('[inert]')) return false
    if (el.closest('[aria-hidden="true"]')) return false
    return true
  })
}

export function focusFirst(
  root: HTMLElement,
  preferred?: HTMLElement | null
): void {
  const autofocus =
    preferred ??
    root.querySelector<HTMLElement>('[data-pix-autofocus], [autofocus]')
  const focusables = getFocusable(root)
  const target =
    autofocus ??
    focusables.find((el) => !el.classList.contains('pix-modal__close')) ??
    focusables[0] ??
    (root.hasAttribute('tabindex') ? root : null)

  if (target) {
    try {
      target.focus({ preventScroll: true })
    } catch {
      target.focus()
    }
  }
}

export function isDisabled(el: HTMLElement): boolean {
  return (
    el.hasAttribute('disabled') ||
    el.getAttribute('aria-disabled') === 'true'
  )
}

export function emit<T = unknown>(el: Element, type: string, detail?: T): void {
  el.dispatchEvent(
    new CustomEvent(type, {
      detail,
      bubbles: true,
      cancelable: true
    })
  )
}

export function setInert(el: HTMLElement, inert: boolean): void {
  if (inert) el.setAttribute('inert', '')
  else el.removeAttribute('inert')
}

export function setBodyLocked(locked: boolean): void {
  if (!canUseDOM) return
  document.body.classList.toggle('pix-modal-open', locked)
}

export function stopEvent(event: Event): void {
  event.preventDefault()
  event.stopPropagation()
}
