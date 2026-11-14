# Backlog

Follow-ups that are deliberately not fixed yet. Each entry records the reported
symptom, what the kit already does, and what "done" looks like — so the next
pass starts from evidence instead of guesswork.

## 2026-11-14 — reported by the user, pending review

### 1. 错误态 (error state) — not surfaced on the site

**Reported:** 错误态未实现.

**What already exists:** `.pix-field__error` and the `[aria-invalid='true']`
treatment in [form.css](components.md) (danger border + 3px tinted ring),
`.pix-alert--danger`, and a `danger` toast tone. `PxInput`, `PxTextarea` and
`PxSelect` all expose `error` / `hint` props and wire `aria-describedby`;
the lab form in `demo/sections/ComponentLab.vue` already demonstrates an invalid
submit.

**The gap:** the site does not reflect any of it. `pixelsmith-site/index.html:456`
and `:461` render two bare `.pix-input` fields with no hint, no error element
and no `aria-invalid` — so a visitor never sees an error state, and the kit has
no dedicated "error / empty / failed to load" block beyond a field-level message.

**Next:** pick the scope before coding.
- (a) Site demo only: invalid submit → `aria-invalid="true"` +
  `.pix-field__error` under the field, one danger alert for the form-level
  failure. Cheap, no kit change.
- (b) Kit-level primitive in 0.3: `.pix-empty-state` / `PxEmptyState` covering
  empty, error and no-permission variants. Preferred after (a) proves the shape.

### 2. PxSpinner 四格像素动画 — implemented upstream, likely stopped by reduced motion

**Reported:** PxSpinner · 四格像素动画未实现动画.

**What already exists:** [loader.css](../src/styles/components/loader.css)
defines `.pix-spinner` as four 8px corner blocks rotating with
`pix-spinner-turn 900ms steps(4) infinite`, plus a three-dot `.pix-loader`
pulse. The site vendors a byte-identical `pixelsmith.css` (sha256 matches
`pixelsmith-ui/dist`) and renders `<span class="pix-spinner" role="status">`
at `pixelsmith-site/index.html:583`.

**Most likely cause on the site:** `pixelsmith-site/assets/site.css:1616-1617`
sets `animation: none` for `.pix-spinner` and `.pix-loader span` inside
`@media (prefers-reduced-motion: reduce)`. On a machine with "reduce motion"
enabled the spinner is intentionally static. The kit's own reduced-motion block
in [base.css](../src/styles/base.css) covers buttons/tabs/toasts/modals/menus
but **not** the spinner or loader — the same upstream gap recorded as M3 in
`pixelsmith-site/UI-AUDIT.md`.

**Next:** re-check the site with reduced motion off before changing anything. If
it still does not animate, look for a stray `animation: none` override. Either
way, add `.pix-spinner` / `.pix-loader span` to the kit's reduced-motion block
so consumers stop patching it locally.

### 3. Light-theme token debt (F1–F8) — fix in the same pass

**Reported:** the 0.2.0 theme tokens fail WCAG AA in several combinations, all
exposed by the light theme, and the fix should land together with items 1 and 2.

**Summary** (worst light-theme ratios; AA needs 4.5 for text, 3.0 for graphics):

| # | Debt | Worst | Surface |
| --- | --- | --- | --- |
| F1 | `.pix-link` uses `--pix-secondary` as text; hover switches to `--pix-primary` | 2.17 / 1.32 | inline links, breadcrumb links |
| F2 | `--pix-ink-mute` used for meaningful text | 3.64 (dark 4.19) | hints, captions, menu labels, code comments, ellipsis |
| F3 | tone tokens used directly as `color` | 1.23 | field errors, menu danger item, code tokens, hover states |
| F4 | on-tone labels (`danger-ink/danger`, `info-ink/info`) | 3.25 | danger buttons/badges/avatars, info badge |
| F5 | accent fill + hardcoded `#170f2a` ink | 3.83 | accent badge/avatar |
| F6 | alert icon = `--pix-bg` on the tone fill | 1.32 | every coloured alert in light |
| F7 | non-text indicators: progress fill, focused input border | 1.20 / 2.33 | progress, slider, focused fields |
| F8 | dark theme residual: `ink-mute / surface-2` | 4.19 | same muted surfaces as F2 |

**Direction:** introduce semantic roles instead of using fill tokens as text —
`--pix-link`, `--pix-<tone>-text`, `--pix-accent-ink`, `--pix-<tone>-graphic` —
and migrate components to consume only those. That keeps tones as fills while
text and graphics get AA-safe variants per theme.

**Note:** the detailed per-rule report with the migration table is
`docs/light-theme-token-debt.md` — a local-only document (see below), not part
of the pushed repository.

### Review checklist for the next pass

- [ ] Confirm whether both reports were observed with default motion settings.
- [ ] Decide (a) vs (b) for the error state and write it here.
- [ ] If the spinner is genuinely static, attach a screenshot pair as evidence.
- [ ] Fix the light-theme token debt (item 3) in the same pass as items 1–2, with
      before/after contrast numbers for F1–F8.

## Local-only files — never pushed

These exist in the working tree for review and must not be committed or pushed:

| Path | Contents |
| --- | --- |
| `docs/light-theme-token-debt.md` | the full F1–F8 analysis and migration table referenced by item 3 |
| `README.md` (modified) | the local edit that links to that report |

Both are deliberately left out of every commit. If they are ever meant to ship,
they need to be reviewed first and added explicitly.
