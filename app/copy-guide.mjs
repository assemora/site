/**
 * `node_modules/assemora/guide/` → `app/guide/`, run before the bundle is built.
 *
 * The guide is the framework's, written beside the code it documents and shipped in
 * the framework's own tarball. This site renders it, which means it needs the Markdown
 * where `import.meta.glob` can see it: a literal, relative path, resolved at build
 * time. Globbing into `node_modules` works and is a promise about somebody else's
 * directory layout, so the pages are copied to a path this repository owns instead.
 *
 * `app/guide/` is machine-made and gitignored. Editing a page here edits nothing: the
 * guide lives in `assemora/assemora`, at `docs/guide/`.
 *
 * Because the pages come from the installed package rather than from that repository's
 * main branch, what this site publishes is the guide for **the version it runs**.
 */
import { cp, mkdir, readdir, rm } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const from = resolve(process.argv[2] ?? join(here, '..', 'node_modules', 'assemora', 'guide'))
const to = resolve(process.argv[3] ?? join(here, 'guide'))

const pages = await readdir(from, { withFileTypes: true }).catch(() => {
  throw new Error(
    `No guide at ${from}. It ships inside the \`assemora\` package from 0.2.6 — ` +
      'run `pnpm install`, and check that the installed version is new enough.',
  )
})

const markdown = pages
  .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
  .map((entry) => entry.name)
  .sort()

if (markdown.length === 0) throw new Error(`No Markdown in ${from}: nothing to render.`)

await rm(to, { recursive: true, force: true })
await mkdir(to, { recursive: true })

for (const page of markdown) await cp(join(from, page), join(to, page))

console.log(`Guide: ${markdown.length} pages from ${from}`)
