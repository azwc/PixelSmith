import './styles/index.css'

export { createPixelUI } from './runtime'
export type {
  PixelTone,
  PixelUIInstance,
  ToastHandle,
  ToastOptions
} from './types'

/** Semver of the currently loaded build. */
export const version = '0.1.0'
