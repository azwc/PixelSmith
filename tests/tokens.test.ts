import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const stylesDir = resolve(dirname(fileURLToPath(import.meta.url)), '../src/styles')
const tokensCss = readFileSync(resolve(stylesDir, 'tokens.css'), 'utf8')

const componentDir = resolve(stylesDir, 'components')
const componentCss = readdirSync(componentDir)
  .filter((file) => file.endsWith('.css'))
  .map((file) => ({ file, css: readFileSync(resolve(componentDir, file), 'utf8') }))

const baseCss = readFileSync(resolve(stylesDir, 'base.css'), 'utf8')

const collect = (css: string, pattern: RegExp): string[] =>
  [...css.matchAll(pattern)].map((match) => match[1] as string)

const REQUIRED_TOKENS = [
  '--pix-fs-display-2xs',
  '--pix-fs-display-xs',
  '--pix-fs-display-sm',
  '--pix-fs-display-md',
  '--pix-fs-display-lg',
  '--pix-fs-display-xl',
  '--pix-fs-body-sm',
  '--pix-fs-body-md',
  '--pix-fs-body-lg',
  '--pix-fs-body-xl',
  '--pix-fs-label',
  '--pix-fs-ui',
  '--pix-fs-body',
  '--pix-fs-control',
  '--pix-fs-control-sm',
  '--pix-fs-control-lg',
  '--pix-leading-tight',
  '--pix-leading-snug',
  '--pix-leading-normal',
  '--pix-leading-display',
  '--pix-tracking-tight',
  '--pix-tracking-wide',
  '--pix-tracking-wider',
  '--pix-tracking-eyebrow',
  '--pix-icon-sm',
  '--pix-icon-md',
  '--pix-icon-lg',
  '--pix-control-sm',
  '--pix-control-md',
  '--pix-control-lg',
  '--pix-field-sm',
  '--pix-field-md',
  '--pix-field-lg'
]

describe('design tokens', () => {
  it('defines every documented type, leading, icon and control token', () => {
    const missing = REQUIRED_TOKENS.filter((token) => !new RegExp(token + ':').test(tokensCss))
    expect(missing).toEqual([])
  })

  it('keeps typography tokens out of the light theme block', () => {
    const start = tokensCss.indexOf("[data-pix-theme='light']")
    const lightBlock = tokensCss.slice(start, tokensCss.indexOf('/* ===', start))
    expect(lightBlock.length).toBeGreaterThan(0)
    expect(lightBlock).not.toMatch(/--pix-fs-/)
    expect(lightBlock).not.toMatch(/--pix-leading-/)
  })

  it('never hardcodes a pixel font size in component or base CSS', () => {
    const offenders: string[] = []
    for (const { file, css } of componentCss) {
      for (const match of css.match(/font-size:\s*[0-9.]+px/g) ?? []) offenders.push(file + ': ' + match)
    }
    for (const match of baseCss.match(/font-size:\s*[0-9.]+px/g) ?? []) offenders.push('base.css: ' + match)
    expect(offenders).toEqual([])
  })

  it('resolves every var(--pix-*) reference', () => {
    const definedInTokens = new Set(collect(tokensCss, /(--pix-[a-z0-9-]+)\s*:/g))
    const files = [
      { file: 'base.css', css: baseCss },
      ...componentCss
    ]
    const unresolved: string[] = []
    for (const { file, css } of files) {
      const local = new Set(collect(css, /(--pix-[a-z0-9-]+)\s*:/g))
      // A var() with an inline fallback is self-sufficient: it documents a
      // per-instance knob (stack gap, progress width, toast timer) rather than
      // an undefined token.
      for (const match of css.matchAll(/var\((--pix-[a-z0-9-]+)(\s*,)?/g)) {
        const name = match[1] as string
        if (match[2]) continue
        if (!definedInTokens.has(name) && !local.has(name)) unresolved.push(file + ': ' + name)
      }
    }
    expect(unresolved).toEqual([])
  })

  it('keeps the legacy size knobs working', () => {
    expect(tokensCss).toMatch(/--pix-font-size:\s*20px/)
    expect(tokensCss).toMatch(/--pix-fs-body:\s*var\(--pix-font-size\)/)
  })
})
