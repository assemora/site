/**
 * The application (SPEC.md §9).
 *
 * Un-booted, because `src/server.ts` serves it and `assemora.config.ts` hands it to
 * the CLI, and neither should get the other's (ADR-0021).
 */
import { join } from 'node:path'

import { auth } from '@assemora/auth'
import { createMemoryAdapter, type DatabaseAdapter } from '@assemora/database'
import { postgres } from '@assemora/database-postgres'
import { pages } from '@assemora/pages'
import { studioAssets } from '@assemora/studio/assets'
import { type AssemoraApplication, assemora } from 'assemora'

import { siteBlocks } from './blocks.ts'
import { ENV_FILE } from './env.ts'
import { site } from './site.ts'

// Node does not read `.env` on its own, and the CLI reaches this file through
// `assemora.config.ts`, so loading it here is what makes one `.env` serve the server
// and every `assemora db:*` command alike.
try {
  process.loadEnvFile(ENV_FILE)
} catch {
  // There is no .env, which is the ordinary case.
}

/** Where this site's content lives, or `undefined` when nowhere yet. */
export const databaseUrl = (): string | undefined => {
  const url = process.env.DATABASE_URL

  return url === undefined || url === '' ? undefined : url
}

/** PostgreSQL when `DATABASE_URL` says where, and otherwise in memory — out loud. */
const database = (): DatabaseAdapter => {
  const url = databaseUrl()

  if (url !== undefined) return postgres({ url })

  console.warn(
    'DATABASE_URL is not set: this site is running on an in-memory database, and ' +
      'everything in it disappears when the process restarts.',
  )

  return createMemoryAdapter()
}

export const createApp = (): AssemoraApplication =>
  assemora({
    database: database(),
    modules: [auth(), pages({ blocks: [...siteBlocks] }), site()],
    project: {
      name: 'assemora-site',
      version: '0.0.0',
      description: 'assemora.com',
    },
    /**
     * The three languages the site is written in (SPEC.md §131).
     *
     * A deployment fact rather than a page's: `/uk` is stripped before routing, so
     * every route stays declared once and the Ukrainian site is the same site read in
     * Ukrainian. Studio's own language is a separate control (ADR-0030).
     */
    locales: ['en', 'uk', 'ru'],
    defaultLocale: 'en',
    studio: { root: studioAssets() },
    mcp: true,
    /**
     * The bundle `pnpm build` writes, served at the origin root.
     *
     * `/preview` is the default and the right one for an example, whose frontend is
     * something Studio frames. This one is a site people are handed the address of,
     * and `assemora.com/preview` is not an address anybody should be handed. The API
     * keeps its own prefix, so its routes stay more specific than the catch-all this
     * registers — which is the precedence the option's own documentation warns about.
     */
    frontend: { root: join(import.meta.dirname, '../app/dist'), path: '/' },
  })
