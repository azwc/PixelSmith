<script setup lang="ts">
import BrandMark from '../components/BrandMark.vue'
</script>

<template>
  <footer class="demo-footer">
    <div class="demo-shell demo-footer__inner">
      <div class="demo-footer__brand">
        <a class="demo-logo" href="#top" aria-label="Back to top">
          <BrandMark />
          <span class="demo-logo__word">
            PIXEL<span class="demo-logo__accent">SMITH</span>
            <span class="demo-logo__ui">UI</span>
          </span>
        </a>
        <p>Chunky pixels. Serious interfaces.<br />Built from scratch in 2026.</p>
      </div>

      <nav class="demo-footer__nav" aria-label="Footer navigation">
        <a href="#components">COMPONENTS</a>
        <a href="#theming">THEMING</a>
        <a href="#usage">USAGE</a>
        <a href="#docs">DOCS</a>
      </nav>

      <div class="demo-footer__meta">
        <span class="pix-badge pix-badge--outline">MIT LICENSE</span>
        <span class="pix-badge pix-badge--outline">v0.1.0</span>
        <p>Made with 16 colors, 0 rounded corners,<br />and one very small robot.</p>
      </div>
    </div>

    <div class="demo-shell demo-footer__bottom">
      <span>© 2026 PIXELSMITH UI</span>
      <span class="demo-footer__pixels" aria-hidden="true">
        <i></i><i></i><i></i><i></i><i></i>
      </span>
      <span>NO BORROWED UI KITS</span>
    </div>
  </footer>
</template>
