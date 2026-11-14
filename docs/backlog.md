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

### Review checklist for the next pass

- [ ] Confirm whether both reports were observed with default motion settings.
- [ ] Decide (a) vs (b) for the error state and write it here.
- [ ] If the spinner is genuinely static, attach a screenshot pair as evidence.
