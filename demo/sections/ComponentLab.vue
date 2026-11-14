<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useToast } from '../../src/vue'
import type { PxDropdownDetail, PxTabItem } from '../../src/vue'
import CodeBlock from '../components/CodeBlock.vue'

const { toast } = useToast()

const activeTab = ref('design')
const tabs: PxTabItem[] = [
  { id: 'design', label: 'DESIGN', icon: '✦' },
  { id: 'code', label: 'CODE', icon: '⌘' },
  { id: 'a11y', label: 'A11Y', icon: '✓' }
]

const modalOpen = ref(false)
const view = ref('grid')
const density = ref('comfy')
const page = ref(3)
const volume = ref(64)
const quality = ref(3)
const openPanels = ref<string[]>(['a11y'])

const views = [
  { label: 'Grid', value: 'grid' },
  { label: 'List', value: 'list' },
  { label: 'Map', value: 'map' }
]
const densities = [
  { label: 'Compact', value: 'compact' },
  { label: 'Comfy', value: 'comfy' }
]
const crumbs = [
  { label: 'Suite', href: '#theming' },
  { label: 'Component lab', href: '#components' },
  { label: 'Navigation' }
]
const panelItems = [
  { id: 'a11y', label: 'Accessibility' },
  { id: 'theme', label: 'Theming' },
  { id: 'ship', label: 'Shipping' }
]
const form = reactive({
  name: 'Ada Lovelace',
  email: 'ada@pixelsmith.dev',
  role: 'engineer',
  terms: true,
  updates: true
})
const errors = reactive({ name: '', email: '' })

const roles = [
  { label: 'Engineer', value: 'engineer' },
  { label: 'Designer', value: 'designer' },
  { label: 'Pixel artisan', value: 'artisan' }
]

const submit = (): void => {
  errors.name = form.name.trim() ? '' : 'A handle is required.'
  errors.email = form.email.includes('@') ? '' : 'That email looks a little 8-bit.'
  if (errors.name || errors.email) {
    toast({
      tone: 'danger',
      title: 'Check the form',
      message: 'Two fields need another pass before launch.'
    })
    return
  }
  toast({
    tone: 'success',
    title: 'Account created',
    message: 'Welcome to the party, ' + (form.name.split(' ')[0] || 'friend') + '.'
  })
}

const demoToast = (): void => {
  toast({
    tone: 'success',
    title: 'Saved',
    message: 'Your pixel-perfect changes are live.',
    duration: 3200
  })
}

const onAction = (detail: PxDropdownDetail): void => {
  toast({
    tone: detail.value === 'delete' ? 'danger' : 'info',
    title: 'Action selected',
    message: 'Menu item: ' + detail.value,
    duration: 2200
  })
}

const deploy = (): void => {
  modalOpen.value = false
  toast({
    tone: 'success',
    title: 'Deploy queued',
    message: 'Build 0.2.0 is shipping to production.'
  })
}

const players = [
  { name: 'NOVA', initials: 'NV', role: 'RANGER', score: 9840, streak: '12x', tone: 'primary' as const, status: 'ONLINE' },
  { name: 'BYTE', initials: 'BT', role: 'MAGE', score: 8720, streak: '08x', tone: 'secondary' as const, status: 'ONLINE' },
  { name: 'ECHO', initials: 'EC', role: 'ROGUE', score: 7410, streak: '05x', tone: 'danger' as const, status: 'AWAY' },
  { name: 'GLITCH', initials: 'GL', role: 'TANK', score: 6980, streak: '03x', tone: 'success' as const, status: 'ONLINE' }
]
</script>

