import { chromium } from 'playwright'

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173'
const failures = []
const checks = []

const check = (name, condition, detail = '') => {
  checks.push({ name, ok: Boolean(condition), detail })
  if (!condition) failures.push(name + (detail ? ': ' + detail : ''))
}

const browser = await chromium.launch()
const context = await browser.newContext()

const attachErrors = (page) => {
  const errors = []
  page.on('pageerror', (error) => errors.push('pageerror: ' + error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push('console: ' + message.text())
  })
  return errors
}

// 1. Responsive containment on the Vue showcase
for (const width of [320, 390, 768, 1024, 1440]) {
  const page = await context.newPage()
  const errors = attachErrors(page)
  await page.setViewportSize({ width, height: 900 })
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)

  const metrics = await page.evaluate(() => {
    const install = document.querySelector('.demo-install')?.getBoundingClientRect()
    return {
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      installRight: install?.right ?? 0,
      installVisible: install ? install.right <= window.innerWidth + 1 : false
    }
  })
  check('no page-level horizontal overflow at ' + width + 'px', metrics.scrollWidth <= metrics.innerWidth + 1, JSON.stringify(metrics))
  check('install command stays in the viewport at ' + width + 'px', metrics.installVisible, JSON.stringify(metrics))
  check('no runtime console errors at ' + width + 'px', errors.length === 0, errors.join('; '))
  await page.close()
}

// 2. Main demo interactions
{
  const page = await context.newPage()
  const errors = attachErrors(page)
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)

  await page.getByRole('button', { name: 'OPEN MODAL' }).click()
  await page.waitForTimeout(180)
  const modal = await page.evaluate(() => {
    const root = document.querySelector('.pix-modal.is-open')
    return {
      open: Boolean(root),
      focusInside: Boolean(root?.contains(document.activeElement)),
      bodyLocked: document.body.classList.contains('pix-modal-open'),
      title: root?.querySelector('.pix-panel__title')?.textContent?.trim()
    }
  })
  check('Vue modal opens', modal.open)
  check('Vue modal receives focus', modal.focusInside, JSON.stringify(modal))
  check('Vue modal locks page scroll', modal.bodyLocked)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(160)
  const modalClosed = await page.evaluate(() => !document.querySelector('.pix-modal.is-open'))
  check('Vue modal closes on Escape', modalClosed)

  await page.getByRole('tab', { name: 'CODE' }).click()
  check('tabs switch panels', (await page.locator('.pix-tab[aria-selected="true"]').innerText()).includes('CODE'))

  await page.getByRole('button', { name: 'TOAST ME' }).click()
  await page.waitForTimeout(120)
  check('toast is created', (await page.locator('.pix-toast').count()) > 0)

  const dropdown = page.locator('.demo-overlay-stack .pix-dropdown')
  await dropdown.locator('button.pix-btn').click()
  check('Vue dropdown opens', await dropdown.locator('.pix-menu').isVisible())
  await dropdown.locator('[data-pix-value="duplicate"]').click()
  await page.waitForTimeout(100)
  check('Vue dropdown closes after selection', !(await dropdown.locator('.pix-menu').isVisible()))

  await page.getByRole('button', { name: 'Switch to light theme' }).click()
  await page.waitForTimeout(100)
  check('theme toggle switches to light', (await page.evaluate(() => document.documentElement.dataset.pixTheme)) === 'light')
  check('no runtime console errors on the showcase', errors.length === 0, errors.join('; '))
  await page.close()
}

// 3. Standalone interactions
{
  const page = await context.newPage()
  const errors = attachErrors(page)
  await page.setViewportSize({ width: 1200, height: 900 })
  await page.goto(base + '/examples/standalone.html', { waitUntil: 'networkidle' })

  const api = await page.evaluate(() => ({
    mounted: typeof window.PixelUI?.mount === 'function',
    toast: typeof window.PixelUI?.toast === 'function'
  }))
  check('standalone API is exposed', api.mounted && api.toast, JSON.stringify(api))

  await page.getByRole('tab', { name: 'TWO' }).click()
  const tabState = await page.evaluate(() => ({
    selected: document.querySelector('.pix-tab[aria-selected="true"]')?.textContent?.trim(),
    visible: !document.querySelector('[data-pix-panel="two"]')?.hidden
  }))
  check('standalone tabs switch', tabState.selected === 'TWO' && tabState.visible, JSON.stringify(tabState))

  await page.locator('#callsign').fill('')
  await page.locator('#signal-form button[type=submit]').click()
  check('standalone form validation marks invalid', (await page.locator('#callsign').getAttribute('aria-invalid')) === 'true')

  const vanillaMenu = page.locator('.pix-menu')
  check('standalone dropdown starts closed', !(await vanillaMenu.isVisible()))
  await page.locator('[data-pix-dropdown-trigger]').click()
  check('standalone dropdown opens', await vanillaMenu.isVisible())
  await page.locator('[data-pix-value="boost"]').click()
  await page.waitForTimeout(100)
  check('standalone dropdown emits a toast', (await page.locator('.pix-toast').count()) > 0)

  await page.locator('#theme-toggle').click()
  check('standalone theme toggle works', (await page.evaluate(() => document.documentElement.dataset.pixTheme)) === 'light')

  await page.locator('[data-pix-open="vanilla-modal"]').click()
  await page.waitForTimeout(180)
  const focusInside = await page.evaluate(() => document.querySelector('#vanilla-modal')?.contains(document.activeElement))
  check('standalone modal receives focus', focusInside)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(120)
  check('standalone modal closes on Escape', await page.evaluate(() => !document.querySelector('#vanilla-modal')?.classList.contains('is-open')))
  check('no runtime console errors on the standalone page', errors.length === 0, errors.join('; '))
  await page.close()
}

// 4. Built Vue UMD global
{
  const page = await context.newPage()
  const errors = attachErrors(page)
  await page.setContent('<div id="app"></div>')
  await page.addStyleTag({ path: 'dist/pixelsmith.css' })
  await page.addScriptTag({ path: 'node_modules/vue/dist/vue.global.prod.js' })
  await page.addScriptTag({ path: 'dist/pixelsmith-vue.js' })
  const umd = await page.evaluate(() => {
    const plugin = window.PixelSmithVue?.default || window.PixelSmithVue
    const app = window.Vue.createApp({
      template: '<PxButton tone="danger">SHIP IT</PxButton>'
    })
    app.use(plugin)
    app.mount('#app')
    const button = document.querySelector('.pix-btn')
    return {
      text: button?.textContent?.trim(),
      background: button ? getComputedStyle(button).backgroundColor : ''
    }
  })
  check('Vue UMD global renders a component', umd.text === 'SHIP IT', JSON.stringify(umd))
  check('Vue UMD CSS is applied', umd.background === 'rgb(255, 93, 143)', JSON.stringify(umd))
  check('no runtime console errors in UMD smoke test', errors.length === 0, errors.join('; '))
  await page.close()
}

await browser.close()

const report = {
  passed: checks.filter((item) => item.ok).length,
  failed: failures.length,
  checks,
  failures
}

console.log(JSON.stringify(report, null, 2))
if (failures.length) process.exitCode = 1
