/**
 * What assemora.com is made of (SPEC.md §55, §56).
 *
 * Every section of the site is a block, which is the point rather than a convenience:
 * this site is the framework's own claim about itself, and a marketing page assembled
 * by hand would be the one page in the project that its CMS could not edit.
 *
 * A declaration says what a block *is*. What it looks like is `app/blocks.tsx`, and
 * how much room it takes is neither: spacing, width, alignment, background, container
 * and responsive visibility are the universal controls every block gets (SPEC.md §61),
 * and the theme decides what each token means. There is deliberately no route from a
 * field here to a stylesheet.
 */
import { block } from '@assemora/pages'
import { array, code, object, select, text, textarea } from '@assemora/resources'

export const Hero = block(
  'hero',
  {
    eyebrow: text().label('Eyebrow'),
    headlineTop: text().required().label('Headline, first line'),
    headlineBottom: text().required().label('Headline, second line'),
    lead: textarea().required().label('Lead'),
    command: text().label('Command').help('Shown in a terminal chip with a copy button'),
    actionLabel: text().label('Link label'),
    actionHref: text().label('Link'),
    meta: array(text()).label('Meta').help('The short facts under the command'),
  },
  { label: 'Hero', description: 'The top of the page', icon: 'panel-top' },
)

/**
 * The one section that argues by running rather than by describing.
 *
 * Every line it plays is a field, because the script *is* the claim: a demo whose copy
 * lived in the component would be a demo nobody could correct without a deploy.
 */
export const Proposals = block(
  'proposals',
  {
    title: text().required().label('Panel title'),
    comment: text().label('Agent comment'),
    call: text().required().label('The tool call'),
    ranStep: text().required().label('Step — ran for real'),
    rolledStep: text().required().label('Step — rolled back'),
    rolledEmphasis: text().label('Step — the part in bold'),
    diffLabel: text().label('Diff heading'),
    removed: textarea().label('Diff, removed line'),
    added: textarea().label('Diff, added line'),
    waiting: text().label('Waiting note'),
    rejectLabel: text().required().label('Reject button'),
    applyLabel: text().required().label('Apply button'),
    appliedNote: text().label('After applying'),
    rejectedNote: text().label('After rejecting'),
    caption: textarea().label('Caption'),
  },
  { label: 'Proposals', description: 'The change-set loop, played out', icon: 'git-pull-request' },
)

/**
 * The block that holds other blocks (SPEC.md §56).
 *
 * `allowedChildren` is what turns a builder from a free-for-all into a design system:
 * a hero cannot be dropped inside it, and the refusal comes from this declaration
 * rather than from anything Studio knows.
 */
export const Cards = block(
  'cards',
  {
    eyebrow: text().label('Eyebrow'),
    heading: text().label('Heading'),
    lead: textarea().label('Lead'),
    columns: select('two', 'three').label('Columns'),
    tone: select('paper', 'ink').label('Tone'),
    numbered: select('no', 'yes').label('Number the cards'),
  },
  {
    label: 'Cards',
    description: 'A row of cards',
    icon: 'layout-grid',
    group: 'Sections',
    acceptsChildren: true,
    allowedChildren: ['card'],
    maxChildren: 8,
  },
)

export const Card = block(
  'card',
  {
    title: text().required().label('Title'),
    badge: text().label('Badge'),
    tone: select('paper', 'ink').label('Tone'),
    body: textarea().required().label('Body'),
    codeComment: text().label('Code comment'),
    code: text().label('Code line'),
  },
  { label: 'Card', description: 'One point, inside a row of cards', icon: 'square' },
)

export const Declaration = block(
  'declaration',
  {
    eyebrow: text().label('Eyebrow'),
    heading: text().required().label('Heading'),
    lead: textarea().label('Lead'),
    sample: code('ts').required().label('The declaration'),
    outcomes: array(object({ call: text(), result: text() })).label('What it becomes'),
  },
  {
    label: 'Declaration',
    description: 'One declaration and everything it feeds',
    icon: 'file-code',
    group: 'Sections',
  },
)

export const Mutation = block(
  'mutation',
  {
    eyebrow: text().label('Eyebrow'),
    heading: text().required().label('Heading'),
    lead: textarea().label('Lead'),
    pipeline: array(text()).label('The path'),
    loop: code('text').label('The loop, as an agent sees it'),
  },
  {
    label: 'Mutation path',
    description: 'The one way state changes',
    icon: 'workflow',
    group: 'Sections',
  },
)

export const Showcase = block(
  'showcase',
  {
    eyebrow: text().label('Eyebrow'),
    heading: text().required().label('Heading'),
    lead: textarea().label('Lead'),
    address: text().label('Address bar'),
  },
  {
    label: 'Showcase',
    description: 'Screenshots behind tabs',
    icon: 'image',
    group: 'Sections',
    acceptsChildren: true,
    allowedChildren: ['shot'],
    maxChildren: 6,
  },
)

export const Shot = block(
  'shot',
  {
    label: text().required().label('Tab label'),
    image: text()
      .required()
      .label('Image')
      .help('A path in this site’s bundle, or an absolute URL'),
    caption: textarea().label('Caption'),
  },
  { label: 'Screenshot', description: 'One tab of a showcase', icon: 'image' },
)

export const Packages = block(
  'packages',
  {
    eyebrow: text().label('Eyebrow'),
    heading: text().required().label('Heading'),
    lead: textarea().label('Lead'),
  },
  {
    label: 'Packages',
    description: 'The package list',
    icon: 'boxes',
    group: 'Sections',
    acceptsChildren: true,
    allowedChildren: ['package-row'],
    maxChildren: 40,
  },
)

export const PackageRow = block(
  'package-row',
  {
    name: text().required().label('Package'),
    summary: text().required().label('What it is'),
  },
  { label: 'Package', description: 'One package and what it is', icon: 'box' },
)

/**
 * The table that states where this project loses.
 *
 * Its rows are data rather than markup for the reason the section exists: a claim
 * about somebody else's software goes stale, and a cell somebody can correct in Studio
 * is a cell that gets corrected.
 */
export const Comparison = block(
  'comparison',
  {
    eyebrow: text().label('Eyebrow'),
    heading: text().required().label('Heading'),
    lead: textarea().label('Lead'),
    columns: array(text()).label('Column headings'),
    rows: array(object({ label: text(), cells: array(text()) })).label('Rows'),
    note: textarea().label('Note under the table'),
  },
  {
    label: 'Comparison',
    description: 'How it compares, stated plainly',
    icon: 'table',
    group: 'Sections',
  },
)

export const Start = block(
  'start',
  {
    heading: text().required().label('Heading'),
    lead: textarea().label('Lead'),
    command: text().label('Command'),
    transcript: code('text').label('What it prints'),
    actionLabel: text().label('Primary label'),
    actionHref: text().label('Primary link'),
    secondaryLabel: text().label('Secondary label'),
    secondaryHref: text().label('Secondary link'),
  },
  {
    label: 'Get started',
    description: 'The closing call to action',
    icon: 'rocket',
    group: 'Sections',
  },
)

export const siteBlocks = [
  Hero,
  Proposals,
  Cards,
  Card,
  Declaration,
  Mutation,
  Showcase,
  Shot,
  Packages,
  PackageRow,
  Comparison,
  Start,
] as const
