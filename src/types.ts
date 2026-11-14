export type PixelTone =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'accent'
  | 'neutral'

export interface ToastOptions {
  /** Short heading. A tone-appropriate default is used when omitted. */
  title?: string
  /** Body copy. Plain text only. */
  message: string
  /** Visual tone, default `primary`. */
  tone?: PixelTone
  /** Auto-dismiss delay in ms. Use `0` for a persistent toast. */
  duration?: number
}

export interface ToastHandle {
  /** Dismiss this toast immediately. */
  dismiss: () => void
}

export interface PixelUIInstance {
  /** Scan a document/root for declarative `data-pix` components and bind them. */
  mount: (root?: ParentNode) => void
  /** Remove every listener, close overlays and tear down generated markup. */
  destroy: () => void
  /** Open a modal by id, selector or element. */
  openModal: (target: string | Element) => void
  /** Close a specific modal, or the topmost one when called without an argument. */
  closeModal: (target?: string | Element) => void
  /** Push a toast notification. */
  toast: (options: string | ToastOptions) => ToastHandle
  /** Dismiss every visible toast. */
  closeAllToasts: () => void
}
