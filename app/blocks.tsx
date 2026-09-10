/**
 * What the blocks of `src/blocks.ts` look like (SPEC.md §57).
 *
 * A declaration says what a block is; these say what it looks like, and they belong
 * to the site: change one and every page using the block changes with it, without a
 * single stored tree being touched.
 *
 * None of them positions itself. Spacing, width, alignment, background and visibility
 * arrive as a wrapper the renderer draws from the universal controls, and the theme
 * decides what each token means — which is what keeps those controls universal
 * (SPEC.md §61).
 */
import type { BlockViewProps } from '@assemora/react'
import { useEffect, useState } from 'react'

/**
 * A paragraph that may name code inside it.
 *
 * The design sets `resource(Dish, …)` and `mcp: { mutations: 'direct' }` as code
 * within a sentence, and a field holding one string cannot say where those begin. A
 * backtick can, and it costs the schema nothing: the value stays a string an editor
 * types, and Studio shows it as written.
 *
 * Deliberately the whole of the markup. Anything richer is `richText()`, which is a
 * field of its own with an editor behind it — not a convention smuggled into a line
 * of prose.
 */
const Prose = ({ text }: { readonly text: string }) => (
  <>
    {text.split('`').map((part, index) =>
      index % 2 === 1 ? (
        // biome-ignore lint/suspicious/noArrayIndexKey: position is the identity here
        <code className="inline" key={index}>
          {part}
        </code>
      ) : (
        part
      ),
    )}
  </>
)

