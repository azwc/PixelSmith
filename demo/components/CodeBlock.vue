<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '../../src/vue'
import { copyText } from '../utils/copy'

defineProps<{
  label?: string
  copyLabel?: string
}>()

const preRef = ref<HTMLElement | null>(null)
const copied = ref(false)
const { toast } = useToast()

const copy = async (): Promise<void> => {
  const text = preRef.value?.innerText ?? ''
  const ok = await copyText(text)
  if (!ok) {
    toast({
      tone: 'warning',
      title: 'Copy failed',
      message: 'Select the snippet and copy it manually.'
    })
    return
  }
  copied.value = true
  window.setTimeout(() => (copied.value = false), 1600)
  toast({
    tone: 'success',
    title: 'Copied',
    message: 'Snippet copied to clipboard.',
    duration: 1800
  })
}
</script>

<template>
  <div class="pix-code-block demo-code">
    <div class="pix-code-block__header">
      <span>{{ label || 'SNIPPET' }}</span>
      <button type="button" class="demo-code__copy" @click="copy">
        {{ copied ? 'COPIED' : 'COPY' }}
      </button>
    </div>
    <pre ref="preRef"><code><slot></slot></code></pre>
  </div>
</template>
