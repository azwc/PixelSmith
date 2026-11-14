import { emit, ensureId, isDisabled } from './utils'

export type Cleanup = () => void

export function bindTabs(root: HTMLElement): Cleanup {
  const tabs = Array.from(root.querySelectorAll<HTMLElement>('[data-pix-tab]')).filter(
    (tab) => tab.closest('[data-pix="tabs"]') === root
  )

  if (!tabs.length) return () => {}

  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-pix-panel]')).filter(
    (panel) => panel.closest('[data-pix="tabs"]') === root
  )

  const panelFor = (value: string): HTMLElement | null => {
    return (
      panels.find(
        (panel) => panel.dataset.pixPanel === value || panel.id === value
      ) ??
      (document.getElementById(value) as HTMLElement | null)
    )
  }

  tabs.forEach((tab, index) => {
    if (tab.tagName === 'BUTTON' && !tab.hasAttribute('type')) {
      tab.setAttribute('type', 'button')
    }
    tab.setAttribute('role', 'tab')
    tab.setAttribute('aria-selected', 'false')
    tab.tabIndex = -1
    if (!tab.id) tab.id = `pix-tab-${ensureId(root, 'pix-tabs')}-${index}`

    const value = tab.dataset.pixTab || tab.id
    const panel = panelFor(value)
    if (panel) {
      if (!panel.id) panel.id = `${tab.id}-panel`
      tab.setAttribute('aria-controls', panel.id)
      panel.setAttribute('role', 'tabpanel')
      panel.setAttribute('aria-labelledby', tab.id)
      panel.tabIndex = 0
      panel.hidden = true
    }
  })

  let activeIndex = -1
  const initial = tabs.findIndex(
    (tab) =>
      tab.getAttribute('aria-selected') === 'true' ||
      tab.classList.contains('is-active')
  )
  activeIndex = initial >= 0 ? initial : 0

  const activate = (index: number, focus = false, notify = true): void => {
    if (index < 0 || index >= tabs.length) return
    const next = tabs[index]
    if (!next || isDisabled(next)) return

    const previous = activeIndex
    activeIndex = index

    tabs.forEach((tab, i) => {
      const selected = i === index
      tab.setAttribute('aria-selected', selected ? 'true' : 'false')
      tab.tabIndex = selected ? 0 : -1
      tab.classList.toggle('is-active', selected)

      const value = tab.dataset.pixTab || tab.id
      const panel = panelFor(value)
      if (panel) {
        panel.hidden = !selected
        panel.classList.toggle('is-active', selected)
      }
    })

    if (focus) {
      try {
        next.focus({ preventScroll: true })
      } catch {
        next.focus()
      }
    }

    if (notify && previous !== index) {
      const value = next.dataset.pixTab || next.id
      emit(root, 'pix:tab-change', {
        value,
        index,
        tab: next,
        panel: panelFor(value)
      })
    }
  }

  const onClick = (event: Event): void => {
    const target = event.target
    if (!(target instanceof Element)) return
    const tab = target.closest<HTMLElement>('[data-pix-tab]')
    if (!tab || !root.contains(tab) || tab.closest('[data-pix="tabs"]') !== root) return
    const index = tabs.indexOf(tab)
    if (index < 0 || isDisabled(tab)) return
    activate(index, false)
  }

  const onKeydown = (event: KeyboardEvent): void => {
    const target = event.target
    if (!(target instanceof HTMLElement)) return
    const tab = target.closest<HTMLElement>('[data-pix-tab]')
    if (!tab || !root.contains(tab)) return

    const current = tabs.indexOf(tab)
    if (current < 0) return

    let next = current
    switch (event.key) {
      case 'ArrowRight':
        next = (current + 1) % tabs.length
        break
      case 'ArrowLeft':
        next = (current - 1 + tabs.length) % tabs.length
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = tabs.length - 1
        break
      default:
        return
    }

    event.preventDefault()
    let attempts = 0
    while (isDisabled(tabs[next]) && attempts < tabs.length) {
      next = (next + 1) % tabs.length
      attempts += 1
    }
    activate(next, true)
  }

  root.addEventListener('click', onClick)
  root.addEventListener('keydown', onKeydown)

  if (!tabs[activeIndex]) activeIndex = 0
  activate(activeIndex, false, false)

  return () => {
    root.removeEventListener('click', onClick)
    root.removeEventListener('keydown', onKeydown)
  }
}
