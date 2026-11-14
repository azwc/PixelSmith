let bodyLocks = 0

export function lockBodyScroll(): void {
  if (typeof document === 'undefined') return
  bodyLocks += 1
  if (bodyLocks === 1) document.body.classList.add('pix-modal-open')
}

export function unlockBodyScroll(): void {
  if (typeof document === 'undefined') return
  bodyLocks = Math.max(0, bodyLocks - 1)
  if (bodyLocks === 0) document.body.classList.remove('pix-modal-open')
}

export function resetBodyScrollLocks(): void {
  bodyLocks = 0
  if (typeof document !== 'undefined') {
    document.body.classList.remove('pix-modal-open')
  }
}
