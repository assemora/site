/**
 * assemora.com, as content (SPEC.md §55, §131).
 *
 * Every word below arrives through the Command Bus, which is the whole reason this
 * file is worth reading: the site is not a template with the copy inlined, it is a
 * page tree an editor can open in Studio and an agent can propose a change to. The
 * seed is the first author, not a privileged one.
 *
 * Three languages, one tree. The English page is built block by block; `pages.translate`
 * then copies that tree — the blocks keep their ids — and `apply` writes the other
 * language's words into the same blocks. So a translation is the same page said
 * differently rather than a second page that happens to look similar, which is what
 * lets the fallback in §131 mean anything.
 *
 * Two things are deliberate. The password is never written here — it comes from
 * `ASSEMORA_SEED_PASSWORD`, and when the environment has none the seed generates one
 * and puts it in `.env`, because a credential printed on boot is a credential in
 * whatever keeps the logs. And the whole thing runs once, guarded on there being no
 * users: a deployment restarted is not a deployment reseeded.
 */
import { randomBytes } from 'node:crypto'
import { realpathSync } from 'node:fs'

import { hashPassword, Permission, Role, RolePermission, User, UserRole } from '@assemora/auth'
import type { Application } from '@assemora/core'
import { Page } from '@assemora/pages'
import type { BlockDesignPatch } from '@assemora/schema'

import { createApp } from './app.ts'
import { COPY, type Copy } from './content.ts'
import { remember } from './env.ts'

const ADMIN = 'admin@assemora.com'

/** The languages this deployment serves, beside the one it is written in first. */
const TRANSLATIONS = ['uk', 'ru'] as const

const seedPassword = async (): Promise<string> => {
  const declared = process.env.ASSEMORA_SEED_PASSWORD

  if (declared !== undefined && declared !== '') return declared

  const generated = randomBytes(18).toString('base64url')

  await remember('ASSEMORA_SEED_PASSWORD', generated)

  return generated
}

const newPage = async (app: Application, slug: string, title: string): Promise<string> => {
  const created = (await app.commands.execute('pages.create', {
    slug,
    title,
  })) as { id: string }

  return created.id
}

/** Answers with the new block's id, which is how the next call nests inside it. */
const add = async (
  app: Application,
  page: string,
  type: string,
  props: Record<string, unknown>,
  parentId?: string,
): Promise<string> => {
  const added = (await app.commands.execute('blocks.add', {
    id: page,
    type,
    props,
    ...(parentId === undefined ? {} : { parentId }),
  })) as { blockId: string }

  return added.blockId
}

const update = (app: Application, page: string, blockId: string, props: Record<string, unknown>) =>
  app.commands.execute('blocks.update', { id: page, blockId, props })

const design = (app: Application, page: string, blockId: string, patch: BlockDesignPatch) =>
  app.commands.execute('blocks.design', { id: page, blockId, design: patch })

/**
 * What Assemora looks like (SPEC.md §62, ADR-0024).
 *
 * These are the tokens of the design system, and they are a stored document rather
 * than a stylesheet: a designer changes one in Studio's Design section and an agent
 * proposes changing one through `theme.update`, which is a command like any other.
 * Nothing here or anywhere accepts CSS.
 *
 * The names are the design system's own — `paper`, `panel`, `accent`, `mint` — and
 * `brand`, `surface`, `surface-sunken` are set beside them because the universal
 * controls of §61 address a background by token name, and a section asking for
 * `surface-sunken` should get this site's paper rather than the framework's default.
 */
