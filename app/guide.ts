/**
 * The guide, read at build time.
 *
 * The Markdown is the framework's and is the one copy of it: nothing here holds a
 * title, an order or a summary the pages do not already carry, so a chapter added to
 * `docs/guide/` upstream appears in the navigation here with no edit at all.
 *
 * Adapted from `apps/docs/src/guide.ts` in the framework repository, which renders the
 * same pages for the same reasons. The differences are this site's: paths rather than
 * hash fragments, because these pages are served at real addresses and a reader should
 * be able to link to one.
 */
import { Marked, type Token } from 'marked'

/** Every page, inlined into the bundle by `app/copy-guide.mjs`. */
const sources = import.meta.glob('./guide/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Readonly<Record<string, string>>

export type Page = {
  /** `03-models`, or `README` for the contents. */
  readonly slug: string
  /** The first `# ` heading, less its number. */
  readonly title: string
  /** `03` for `03-models.md`, and `undefined` for the contents. */
  readonly number: string | undefined
  readonly html: string
}

/** Where the guide is served. */
export const DOCS = '/docs'

const REPOSITORY = 'https://github.com/assemora/assemora'

/** Where the guide sits upstream. Links out of it are resolved from here. */
const GUIDE = 'docs/guide/'

const slugOf = (path: string): string => (path.split('/').at(-1) ?? path).replace(/\.md$/, '')

const slugs = new Set(Object.keys(sources).map(slugOf))

/** The address of one page on this site. The contents page is the section root. */
export const hrefOf = (slug: string): string => (slug === 'README' ? DOCS : `${DOCS}/${slug}`)

/**
 * What a link in the Markdown becomes here.
 *
 * The pages are written to be read in a checkout too, so their links are repository
 * paths. A link to another page of the guide becomes an address on this site; anything
 * else relative — `../adr/`, `../../SPEC.md` — is a real file this site does not hold,
 * so it goes to the repository rather than to a 404.
 */
export const hrefFor = (href: string): string => {
  if (href === '' || href.startsWith('#') || href.startsWith('//') || /^[a-z]+:/i.test(href)) {
    return href
  }

  const [path = '', fragment] = href.split('#')
  const suffix = fragment === undefined ? '' : `#${fragment}`
  const named = path.replace(/\.md$/, '')

  if (slugs.has(named) && !path.includes('/')) return `${hrefOf(named)}${suffix}`

  // Resolved against the guide's own directory, so `../../SPEC.md` lands at the root.
  const resolved = new URL(path, `https://assemora.invalid/${GUIDE}`).pathname.slice(1)

  return `${REPOSITORY}/${resolved.endsWith('/') ? 'tree' : 'blob'}/main/${resolved}${suffix}`
}

/**
 * One renderer, configured once.
 *
 * `walkTokens` rewrites the href on the token rather than in the emitted HTML, so the
 * default renderer still does the escaping — a regular expression over finished HTML
 * is the version of this that eventually mangles a code sample.
 */
const markdown = new Marked({
  walkTokens: (token: Token): void => {
    if (token.type === 'link') token.href = hrefFor(token.href)
  },
})

/** `# 3. Models` and `# Models` both read as "Models". */
const titleOf = (source: string, slug: string): string =>
  (/^#\s+(.+)$/m.exec(source)?.[1] ?? slug).replace(/^\d+\.\s*/, '').trim()

const toPage = (path: string, source: string): Page => {
  const slug = slugOf(path)

  return {
    slug,
    title: titleOf(source, slug),
    number: /^(\d+)-/.exec(slug)?.[1],
    // Stated rather than assumed: `parse` answers with a promise when an extension asks
    // it to, and a page is rendered during a render.
    html: markdown.parse(source, { async: false }),
  }
}

const pages: readonly Page[] = Object.entries(sources)
  .map(([path, source]) => toPage(path, source))
  // The file names carry the order, which is why they are numbered.
  .sort((left, right) => left.slug.localeCompare(right.slug))

/** The table of contents: `README.md`. */
export const contents: Page | undefined = pages.find((page) => page.slug === 'README')

/** The numbered pages, in order — what the navigation lists and what next/previous walk. */
export const chapters: readonly Page[] = pages.filter((page) => page.number !== undefined)

/** The page an address names, or nothing. `/docs` itself is the contents. */
export const pageAt = (pathname: string): Page | undefined => {
  const rest = pathname.replace(/^\/+|\/+$/g, '').split('/').slice(1)
  const slug = rest[0]

  if (slug === undefined || slug === '') return contents

  return pages.find((page) => page.slug === slug && page.slug !== 'README')
}

/** Where a page sits in the walk, so a reader is never handed a dead end. */
export const neighbours = (
  page: Page,
): { readonly previous: Page | undefined; readonly next: Page | undefined } => {
  const index = chapters.findIndex((chapter) => chapter.slug === page.slug)

  if (index < 0) return { previous: undefined, next: chapters[0] }

  return { previous: chapters[index - 1], next: chapters[index + 1] }
}
