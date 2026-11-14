# PixelSmith UI — Component API

All Vue components are exported from the repository's Vue entry at
<code>src/vue</code>. The same classes are available in the standalone stylesheet. Prop types are TypeScript
types; defaults are listed in parentheses.

## Conventions

- Use <code>v-model</code> on form components and <code>PxModal</code>.
- Native attributes fall through to the native control where it matters
  (<code>PxInput</code>, <code>PxTextarea</code>, <code>PxSelect</code>).
- <code>tone</code> accepts: <code>primary</code>, <code>secondary</code>,
  <code>success</code>, <code>danger</code>, <code>warning</code>,
  <code>info</code>, <code>accent</code>, <code>neutral</code>.
- <code>size</code> accepts: <code>sm</code>, <code>md</code>, <code>lg</code>.
- All interactive components use the global 3px focus ring token.

---

## Typography & scale

Two families ship with the kit: `Press Start 2P` (`--pix-font-display`) for
labels, buttons, titles and eyebrow text, and `VT323` (`--pix-font-body`) for
prose and controls. Both are self-hosted, so nothing is fetched at runtime.

Component CSS never hardcodes a size. Every step is a token, which means a single
override rescales a whole surface:

| Token | Value | Used by |
| --- | --- | --- |
| <code>--pix-fs-display-2xs</code> | 10px | floors decorative type (demo, micro marks) |
| <code>--pix-fs-display-xs</code> / <code>--pix-fs-label</code> | 11px | field labels, table heads, badges, tabs, menu headers |
| <code>--pix-fs-display-sm</code> / <code>--pix-fs-ui</code> | 12px | buttons, panel titles, toast titles |
| <code>--pix-fs-display-md</code> | 14px | large buttons |
| <code>--pix-fs-display-lg</code> | 16px | avatar text, menu icons |
| <code>--pix-fs-body-sm</code> | 18px | hints, errors, table cells, alert and toast bodies |
| <code>--pix-fs-body-md</code> / <code>--pix-fs-body</code> | 20px | body copy, checkbox labels |
| <code>--pix-fs-body-lg</code> / <code>--pix-fs-control</code> | 22px | inputs, textareas, selects |
| <code>--pix-fs-body-xl</code> / <code>--pix-fs-control-lg</code> | 25px | large controls |

Supporting tokens: `--pix-leading-*` (none/tight/snug/normal/relaxed/display/loose),
`--pix-tracking-*` (tight/wide/wider/eyebrow), `--pix-icon-sm|md|lg`,
`--pix-control-sm|md|lg` (34/42/52px) and `--pix-field-sm|md|lg` (38/46/54px).
Headings keep their fluid clamps but are exposed as `--pix-fs-h1..h5`.

~~~css
:root {
  --pix-font-size: 22px;      /* body base; everything that derives from it follows */
  --pix-fs-h1: clamp(24px, 5vw, 52px);
  --pix-fs-label: 12px;
}
~~~

Utility classes: `.pix-text` (with `--sm` 18px, `--lg` 22px, `--tight`, `--dim`,
`--mute`), `.pix-label` (11px display, uppercase, tracked) and `.pix-h1`…`.pix-h5`.

---

## PxButton

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| <code>tone</code> | <code>PixelTone \| 'ghost'</code> | <code>primary</code> | Visual variant |
| <code>size</code> | <code>sm \| md \| lg</code> | <code>md</code> | |
| <code>type</code> | <code>button \| submit \| reset</code> | <code>button</code> | |
| <code>block</code> | <code>boolean</code> | <code>false</code> | Full width |
| <code>iconOnly</code> | <code>boolean</code> | <code>false</code> | Square; pass <code>aria-label</code> |
| <code>loading</code> | <code>boolean</code> | <code>false</code> | Disables and shows a pixel loader |
| <code>disabled</code> | <code>boolean</code> | <code>false</code> | |

Slots: <code>default</code>, <code>icon</code>. Event: <code>click</code>.

---

## PxPanel

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| <code>title</code> | <code>string</code> | <code>''</code> | Titlebar label |
| <code>tone</code> | <code>default \| primary \| dark</code> | <code>default</code> | |
| <code>dots</code> | <code>boolean</code> | <code>true</code> | Three window dots |
| <code>flat</code> | <code>boolean</code> | <code>false</code> | Removes shadow |
| <code>raised</code> | <code>boolean</code> | <code>false</code> | Larger shadow |
| <code>compact</code> | <code>boolean</code> | <code>false</code> | Tighter body padding |
| <code>flush</code> | <code>boolean</code> | <code>false</code> | Zero body padding |
| <code>noHeader</code> | <code>boolean</code> | <code>false</code> | Hides the titlebar entirely |

