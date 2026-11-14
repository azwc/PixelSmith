# Changelog

All notable changes to PixelSmith UI are recorded here. The project is
source-only and pre-1.0, so minor releases may still adjust visuals.

## 0.2.0 — 2026-11-14

### Added

- **Type scale.** `--pix-fs-*`, `--pix-leading-*`, `--pix-tracking-*`,
  `--pix-icon-*`, `--pix-control-*` and `--pix-field-*` tokens. All component
  CSS now resolves through them instead of writing raw pixel sizes.
- **Six components:** `PxAccordion`, `PxBreadcrumb`, `PxPagination`,
  `PxSkeleton`, `PxSlider`, `PxSegmented` — 16 → 22 components.
- `.pix-label`, `.pix-text--lg`, `.pix-h5` utilities.
- `tests/tokens.test.ts` guards the scale against regressions.
- Demo: navigation and loading panels, type-scale specimen, dark/light parity.

### Changed

- Labels, titles, hints, table cells, alert/toast bodies and controls are now
  size-consistent (no more 13/17/19px one-offs).
- `.pix-btn--lg` is now genuinely larger than the default button (14px labels
  instead of 11px).
- `.pix-text` body size matches `--pix-font-size` (21px → 20px).
- DEMO typography derives from the kit tokens; decorative text no longer drops
  below 10px.

### Removed

- Unused `--pix-bg-raise` token.
