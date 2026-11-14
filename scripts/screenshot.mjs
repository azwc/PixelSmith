import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173'
const out = 'docs/screenshots'
await mkdir(out, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 })
const errors = []
page.on('console', (message) => {
  if (message.type() === 'error') errors.push('console: ' + message.text())
})
page.on('pageerror', (error) => errors.push('pageerror: ' + error.message))

await page.goto(base + '/', { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(500)

const metrics = await page.evaluate(() => ({
  title: document.title,
  width: window.innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  height: document.documentElement.scrollHeight,
  headings: Array.from(document.querySelectorAll('h1, h2')).slice(0, 8).map((el) => el.textContent?.trim().replace(/\s+/g, ' ')),
  buttons: document.querySelectorAll('button').length,
  fonts: getComputedStyle(document.body).fontFamily,
  fontLoaded: document.fonts.check('10px "Press Start 2P"')
}))

await page.screenshot({ path: out + '/desktop-hero.png' })
await page.screenshot({ path: out + '/desktop-full.png', fullPage: true })

// Modal state
await page.getByRole('button', { name: 'OPEN MODAL' }).click()
await page.waitForTimeout(250)
await page.screenshot({ path: out + '/desktop-modal.png' })
const modalVisible = await page.locator('.pix-modal.is-open').isVisible()
await page.keyboard.press('Escape')
await page.waitForTimeout(200)

// Theme toggle
await page.getByRole('button', { name: 'Switch to light theme' }).click()
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(350)
await page.screenshot({ path: out + '/desktop-light.png' })
const lightTheme = await page.evaluate(() => document.documentElement.dataset.pixTheme)
await page.getByRole('button', { name: 'Switch to dark theme' }).click()

// Vanilla page
await page.goto(base + '/examples/standalone.html', { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(300)
const vanilla = await page.evaluate(() => ({
  pixelUI: typeof window.PixelUI?.mount === 'function',
  toast: typeof window.PixelUI?.toast === 'function',
  tabs: document.querySelectorAll('[data-pix-tab]').length,
  modalAriaHidden: document.getElementById('vanilla-modal')?.getAttribute('aria-hidden')
}))
await page.screenshot({ path: out + '/standalone.png', fullPage: true })
await page.getByRole('button', { name: 'OPEN MODAL' }).click()
await page.waitForTimeout(200)
await page.screenshot({ path: out + '/standalone-modal.png' })

// Mobile pass
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
await mobile.goto(base + '/', { waitUntil: 'networkidle' })
await mobile.evaluate(() => document.fonts.ready)
await mobile.waitForTimeout(300)
const mobileMetrics = await mobile.evaluate(() => ({
  width: window.innerWidth,
  scrollWidth: document.documentElement.scrollWidth
}))
await mobile.screenshot({ path: out + '/mobile-hero.png' })
await mobile.screenshot({ path: out + '/mobile-full.png', fullPage: true })

const small = await browser.newPage({ viewport: { width: 320, height: 780 }, deviceScaleFactor: 1 })
await small.goto(base + '/', { waitUntil: 'networkidle' })
await small.evaluate(() => document.fonts.ready)
await small.waitForTimeout(250)
const smallMetrics = await small.evaluate(() => ({
  width: window.innerWidth,
  scrollWidth: document.documentElement.scrollWidth
}))
await small.screenshot({ path: out + '/mobile-320.png', fullPage: true })

await browser.close()

console.log(JSON.stringify({ metrics, modalVisible, lightTheme, vanilla, mobileMetrics, smallMetrics, errors }, null, 2))
