import { createToastManager } from '../runtime/toast'
import type { ToastHandle, ToastOptions } from '../types'

let shared: ReturnType<typeof createToastManager> | null = null

const manager = (): ReturnType<typeof createToastManager> => {
  shared ??= createToastManager()
  return shared
}

export const toast = (options: string | ToastOptions): ToastHandle => {
  return manager().toast(options)
}

export function useToast(): {
  toast: (options: string | ToastOptions) => ToastHandle
  closeAll: () => void
} {
  return {
    toast,
    closeAll: () => manager().dismissAll()
  }
}

/** Remove the shared toast host. Useful in tests and micro-frontends. */
export function destroyToasts(): void {
  shared?.destroy()
  shared = null
}