Slots: <code>default</code>, <code>title</code>, <code>actions</code>,
<code>footer</code>.

---

## PxBadge

Props: <code>tone</code> (default <code>primary</code>), <code>size</code>
(<code>sm \| md \| lg</code>), <code>outline</code>, <code>dot</code>,
<code>live</code>. Default slot is the label.

---

## PxInput

| Prop | Type | Default |
| --- | --- | --- |
| <code>modelValue</code> | <code>string \| number</code> | <code>''</code> |
| <code>label</code> | <code>string</code> | <code>''</code> |
| <code>placeholder</code> | <code>string</code> | <code>''</code> |
| <code>hint</code> | <code>string</code> | <code>''</code> |
| <code>error</code> | <code>string</code> | <code>''</code> |
| <code>type</code> | <code>string</code> | <code>text</code> |
| <code>size</code> | <code>sm \| md \| lg</code> | <code>md</code> |
| <code>name</code> | <code>string</code> | <code>''</code> |
| <code>disabled</code> / <code>readonly</code> / <code>required</code> | <code>boolean</code> | <code>false</code> |
| <code>autocomplete</code> | <code>string</code> | <code>off</code> |

Emits: <code>update:modelValue</code>, <code>input</code>, <code>change</code>,
<code>focus</code>, <code>blur</code>. Exposes <code>focus()</code>.

---

## PxTextarea

Props mirror <code>PxInput</code>, plus <code>rows</code> (default 4) and
<code>resize</code> (<code>vertical</code>). Same events and exposed method.

---

## PxSelect

Props: <code>modelValue</code>, <code>options</code>
(<code>{ label, value, disabled? }[]</code>), <code>label</code>,
<code>placeholder</code>, <code>hint</code>, <code>error</code>,
<code>size</code>, <code>name</code>, <code>disabled</code>,
<code>required</code>.

Emits: <code>update:modelValue</code> (string), <code>change</code>,
<code>focus</code>, <code>blur</code>. The native select is wrapped in the pixel
chevron.

---

## PxCheckbox

Props: <code>modelValue</code> (boolean), <code>label</code>, <code>hint</code>,
<code>name</code>, <code>value</code>, <code>disabled</code>,
<code>indeterminate</code>. Emits <code>update:modelValue</code> and
<code>change</code>.

---

## PxRadio

Props: <code>modelValue</code>, <code>value</code>, <code>label</code>,
<code>hint</code>, <code>name</code>, <code>disabled</code>. Emits
<code>update:modelValue</code> and <code>change</code>. Give a group of radios
the same <code>name</code>.

---

## PxSwitch

Props: <code>modelValue</code> (boolean), <code>label</code>, <code>hint</code>,
<code>name</code>, <code>value</code>, <code>disabled</code>. Renders a native
checkbox with <code>role="switch"</code>. Emits <code>update:modelValue</code>
and <code>change</code>.

---

## PxProgress

| Prop | Type | Default |
| --- | --- | --- |
| <code>value</code> | <code>number</code> | <code>0</code> |
| <code>max</code> | <code>number</code> | <code>100</code> |
| <code>label</code> | <code>string</code> | <code>''</code> |
| <code>showValue</code> | <code>boolean</code> | <code>false</code> |
| <code>tone</code> | <code>PixelTone</code> | <code>primary</code> |
| <code>size</code> | <code>sm \| md \| lg</code> | <code>md</code> |
| <code>indeterminate</code> | <code>boolean</code> | <code>false</code> |
| <code>striped</code> | <code>boolean</code> | <code>false</code> |

Renders <code>role="progressbar"</code> with <code>aria-valuenow</code> omitted
when indeterminate. Slot: <code>label</code>.

---

## PxTabs

| Prop | Type | Default |
| --- | --- | --- |
| <code>tabs</code> | <code>{ id, label, disabled?, icon? }[]</code> | <code>[]</code> |
| <code>modelValue</code> | <code>string</code> | <code>undefined</code> |
| <code>defaultValue</code> | <code>string</code> | <code>''</code> |
| <code>ariaLabel</code> | <code>string</code> | <code>Tabs</code> |

