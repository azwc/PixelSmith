<script setup lang="ts">
import CodeBlock from '../components/CodeBlock.vue'

const swatches = [
  { name: 'PRIMARY', token: '--pix-primary', value: 'var(--pix-primary)' },
  { name: 'SECONDARY', token: '--pix-secondary', value: 'var(--pix-secondary)' },
  { name: 'SUCCESS', token: '--pix-success', value: 'var(--pix-success)' },
  { name: 'DANGER', token: '--pix-danger', value: 'var(--pix-danger)' },
  { name: 'WARNING', token: '--pix-warning', value: 'var(--pix-warning)' },
  { name: 'INFO', token: '--pix-info', value: 'var(--pix-info)' },
  { name: 'ACCENT', token: '--pix-accent', value: 'var(--pix-accent)' },
  { name: 'SURFACE', token: '--pix-surface', value: 'var(--pix-surface)' }
]
</script>

<template>
  <section id="theming" class="demo-section demo-section--alt">
    <div class="demo-shell">
      <div class="demo-section__head">
        <div>
          <p class="pix-eyebrow">THEME SYSTEM</p>
          <h2 class="pix-h1 demo-section__title" aria-label="Your palette. Your rules.">
            YOUR PALETTE.<br />
            <span class="demo-text-accent">YOUR RULES.</span>
          </h2>
        </div>
        <div class="demo-section__meta">
          <span class="pix-badge pix-badge--accent pix-badge--lg">CSS CUSTOM PROPERTIES</span>
          <p>
            No theme provider, no build plugin. Override a handful of tokens and
            the entire kit follows.
          </p>
        </div>
      </div>

      <div class="demo-theme-grid">
        <PxPanel title="THE TOKEN SHELF">
          <template #actions>
            <span class="pix-badge pix-badge--outline">LIVE SWATCHES</span>
          </template>

          <div class="demo-swatches">
            <div v-for="swatch in swatches" :key="swatch.token" class="demo-swatch">
              <span class="demo-swatch__color" :style="{ background: swatch.value }"></span>
              <span class="demo-swatch__meta">
                <strong>{{ swatch.name }}</strong>
                <code>{{ swatch.token }}</code>
              </span>
            </div>
          </div>

          <div class="demo-token-notes">
            <span><code>--pix-border: 3px</code> CHUNKY</span>
            <span><code>--pix-shadow-size: 5px</code> STEPPED</span>
            <span><code>--pix-radius: 0</code> SHARP</span>
          </div>
        </PxPanel>

        <PxPanel title="OVERRIDE ANYTHING">
          <template #actions>
            <span class="pix-badge pix-badge--secondary">NO BUILD STEP</span>
          </template>

          <CodeBlock label="MY-THEME.CSS">
<span class="tok-com">/* drop this in after the kit */</span>
<span class="tok-key">:root</span> {
  --pix-primary: <span class="tok-str">#ff7a18</span>;
  --pix-secondary: <span class="tok-str">#48f2c8</span>;
  --pix-border: <span class="tok-num">4px</span>;
  --pix-shadow-size: <span class="tok-num">7px</span>;
  --pix-font-display: <span class="tok-str">'Press Start 2P'</span>, monospace;
}
          </CodeBlock>

          <p class="pix-text pix-text--sm pix-text--dim">
            Dark is the default. Flip to light at any level with
            <code class="pix-code-inline">data-pix-theme="light"</code>, or put it
            on the <code class="pix-code-inline">&lt;html&gt;</code> element to theme
            teleported modals and toasts too.
          </p>
        </PxPanel>
      </div>
    </div>
  </section>
</template>
