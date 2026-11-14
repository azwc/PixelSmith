<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '../../src/vue'
import BrandMark from '../components/BrandMark.vue'
import { copyText } from '../utils/copy'

defineProps<{
  theme: 'dark' | 'light'
}>()

defineEmits<{
  'toggle-theme': []
}>()

const { toast } = useToast()
const copied = ref(false)

const cloneCommand = 'git clone https://github.com/azwc/PixelSmith.git'

const copyClone = async (): Promise<void> => {
  const ok = await copyText(cloneCommand)
  if (!ok) return
  copied.value = true
  window.setTimeout(() => (copied.value = false), 1400)
  toast({
    tone: 'success',
    title: 'Clone command copied',
    message: cloneCommand,
    duration: 1800
  })
}
</script>

<template>
  <header class="demo-header">
    <div class="demo-shell demo-header__inner">
      <a class="demo-logo" href="#top" aria-label="PixelSmith UI home">
        <BrandMark />
        <span class="demo-logo__word">
          PIXEL<span class="demo-logo__accent">SMITH</span>
          <span class="demo-logo__ui">UI</span>
        </span>
      </a>

      <nav class="demo-nav" aria-label="Main navigation">
        <a href="#components">COMPONENTS</a>
        <a href="#theming">THEMING</a>
        <a href="#usage">USAGE</a>
        <a href="#docs">DOCS</a>
      </nav>

      <div class="demo-header__actions">
        <button
          type="button"
          class="demo-install-chip"
          aria-label="Copy clone command"
          @click="copyClone"
        >
          <span aria-hidden="true">$</span>
          <code>{{ copied ? 'copied!' : 'git clone azwc/PixelSmith' }}</code>
        </button>

        <span class="pix-badge pix-badge--outline demo-version">v0.1.0</span>

        <button
          type="button"
          class="pix-btn pix-btn--ghost pix-btn--sm demo-theme-toggle"
          :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
          :aria-pressed="theme === 'light'"
          @click="$emit('toggle-theme')"
        >
          <span class="demo-theme-toggle__icon" aria-hidden="true">
            {{ theme === 'dark' ? '☀' : '☾' }}
          </span>
          {{ theme === 'dark' ? 'LIGHT' : 'DARK' }}
        </button>

        <a class="pix-btn pix-btn--primary pix-btn--sm demo-header__cta" href="#usage">
          GET STARTED
        </a>
      </div>
    </div>
  </header>
</template>
