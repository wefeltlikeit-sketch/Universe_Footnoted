import { useRef, useState } from 'react';
import { app, useApp } from '../state';
import * as J from '../../narrative/journey';
import { download, filenameFor, parseJourneyFile, toJSON, toMarkdown, toSVG } from '../../narrative/export';

/** Saved journeys: named, reopened, continued, exported, replayed. */
export default function Journeys() {
  const journeys = useApp((s) => s.journeys);
  const theme = useApp((s) => s.settings.theme);
  useApp((s) => s.graphVersion);
  const [confirm, setConfirm] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const g = app.graph;

  const importFile = async (file: File) => {
    try {
      const f = parseJourneyFile(await file.text());
      await app.repo.saveKnowledge({
        sources: f.sources,
        concepts: f.concepts.filter((c) => !g.get(c.id) || g.get(c.id)!.stub).map((c) => ({ ...c, origin: c.origin.kind === 'seed' ? c.origin : { ...c.origin, kind: 'import' as const } })),
        edges: f.edges.filter((e) => !g.edges.has(e.id)),
      });
      const j = { ...f.journey, id: journeys.some((x) => x.id === f.journey.id) ? `${f.journey.id}-i` : f.journey.id };
      await app.persist(j);
      app.flash(`Imported “${J.displayName(j, g)}”.`);
    } catch (e) {
      app.flash(e instanceof Error ? e.message : 'Could not import that file.', 'error');
    }
  };

  return (
    <section className="study">
      <span className="label">Journeys</span>
      <h2>Where curiosity went</h2>
      <p className="lede">Every journey is saved as you travel. Name the good ones.</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button className="btn" onClick={() => fileRef.current?.click()}>Import a journey</button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => e.target.files?.[0] && importFile(e.target.files[0])} />
      </div>
      {journeys.length === 0 && <p className="lede">No journeys yet. Begin with something ordinary.</p>}
      <ul className="jlist">
        {journeys.map((j) => {
          const concepts = J.discoveryOrder(j).length;
          const deepest = Math.max(...j.steps.map((_, i) => J.depth(j, i)));
          return (
            <li key={j.id}>
              <input
                className="jname" defaultValue={j.name} placeholder={J.autoName(j, g)} aria-label="Journey name"
                onBlur={(e) => e.target.value !== j.name && app.rename(j.id, e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
              />
              <div className="jmeta">
                {concepts} concepts · {deepest} deep · {new Date(j.updatedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                {' · '}{J.discoveryOrder(j).slice(0, 6).map((s) => g.get(s.conceptId)?.title).join(' → ')}{concepts > 6 ? ' …' : ''}
              </div>
              <div className="jacts">
                <button className="btn" onClick={() => app.openJourney(j.id)}>Continue</button>
                <button className="btn" onClick={() => app.set({ overlay: { kind: 'replay', journeyId: j.id } })}>Replay</button>
                <button className="btn quiet" onClick={() => download(filenameFor(j, g, 'json'), toJSON(j, g), 'application/json')}>JSON</button>
                <button className="btn quiet" onClick={() => download(filenameFor(j, g, 'md'), toMarkdown(j, g), 'text/markdown')}>Markdown</button>
                <button className="btn quiet" onClick={() => download(filenameFor(j, g, 'svg'), toSVG(j, g, theme), 'image/svg+xml')}>Image</button>
                {confirm === j.id ? (
                  <>
                    <button className="btn" style={{ color: 'var(--bad)' }} onClick={() => { void app.remove(j.id); setConfirm(null); }}>Delete for good</button>
                    <button className="btn quiet" onClick={() => setConfirm(null)}>Keep</button>
                  </>
                ) : (
                  <button className="btn quiet" onClick={() => setConfirm(j.id)}>Delete</button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
