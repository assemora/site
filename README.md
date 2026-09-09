# assemora.com

The Assemora site, built with Assemora.

It depends on the published packages rather than on a checkout of the framework, which
is the whole reason it is a repository of its own: it is an ordinary Assemora project,
the same one `pnpm create assemora` writes, and it proves the packages work by being one.

## It is content, not a template

The home page is a tree of **45 blocks across 12 block types**. `src/seed.ts` writes it
through the Command Bus on the first deploy — so after that, nobody edits this
repository to change a sentence on the site. An editor opens `/studio`; an agent
proposes a change over MCP and a person applies it.

- `src/blocks.ts` declares what a block *is*. `app/blocks.tsx` says what it looks like.
- `src/content.ts` holds every word, in three languages.
- `src/seed.ts` sets the theme through `theme.update` — the design system is a stored
  document, and nothing here accepts CSS.

## Three languages, one tree

`locales: ['en', 'uk', 'ru']` (SPEC.md §131). The English page is built block by block;
`pages.translate` copies that tree — the blocks keep their ids — and the other
language's words are written into the same blocks. A translation is the same page said
differently, not a second page that resembles it.

`/` is English, `/uk` and `/ru` are the others. The language is a path segment the API
strips before routing, so `/api/uk/site/pages/home` is one declared route answered in
Ukrainian.

## Running it

```bash
pnpm install
pnpm build     # writes app/dist, which the site is served from
pnpm dev
```

With no `DATABASE_URL` it runs in memory and seeds itself on every boot, which is the
right thing locally. Point it at PostgreSQL and the content is written once:

```bash
pnpm db:migrate
pnpm seed
```

`ASSEMORA_SEED_PASSWORD` is the administrator's password, and it is a fact about the
deployment rather than about the first deploy: every run of `pnpm seed` sets the
administrator's password to what the environment names, so rotating it is setting a
variable and deploying. Run without one, `pnpm seed` refuses rather than generating a
password into a `.env` that dies with the container — that is an account nobody can
ever sign in as, and the image refuses to start for the same reason.

It goes through `auth.users.password` on the Command Bus, so it is hashed by the handler
and leaves no revision behind.

### Changing the design after it is live

The seed is the site's first author, not its only one. Once it has run the page is
content, so a deploy does not touch it: section spacing, a card's tone and the theme
tokens live in the database, and changing them here changes nothing that is already
written.

While the site is still exactly what the seed wrote, `ASSEMORA_RESEED=1 pnpm seed`
deletes every page — translations included — and writes them again. Once anybody has
edited anything, that flag destroys their work: the change belongs in Studio, or in a
migration that knows what it is preserving.

## Deploying

`Dockerfile` builds it. The framework arrives compiled from npm, so the image installs
one project rather than a workspace.

| Variable | Value |
| --- | --- |
| `ASSEMORA_SEED_PASSWORD` | the administrator's password; required |
| `DATABASE_URL` | PostgreSQL, so an edit outlives the process |
| `HOST` / `PORT` | `0.0.0.0` and `3000`, both set in the image |

**It must be served over HTTPS.** Session and CSRF cookies carry `Secure` by default, so
over plain `http` the sign-in form accepts the password and the next request arrives
with no session — a failure that looks like a wrong password and is not.

## The fonts

Space Grotesk and JetBrains Mono, with Manrope behind them for Cyrillic, which Space
Grotesk has no glyphs for. Every face declares the range it covers, so an English reader
downloads neither Cyrillic file. All three are OFL; `NOTICE` records that.

They are served from this origin rather than a font CDN, because `style-src 'self'` is
the policy the framework sends — and because no third party needs to be told who is
reading.

## What is not content

Navigation and the footer are code. SPEC.md §133 is not built, so there is no menu
resource, and a nav assembled from content would be assembled from nothing. Saying so
is better than implying the site is entirely editable when one strip of it is not.

## The framework

[github.com/assemora/assemora](https://github.com/assemora/assemora) — Apache-2.0.
