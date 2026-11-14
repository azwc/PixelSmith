import { onMounted, ref } from 'vue'

export type DemoTheme = 'dark' | 'light'

const STORAGE_KEY = 'pixelsmith-theme'

export function useTheme() {
  const theme = ref<DemoTheme>('dark')

  const apply = (next: DemoTheme): void => {
    theme.value = next
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.pixTheme = next
    }
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage can be unavailable */
    }
  }

  const toggle = (): void => {
    apply(theme.value === 'dark' ? 'light' : 'dark')
  }

  onMounted(() => {
    let stored: string | null = null
    try {
      stored = localStorage.getItem(STORAGE_KEY)
    } catch {
      stored = null
    }
    if (stored === 'light' || stored === 'dark') {
      apply(stored)
    } else {
      apply('dark')
    }
  })

  return { theme, apply, toggle }
}
