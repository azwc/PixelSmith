<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title?: string
    tone?: 'default' | 'primary' | 'dark'
    dots?: boolean
    flat?: boolean
    raised?: boolean
    compact?: boolean
    flush?: boolean
    noHeader?: boolean
  }>(),
  {
    title: '',
    tone: 'default',
    dots: true,
    flat: false,
    raised: false,
    compact: false,
    flush: false,
    noHeader: false
  }
)

const classes = computed(() => [
  'pix-panel',
  {
    'pix-panel--primary': props.tone === 'primary',
    'pix-panel--dark': props.tone === 'dark',
    'pix-panel--flat': props.flat,
    'pix-panel--raised': props.raised
  }
])

const bodyClasses = computed(() => ({
  'pix-panel__body--flush': props.flush,
  'pix-panel__body--compact': props.compact
}))

const showHeader = computed(
  () => !props.noHeader && Boolean(props.title || props.dots)
)
</script>

<template>
  <section :class="classes">
    <header
      v-if="!noHeader && (showHeader || $slots.title || $slots.actions)"
      class="pix-panel__titlebar"
    >
      <span v-if="dots" class="pix-panel__dots" aria-hidden="true">
        <span class="pix-panel__dot"></span>
        <span class="pix-panel__dot"></span>
        <span class="pix-panel__dot"></span>
      </span>
      <h3 v-if="title || $slots.title" class="pix-panel__title">
        <slot name="title">{{ title }}</slot>
      </h3>
      <span class="pix-panel__titlebar-spacer"></span>
      <div v-if="$slots.actions" class="pix-panel__titlebar-slot">
        <slot name="actions"></slot>
      </div>
    </header>
    <div class="pix-panel__body" :class="bodyClasses">
      <slot></slot>
    </div>
    <footer v-if="$slots.footer" class="pix-panel__footer">
      <slot name="footer"></slot>
    </footer>
  </section>
</template>
