import type { PixelTone } from '../types'

export type PxButtonTone = Exclude<PixelTone, 'accent'> | 'ghost'
export type PxSize = 'sm' | 'md' | 'lg'

export interface PxAccordionItem {
  id: string
  label: string
  /** Panel body used when the `panel-<id>` slot is not provided. */
  panel?: string
  disabled?: boolean
}

export interface PxBreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

export interface PxSegmentedOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface PxTabItem {
  id: string
  label: string
  disabled?: boolean
  icon?: string
}

export interface PxSelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface PxDropdownDetail {
  value: string
  item: HTMLElement
  dropdown: HTMLElement
}
