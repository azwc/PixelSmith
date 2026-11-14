<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
  }>(),
  { label: 'Loading' }
)
</script>

<template>
  <span class="pix-spinner" role="status" :aria-label="label"></span>
</template>
