import type { App, Plugin } from 'vue'
import PxAccordion from './components/PxAccordion.vue'
import PxAlert from './components/PxAlert.vue'
import PxBreadcrumb from './components/PxBreadcrumb.vue'
import PxAvatar from './components/PxAvatar.vue'
import PxBadge from './components/PxBadge.vue'
import PxButton from './components/PxButton.vue'
import PxCheckbox from './components/PxCheckbox.vue'
import PxDropdown from './components/PxDropdown.vue'
import PxInput from './components/PxInput.vue'
import PxModal from './components/PxModal.vue'
import PxPagination from './components/PxPagination.vue'
import PxPanel from './components/PxPanel.vue'
import PxProgress from './components/PxProgress.vue'
import PxRadio from './components/PxRadio.vue'
import PxSegmented from './components/PxSegmented.vue'
import PxSelect from './components/PxSelect.vue'
import PxSkeleton from './components/PxSkeleton.vue'
import PxSlider from './components/PxSlider.vue'
import PxSpinner from './components/PxSpinner.vue'
import PxSwitch from './components/PxSwitch.vue'
import PxTabs from './components/PxTabs.vue'
import PxTextarea from './components/PxTextarea.vue'

export const components = {
  PxAccordion,
  PxAlert,
  PxAvatar,
  PxBadge,
  PxBreadcrumb,
  PxButton,
  PxCheckbox,
  PxDropdown,
  PxInput,
  PxModal,
  PxPagination,
  PxPanel,
  PxProgress,
  PxRadio,
  PxSegmented,
  PxSelect,
  PxSkeleton,
  PxSlider,
  PxSpinner,
  PxSwitch,
  PxTabs,
  PxTextarea
}

export const PixelSmith: Plugin = {
  install(app: App) {
    Object.entries(components).forEach(([name, component]) => {
      app.component(name, component)
    })
  }
}
