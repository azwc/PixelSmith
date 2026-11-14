<script setup lang="ts">
import { computed } from 'vue'
import type { PxBreadcrumbItem } from '../types'

const props = withDefaults(
  defineProps<{
    items?: PxBreadcrumbItem[]
    separator?: 'chevron' | 'slash'
    ariaLabel?: string
  }>(),
  { items: () => [], separator: 'chevron', ariaLabel: 'Breadcrumb' }
)

const classes = computed(() => [
  'pix-breadcrumb',
  props.separator === 'slash' ? 'pix-breadcrumb--slash' : ''
])

const isLast = (index: number): boolean => index === props.items.length - 1
</script>

<template>
  <nav :class="classes" :aria-label="ariaLabel">
    <ol class="pix-breadcrumb__list">
      <li v-for="(item, index) in items" :key="item.label + index" class="pix-breadcrumb__item">
        <a
          v-if="item.href && !isLast(index) && !item.current"
          class="pix-breadcrumb__link"
          :href="item.href"
        >{{ item.label }}</a>
        <span
          v-else
          class="pix-breadcrumb__current"
          :aria-current="isLast(index) || item.current ? 'page' : undefined"
        >{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>
