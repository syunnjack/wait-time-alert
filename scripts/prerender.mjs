import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'vite'

const ssrDir = path.resolve('dist-ssr')

await build({
  logLevel: 'warn',
  build: { ssr: 'src/entry-server.jsx', outDir: 'dist-ssr', emptyOutDir: true },
})

const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)
const indexPath = path.resolve('dist/index.html')
const html = await fs.readFile(indexPath, 'utf8')

if (!html.includes('<div id="root"></div>')) {
  throw new Error('prerender: <div id="root"></div> not found in dist/index.html')
}

await fs.writeFile(indexPath, html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`))
await fs.rm(ssrDir, { recursive: true, force: true })
