<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '../../src/vue'
import CodeBlock from '../components/CodeBlock.vue'
import { copyText } from '../utils/copy'

const { toast } = useToast()
const copied = ref(false)

const cloneCommand = 'git clone https://github.com/azwc/PixelSmith.git'

const copyClone = async (): Promise<void> => {
  const ok = await copyText(cloneCommand)
  if (!ok) return
  copied.value = true
  window.setTimeout(() => (copied.value = false), 1600)
  toast({
    tone: 'success',
    title: 'Clone command copied',
    message: cloneCommand,
    duration: 1800
  })
}
</script>

<template>
  <section id="usage" class="demo-section">
    <div class="demo-shell">
      <div class="demo-section__head">
        <div>
          <p class="pix-eyebrow">TWO SHIPPING MODES</p>
          <h2 class="pix-h1 demo-section__title" aria-label="Vue or vanilla. Same soul.">
            VUE OR VANILLA.<br />
            <span class="demo-text-accent">SAME SOUL.</span>
          </h2>
        </div>
        <div class="demo-section__meta">
          <p>
            Components are authored in Vue 3, then the behavior layer and CSS ship
            separately for plain HTML. Pick one. Mix them. No lock-in.
          </p>
          <PxButton size="sm" tone="secondary" @click="copyClone">
            {{ copied ? 'COPIED!' : 'COPY CLONE' }}
          </PxButton>
        </div>
      </div>

      <div class="demo-usage-grid">
        <PxPanel title="VUE 3 / PLUGIN">
          <template #actions>
            <span class="pix-badge pix-badge--secondary">RECOMMENDED</span>
          </template>

          <div class="demo-usage">

            <CodeBlock label="MAIN.TS">
<span class="tok-key">import</span> { createApp } <span class="tok-key">from</span> <span class="tok-str">'vue'</span>
<span class="tok-key">import</span> PixelSmith <span class="tok-key">from</span> <span class="tok-str">'../src/vue'</span>
<span class="tok-key">import</span> <span class="tok-str">'../src/styles/index.css'</span>
<span class="tok-key">import</span> App <span class="tok-key">from</span> <span class="tok-str">'./App.vue'</span>

createApp(App)
  .use(PixelSmith)
  .mount(<span class="tok-str">'#app'</span>)
            </CodeBlock>

            <CodeBlock label="ANY-COMPONENT.VUE">
<span class="tok-key">&lt;PxButton</span> tone=<span class="tok-str">"secondary"</span> size=<span class="tok-str">"lg"</span><span class="tok-key">&gt;</span>
  SAVE THE DAY
<span class="tok-key">&lt;/PxButton&gt;</span>
            </CodeBlock>

            <p class="pix-text pix-text--sm pix-text--dim">
              Import components individually for tree-shaking, or register the
              whole kit once with the plugin. Every component exposes typed props
              and native events.
            </p>
          </div>
        </PxPanel>

        <PxPanel title="VANILLA / SCRIPT TAG">
          <template #actions>
            <span class="pix-badge pix-badge--primary">ZERO BUILD</span>
          </template>

          <div class="demo-usage">

            <CodeBlock label="INDEX.HTML">
&lt;link rel=<span class="tok-str">"stylesheet"</span> href=<span class="tok-str">"dist/pixelsmith.css"</span>&gt;
&lt;script src=<span class="tok-str">"dist/pixelsmith.js"</span>&gt;&lt;/script&gt;

&lt;button class=<span class="tok-str">"pix-btn pix-btn--primary"</span>&gt;
  SAVE THE DAY
&lt;/button&gt;
            </CodeBlock>

            <CodeBlock label="APP.JS">
<span class="tok-com">// UMD bundle auto-mounts on load</span>
PixelUI.toast({
  tone: <span class="tok-str">'success'</span>,
  title: <span class="tok-str">'Saved'</span>,
  message: <span class="tok-str">'One tiny toast, zero dependencies.'</span>
})
            </CodeBlock>

            <p class="pix-text pix-text--sm pix-text--dim">
              Run <code class="pix-code-inline">pnpm build</code> first. Behavior
              components are declarative too: add
              <code class="pix-code-inline">data-pix="tabs"</code> or
              <code class="pix-code-inline">data-pix-open="my-modal"</code> and the
              runtime wires it up.
            </p>
          </div>
        </PxPanel>
      </div>

      <div class="demo-usage-actions">
        <a class="pix-btn pix-btn--primary" href="/examples/standalone.html" target="_blank" rel="noopener">
          OPEN THE VANILLA EXAMPLE
          <span class="pix-btn__icon" aria-hidden="true">↗</span>
        </a>
        <a class="pix-btn pix-btn--ghost" href="#docs">READ THE DOCS</a>
        <span class="demo-usage-actions__note">SOURCE-ONLY · MIT LICENSE · NO REGISTRY PUBLISH</span>
      </div>
    </div>
  </section>
</template>
