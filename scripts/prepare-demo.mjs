import { cp, mkdir, rm } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = process.cwd()
const demo = resolve(root, 'demo-dist')

// Make the standalone example available inside the built demo:
// /examples/standalone.html loads ../dist/pixelsmith.{css,js}
await mkdir(resolve(demo, 'examples'), { recursive: true })
await rm(resolve(demo, 'dist'), { recursive: true, force: true })
await cp(resolve(root, 'dist'), resolve(demo, 'dist'), { recursive: true })
await cp(
  resolve(root, 'examples/standalone.html'),
  resolve(demo, 'examples/standalone.html')
)

console.log('Prepared demo-dist/examples and demo-dist/dist')
