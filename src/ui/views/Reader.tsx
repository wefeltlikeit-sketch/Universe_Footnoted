import { Fragment, useMemo, useState } from 'react';
import type { Concept, Journey } from '../../model/types';
import { parseBody } from '../../graph/markup';
import { leap } from '../../graph/KnowledgeGraph';
import { usable } from '../../graph/paths';
import { app, useApp } from '../state';
import * as J from '../../narrative/journey';
import { FAMILY_OF, familyVar } from '../map/visual';

/**
 * One page of the book. Footnote markers sit in the text; their notes sit in the margin, each saying
 * why the connection holds. Hover to read, click to travel.
 */
export default function Reader({ concept, journey }: { concept: Concept; journey: Journey }) {
  const g = app.graph;
  useApp((s) => s.graphVersion);
  const pending = useApp((s) => s.pending);
  const busy = useApp((s) => s.busy);
  const strangeness = useApp((s) => s.settings.strangeness);
  const leapInfo = useApp((s) => s.leap);
  const [lit, setLit] = useState<string | null>(null);

  const parsed = useMemo(() => parseBody(concept.body), [concept.body]);
  const d = J.depth(journey);
  const step = J.current(journey);
  const from = step.parent !== null ? g.get(journey.steps[step.parent].conceptId) : undefined;

  const noteFor = (target: string) => {
    const e = g.edge(concept.id, target);
    const c = g.get(target);
    const far = leap(concept, c) >= 0.9;
    return { e, c, far };
  };

  // The depth dial shifts emphasis without hiding anything: familiar dims far notes, strange dims near ones.
  const dimmed = (far: boolean) => (strangeness < 0.34 && far) || (strangeness > 0.66 && !far);

  const inBody = new Set(parsed.footnotes.map((f) => f.target));
  const further = g.neighbors(concept.id)
    .filter((n) => !inBody.has(n.id) && g.get(n.id))
    .map((n) => ({ ...n, far: leap(concept, g.get(n.id)) }))
    .sort((a, b) => Math.abs(a.far - strangeness) - Math.abs(b.far - strangeness) || g.gravity(b.id) - g.gravity(a.id))
    .slice(0, 9);

  const writing = pending === concept.id;
  const source = concept.wiki ? g.sources.get(`wp:${concept.wiki}`) : undefined;

  return (
    <article className="page-inner" key={concept.id + journey.cursor}>
      <div className="folio">
        <span className="label">
          {d === 0 ? 'Origin' : <>Depth <b>{d}</b></>}
          {from && <> · from {from.title}</>}
        </span>
        <span className="label">{originLine(concept)}</span>
      </div>
      {leapInfo && step.via === 'surprise' && (
        <p className="reason" style={{ marginTop: 0, marginBottom: 20 }}>
          <span className="label">✦ somewhere unexpected</span>
          {leapInfo.text}{' '}
          <button className="prov" onClick={() => app.set({ overlay: { kind: 'howdid' } })}>see how we got here</button>
        </p>
      )}
      <h2>{concept.title}</h2>
      <p className="kicker">{concept.kicker || ' '}</p>

      {concept.stub || writing ? (
        <div>
          {writing ? (
            <p className="writing"><span className="orbit" /> {busy ?? 'Writing this page…'}</p>
          ) : (
            <p className="writing">
              This page has not been written yet.{' '}
              <button className="btn primary" onClick={() => app.write(concept.id)}>
                {app.ai.available ? 'Write it' : 'Look it up'}
              </button>
            </p>
          )}
        </div>
      ) : (
        <div className="leaf">
          <div className="body">
            <p>
              {parsed.segments.map((s, i) =>
                s.kind === 'text' ? (
                  <Fragment key={i}>{s.text}</Fragment>
                ) : (
                  <a
                    key={i}
                    className={`note ${lit === s.target ? 'lit' : ''} ${noteFor(s.target).far ? 'far' : ''} ${dimmed(noteFor(s.target).far) ? 'muted' : ''}`}
                    href={`#/c/${encodeURIComponent(s.target)}`}
                    onMouseEnter={() => setLit(s.target)}
                    onMouseLeave={() => setLit(null)}
                    onFocus={() => setLit(s.target)}
                    onClick={(e) => {
                      e.preventDefault();
                      app.follow(s.target, 'footnote');
                    }}
                  >
                    {s.text}<sup>{s.n}</sup>
                  </a>
                ),
              )}
            </p>
          </div>
          <aside className="margin" aria-label="Footnotes">
            {parsed.footnotes.map((f) => {
              const { e, c } = noteFor(f.target);
              if (!e || !c) return null;
              return (
                <div
                  key={f.target}
                  className={`sidenote ${lit === f.target ? 'lit' : ''}`}
                  onMouseEnter={() => setLit(f.target)}
                  onMouseLeave={() => setLit(null)}
                >
                  <button className="head" style={{ textAlign: 'left' }} onClick={() => app.follow(f.target, 'footnote')}>
                    <span className="n">{f.n}</span>
                    <span className="t">{c.title}</span>
                  </button>
                  <div className="why">{e.why}</div>
                  <div className="meta">
                    <span className="glyph" style={{ background: familyVar(FAMILY_OF[e.type]) }} />
                    <span className="label">{e.type} · {e.status}</span>
                    <button className="prov" onClick={() => app.set({ overlay: { kind: 'edge', edgeId: e.id, from: concept.id } })}>why?</button>
                  </div>
                </div>
              );
            })}
          </aside>
        </div>
      )}

      {further.length > 0 && (
        <section className="exits">
          <span className="label">{strangeness > 0.66 ? 'Stranger exits' : strangeness < 0.34 ? 'Nearby' : 'Other exits'}</span>
          <div className="row">
            {further.map(({ id, edge }) => (
              <button
                key={id}
                className="chip"
                title={edge.why}
                onClick={() => app.follow(id, 'exit')}
                style={usable(edge) ? undefined : { opacity: 0.6 }}
              >
                <span className="dot" style={{ background: familyVar(FAMILY_OF[edge.type]) }} />
                {g.get(id)!.title}
              </button>
            ))}
          </div>
        </section>
      )}

      {!concept.stub && (
        <footer className="colophon">
          <span className="label">Reference</span>
          {source?.url ? <a href={source.url} target="_blank" rel="noreferrer">{source.title}, {source.publisher}</a> : <span className="label">—</span>}
        </footer>
      )}
    </article>
  );
}

function originLine(c: Concept): string {
  switch (c.origin.kind) {
    case 'seed': return 'Curated';
    case 'ai': return `Written by ${c.origin.model ?? 'AI'}`;
    case 'wikipedia': return 'From Wikipedia · unrefereed';
    case 'import': return 'Imported';
    default: return '';
  }
}
