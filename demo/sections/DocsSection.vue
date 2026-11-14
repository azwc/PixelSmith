<script setup lang="ts">
const componentList = [
  { name: 'PxButton', note: '5 tones, 3 sizes, loading, icons' },
  { name: 'PxInput', note: 'labels, hints, errors, aria wiring' },
  { name: 'PxTextarea', note: 'resizable, validated, accessible' },
  { name: 'PxSelect', note: 'pixel chevron, option API' },
  { name: 'PxCheckbox', note: 'indeterminate + custom pixel check' },
  { name: 'PxRadio', note: 'group-friendly square radios' },
  { name: 'PxSwitch', note: 'native checkbox, switch semantics' },
  { name: 'PxPanel', note: 'window chrome with pixel dots' },
  { name: 'PxBadge', note: 'tones, outlines, live dots' },
  { name: 'PxProgress', note: 'segmented bars + indeterminate' },
  { name: 'PxTabs', note: 'roving focus and named panels' },
  { name: 'PxModal', note: 'focus trap, escape, scroll lock' },
  { name: 'PxDropdown', note: 'menu with keyboard navigation' },
  { name: 'PxAlert', note: 'four tones, optional dismiss' },
  { name: 'PxSpinner', note: 'four-square pixel loader' },
  { name: 'PxAvatar', note: 'initials, image, size scale' }
]

const faqs = [
  {
    q: 'Does it work without Vue?',
    a: 'Yes. The CSS is plain CSS, and the IIFE bundle exposes window.PixelUI plus declarative data-pix behavior for tabs, modals and dropdowns. Buttons, fields, panels, badges, tables and tooltips are CSS-only.'
  },
  {
    q: 'Is there a runtime dependency?',
    a: 'No. Vue is a peer dependency only when you use the Vue entry. The vanilla entry has zero dependencies. Build tooling is dev-only.'
  },
  {
    q: 'Can I theme it without a build step?',
    a: 'Yes. Every visual decision is a CSS custom property. Include your override stylesheet after pixelsmith.css and change only what you need.'
  }
]
</script>

<template>
  <section id="docs" class="demo-section demo-section--alt demo-docs">
    <div class="demo-shell">
      <div class="demo-section__head">
        <div>
          <p class="pix-eyebrow">FIELD MANUAL</p>
          <h2 class="pix-h1 demo-section__title" aria-label="The whole kit. No magic.">
            THE WHOLE KIT.<br />
            <span class="demo-text-accent">NO MAGIC.</span>
          </h2>
        </div>
        <div class="demo-section__meta">
          <p>
            A small, complete API surface. Read the README for prop tables, events
            and every data attribute.
          </p>
          <span class="pix-badge pix-badge--outline pix-badge--lg">README.MD</span>
        </div>
      </div>

      <div class="demo-docs-grid">
        <PxPanel title="COMPONENT INDEX">
          <template #actions>
            <span class="pix-badge pix-badge--primary">16 / 16</span>
          </template>

          <ul class="demo-component-list">
            <li v-for="(component, index) in componentList" :key="component.name">
              <span class="demo-component-list__num">{{ String(index + 1).padStart(2, '0') }}</span>
              <code>{{ component.name }}</code>
              <span>{{ component.note }}</span>
            </li>
          </ul>
        </PxPanel>

        <PxPanel title="QUICK ANSWERS">
          <template #actions>
            <span class="pix-badge pix-badge--secondary">FAQ</span>
          </template>

          <div class="demo-faq">
            <details v-for="(faq, index) in faqs" :key="faq.q" :open="index === 0">
              <summary>{{ faq.q }}</summary>
              <p>{{ faq.a }}</p>
            </details>
          </div>

          <div class="demo-docs-note">
            <span class="pix-badge pix-badge--success">FROM SCRATCH</span>
            <p>
              This kit was built from an empty folder: no borrowed component
              library, no copied theme, no runtime framework under the hood. Just
              CSS, TypeScript, Vue SFCs, and a slightly unreasonable love of
              pixels.
            </p>
          </div>
        </PxPanel>
      </div>
    </div>
  </section>
</template>
