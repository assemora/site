/**
 * The entry document, for both audiences (SPEC.md §59).
 *
 * The origin root is the site: it reads the language from the path and the slug from
 * `?slug=` (or `home`) through the public route. `?page=<id>&editing=1&editor=<origin>`
 * is the builder canvas: it reads the draft through the authorized query and holds up
 * one end of the canvas protocol — `useCanvasFrame`, from `@assemora/react`, which
 * every Assemora frame shares rather than writing out again.
 *
 * One bundle, one renderer, one set of block views. That is what makes the preview
 * accurate rather than approximate.
 */
import { useCanvasFrame } from '@assemora/react'
import type { BlockTree } from '@assemora/schema'
import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

import { localeFromPath, readForEditor, readPublished, Site } from './site.tsx'
import './theme.css'

const parameters = new URLSearchParams(location.search)
const pageId = parameters.get('page') ?? ''
const slug = parameters.get('slug') ?? 'home'
const mode = parameters.get('mode') === 'draft' ? 'draft' : 'published'
const editing = parameters.get('editing') === '1'
const locale = localeFromPath(location.pathname)

/**
 * The one window this frame will talk to. A page anybody may embed must not take
 * instructions from whoever embedded it, nor broadcast what it is showing.
 */
const editor = parameters.get('editor') ?? ''

const Page = () => {
  const [tree, setTree] = useState<BlockTree>({ blocks: [] })
  const [failure, setFailure] = useState<string>()

  useCanvasFrame({ editing, editor, tree, render: setTree })

  useEffect(() => {
    const first = pageId === '' ? readPublished(slug, locale) : readForEditor(pageId, mode)

    first
      .then(setTree)
      .catch((error: unknown) => setFailure(error instanceof Error ? error.message : String(error)))
  }, [])

  if (failure !== undefined) return <p className="missing">{failure}</p>

  return <Site tree={tree} locale={locale} editing={editing} />
}

const container = document.querySelector('#site')

if (container === null) throw new Error('index.html needs a #site element to render into')

/**
 * Which of the two things this bundle is, decided by the address.
 *
 * The application serves this document for everything it does not answer itself, so
 * `/docs` and `/docs/03-models` arrive here exactly as `/` and `/uk` do.
 *
 * Never in the builder canvas. Studio frames this to edit a page and names one by id —
 * a canvas that answered with the guide because the frame's path happened to start with
 * `/docs` would be an editor showing documentation instead of the page.
 */
const isGuide = !editing && /^\/docs(?:\/|$)/.test(location.pathname)

/**
 * The guide is imported only where it is read.
 *
 * Its pages are rendered into the bundle at build time, which is what makes a chapter
 * appear with no request and no loading state — and it is 220 kB. Imported at the top
 * of this file it doubled the download for every visitor to the landing page, none of
 * whom asked for documentation. A dynamic import puts it in a chunk of its own, so the
 * cost is paid by the readers who followed the link and by nobody else.
 */
const root = createRoot(container)

if (isGuide) {
  const { Docs } = await import('./docs.tsx')

  root.render(
    <StrictMode>
      <Docs pathname={location.pathname} />
    </StrictMode>,
  )
} else {
  root.render(
    <StrictMode>
      <Page />
    </StrictMode>,
  )
}
