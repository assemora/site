/**
 * The module (SPEC.md §13).
 *
 * The blocks are not listed here: a block reaches the builder through
 * `pages({ blocks })` in `src/app.ts`, because it is the pages module that offers
 * them. This site stores nothing of its own — every word on it is a page — so the
 * module registers one public route and nothing else.
 */
import { module } from '@assemora/core'

import { siteRoutes } from './routes.ts'

export const site = () => module('site').routes(...siteRoutes)
