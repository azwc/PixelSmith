<script setup lang="ts">
import { useTheme } from './useTheme'
import SiteHeader from './sections/SiteHeader.vue'
import HeroSection from './sections/HeroSection.vue'
import ComponentLab from './sections/ComponentLab.vue'
import ThemingSection from './sections/ThemingSection.vue'
import UsageSection from './sections/UsageSection.vue'
import DocsSection from './sections/DocsSection.vue'
import SiteFooter from './sections/SiteFooter.vue'

const { theme, toggle } = useTheme()

const ticker = [
  '16 HAND-BUILT COMPONENTS',
  'VUE 3 + VANILLA',
  'ZERO RUNTIME DEPS',
  'WCAG-MINDED',
  'PIXEL PERFECT',
  'MIT LICENSED'
]
</script>

<template>
  <div class="pix-root demo">
    <a class="demo-skip" href="#main">SKIP TO CONTENT</a>

    <div class="demo-announce">
      <span class="demo-announce__blink" aria-hidden="true"></span>
      <span>PIXELSMITH UI 0.1.0 IS OUT</span>
      <span class="demo-announce__divider" aria-hidden="true">/</span>
      <span class="demo-announce__muted">VUE 3 + VANILLA CSS + JS</span>
      <a href="#usage">GET STARTED →</a>
    </div>

    <SiteHeader :theme="theme" @toggle-theme="toggle" />

    <main id="main">
      <HeroSection />

      <div class="demo-ticker" aria-hidden="true">
        <div class="demo-ticker__track">
          <template v-for="copy in 2" :key="copy">
            <span v-for="word in ticker" :key="`${copy}-${word}`" class="demo-ticker__item">
              {{ word }} <b>★</b>
            </span>
          </template>
        </div>
      </div>

      <ComponentLab />
      <ThemingSection />
      <UsageSection />
      <DocsSection />
    </main>

    <SiteFooter />
  </div>
</template>