Slots: <code>panel-&lt;id&gt;</code> for each tab, or a generic
<code>panel</code> slot. Events: <code>update:modelValue</code>,
<code>change</code>. Exposes <code>select(id)</code>.

Keyboard: ArrowLeft/Right, Home, End.

---

## PxModal

| Prop | Type | Default |
| --- | --- | --- |
| <code>modelValue</code> | <code>boolean</code> | required |
| <code>title</code> | <code>string</code> | <code>''</code> |
| <code>size</code> | <code>sm \| md \| lg \| xl</code> | <code>md</code> |
| <code>closeOnBackdrop</code> | <code>boolean</code> | <code>true</code> |
| <code>closeOnEsc</code> | <code>boolean</code> | <code>true</code> |
| <code>hideClose</code> | <code>boolean</code> | <code>false</code> |
| <code>ariaLabel</code> | <code>string</code> | <code>Dialog</code> |

Slots: <code>default</code>, <code>title</code>, <code>footer</code>. Events:
<code>update:modelValue</code>, <code>open</code>, <code>close</code>. Teleports
to <code>body</code>, locks scroll, traps Tab, closes on Escape, and restores the
previous focus. Mark the element to focus first with
<code>data-pix-autofocus</code>.

---

## PxDropdown

Props: <code>label</code> (default <code>Menu</code>), <code>tone</code>,
<code>size</code>, <code>align</code> (<code>left \| right</code>),
<code>disabled</code>, <code>menuLabel</code>. Slots: <code>trigger</code> and
default (menu content). Event: <code>select</code> with
<code>{ value, item, dropdown }</code>. Also emits <code>open</code> and
<code>close</code>. Menu items should use <code>.pix-menu__item</code> and can
provide <code>data-pix-value</code>.

---

## PxAlert

Props: <code>tone</code> (default <code>info</code>), <code>title</code>,
<code>dismissible</code>. Slots: <code>default</code>, <code>title</code>.
Event: <code>close</code>. Uses <code>role="alert"</code> for danger/warning and
<code>role="status"</code> otherwise.

---

## PxSpinner

Prop: <code>label</code> (default <code>Loading</code>). Renders
<code>role="status"</code>.

---

## PxAvatar

Props: <code>src</code>, <code>alt</code>, <code>initials</code>,
<code>tone</code>, <code>size</code>. Default slot replaces initials.

---

## PxAccordion

| Prop | Type | Default |
| --- | --- | --- |
| <code>items</code> | <code>{ id, label, panel?, disabled? }[]</code> | <code>[]</code> |
| <code>modelValue</code> | <code>string[]</code> | <code>[]</code> |
| <code>exclusive</code> | <code>boolean</code> | <code>false</code> |
| <code>name</code> | <code>string</code> | generated |

Renders native `<details>`/`<summary>`, so the disclosure is keyboard-operable
without JavaScript. Slot `panel-<id>` overrides `item.panel`. Events:
`update:modelValue`, `change` (both carry the open id list). Exclusive mode also
sets the native `name` attribute and keeps a script fallback for older browsers.

---

## PxBreadcrumb

Props: `items` (`{ label, href?, current? }[]`), `separator`
(`chevron | slash`), `ariaLabel`. The last item gets `aria-current="page"`;
separators are CSS pseudo-elements and stay out of the accessibility tree.

---

## PxPagination

| Prop | Type | Default |
| --- | --- | --- |
| <code>modelValue</code> | <code>number</code> | <code>1</code> |
| <code>pages</code> | <code>number</code> | <code>1</code> |
| <code>siblings</code> | <code>number</code> | <code>1</code> |
| <code>disabled</code> | <code>boolean</code> | <code>false</code> |
| <code>href</code> | <code>(page: number) => string</code> | — |

Emits `update:modelValue` and `change` with the new page. Renders buttons by
default; pass `href` to render real links instead. Out-of-range values are
clamped, `pages <= 1` renders a single control set, and the current page carries
`aria-current="page"`. Ellipses are `aria-hidden`.

---

## PxSkeleton

Props: `variant` (`block | text | circle`, default `block`), `size`
(`sm | md | lg`), `width`, `height`, `lines` (text multi-line), `label`.
Decorative by default (`aria-hidden`); pass `label` to expose `role="status"`.
The sweep animation is stepped and stops under `prefers-reduced-motion`.

---

## PxSlider

