/**
 * Boot, seed, listen (SPEC.md §79).
 *
 * `assemora start` runs this file, so anything unconditional here happens on the first
 * boot of a deployment. Creating an administrator is therefore guarded: the in-memory
 * fallback is throwaway and unreachable from outside this process, so it seeds itself;
 * a real database is seeded by `pnpm seed`, deliberately, once.
 */
import { User } from '@assemora/auth'

import { createApp, databaseUrl } from './app.ts'
import { seed } from './seed.ts'

const app = createApp()

await app.boot()

// The in-memory fallback is throwaway, so it seeds itself. A real database is seeded
// by `pnpm seed`, which the deployment runs once before traffic moves — the content of
// this site *is* its seed, so a deployment that skipped it would serve nothing, but a
// boot is the wrong place to write a hundred rows and a health check the wrong thing
// to keep waiting on it.
if (databaseUrl() === undefined) await seed(app.app)
else if ((await User.count()) === 0) {
  console.warn('This database is empty. `pnpm seed` writes the site and its administrator.')
}

const address = await app.listen()

console.log(`listening on ${address}`)
console.log(`  site     ${address}/`)
console.log(`  studio   ${address}/studio`)
console.log(`  public   ${address}/api/site/pages/home`)
