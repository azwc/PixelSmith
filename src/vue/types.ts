import type { PixelTone } from '../types'

export type PxButtonTone = Exclude<PixelTone, 'accent'> | 'ghost'
export type PxSize = 'sm' | 'md' | 'lg'

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
