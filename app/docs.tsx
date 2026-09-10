/**
 * The guide, at `/docs` (SPEC.md §57).
 *
 * Not a second site. It is drawn inside the same `Chrome` the landing page uses, in the
 * same theme tokens, with the same faces — because a documentation site that looks
 * like a different product is how a reader learns to distrust the one they came from.
 *
 * The pages are Markdown from the installed framework (`guide.ts`), so what is
 * published here is the guide for the version this site runs. Nothing about them is
 * held in the CMS: the guide is the framework's to write, and a page assembled from
 * blocks would be a second copy of it, drifting.
 *
 * There is no router. The site's bundle already reads `location.pathname` to find the
 * language; this reads it to find the chapter, and every link is an ordinary anchor —
 * so a reader may link to a page, open one in a new tab, and use the back button. The
 * server serves this bundle for every path under `/docs`, which is what makes those
 * addresses real rather than fragments.
 */
import { Chrome } from './site.tsx'
import { chapters, contents, DOCS, hrefOf, neighbours, type Page, pageAt } from './guide.ts'

const Sidebar = ({ current }: { readonly current: Page }) => (
  <nav className="docs-nav" aria-label="Guide">
    <a
      className={current.slug === 'README' ? 'docs-link is-current' : 'docs-link'}
      href={DOCS}
      aria-current={current.slug === 'README' ? 'page' : undefined}
    >
      Contents
    </a>

    <ol className="docs-chapters">
      {chapters.map((chapter) => (
        <li key={chapter.slug}>
          <a
            className={chapter.slug === current.slug ? 'docs-link is-current' : 'docs-link'}
            href={hrefOf(chapter.slug)}
            aria-current={chapter.slug === current.slug ? 'page' : undefined}
          >
            <span className="docs-number">{chapter.number}</span>
            {chapter.title}
          </a>
        </li>
      ))}
    </ol>
  </nav>
)

/**
 * Where to go next, and where the reader came from.
 *
 * The contents page is not in the walk, so from there the only way on is the first
 * chapter — which `neighbours` answers, rather than this drawing a dead end.
 */
const Walk = ({ current }: { readonly current: Page }) => {
  const { previous, next } = neighbours(current)

  if (previous === undefined && next === undefined) return null

  return (
    <div className="docs-walk">
      {previous === undefined ? (
        <span />
      ) : (
        <a className="docs-step" href={hrefOf(previous.slug)}>
          <span className="docs-step-label">Previous</span>
          {previous.title}
        </a>
      )}

      {next !== undefined && (
        <a className="docs-step is-next" href={hrefOf(next.slug)}>
          <span className="docs-step-label">Next</span>
          {next.title}
        </a>
      )}
    </div>
  )
}

/**
 * An address under `/docs` that names no chapter.
 *
 * A 200 with an explanation rather than the contents page silently: the reader typed
 * or followed something, and being moved without being told is how a broken link
 * survives — nobody reports what looked like it worked.
 */
const Missing = ({ pathname }: { readonly pathname: string }) => (
  <article className="docs-page prose">
    <h1>No such page</h1>
    <p>
      The guide has nothing at <code>{pathname}</code>. The contents are{' '}
      <a href={DOCS}>at the top of the guide</a>, and every chapter is listed beside this.
    </p>
  </article>
)

export const Docs = ({ pathname }: { readonly pathname: string }) => {
  const page = pageAt(pathname)
  const current = page ?? contents

  return (
    <Chrome locale="en" away>
      <div className="docs">
        {current !== undefined && <Sidebar current={current} />}

        <div className="docs-body">
          {page === undefined || current === undefined ? (
            <Missing pathname={pathname} />
          ) : (
            <>
              {/* The Markdown is the framework's own, rendered at build time by
                  `marked` with its escaping intact — nothing here comes from a
                  request, a query string or the database. */}
              <article
                className="docs-page prose"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: build-time Markdown from the installed package, never input.
                dangerouslySetInnerHTML={{ __html: page.html }}
              />
              <Walk current={page} />
            </>
          )}
        </div>
      </div>
    </Chrome>
  )
}
