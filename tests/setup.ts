import { afterEach } from 'vitest'

afterEach(() => {
  document.body.innerHTML = ''
  document.body.className = ''
  document.documentElement.removeAttribute('data-pix-theme')
})