const brand = (app: Application) =>
  app.commands.execute('theme.update', {
    colors: {
      ink: '#1a1a1a',
      'ink-deep': '#111111',
      'ink-soft': '#5b6070',
      'ink-mute': '#8a8f9c',
      // Lighter than a caption: body text on ink, which the design sets apart.
      'ink-faint': '#a7abb6',
      paper: '#f3f4f7',
      panel: '#ffffff',
      accent: '#29845a',
      'accent-deep': '#1f6a46',
      mint: '#7fd1a4',
      'green-tint': '#e3f1e9',
      line: '#e2e4ea',
      hairline: '#eceef2',
      'line-on-ink': '#3a3a3a',
      'amber-tint': '#fbf3dc',
      'amber-text': '#8a6a1f',
      'red-tint': '#fdf1f1',
      red: '#a53b3b',
      // The names the universal controls address, pointed at this site's own.
      brand: '#29845a',
      surface: '#ffffff',
      'surface-sunken': '#f3f4f7',
    },
    typography: {
      fonts: {
        // Manrope catches Cyrillic, which Space Grotesk does not have a glyph for.
        body: ['Space Grotesk', 'Manrope', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'Manrope', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      sizes: {
        xs: '0.75rem',
        sm: '0.9375rem',
        md: '1.0625rem',
        lg: '1.1875rem',
        xl: '1.5rem',
        '2xl': '2.75rem',
        '3xl': '4.5rem',
      },
      weights: { normal: 400, medium: 500, semibold: 600, bold: 700 },
      lineHeights: {
        display: 0.98,
        tight: 1.02,
        snug: 1.1,
        normal: 1.55,
        relaxed: 1.65,
      },
    },
    /**
     * The page's rhythm, which is what the universal controls address by name.
     *
     * The design system measures in two ranges — 10 to 56px inside a component, 40 to
     * 112px between sections — and seven steps cannot hold both. These are the second:
     * `spacingTop: 'xs'` is how two sections are made to read as one, and `'xl'` is an
     * ordinary break. A card's own padding is written out in `app/theme.css`, where it
     * belongs, because it is a fact about the card rather than about the page.
     */
    spacing: {
      none: '0',
      xs: '2.5rem',
      sm: '3.5rem',
      md: '4rem',
      lg: '5rem',
      xl: '6rem',
      '2xl': '6.5rem',
    },
    radius: {
      none: '0',
      sm: '0.625rem',
      md: '1rem',
      lg: '1.125rem',
      full: '999px',
    },
    container: {
      narrow: '34rem',
      normal: '46rem',
      wide: '75rem',
      full: '100%',
    },
  })

// --- what is the same in every language --------------------------------------

const GUIDE = 'https://github.com/assemora/assemora/tree/main/docs/guide'
const REPOSITORY = 'https://github.com/assemora/assemora'
const COMMAND = 'pnpm create assemora my-site'
const ADDRESS = 'localhost:3000/studio/pages/home'

const DECLARATION = `export const Article = model('articles', {
  id: uuid().primary().defaultRandom(),
  title: string(),
  published: boolean().default(false),
})

export const Articles = resource(Article, {
  title: text().required().searchable(),
  published: toggle().filterable(),
})

export default assemora({
  database: postgres({ url: process.env.DATABASE_URL }),
  modules: [auth(), module('blog').models(Article).resources(Articles)],
  studio: true,
  mcp: true,
})`

const SESSION = `$ pnpm create assemora my-site
$ cd my-site
$ pnpm install
$ pnpm build && pnpm dev

listening on http://127.0.0.1:3000
  site     http://127.0.0.1:3000/
  studio   http://127.0.0.1:3000/studio
  api      http://127.0.0.1:3000/api`

const LOOP = `# the loop, as an agent sees it
assemora.describe            →  { models: […], resources: […], commands: […], policies: […] }
assemora.pages.get           →  { slug: 'home', tree: { blocks: [{ type: 'hero', … }] } }
assemora.blocks.update       →  { status: 'pending', changes: [{ summary: 'hero — subtitle changed' }] }
                                nothing has changed yet
assemora.changesets.propose  ←  several commands, under a name the agent chose
                                a person opens Proposals, reads the diff, and applies it`

/** The stages of SPEC.md §14, which are names in the code rather than words on a page. */
const PIPELINE = [
  'Command Bus',
  'validation',
  'authorization',
  'transaction',
  'handler',
  'revision',
  'events',
  'audit',
  'database',
] as const

/** The call each row of the declaration table answers. Code, so it does not translate. */
const CALLS = [
  'pnpm assemora db:generate initial',
  'typeof Article.$infer',
  "Article.where('published', true)",
  'GET /api/articles?published=true',
  'GET /api/openapi.json',
  'pnpm assemora sdk:generate',
  '/studio/articles',
  'assemora.entries.create',
] as const

/** What each author card writes, under the words that describe it. */
const AUTHOR_CODE = [
  { codeComment: '// writes', code: "commands.execute('entries.create', …)" },
  { codeComment: '// writes', code: 'a form → the same command' },
  {
    codeComment: '// proposes',
    code: "assemora.entries.create → { status: 'pending' }",
  },
] as const

const SHOT_IMAGES = [
  '/media/studio-page-builder.png',
  '/media/studio-proposals.png',
  '/media/studio-dashboard.png',
  '/media/studio-theme.png',
] as const

const COLUMNS = ['', 'Assemora', 'Payload 3', 'Strapi 5', 'Directus'] as const

const PACKAGES: readonly (readonly [string, string])[] = [
  ['@assemora/schema', 'The primitives every layer reads. No dependencies, ever'],
  ['@assemora/core', 'Command Bus, Query Bus, Schema Registry, events, context'],
  ['@assemora/database', 'The Query AST and the adapter contract'],
  ['@assemora/data', 'model(), the column DSL, the query builder, relations'],
  ['@assemora/database-postgres', 'The AST executed. Drizzle lives here and nowhere else'],
  ['@assemora/resources', 'A model as content: fields, filters, generic CRUD'],
  ['@assemora/http', 'route(), the Fastify adapter, generated endpoints'],
  ['@assemora/openapi', 'OpenAPI 3.1 and the introspection endpoint'],
  ['@assemora/sdk', 'The typed client, generated from the registry'],
  ['@assemora/auth', 'Users, roles, permissions, policies, tokens, agents'],
  ['@assemora/pages', 'Pages as block trees, and every edit as a command'],
  ['@assemora/revisions', 'History, diff, restore, undo and redo'],
  ['@assemora/media', 'The media library and its storage drivers'],
  ['@assemora/react', 'The renderer a site ships, and the builder canvas runs'],
  ['@assemora/audit', 'What happened, who did it, and how it ended'],
  ['@assemora/change-sets', 'What an agent proposed, previewed and not yet applied'],
  ['@assemora/mcp', 'Every command and query, as a tool, generated from the registry'],
  ['@assemora/theme', 'The theme as tokens, and the stylesheet they render to'],
  ['@assemora/notifications', 'What an application announces, to whom, over which channel'],
  ['@assemora/queue-bullmq', 'Jobs on Redis: the queue port of SPEC.md §82, implemented'],
  ['@assemora/plugin', 'A module an npm package ships, and what it added'],
  ['@assemora/cli', 'The assemora executable: generators, migrations, introspection'],
  ['assemora', 'The umbrella: one call assembles all of the above'],
  ['create-assemora', 'The scaffolder behind pnpm create assemora my-project'],
]

// --- the props of each block, in one language --------------------------------

const heroProps = (copy: Copy) => ({
  ...copy.hero,
  command: COMMAND,
  actionHref: GUIDE,
  meta: [...copy.hero.meta],
})

const proposalsProps = (copy: Copy) => ({
  ...copy.proposals,
  comment: '// content-agent · over MCP',
  call: "assemora.blocks.update { block: 'hero', subtitle: … }",
})

const declarationProps = (copy: Copy) => ({
  eyebrow: copy.declaration.eyebrow,
  heading: copy.declaration.heading,
  lead: copy.declaration.lead,
  sample: { language: 'ts', source: DECLARATION },
  outcomes: CALLS.map((call, index) => ({
    call,
    result: copy.declaration.results[index] ?? '',
  })),
})

const mutationProps = (copy: Copy) => ({
  ...copy.mutation,
  pipeline: [...PIPELINE],
  loop: { language: 'text', source: LOOP },
})

const comparisonProps = (copy: Copy) => ({
  eyebrow: copy.comparison.eyebrow,
  heading: copy.comparison.heading,
  lead: copy.comparison.lead,
  note: copy.comparison.note,
  columns: [...COLUMNS],
  rows: copy.comparison.rows.map((row) => ({
    label: row.label,
    cells: [...row.cells],
  })),
})

const startProps = (copy: Copy) => ({
  ...copy.start,
  anchor: 'start',
  command: COMMAND,
  transcript: { language: 'text', source: SESSION },
  actionHref: REPOSITORY,
  secondaryHref: GUIDE,
})

/** Where each block ended up, so a translation can be written into the same tree. */
type Placed = {
  readonly hero: string
  readonly proposals: string
  readonly authors: string
  readonly authorCards: readonly string[]
  readonly declaration: string
  readonly mutation: string
  readonly steps: string
  readonly stepCards: readonly string[]
  readonly showcase: string
  readonly shots: readonly string[]
  readonly comparison: string
  readonly packages: string
  readonly start: string
}

const build = async (
  app: Application,
  copy: Copy,
): Promise<{ readonly page: string; readonly placed: Placed }> => {
  const page = await newPage(app, 'home', 'Assemora')

  const hero = await add(app, page, 'hero', heroProps(copy))

  await design(app, page, hero, {
    spacingTop: 'xl',
    spacingBottom: 'lg',
    container: 'wide',
  })

  const proposals = await add(app, page, 'proposals', proposalsProps(copy), hero)

  const authors = await add(app, page, 'cards', {
    anchor: 'authors',
    eyebrow: copy.authors.eyebrow,
    heading: copy.authors.heading,
    columns: 'three',
    tone: 'paper',
    numbered: 'no',
  })

  await design(app, page, authors, {
    spacingTop: 'xs',
    spacingBottom: 'xl',
    container: 'wide',
  })

  const authorCards: string[] = []

  for (const [index, card] of copy.authors.cards.entries()) {
    authorCards.push(
      await add(
        app,
        page,
        'card',
        {
          ...card,
          ...(AUTHOR_CODE[index] ?? {}),
          ...(index === 2 ? { badge: 'MCP', tone: 'ink' } : {}),
        },
        authors,
      ),
    )
  }

  const declaration = await add(app, page, 'declaration', declarationProps(copy))

  await design(app, page, declaration, {
    spacingTop: 'xl',
    spacingBottom: 'xl',
    container: 'wide',
    background: 'panel',
  })

  const mutation = await add(app, page, 'mutation', {
    ...mutationProps(copy),
    anchor: 'agents',
  })

  await design(app, page, mutation, {
    spacingTop: '2xl',
    spacingBottom: 'none',
    container: 'wide',
    background: 'ink',
  })

  const steps = await add(app, page, 'cards', {
    columns: 'two',
    tone: 'ink',
    numbered: 'yes',
  })

  await design(app, page, steps, {
    spacingTop: 'sm',
    spacingBottom: '2xl',
    container: 'wide',
    background: 'ink',
  })

  const stepCards: string[] = []

  for (const step of copy.steps) {
    stepCards.push(await add(app, page, 'card', { ...step }, steps))
  }

  const showcase = await add(app, page, 'showcase', {
    anchor: 'studio',
    eyebrow: 'Studio',
    heading: copy.showcase.heading,
    lead: copy.showcase.lead,
    address: ADDRESS,
  })

  await design(app, page, showcase, {
    spacingTop: '2xl',
    spacingBottom: 'xl',
    container: 'wide',
  })

  const shots: string[] = []

  for (const [index, shot] of copy.showcase.shots.entries()) {
    shots.push(await add(app, page, 'shot', { ...shot, image: SHOT_IMAGES[index] ?? '' }, showcase))
  }

  const comparison = await add(app, page, 'comparison', comparisonProps(copy))

  await design(app, page, comparison, {
    spacingTop: 'xl',
    spacingBottom: 'xl',
    container: 'wide',
  })

  const packages = await add(app, page, 'packages', {
    ...copy.packages,
    anchor: 'packages',
  })

  await design(app, page, packages, {
    spacingTop: 'xl',
    spacingBottom: 'xs',
    container: 'wide',
    background: 'panel',
  })

  for (const [name, summary] of PACKAGES) {
    await add(app, page, 'package-row', { name, summary }, packages)
  }

  const start = await add(app, page, 'start', startProps(copy))

  await design(app, page, start, {
    spacingTop: 'md',
    spacingBottom: '2xl',
    container: 'wide',
  })

  return {
    page,
    placed: {
      hero,
      proposals,
      authors,
      authorCards,
      declaration,
      mutation,
      steps,
      stepCards,
      showcase,
      shots,
      comparison,
      packages,
      start,
    },
  }
}

/**
 * The same tree, said in another language.
 *
 * The package rows are not here on purpose: they name packages and say what is in
 * them, in the language the code is written in, and a translated `model(), the column
 * DSL` would be a worse sentence in every language.
 */
const apply = async (app: Application, page: string, placed: Placed, copy: Copy): Promise<void> => {
  await update(app, page, placed.hero, heroProps(copy))
  await update(app, page, placed.proposals, proposalsProps(copy))
  await update(app, page, placed.authors, {
    anchor: 'authors',
    eyebrow: copy.authors.eyebrow,
    heading: copy.authors.heading,
    columns: 'three',
    tone: 'paper',
    numbered: 'no',
  })

  for (const [index, card] of copy.authors.cards.entries()) {
    const blockId = placed.authorCards[index]

    if (blockId === undefined) continue

    await update(app, page, blockId, {
      ...card,
      ...(AUTHOR_CODE[index] ?? {}),
      ...(index === 2 ? { badge: 'MCP', tone: 'ink' } : {}),
    })
  }

  await update(app, page, placed.declaration, declarationProps(copy))
  await update(app, page, placed.mutation, { ...mutationProps(copy), anchor: 'agents' })

  for (const [index, step] of copy.steps.entries()) {
    const blockId = placed.stepCards[index]

    if (blockId !== undefined) await update(app, page, blockId, { ...step })
  }

  await update(app, page, placed.showcase, {
    anchor: 'studio',
    eyebrow: 'Studio',
    heading: copy.showcase.heading,
    lead: copy.showcase.lead,
    address: ADDRESS,
  })

  for (const [index, shot] of copy.showcase.shots.entries()) {
    const blockId = placed.shots[index]

    if (blockId !== undefined) {
      await update(app, page, blockId, {
        ...shot,
        image: SHOT_IMAGES[index] ?? '',
      })
    }
  }

  await update(app, page, placed.comparison, comparisonProps(copy))
  await update(app, page, placed.packages, { ...copy.packages, anchor: 'packages' })
  await update(app, page, placed.start, startProps(copy))
}

/**
 * Makes the administrator's password the one the environment names.
 *
 * A deployment's password is a fact about the deployment, so it should be true after
 * every deploy rather than only after the first: rotating it is then setting a variable
 * and deploying, which is the same gesture as setting it in the first place.
 *
 * It is also the repair for a database seeded without one. `seed` returns early once a
 * user exists, so an administrator created with a generated password stays that way
 * forever otherwise — the account is there and nobody can sign in as it.
 *
 * Through the Command Bus, like every other write: the password is hashed by the
 * handler and deliberately leaves no revision behind (SPEC.md §85).
 */
export const ensureAdministratorPassword = async (
  app: Application,
  declared: string,
): Promise<void> => {
  const admin = await User.where('email', ADMIN).first()

  if (admin === null) return

  await app.run({ source: 'internal', actor: { type: 'user', id: admin.id } }, async () => {
    await app.commands.execute('auth.users.password', { id: admin.id, password: declared })
  })
}

/** Actor, as every write below needs one. */
type Actor = { readonly type: 'user'; readonly id: string }

/**
 * The site itself: the English page, then the same tree said twice more.
 *
 * Separate from `seed` because it is the half that can be written again. Creating an
 * administrator is a thing you do once; writing the page is a thing a reset does over.
 */
const writeSite = async (app: Application, actor: Actor): Promise<void> => {
  await app.run({ source: 'internal', actor }, async () => {
    await brand(app)

    const { page, placed } = await build(app, COPY.en)

    await app.commands.execute('pages.publish', { id: page })

    for (const locale of TRANSLATIONS) {
      const made = (await app.commands.execute('pages.translate', {
        id: page,
        locale,
      })) as { id: string }

      // In the language of the translation, because every read inside these commands
      // is scoped to the language of the operation (SPEC.md §131) — and a read scoped
      // to English would find the English page, which is the one not being edited.
      await app.run({ source: 'internal', actor, locale }, async () => {
        await apply(app, made.id, placed, COPY[locale])
        await app.commands.execute('pages.publish', { id: made.id })
      })
    }
  })
}

export const seed = async (app: Application): Promise<void> => {
  if ((await User.count()) > 0) return

  const admin = await User.create({
    email: ADMIN,
    name: 'Admin',
    passwordHash: await hashPassword(await seedPassword()),
  })

  const role = await Role.create({
    name: 'administrator',
    label: 'Administrator',
  })
  const everything = await Permission.create({ name: '*', description: null })

  await RolePermission.create({ roleId: role.id, permissionId: everything.id })
  await UserRole.create({ userId: admin.id, roleId: role.id })

  await writeSite(app, { type: 'user', id: admin.id })

  // Where the password came from, rather than where it sometimes goes: saying `.env`
  // when the environment supplied it sends whoever reads this to an empty file.
  const fromEnvironment = process.env.ASSEMORA_SEED_PASSWORD

  console.log(
    `seeded ${ADMIN} — its password is ${
      fromEnvironment === undefined || fromEnvironment === ''
        ? 'in .env, as ASSEMORA_SEED_PASSWORD'
        : 'the one ASSEMORA_SEED_PASSWORD names'
    }`,
  )
}

/**
 * Throws the site away and writes it again.
 *
 * The seed is the site's first author, not its only one: once it has run, the page is
 * content, and an editor's change to it outweighs this file's opinion. So nothing here
 * re-runs on its own — `seed` returns the moment a user exists.
 *
 * This is the deliberate exception, and it is behind a flag because it **deletes every
 * page, translations included**. It exists for the window where the site is still
 * exactly what the seed wrote and a change to the design lives in the block props
 * rather than in the stylesheet — section spacing, a card's tone, a theme token. Those
 * are content, and a deploy does not touch content. Run it while nobody has edited
 * anything; after that, the change belongs in Studio or in a migration that knows what
 * it is preserving.
 */
export const reseed = async (app: Application): Promise<void> => {
  const admin = await User.where('email', ADMIN).first()

  if (admin === null) return

  const actor = { type: 'user', id: admin.id } as const

  const pages = await app.run({ source: 'internal', actor }, async () => {
    const existing = await Page.allLocales().get()

    for (const page of existing) {
      await app.commands.execute('pages.delete', { id: page.id })
    }

    return existing.length
  })

  await writeSite(app, actor)

  console.log(`reseed: replaced ${pages} pages`)
}

/**
 * `pnpm seed` — the same function `src/server.ts` calls, run on its own against
 * whatever `DATABASE_URL` names.
 *
 * This is how a real deployment gets its content: the release command runs it once
 * before traffic moves, and `seed` returns immediately if the database already has a
 * user, so running it on every deploy costs one query. Node names the file it was
 * started with in `process.argv[1]`, and that is this file only when it was started
 * directly — so importing the seed does not run it.
 */
const started = process.argv[1]

if (started !== undefined && realpathSync(started) === import.meta.filename) {
  const declared = process.env.ASSEMORA_SEED_PASSWORD

  if (declared === undefined || declared === '') {
    console.error(
      'ASSEMORA_SEED_PASSWORD is not set. Seeding without it creates an administrator ' +
        'whose password is generated into a .env that dies with this process — an ' +
        'account nobody can ever sign in as. Set it and run this again.',
    )
    process.exit(1)
  }

  const app = createApp()

  await app.boot()
  await seed(app.app)
  await ensureAdministratorPassword(app.app, declared)

  if (process.env.ASSEMORA_RESEED === '1') await reseed(app.app)

  await app.shutdown()
}
