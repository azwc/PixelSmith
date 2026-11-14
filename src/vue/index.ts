import '../styles/index.css'

import { PixelSmith } from './plugin'

export { PixelSmith, components } from './plugin'
export { toast, useToast, destroyToasts } from './useToast'

export { default as PxAccordion } from './components/PxAccordion.vue'
export { default as PxAlert } from './components/PxAlert.vue'
export { default as PxAvatar } from './components/PxAvatar.vue'
export { default as PxBadge } from './components/PxBadge.vue'
export { default as PxBreadcrumb } from './components/PxBreadcrumb.vue'
export { default as PxButton } from './components/PxButton.vue'
export { default as PxCheckbox } from './components/PxCheckbox.vue'
export { default as PxDropdown } from './components/PxDropdown.vue'
export { default as PxInput } from './components/PxInput.vue'
export { default as PxModal } from './components/PxModal.vue'
export { default as PxPagination } from './components/PxPagination.vue'
export { default as PxPanel } from './components/PxPanel.vue'
export { default as PxProgress } from './components/PxProgress.vue'
export { default as PxRadio } from './components/PxRadio.vue'
export { default as PxSegmented } from './components/PxSegmented.vue'
export { default as PxSelect } from './components/PxSelect.vue'
export { default as PxSkeleton } from './components/PxSkeleton.vue'
export { default as PxSlider } from './components/PxSlider.vue'
export { default as PxSpinner } from './components/PxSpinner.vue'
export { default as PxSwitch } from './components/PxSwitch.vue'
export { default as PxTabs } from './components/PxTabs.vue'
export { default as PxTextarea } from './components/PxTextarea.vue'

export type { PixelTone, ToastHandle, ToastOptions } from '../types'
export type {
  PxAccordionItem,
  PxBreadcrumbItem,
  PxButtonTone,
  PxDropdownDetail,
  PxSegmentedOption,
  PxSelectOption,
  PxSize,
  PxTabItem
} from './types'

/** Semver of the currently loaded Vue build. */
export const version = '0.2.0'

export default PixelSmith
