<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '../../src/vue'
import BrandMark from '../components/BrandMark.vue'
import PixelSmithMascot from '../components/PixelSmithMascot.vue'
import { copyText } from '../utils/copy'

const { toast } = useToast()
const copied = ref(false)

const cloneCommand = 'git clone https://github.com/azwc/PixelSmith.git'

const copyClone = async (): Promise<void> => {
  const ok = await copyText(cloneCommand)
  if (!ok) {
    toast({
      tone: 'warning',
      title: 'Copy failed',
      message: 'Select the command and copy it manually.'
    })
    return
  }
  copied.value = true
  window.setTimeout(() => (copied.value = false), 1600)
  toast({
    tone: 'success',
    title: 'Ready to clone',
    message: 'git clone https://github.com/azwc/PixelSmith.git — copied.',
    duration: 2200
  })
}
</script>

<template>
  <section id="top" class="demo-hero">
    <div class="demo-hero__glow" aria-hidden="true"></div>
    <div class="demo-shell demo-hero__inner">
      <div class="demo-hero__copy">
        <p class="pix-eyebrow">A HANDCRAFTED UI KIT · EST. 2026</p>

        <h1 class="demo-hero__title" aria-label="Pixel perfect. Production ready.">
          <span>PIXEL</span><span class="demo-hero__title-accent">PERFECT.</span>
          <span>PRODUCTION</span><span class="demo-hero__title-secondary">READY.</span>
        </h1>

        <p class="demo-hero__lede">
          An 8-bit love letter to serious interfaces. Sixteen hand-built Vue 3
          components, a standalone CSS + JS bundle, and zero runtime dependencies.
          No rounded corners were harmed.
        </p>

        <div class="demo-hero__ctas">
          <a class="pix-btn pix-btn--primary pix-btn--lg" href="#components">
            EXPLORE THE KIT
            <span class="pix-btn__icon" aria-hidden="true">→</span>
          </a>
          <a
            class="pix-btn pix-btn--ghost pix-btn--lg"
            href="/examples/standalone.html"
            target="_blank"
            rel="noopener"
          >
            VANILLA DEMO
          </a>
        </div>

        <div class="demo-install">
          <span class="demo-install__prompt" aria-hidden="true">$</span>
          <code>git clone azwc/PixelSmith</code>
          <button type="button" class="demo-install__copy" @click="copyClone">
            {{ copied ? 'COPIED' : 'COPY' }}
          </button>
        </div>

        <dl class="demo-stats">
          <div class="demo-stat">
            <dt>VUE COMPONENTS</dt>
            <dd>16</dd>
          </div>
          <div class="demo-stat">
            <dt>RUNTIME DEPS</dt>
            <dd>0</dd>
          </div>
          <div class="demo-stat">
            <dt>SHIPPING MODES</dt>
            <dd>02</dd>
          </div>
        </dl>
      </div>

      <div class="demo-hero__visual">
        <div class="demo-float demo-float--vue">
          <span class="pix-badge pix-badge--secondary">VUE 3</span>
        </div>
        <div class="demo-float demo-float--plain">
          <span class="pix-badge pix-badge--primary">NO BUILD STEP</span>
        </div>
        <div class="demo-float demo-float--a11y">
          <span class="pix-badge pix-badge--success">A11Y READY</span>
        </div>

        <div class="pix-panel pix-panel--raised demo-console">
          <div class="pix-panel__titlebar">
            <span class="pix-panel__dots" aria-hidden="true">
              <span class="pix-panel__dot"></span>
              <span class="pix-panel__dot"></span>
              <span class="pix-panel__dot"></span>
            </span>
            <span class="pix-panel__title">SMITH.EXE</span>
            <span class="pix-panel__titlebar-spacer"></span>
            <span class="pix-badge pix-badge--success pix-badge--live">
              <span class="pix-badge__dot"></span>
              ONLINE
            </span>
          </div>
          <div class="demo-stage pix-scanlines">
            <div class="demo-stage__grid" aria-hidden="true"></div>
            <PixelSmithMascot />
            <span class="demo-stage__tag">BUILT PIXEL BY PIXEL</span>
          </div>
          <div class="demo-console__footer">
            <span class="demo-console__path">~/pixelsmith-ui</span>
            <span class="demo-console__status">BUILD: PASS</span>
          </div>
        </div>

        <div class="demo-credit">
          <BrandMark />
          <span>SMITH / <strong>UNIT 01</strong></span>
        </div>
      </div>
    </div>
  </section>
</template>
