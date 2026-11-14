import type { PixelTone, ToastHandle, ToastOptions } from '../types'
import { canUseDOM } from './utils'

const DEFAULT_TITLES: Record<PixelTone, string> = {
  primary: 'Notice',
  secondary: 'Heads up',
  success: 'Success',
  danger: 'Error',
  warning: 'Warning',
  info: 'Info',
  accent: 'Update',
  neutral: 'Notice'
}

const ICONS: Record<PixelTone, string> = {
  primary: '★',
  secondary: '◆',
  success: '✓',
  danger: '!',
  warning: '!',
  info: 'i',
  accent: '✦',
  neutral: '·'
}

interface LiveToast {
  dismiss: (immediate?: boolean) => void
}

export interface ToastManager {
  toast: (input: string | ToastOptions) => ToastHandle
  dismissAll: () => void
  destroy: () => void
}

export function createToastManager(): ToastManager {
  let container: HTMLElement | null = null
  const live = new Set<LiveToast>()

  const ensureContainer = (): HTMLElement | null => {
    if (!canUseDOM || !document.body) return null
    if (container?.isConnected) return container
    container = document.createElement('div')
    container.className = 'pix-toasts'
    container.setAttribute('role', 'region')
    container.setAttribute('aria-label', 'Notifications')
    document.body.appendChild(container)
    return container
  }

  const toast = (input: string | ToastOptions): ToastHandle => {
    if (!canUseDOM) return { dismiss: () => {} }

    const options: ToastOptions =
      typeof input === 'string' ? { message: input } : input
    const tone: PixelTone = options.tone ?? 'primary'
    const duration =
      typeof options.duration === 'number' ? Math.max(0, options.duration) : 3500
    const host = ensureContainer()
    if (!host) return { dismiss: () => {} }

    const el = document.createElement('div')
    el.className = `pix-toast pix-toast--${tone}`
    el.setAttribute('role', tone === 'danger' ? 'alert' : 'status')
    el.setAttribute('aria-atomic', 'false')

    const icon = document.createElement('span')
    icon.className = 'pix-toast__icon'
    icon.setAttribute('aria-hidden', 'true')
    icon.textContent = ICONS[tone]

    const content = document.createElement('div')
    content.className = 'pix-toast__content'

    const title = document.createElement('strong')
    title.className = 'pix-toast__title'
    title.textContent = options.title ?? DEFAULT_TITLES[tone]

    const message = document.createElement('p')
    message.className = 'pix-toast__message'
    message.textContent = options.message

    content.append(title, message)

    const close = document.createElement('button')
    close.type = 'button'
    close.className = 'pix-toast__close'
    close.setAttribute('aria-label', 'Dismiss notification')
    close.textContent = '×'

    el.append(icon, content, close)

    let timer: number | undefined
    let startedAt = 0
    let remaining = duration
    let dismissed = false

    const clearTimer = (): void => {
      if (timer !== undefined) {
        window.clearTimeout(timer)
        timer = undefined
      }
    }

    const schedule = (): void => {
      if (duration <= 0 || remaining <= 0) return
      startedAt = Date.now()
      timer = window.setTimeout(() => dismiss(true), remaining)
    }

    const pause = (): void => {
      if (timer === undefined) return
      clearTimer()
      remaining -= Date.now() - startedAt
      if (remaining < 0) remaining = 0
    }

    const resume = (): void => {
      if (dismissed) return
      schedule()
    }

    const dismiss = (animate = true): void => {
      if (dismissed) return
      dismissed = true
      clearTimer()
      live.delete(record)
      if (!animate) {
        el.remove()
        return
      }
      el.classList.add('is-leaving')
      window.setTimeout(() => el.remove(), 160)
    }

    const record: LiveToast = { dismiss: () => dismiss(true) }
    live.add(record)

    if (duration > 0) {
      const bar = document.createElement('span')
      bar.className = 'pix-toast__timer'
      bar.setAttribute('aria-hidden', 'true')
      bar.style.setProperty('--pix-toast-duration', `${duration}ms`)
      el.append(bar)

      el.addEventListener('mouseenter', pause)
      el.addEventListener('mouseleave', resume)
      schedule()
    }

    close.addEventListener('click', () => dismiss(true))

    host.appendChild(el)

    return {
      dismiss: () => dismiss(true)
    }
  }

  const dismissAll = (): void => {
    Array.from(live).forEach((item) => item.dismiss(true))
  }

  const destroy = (): void => {
    Array.from(live).forEach((item) => item.dismiss(false))
    live.clear()
    container?.remove()
    container = null
  }

  return { toast, dismissAll, destroy }
}