Props mirror `PxInput` where they apply: `modelValue`, `min`, `max`, `step`,
`label`, `hint`, `error`, `name`, `disabled`, `required`, plus `showValue` and
`format`. Emits `update:modelValue` (number), `input`, `change`. Wraps the native
`input[type=range]` — keyboard, pointer and touch behaviour are the browser's.

---

## PxSegmented

Props: `modelValue`, `options` (`{ label, value, disabled? }[]`), `name`,
`size` (`sm | md | lg`), `ariaLabel`, `disabled`. A native radio group, so arrow
keys and `role="radiogroup"` come for free. Emits `update:modelValue` and
`change`.

---

# Toast

~~~ts
import { toast, useToast } from '../src/vue'

toast({
  tone: 'success',   // PixelTone
  title: 'Saved',    // optional
  message: 'All good.',
  duration: 3200     // ms; 0 keeps it open
})
~~~

<code>useToast()</code> returns <code>{ toast, closeAll }</code>. The vanilla
equivalent is <code>PixelUI.toast(options)</code>. Toasts pause their timer on
hover and animate out before removal.

---

# Vanilla runtime

~~~ts
import { createPixelUI } from './src/index'

const ui = createPixelUI()
ui.mount()                       // scan document
ui.mount(someContainer)          // scan a subtree after dynamic updates
ui.openModal('my-modal')
ui.closeModal()
ui.toast({ tone: 'success', message: 'Saved' })
ui.closeAllToasts()
ui.destroy()
~~~

| Markup | Behavior |
| --- | --- |
| <code>[data-pix="tabs"]</code> + <code>[data-pix-tab]</code> + <code>[data-pix-panel]</code> | ARIA tabs, panels, keyboard navigation |
| <code>[data-pix="modal"]</code> + <code>[data-pix-open]</code> + <code>[data-pix-close]</code> | Modal opening, focus trap, Escape, backdrop close |
| <code>[data-pix="dropdown"]</code> + <code>[data-pix-dropdown-trigger]</code> + <code>[data-pix-dropdown-menu]</code> | Menu, outside click, Arrow/Home/End/Escape |
| <code>[data-pix-tooltip]</code> | CSS-only tooltip |
| <code>data-pix-static</code> on a modal | Backdrop click no longer closes it |

Runtime events bubble from the component root:

- <code>pix:tab-change</code> with <code>{ value, index, tab, panel }</code>
- <code>pix:modal-open</code> / <code>pix:modal-close</code> with <code>{ modal, dialog }</code>
- <code>pix:dropdown-open</code> with <code>{ root, menu }</code>
- <code>pix:select</code> with <code>{ value, item, dropdown }</code>

---

# CSS-only primitives

| Class | Purpose |
| --- | --- |
| <code>.pix-btn</code> | Button, with tone/size/ghost/block modifiers |
| <code>.pix-panel</code> | Window-chrome card with optional titlebar and footer |
| <code>.pix-badge</code> / <code>.pix-tag</code> | Status chips and dashed tags |
| <code>.pix-input</code> / <code>.pix-textarea</code> / <code>.pix-select</code> | Form fields |
| <code>.pix-check</code> / <code>.pix-radio</code> / <code>.pix-switch</code> | Selection controls |
| <code>.pix-progress</code> | Segmented progress bar |
| <code>.pix-table</code> / <code>.pix-table-wrap</code> | Data table |
| <code>.pix-alert</code> | Inline alert |
| <code>.pix-avatar</code> | Pixel avatar |
| <code>.pix-code-block</code> / <code>.pix-code-inline</code> / <code>.pix-kbd</code> | Code and keyboard UI |
| <code>.pix-divider</code> / <code>.pix-stack</code> / <code>.pix-row</code> / <code>.pix-cluster</code> / <code>.pix-grid</code> | Lightweight layout helpers |
| <code>.pix-accordion</code> + <code>&lt;details&gt;</code> | Disclosure panels, no JS |
| <code>.pix-breadcrumb</code> | Breadcrumb trail with CSS separators |
| <code>.pix-pagination</code> | Page list with current/disabled states |
| <code>.pix-skeleton</code> | Loading placeholder (block/text/circle) |
| <code>.pix-slider</code> | Styled native range input |
| <code>.pix-segmented</code> | Radio-backed segmented control |

All classes are namespaced with <code>pix-</code> so they can sit alongside other
CSS systems without a global reset.
