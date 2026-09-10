/**
 * The site: one registry, one renderer, two ways to fetch a page (SPEC.md §57, §59).
 *
 * The two readers below are the whole difference between a visitor and an editor.
 * Studio's canvas asks for a page by id, in draft, through the authorized query it
 * already has a session for. Everybody else asks for a slug through the public route,
 * which serves the published tree and refuses to serve anything else.
 */
import { AssemoraPage, createBlockRegistry } from '@assemora/react'
import type { BlockTree } from '@assemora/schema'
import { type ReactNode, useEffect, useId, useRef, useState } from 'react'

import {
  CardsView,
  CardView,
  ComparisonView,
  DeclarationView,
  HeroView,
  MissingView,
  MutationView,
  PackageRowView,
  PackagesView,
  ProposalsView,
  ShotView,
  ShowcaseView,
  StartView,
} from './blocks.tsx'

/**
 * Where a block declaration meets its component.
 *
 * The key is the block's `type` from `src/blocks.ts`, and this map is the only thing
 * joining the two. Add a block there, add its view here, and the builder can place it.
 */
export const blocks = createBlockRegistry(
  {
    hero: HeroView,
    proposals: ProposalsView,
    cards: CardsView,
    card: CardView,
    declaration: DeclarationView,
    mutation: MutationView,
    showcase: ShowcaseView,
    shot: ShotView,
    packages: PackagesView,
    'package-row': PackageRowView,
    comparison: ComparisonView,
    start: StartView,
  },
  { fallback: MissingView },
)

/** The languages this deployment serves, and the one it falls back to (SPEC.md §131). */
/*
 * The order the menu lists them in, English first because it is the default.
 *
 * It is a reading order rather than a ranking, and the one thing it must not be is the
 * order they happened to be added in — that is a record of this file's history, which
 * is nobody's business but this file's.
 */
export const LOCALES = ['en', 'de', 'es', 'fr', 'uk', 'ru'] as const
export type Locale = (typeof LOCALES)[number]

/** What each language calls itself. A list of languages in one language is a list for one reader. */
const LANGUAGE_NAMES: Readonly<Record<Locale, string>> = {
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  uk: 'Українська',
  ru: 'Русский',
}
export const DEFAULT_LOCALE: Locale = 'en'

const isLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value)

/**
 * The language from the address, because that is where a reader put it.
 *
 * `/uk` and `/ru` reach this bundle rather than a route of their own: the frontend is
 * mounted at the origin root, so a path the API does not claim is served the document
 * and read here. `/` is the default language and carries no segment, which is what
 * keeps the canonical address of an English page free of one.
 */
export const localeFromPath = (pathname: string): Locale => {
  const first = pathname.split('/').filter((segment) => segment !== '')[0] ?? ''

  return isLocale(first) ? first : DEFAULT_LOCALE
}

/**
 * Where the API is for one language.
 *
 * The prefix is stripped before routing, so `/api/uk/site/pages/home` is the same
 * declared route as `/api/site/pages/home`, answered in Ukrainian. The default
 * language names no segment, so one language means one path.
 */
const apiBase = (locale: Locale): string => (locale === DEFAULT_LOCALE ? '/api' : `/api/${locale}`)

/** What a visitor gets: published, by slug, with no session (`src/routes.ts`). */
export const readPublished = async (slug: string, locale: Locale): Promise<BlockTree> => {
  const response = await fetch(`${apiBase(locale)}/site/pages/${encodeURIComponent(slug)}`)

  if (!response.ok) throw new Error(`No published page at “${slug}” (${response.status})`)

  return ((await response.json()) as { tree: BlockTree }).tree
}

/** What the canvas gets: by id, in whichever mode it asked for, as the signed-in editor. */
export const readForEditor = async (id: string, mode: string): Promise<BlockTree> => {
  const query = new URLSearchParams({ id, mode })
  const response = await fetch(`/api/queries/pages.get?${query.toString()}`, {
    credentials: 'include',
  })

  if (!response.ok) throw new Error(`The page could not be loaded (${response.status})`)

  return ((await response.json()) as { tree: BlockTree }).tree
}