<template>
  <section id="components" class="demo-section">
    <div class="demo-shell">
      <div class="demo-section__head">
        <div>
          <p class="pix-eyebrow">THE COMPONENT LAB</p>
          <h2 class="pix-h1 demo-section__title" aria-label="Every control. Hand-cut.">
            EVERY CONTROL.<br />
            <span class="demo-text-accent">HAND-CUT.</span>
          </h2>
        </div>
        <div class="demo-section__meta">
          <span class="pix-badge pix-badge--primary pix-badge--lg">22 VUE COMPONENTS</span>
          <span class="pix-badge pix-badge--outline pix-badge--lg">CSS PRIMITIVES</span>
          <p>Every state below is live. Click, type, open, and poke at it.</p>
        </div>
      </div>

      <div class="demo-lab">
        <!-- 01 BUTTONS -->
        <div class="demo-cell demo-cell--7">
          <PxPanel title="01 / BUTTONS">
            <template #actions>
              <span class="pix-badge pix-badge--secondary">CORE</span>
            </template>

            <div class="demo-lab__block">
              <span class="demo-label">TONES</span>
              <div class="pix-cluster">
                <PxButton>PRIMARY</PxButton>
                <PxButton tone="secondary">SECONDARY</PxButton>
                <PxButton tone="success">SUCCESS</PxButton>
                <PxButton tone="danger">DANGER</PxButton>
                <PxButton tone="ghost">GHOST</PxButton>
              </div>
            </div>

            <div class="demo-lab__block">
              <span class="demo-label">SIZES &amp; STATES</span>
              <div class="pix-cluster">
                <PxButton size="sm">SMALL</PxButton>
                <PxButton>DEFAULT</PxButton>
                <PxButton size="lg" tone="secondary">LARGE</PxButton>
                <PxButton loading>LOADING</PxButton>
                <PxButton disabled>DISABLED</PxButton>
                <PxButton icon-only aria-label="Favorite">
                  <template #icon>★</template>
                </PxButton>
              </div>
            </div>

            <div class="demo-lab__block">
              <span class="demo-label">BADGES &amp; PIXEL DETAIL</span>
              <div class="pix-cluster">
                <PxBadge dot>DEFAULT</PxBadge>
                <PxBadge tone="secondary" dot>VUE 3</PxBadge>
                <PxBadge tone="success" live>LIVE</PxBadge>
                <PxBadge tone="danger">HOT</PxBadge>
                <PxBadge tone="warning" outline>BETA</PxBadge>
              </div>
            </div>

            <div class="demo-callout">
              <span class="demo-callout__mark" aria-hidden="true">!</span>
              <p>
                Hard borders, stepped shadows, and a 3px focus ring. Buttons move
                on press — never on a bouncy cubic-bezier.
              </p>
            </div>
          </PxPanel>
        </div>

        <!-- 02 FORMS -->
        <div class="demo-cell demo-cell--5">
          <PxPanel title="02 / FORMS">
            <template #actions>
              <span class="pix-badge pix-badge--primary">LIVE</span>
            </template>

            <form class="demo-form" novalidate @submit.prevent="submit">
              <PxInput
                v-model="form.name"
                label="Player handle"
                placeholder="e.g. Ada"
                :error="errors.name"
                required
              />
              <PxInput
                v-model="form.email"
                label="Email"
                type="email"
                placeholder="you@example.dev"
                :error="errors.email"
                hint="We only send patch notes. Promise."
                required
              />
              <PxSelect
                v-model="form.role"
                label="Class"
                :options="roles"
                hint="Pick your loadout."
              />
              <div class="demo-form__checks">
                <PxCheckbox v-model="form.terms" label="I accept the pixel treaty" />
                <PxSwitch v-model="form.updates" label="Product updates" />
              </div>
              <PxButton type="submit" block>CREATE ACCOUNT</PxButton>
            </form>
          </PxPanel>
        </div>

        <!-- 03 TABS -->
        <div class="demo-cell demo-cell--7">
          <PxPanel title="03 / TABS">
            <template #actions>
              <span class="pix-badge pix-badge--outline">KEYBOARD READY</span>
            </template>

            <PxTabs v-model="activeTab" :tabs="tabs" aria-label="Component details">
              <template #panel-design>
                <div class="demo-tab-copy">
                  <p class="pix-text">
                    Tabs are roving-tabindex widgets. Arrow keys move, Home and End
                    jump to the edges, and panels keep their state while hidden.
                  </p>
                  <div class="pix-cluster">
                    <PxBadge tone="secondary">ARIA TABLIST</PxBadge>
                    <PxBadge tone="success">ROVING FOCUS</PxBadge>
                    <PxBadge tone="warning">STATE PRESERVED</PxBadge>
                  </div>
                </div>
              </template>

              <template #panel-code>
                <CodeBlock label="PXTABS.VUE">
                  <span class="tok-key">const</span> tabs = [
                    { id: <span class="tok-str">'design'</span>, label: <span class="tok-str">'DESIGN'</span> },
                    { id: <span class="tok-str">'code'</span>, label: <span class="tok-str">'CODE'</span> }
                  ]
                </CodeBlock>
              </template>

              <template #panel-a11y>
                <ul class="demo-checklist">
                  <li><span aria-hidden="true">✓</span> Arrow, Home and End navigation</li>
                  <li><span aria-hidden="true">✓</span> <code>aria-selected</code> and panel wiring</li>
                  <li><span aria-hidden="true">✓</span> Visible 3px focus ring</li>
                </ul>
              </template>
            </PxTabs>
          </PxPanel>
        </div>

        <!-- 04 FEEDBACK -->
        <div class="demo-cell demo-cell--5">
          <PxPanel title="04 / FEEDBACK">
            <template #actions>
              <span class="pix-badge pix-badge--success">STATUS</span>
            </template>

            <div class="demo-feedback">
              <PxProgress :value="68" label="BUILD PROGRESS" show-value />
              <PxProgress :value="32" tone="secondary" label="TEST COVERAGE" show-value />
              <PxProgress indeterminate tone="warning" label="COMPILING PIXELS" />
            </div>

            <PxAlert tone="success" title="Build complete">
              All 22 components compiled with zero warnings.
            </PxAlert>
            <PxAlert tone="danger" title="One tiny problem">
              Round corners detected in a third-party stylesheet.
            </PxAlert>

            <div class="demo-loader-line">
              <span class="pix-loader" aria-hidden="true">
                <span></span><span></span><span></span>
              </span>
              <span>LOADING STATE</span>
            </div>
          </PxPanel>
        </div>

        <!-- 05 OVERLAYS -->
        <div class="demo-cell demo-cell--5">
          <PxPanel title="05 / OVERLAYS">
            <template #actions>
              <span class="pix-badge pix-badge--danger">INTERACTIVE</span>
            </template>

            <div class="demo-overlay-stack">
              <div class="pix-cluster">
                <PxButton @click="modalOpen = true">OPEN MODAL</PxButton>
                <PxButton tone="secondary" @click="demoToast">TOAST ME</PxButton>
              </div>

              <PxDropdown label="ACTIONS" @select="onAction">
                <div class="pix-menu__label">FILE</div>
                <button type="button" class="pix-menu__item" data-pix-value="duplicate">
                  <span class="pix-menu__item-icon" aria-hidden="true">⧉</span>
                  Duplicate
                  <span class="pix-menu__shortcut">⌘D</span>
                </button>
                <button type="button" class="pix-menu__item" data-pix-value="rename">
                  <span class="pix-menu__item-icon" aria-hidden="true">✎</span>
                  Rename
                </button>
                <div class="pix-menu__separator"></div>
                <button type="button" class="pix-menu__item pix-menu__item--danger" data-pix-value="delete">
                  <span class="pix-menu__item-icon" aria-hidden="true">×</span>
                  Delete
                </button>
              </PxDropdown>

              <span class="demo-tooltip-anchor" data-pix-tooltip="Tooltip: all CSS, no JS required" data-pix-tooltip-pos="bottom">
                <PxButton tone="ghost" size="sm">HOVER FOR TOOLTIP</PxButton>
              </span>
            </div>

            <p class="pix-text pix-text--sm pix-text--mute demo-overlay-note">
              Modal focuses, traps tab, restores focus, closes on Escape and locks
              the page. Toasts stack, pause on hover, and get out of the way.
            </p>
          </PxPanel>
        </div>

        <!-- 06 TABLE -->
        <div class="demo-cell demo-cell--7">
          <PxPanel title="06 / DATA GRID" flush>
            <template #actions>
              <span class="pix-badge pix-badge--outline">SORTED BY SCORE</span>
            </template>

            <div class="pix-table-wrap demo-table-wrap">
              <table class="pix-table pix-table--striped">
                <thead>
                  <tr>
                    <th scope="col">PLAYER</th>
                    <th scope="col">CLASS</th>
                    <th scope="col" class="pix-table__num">SCORE</th>
                    <th scope="col" class="pix-table__num">STREAK</th>
                    <th scope="col">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="player in players" :key="player.name">
                    <td>
                      <span class="demo-player">
                        <PxAvatar size="sm" :tone="player.tone" :initials="player.initials" />
                        <strong>{{ player.name }}</strong>
                      </span>
                    </td>
                    <td><span class="pix-tag">{{ player.role }}</span></td>
                    <td class="pix-table__num">{{ player.score.toLocaleString() }}</td>
                    <td class="pix-table__num">{{ player.streak }}</td>
                    <td>
                      <PxBadge
                        :tone="player.status === 'ONLINE' ? 'success' : 'warning'"
                        dot
                      >
                        {{ player.status }}
                      </PxBadge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </PxPanel>
        </div>

        <!-- 07 NAVIGATION & DISCLOSURE -->
        <div class="demo-cell demo-cell--7">
          <PxPanel title="07 / NAVIGATION">
            <template #actions>
              <span class="pix-badge pix-badge--secondary">NEW IN 0.2</span>
            </template>

            <div class="demo-lab__block">
              <span class="demo-label">BREADCRUMB</span>
              <PxBreadcrumb :items="crumbs" />
            </div>

            <div class="demo-lab__block">
              <span class="demo-label">SEGMENTED CONTROL</span>
              <div class="pix-cluster">
                <PxSegmented v-model="view" :options="views" aria-label="View mode" />
                <PxSegmented v-model="density" :options="densities" size="sm" aria-label="Density" />
              </div>
            </div>

            <div class="demo-lab__block">
              <span class="demo-label">ACCORDION</span>
              <PxAccordion v-model="openPanels" :items="panelItems" exclusive>
                <template #panel-a11y>
                  <p class="pix-text pix-text--sm">
                    Built on native <code class="pix-code-inline">details</code> /
                    <code class="pix-code-inline">summary</code>, so the disclosure is
                    keyboard-operable and screen-reader friendly before any script runs.
                  </p>
                </template>
                <template #panel-theme>
                  <p class="pix-text pix-text--sm">
                    Panels inherit the same tokens as every other surface — border,
                    shadow size, and label type all follow the theme.
                  </p>
                </template>
                <template #panel-ship>
                  <p class="pix-text pix-text--sm">
                    Exclusive mode is wired through the native
                    <code class="pix-code-inline">name</code> attribute, with a script
                    fallback for browsers that ignore it.
                  </p>
                </template>
              </PxAccordion>
            </div>

            <div class="demo-lab__block">
              <span class="demo-label">PAGINATION</span>
              <PxPagination v-model="page" :pages="24" aria-label="Result pages" />
            </div>
          </PxPanel>
        </div>

        <!-- 08 LOADING & RANGE -->
        <div class="demo-cell demo-cell--5">
          <PxPanel title="08 / LOADING &amp; RANGE">
            <template #actions>
              <span class="pix-badge pix-badge--warning">NEW IN 0.2</span>
            </template>

            <div class="demo-lab__block">
              <span class="demo-label">SKELETON</span>
              <div class="demo-skeleton-card">
                <PxSkeleton variant="circle" label="Loading profile" />
                <div class="demo-skeleton-copy">
                  <PxSkeleton variant="text" :lines="3" />
                </div>
              </div>
            </div>

            <div class="demo-lab__block">
              <span class="demo-label">SLIDER</span>
              <PxSlider
                v-model="volume"
                label="Output volume"
                hint="Native range input, styled only."
                show-value
                :format="(value: number) => value + '%'"
              />
              <PxSlider
                v-model="quality"
                label="Pixel density"
                :min="1"
                :max="5"
                :step="1"
                show-value
              />
            </div>
          </PxPanel>
        </div>
      </div>
    </div>

    <PxModal v-model="modalOpen" title="DEPLOY BUILD" size="sm" aria-label="Deploy build">
      <div class="demo-modal">
        <p class="pix-text">
          Ready to ship <strong>PixelSmith UI 0.2.0</strong> to production?
        </p>
        <PxAlert tone="warning" title="Heads up">
          This build contains 22 components, 1 stylesheet, and absolutely no
          rounded corners.
        </PxAlert>
        <div class="demo-modal__meta">
          <span>BUILD</span><code>0.2.0</code>
          <span>ASSETS</span><code>4 files</code>
          <span>TARGET</span><code>production</code>
        </div>
      </div>
      <template #footer>
        <PxButton tone="ghost" @click="modalOpen = false">CANCEL</PxButton>
        <PxButton tone="success" @click="deploy">DEPLOY NOW</PxButton>
      </template>
    </PxModal>
  </section>
</template>
