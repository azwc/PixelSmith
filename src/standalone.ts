import './styles/index.css'
import { createPixelUI } from './runtime'
import type { PixelUIInstance } from './types'

declare global {
  interface Window {
    PixelUI?: PixelUIInstance
  }
}

const ui = createPixelUI()

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  window.PixelUI = ui

  const boot = (): void => {
    ui.mount(document)
    document.documentElement.classList.add('pix-js-ready')
  }

  if (!document.documentElement.hasAttribute('data-pix-manual')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot, { once: true })
    } else {
      boot()
    }
  }
}

/* The standalone bundle intentionally has no module exports.
   It exposes the manager as window.PixelUI and auto-mounts on load. */