const MARK = (
  <span className="mark" aria-hidden="true">
    <span />
    <span />
    <span />
  </span>
)

/**
 * The one part of this page the CMS does not own.
 *
 * Navigation is SPEC.md §133 and is not built: there is no menu resource, so a nav
 * assembled from content would be a nav assembled from nothing. It is code until then,
 * and saying so is better than quietly implying the site is entirely editable when one
 * strip of it is not.
 */
/**
 * The language, as a menu rather than a row.
 *
 * Three abbreviations side by side ask a reader to know what UK and RU stand for; a
 * menu can afford to say Українська. It is a real menu, so it answers to a keyboard
 * and to Escape, and it closes when the page is clicked elsewhere — a dropdown that
 * only closes by choosing something is a trap rather than a control.
 *
 * The items are links, not buttons: each language is an address, and a reader is
 * entitled to open one in a new tab.
 */
const LanguageMenu = ({ locale }: { readonly locale: Locale }) => {
  const [open, setOpen] = useState(false)
  const holder = useRef<HTMLDivElement>(null)
  const id = useId()

  useEffect(() => {
    if (!open) return

    const dismiss = (event: MouseEvent) => {
      if (!holder.current?.contains(event.target as Node)) setOpen(false)
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', dismiss)
    document.addEventListener('keydown', onEscape)

    return () => {
      document.removeEventListener('mousedown', dismiss)
      document.removeEventListener('keydown', onEscape)
    }
  }, [open])

  return (
    <div className="languages" ref={holder}>
      <button
        type="button"
        className="languages-button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((was) => !was)}
      >
        {locale.toUpperCase()}
        <span aria-hidden="true" className="languages-chevron" />
      </button>

      <div className="languages-menu" id={id} role="menu" hidden={!open}>
        {LOCALES.map((option) => (
          <a
            key={option}
            role="menuitem"
            href={option === DEFAULT_LOCALE ? '/' : `/${option}`}
            aria-current={option === locale ? 'true' : undefined}
          >
            <span className="languages-code">{option.toUpperCase()}</span>
            {LANGUAGE_NAMES[option]}
          </a>
        ))}
      </div>
    </div>
  )
}

const Chrome = ({
  locale,
  children,
}: {
  readonly locale: Locale
  readonly children: ReactNode
}) => (
  <div className="shell">
    <nav className="nav">
      <div className="nav-inner">
        <a className="wordmark" href={locale === DEFAULT_LOCALE ? '/' : `/${locale}`}>
          {MARK}
          Assemora
        </a>
        <div className="nav-links">
          <a href="#authors">Authors</a>
          <a href="#studio">Studio</a>
          <a href="#agents">Agents</a>
          <a href="#packages">Packages</a>
          <a href="https://github.com/assemora/assemora">GitHub</a>
        </div>
        <LanguageMenu locale={locale} />

        <a className="nav-cta" href="#start">
          Get started
        </a>
      </div>
    </nav>

    <main>{children}</main>

    <footer className="footer">
      <div className="footer-inner">
        <p>Build visually. Extend with TypeScript. Control with AI.</p>
        <p className="meta">
          <span>Apache-2.0</span>
          <span>
            <a href="https://github.com/assemora/assemora">github.com/assemora/assemora</a>
          </span>
        </p>
      </div>
    </footer>
  </div>
)

export type SiteProps = {
  readonly tree: BlockTree
  readonly locale: Locale
  /** Marks each block in the DOM so the builder can find it. Off for a visitor. */
  readonly editing?: boolean
}

/**
 * The canvas gets the blocks and nothing around them.
 *
 * Studio frames this document to edit a page, and a sticky navigation bar inside the
 * frame would be a second navigation bar over Studio's own — and a language switcher
 * in it would change what the *canvas* is showing without telling the editor.
 */
export const Site = ({ tree, locale, editing = false }: SiteProps) =>
  editing ? (
    <AssemoraPage page={{ tree }} blocks={blocks} editing />
  ) : (
    <Chrome locale={locale}>
      <AssemoraPage page={{ tree }} blocks={blocks} />
    </Chrome>
  )
