/**
 * The site, for people who are not signed in (SPEC.md §41).
 *
 * assemora.com has no readers with accounts, and authorization denies by default
 * (SPEC.md §50), so this is a deliberate opening — and it opens exactly one thing.
 *
 * `pages.get` is the query Studio and the builder canvas use, and it cannot be the
 * public door: it accepts `mode=draft`, and a policy answering "may this actor read
 * pages" never sees which mode was asked for. A route can insist, because it writes
 * the filter itself — `status` published, and the *published* tree, never the draft
 * beside it.
 */
import { route } from '@assemora/http'
import { Page } from '@assemora/pages'
import { blockTree, emptyTree, string } from '@assemora/schema'

export const readPage = route.get('/site/pages/:slug', {
  description: 'The published tree of one page',
  tags: ['site'],
  params: { slug: string().min(1) },
  response: { slug: string(), title: string(), tree: blockTree() },
  errors: [{ code: 'NOT_FOUND', status: 404, description: 'No published page has that slug' }],
  handler: async ({ params }) => {
    const page = await Page.where('slug', params.slug).where('status', 'published').firstOrFail()

    // A page published and then unpublished keeps its tree; `status` is what decides,
    // and `?? emptyTree()` is the honest answer for one that has never been published.
    return { slug: page.slug, title: page.title, tree: page.publishedTree ?? emptyTree() }
  },
})

export const siteRoutes = [readPage] as const