/** A copy button that says so, and goes quiet again. */
const Copy = ({ value }: { readonly value: string }) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return

    const timer = setTimeout(() => setCopied(false), 1600)

    return () => clearTimeout(timer)
  }, [copied])

  return (
    <button
      type="button"
      className="copy"
      onClick={() => {
        navigator.clipboard?.writeText(value).then(
          () => setCopied(true),
          () => undefined,
        )
      }}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

const Terminal = ({ command }: { readonly command: string }) => (
  <div className="terminal">
    <span className="terminal-prompt">$</span>
    <code>{command}</code>
    <Copy value={command} />
  </div>
)

export const HeroView = ({
  props,
  children,
}: BlockViewProps<{
  readonly eyebrow?: string
  readonly headlineTop?: string
  readonly headlineBottom?: string
  readonly lead?: string
  readonly command?: string
  readonly actionLabel?: string
  readonly actionHref?: string
  readonly meta?: readonly string[]
}>) => (
  <header className="hero">
    <div className="hero-copy">
      {props.eyebrow !== undefined && <p className="eyebrow">{props.eyebrow}</p>}
      <h1>
        {props.headlineTop}
        <br />
        {props.headlineBottom}
      </h1>
      {props.lead !== undefined && (
        <p className="lead">
          <Prose text={props.lead} />
        </p>
      )}
      <div className="hero-actions">
        {props.command !== undefined && props.command !== '' && (
          <Terminal command={props.command} />
        )}
        {props.actionLabel !== undefined && props.actionHref !== undefined && (
          <a className="link-arrow" href={props.actionHref}>
            {props.actionLabel} <span aria-hidden="true">→</span>
          </a>
        )}
      </div>
      {props.meta !== undefined && props.meta.length > 0 && (
        <p className="meta">
          {props.meta.map((fact) => (
            <span key={fact}>{fact}</span>
          ))}
        </p>
      )}
    </div>

    {children}
  </header>
)

type Stage = 'running' | 'pending' | 'applied' | 'rejected'

/**
 * The claim, played rather than described.
 *
 * It is a drawing of the real loop and says so: the panel walks from the tool call to
 * a proposal waiting for a person, and stops there until somebody presses a button.
 * What it must not do is decide on its own — an animation that applied the change by
 * itself would be arguing the opposite of the sentence above it.
 */
export const ProposalsView = ({
  props,
}: BlockViewProps<{
  readonly title?: string
  readonly comment?: string
  readonly call?: string
  readonly ranStep?: string
  readonly rolledStep?: string
  readonly rolledEmphasis?: string
  readonly diffLabel?: string
  readonly removed?: string
  readonly added?: string
  readonly waiting?: string
  readonly rejectLabel?: string
  readonly applyLabel?: string
  readonly appliedNote?: string
  readonly rejectedNote?: string
  readonly caption?: string
}>) => {
  const [stage, setStage] = useState<Stage>('running')

  useEffect(() => {
    if (stage !== 'running') return

    const timer = setTimeout(() => setStage('pending'), 1400)

    return () => clearTimeout(timer)
  }, [stage])

  useEffect(() => {
    if (stage !== 'applied' && stage !== 'rejected') return

    const timer = setTimeout(() => setStage('running'), 4200)

    return () => clearTimeout(timer)
  }, [stage])

  const settled = stage === 'applied' || stage === 'rejected'

  return (
    <section className="proposals">
      <div className="panel" data-stage={stage}>
        <div className="panel-head">
          <span className="dot" aria-hidden="true" />
          <strong>{props.title}</strong>
          <span className="pill" data-stage={stage}>
            {stage}
          </span>
        </div>

        <div className="panel-body">
          {props.comment !== undefined && <p className="code-comment">{props.comment}</p>}
          <p className="code-call">{props.call}</p>
          <p className="code-step">{props.ranStep}</p>
          {stage !== 'running' && (
            <p className="code-step">
              {props.rolledStep} <strong>{props.rolledEmphasis}</strong>
            </p>
          )}

          {stage !== 'running' && (
            <div className="diff">
              <p className="diff-label">{props.diffLabel}</p>
              <p className="diff-line diff-removed">{props.removed}</p>
              <p className="diff-line diff-added">{props.added}</p>
            </div>
          )}

          {stage === 'pending' && <p className="code-waiting">{props.waiting}</p>}
          {stage === 'applied' && <p className="outcome outcome-applied">{props.appliedNote}</p>}
          {stage === 'rejected' && <p className="outcome outcome-rejected">{props.rejectedNote}</p>}
        </div>

        <div className="panel-foot">
          <button
            type="button"
            className="button-quiet"
            disabled={stage !== 'pending'}
            onClick={() => setStage('rejected')}
          >
            {props.rejectLabel}
          </button>
          <button
            type="button"
            className="button-accent"
            disabled={stage !== 'pending'}
            onClick={() => setStage('applied')}
          >
            {props.applyLabel}
          </button>
        </div>
      </div>

      {props.caption !== undefined && (
        <p className="caption" data-settled={settled ? '1' : undefined}>
          {props.caption}
        </p>
      )}
    </section>
  )
}

export const CardsView = ({
  props,
  children,
}: BlockViewProps<{
  readonly eyebrow?: string
  readonly heading?: string
  readonly lead?: string
  readonly columns?: string
  readonly tone?: string
  readonly numbered?: string
  readonly anchor?: string
}>) => (
  <section className="cards" id={props.anchor} data-tone={props.tone ?? 'paper'}>
    {props.eyebrow !== undefined && <p className="eyebrow">{props.eyebrow}</p>}
    {props.heading !== undefined && <h2>{props.heading}</h2>}
    {props.lead !== undefined && (
      <p className="lead">
        <Prose text={props.lead} />
      </p>
    )}
    <div
      className="card-grid"
      data-columns={props.columns ?? 'three'}
      data-numbered={props.numbered ?? 'no'}
      data-seam={props.tone === 'ink' ? '1' : undefined}
    >
      {children}
    </div>
  </section>
)

export const CardView = ({
  props,
}: BlockViewProps<{
  readonly title?: string
  readonly badge?: string
  readonly body?: string
  readonly codeComment?: string
  readonly code?: string
  readonly tone?: string
}>) => (
  <article className="card" data-tone={props.tone ?? 'paper'}>
    <h3>
      {props.title}
      {props.badge !== undefined && props.badge !== '' && (
        <span className="badge">{props.badge}</span>
      )}
    </h3>
    <p>
      <Prose text={props.body ?? ''} />
    </p>
    {props.code !== undefined && props.code !== '' && (
      <div className="card-code">
        {props.codeComment !== undefined && (
          <span className="code-comment">{props.codeComment}</span>
        )}
        <code>{props.code}</code>
      </div>
    )}
  </article>
)

export const DeclarationView = ({
  props,
}: BlockViewProps<{
  readonly eyebrow?: string
  readonly heading?: string
  readonly lead?: string
  readonly sample?: { readonly language?: string; readonly source?: string }
  readonly outcomes?: readonly { readonly call?: string; readonly result?: string }[]
}>) => {
  /*
   * One field, three cards.
   *
   * The design shows the declaration as separate pieces — the model, the resource, the
   * application — because they are three decisions rather than one listing. A blank
   * line is where the author of the field already separated them, so that is the seam
   * rather than three fields nobody would keep in step.
   */
  const parts = (props.sample?.source ?? '').split(/\n{2,}/).filter((part) => part !== '')

  return (
    <section className="declaration">
      <div className="declaration-copy">
        {props.eyebrow !== undefined && <p className="eyebrow">{props.eyebrow}</p>}
        <h2>{props.heading}</h2>
        {props.lead !== undefined && (
          <p className="lead">
            <Prose text={props.lead} />
          </p>
        )}

        {parts.map((part) => (
          <pre className="code-block" key={part.slice(0, 40)}>
            <code data-language={props.sample?.language}>{part}</code>
          </pre>
        ))}
      </div>

      {props.outcomes !== undefined && props.outcomes.length > 0 && (
        <ul className="outcomes">
          {props.outcomes.map((outcome) => (
            <li key={outcome.call ?? outcome.result}>
              <code>{outcome.call}</code>
              <span>{outcome.result}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export const MutationView = ({
  props,
}: BlockViewProps<{
  readonly eyebrow?: string
  readonly heading?: string
  readonly lead?: string
  readonly pipeline?: readonly string[]
  readonly loop?: { readonly language?: string; readonly source?: string }
  readonly anchor?: string
}>) => (
  <section className="mutation" id={props.anchor}>
    {props.eyebrow !== undefined && <p className="eyebrow">{props.eyebrow}</p>}
    <div className="section-head">
      <h2>{props.heading}</h2>
      {props.lead !== undefined && (
        <p className="lead">
          <Prose text={props.lead} />
        </p>
      )}
    </div>
    {props.pipeline !== undefined && props.pipeline.length > 0 && (
      <ol className="pipeline">
        {props.pipeline.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    )}
    {props.loop?.source !== undefined && props.loop.source !== '' && (
      <pre className="code-block code-block-dark">
        <code data-language={props.loop.language}>{props.loop.source}</code>
      </pre>
    )}
  </section>
)

/**
 * Tabs over the children, labelled from the children themselves.
 *
 * `block.children` is the tree rather than the rendered output, so the label a tab
 * needs is readable here without the parent being told twice what its children are —
 * add a screenshot in Studio and its tab appears with it.
 */
export const ShowcaseView = ({
  props,
  block,
  children,
}: BlockViewProps<{
  readonly eyebrow?: string
  readonly heading?: string
  readonly lead?: string
  readonly address?: string
  readonly anchor?: string
}>) => {
  const [active, setActive] = useState(0)
  const shots = block.children

  return (
    <section className="showcase" id={props.anchor}>
      {props.eyebrow !== undefined && <p className="eyebrow">{props.eyebrow}</p>}
      <div className="section-head">
        <h2>{props.heading}</h2>
        {props.lead !== undefined && (
          <p className="lead">
            <Prose text={props.lead} />
          </p>
        )}
      </div>

      {shots.length > 1 && (
        <div className="tabs" role="tablist">
          {shots.map((shot, index) => (
            <button
              key={shot.id}
              type="button"
              role="tab"
              aria-selected={index === active}
              onClick={() => setActive(index)}
            >
              {String(shot.props.label ?? '')}
            </button>
          ))}
        </div>
      )}

      {/* The frame is a browser: an address bar, and the screenshot inside it. It says
          this is a running application rather than a picture of one. */}
      <div className="frame">
        <div className="frame-bar">
          <span className="frame-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          {props.address !== undefined && <span className="address">{props.address}</span>}
        </div>

        <div className="shots" data-active={active}>
          {children}
        </div>
      </div>
    </section>
  )
}

export const ShotView = ({
  props,
}: BlockViewProps<{
  readonly label?: string
  readonly image?: string
  readonly caption?: string
}>) => (
  <figure className="shot">
    {props.label !== undefined && <figcaption className="shot-label">{props.label}</figcaption>}
    {props.image !== undefined && (
      <img src={props.image} alt={props.caption ?? props.label ?? ''} />
    )}
    {props.caption !== undefined && <p className="caption">{props.caption}</p>}
  </figure>
)

export const PackagesView = ({
  props,
  children,
}: BlockViewProps<{
  readonly eyebrow?: string
  readonly heading?: string
  readonly lead?: string
  readonly anchor?: string
}>) => (
  <section className="packages" id={props.anchor}>
    {props.eyebrow !== undefined && <p className="eyebrow">{props.eyebrow}</p>}
    <h2>{props.heading}</h2>
    {props.lead !== undefined && (
      <p className="lead">
        <Prose text={props.lead} />
      </p>
    )}
    <ul className="package-list">{children}</ul>
  </section>
)

export const PackageRowView = ({
  props,
}: BlockViewProps<{ readonly name?: string; readonly summary?: string }>) => (
  <li className="package-row">
    <code>{props.name}</code>
    <span>{props.summary}</span>
  </li>
)

export const ComparisonView = ({
  props,
}: BlockViewProps<{
  readonly eyebrow?: string
  readonly heading?: string
  readonly lead?: string
  readonly columns?: readonly string[]
  readonly rows?: readonly { readonly label?: string; readonly cells?: readonly string[] }[]
  readonly note?: string
}>) => (
  <section className="comparison">
    {props.eyebrow !== undefined && <p className="eyebrow">{props.eyebrow}</p>}
    <h2>{props.heading}</h2>
    {props.lead !== undefined && (
      <p className="lead">
        <Prose text={props.lead} />
      </p>
    )}
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            {(props.columns ?? []).map((column, index) => (
              <th key={column === '' ? `column-${index}` : column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(props.rows ?? []).map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {(row.cells ?? []).map((cell, index) => (
                // A cell belongs to a column, so the column's own heading names it —
                // and the first cell is this project's, which is the one the table
                // tints.
                <td
                  key={`${row.label}-${props.columns?.[index + 1] ?? index}`}
                  data-ours={index === 0 ? '1' : undefined}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {props.note !== undefined && <p className="caption">{props.note}</p>}
  </section>
)

export const StartView = ({
  props,
}: BlockViewProps<{
  readonly heading?: string
  readonly lead?: string
  readonly command?: string
  readonly transcript?: { readonly language?: string; readonly source?: string }
  readonly actionLabel?: string
  readonly actionHref?: string
  readonly secondaryLabel?: string
  readonly secondaryHref?: string
  readonly anchor?: string
}>) => (
  <section className="start" id={props.anchor}>
    <div className="start-panel">
      <div className="start-copy">
        <h2>{props.heading}</h2>
        {props.lead !== undefined && (
          <p className="lead">
            <Prose text={props.lead} />
          </p>
        )}
        {props.command !== undefined && props.command !== '' && (
          <Terminal command={props.command} />
        )}
        <div className="start-actions">
          {props.actionLabel !== undefined && props.actionHref !== undefined && (
            <a className="button-light" href={props.actionHref}>
              {props.actionLabel}
            </a>
          )}
          {props.secondaryLabel !== undefined && props.secondaryHref !== undefined && (
            <a className="button-outline" href={props.secondaryHref}>
              {props.secondaryLabel}
            </a>
          )}
        </div>
      </div>

      {props.transcript?.source !== undefined && props.transcript.source !== '' && (
        <pre className="start-transcript">
          <code data-language={props.transcript.language}>{props.transcript.source}</code>
        </pre>
      )}
    </div>
  </section>
)

/**
 * Drawn in place of a block this bundle does not know.
 *
 * A page outlives the code that renders it, and a block removed from the site is a
 * block still sitting in a stored tree. Saying so beats rendering nothing.
 */
export const MissingView = ({ block }: BlockViewProps) => (
  <p className="missing">No view for a “{block.type}” block.</p>
)
