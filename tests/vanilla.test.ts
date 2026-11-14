import { afterEach, describe, expect, it, vi } from 'vitest'
import { createPixelUI } from '../src/index'
import type { PixelUIInstance } from '../src/index'

let ui: PixelUIInstance | null = null

afterEach(() => {
  ui?.destroy()
  ui = null
  document.body.innerHTML = ''
  vi.useRealTimers()
})

describe('vanilla tabs', () => {
  const markup = `
    <div data-pix="tabs" id="tabs">
      <div class="pix-tabs__list" role="tablist">
        <button type="button" data-pix-tab="a">A</button>
        <button type="button" data-pix-tab="b">B</button>
        <button type="button" data-pix-tab="c" disabled>C</button>
      </div>
      <div data-pix-panel="a">Panel A</div>
      <div data-pix-panel="b">Panel B</div>
      <div data-pix-panel="c">Panel C</div>
    </div>
  `

  it('wires up roles and switches panels', () => {
    document.body.innerHTML = markup
    ui = createPixelUI()
    ui.mount()

    const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-pix-tab]'))
    const panels = Array.from(document.querySelectorAll<HTMLElement>('[data-pix-panel]'))

    expect(tabs[0]?.getAttribute('aria-selected')).toBe('true')
    expect(tabs[0]?.tabIndex).toBe(0)
    expect(panels[0]?.hidden).toBe(false)
    expect(panels[1]?.hidden).toBe(true)

    tabs[1]?.click()

    expect(tabs[1]?.getAttribute('aria-selected')).toBe('true')
    expect(tabs[1]?.classList.contains('is-active')).toBe(true)
    expect(panels[0]?.hidden).toBe(true)
    expect(panels[1]?.hidden).toBe(false)
  })

  it('emits a change event and supports arrow keys', () => {
    document.body.innerHTML = markup
    ui = createPixelUI()
    ui.mount()

    const root = document.getElementById('tabs') as HTMLElement
    const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-pix-tab]'))
    const onChange = vi.fn()
    root.addEventListener('pix:tab-change', onChange)

    tabs[0]?.focus()
    tabs[0]?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    )

    expect(tabs[1]?.getAttribute('aria-selected')).toBe('true')
    expect(document.activeElement).toBe(tabs[1])
    expect(onChange).toHaveBeenCalledTimes(1)
    expect((onChange.mock.calls[0]?.[0] as CustomEvent).detail.value).toBe('b')
  })
})

describe('vanilla modal', () => {
  const markup = `
    <button type="button" id="open" data-pix-open="demo-modal">Open</button>
    <div class="pix-modal" id="demo-modal" data-pix="modal" aria-hidden="true">
      <div class="pix-modal__backdrop" data-pix-close></div>
      <div class="pix-modal__dialog">
        <div class="pix-panel pix-modal__panel">
          <div class="pix-panel__titlebar">
            <h2 class="pix-panel__title">Demo modal</h2>
            <button type="button" class="pix-modal__close" id="close" data-pix-close>×</button>
          </div>
          <div class="pix-panel__body">
            <button type="button" id="inside">Inside</button>
          </div>
        </div>
      </div>
    </div>
  `

  it('opens from a data attribute, traps focus and closes on Escape', () => {
    document.body.innerHTML = markup
    ui = createPixelUI()
    ui.mount()

    const opener = document.getElementById('open') as HTMLButtonElement
    const modal = document.getElementById('demo-modal') as HTMLElement
    const close = document.getElementById('close') as HTMLButtonElement

    opener.focus()
    opener.click()

    expect(modal.classList.contains('is-open')).toBe(true)
    expect(modal.getAttribute('aria-hidden')).toBe('false')
    expect(document.body.classList.contains('pix-modal-open')).toBe(true)
    expect(modal.contains(document.activeElement)).toBe(true)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    expect(modal.classList.contains('is-open')).toBe(false)
    expect(modal.getAttribute('aria-hidden')).toBe('true')
    expect(document.body.classList.contains('pix-modal-open')).toBe(false)
    expect(document.activeElement).toBe(opener)

    // The close button still works after a re-open.
    opener.click()
    close.click()
    expect(modal.classList.contains('is-open')).toBe(false)
  })

  it('closes when the backdrop is clicked', () => {
    document.body.innerHTML = markup
    ui = createPixelUI()
    ui.mount()

    ui.openModal('demo-modal')
    const backdrop = document.querySelector<HTMLElement>('.pix-modal__backdrop')
    backdrop?.click()
    expect(document.getElementById('demo-modal')?.classList.contains('is-open')).toBe(false)
  })
})

describe('vanilla dropdown', () => {
  it('opens, emits select and closes', () => {
    document.body.innerHTML = `
      <div data-pix="dropdown" id="dropdown">
        <button type="button" data-pix-dropdown-trigger>Actions</button>
        <div class="pix-menu" data-pix-dropdown-menu>
          <button type="button" class="pix-menu__item" data-pix-value="duplicate">Duplicate</button>
          <button type="button" class="pix-menu__item" data-pix-value="delete">Delete</button>
        </div>
      </div>
    `
    ui = createPixelUI()
    ui.mount()

    const root = document.getElementById('dropdown') as HTMLElement
    const trigger = root.querySelector<HTMLButtonElement>('[data-pix-dropdown-trigger]')!
    const menu = root.querySelector<HTMLElement>('[data-pix-dropdown-menu]')!
    const onSelect = vi.fn()
    root.addEventListener('pix:select', onSelect)

    trigger.click()
    expect(menu.hidden).toBe(false)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')

    const item = root.querySelector<HTMLButtonElement>('[data-pix-value="delete"]')!
    item.click()

    expect(menu.hidden).toBe(true)
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect((onSelect.mock.calls[0]?.[0] as CustomEvent).detail.value).toBe('delete')
  })
})

describe('toasts', () => {
  it('creates a toast and dismisses it', () => {
    vi.useFakeTimers()
    ui = createPixelUI()
    const handle = ui.toast({
      tone: 'success',
      title: 'Saved',
      message: 'Everything is pixel perfect.'
    })

    expect(document.querySelector('.pix-toast')).not.toBeNull()
    expect(document.querySelector('.pix-toast__title')?.textContent).toBe('Saved')

    handle.dismiss()
    vi.advanceTimersByTime(200)
    expect(document.querySelector('.pix-toast')).toBeNull()
  })

  it('escapes message text instead of parsing markup', () => {
    ui = createPixelUI()
    ui.toast({ message: '<img src=x onerror=alert(1)>' })
    const message = document.querySelector('.pix-toast__message')
    expect(message?.querySelector('img')).toBeNull()
    expect(message?.textContent).toContain('<img')
  })
})
