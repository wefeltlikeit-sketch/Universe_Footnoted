import { useMemo, useState } from 'react';
import { app, useApp } from '../state';
import { findPaths, PATH_MODES, type Path, type PathMode } from '../../graph/paths';
import Constellation from '../map/Constellation';
import { pathMap } from '../map/data';
import ConceptSearch from '../components/ConceptSearch';
import { FAMILY_OF, familyVar } from '../map/visual';

const SUGGESTIONS: [string, string][] = [
  ['epoisses', 'dirac'], ['coffee', 'bells-theorem'], ['passport', 'entropy'], ['chalk', 'cryptography'],
];

/** FIND A PATH — defensible bridges between any two ideas. */
export default function PathFinder() {
  const version = useApp((s) => s.graphVersion);
  const busy = useApp((s) => s.busy);
  const [a, setA] = useState({ text: '', id: '' });
  const [b, setB] = useState({ text: '', id: '' });
  const [pair, setPair] = useState<[string, string] | null>(null);
  const [only, setOnly] = useState<PathMode | 'all'>('all');
  const [open, setOpen] = useState<string | null>(null);
  const [focus, setFocus] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const g = app.graph;

  const paths: Path[] = useMemo(() => {
    if (!pair) return [];
    return findPaths(g, pair[0], pair[1], only === 'all' ? undefined : [only]);
  }, [pair, only, version]);

  const run = async (aq = a, bq = b) => {
    setNote(null);
    const [ia, ib] = [await app.ensure(aq.id || aq.text), await app.ensure(bq.id || bq.text)];
    if (!ia || !ib) return;
    setA({ id: ia, text: g.get(ia)!.title });
    setB({ id: ib, text: g.get(ib)!.title });
    setPair([ia, ib]);
    setFocus(0);
    if (!findPaths(g, ia, ib, ['shortest']).length) {
      if (app.ai.available) await bridge(ia, ib);
      else setNote('The atlas knows no defensible route between these yet. Connect an AI provider in Settings to search for new bridges, or wander toward one of them first.');
    }
  };

  const bridge = async (ia: string, ib: string) => {
    app.set({ busy: 'Searching for conceptual bridges…' });
    try {
      const n = await app.ai.bridge(ia, ib, (busy) => app.set({ busy }));
      setNote(n ? `${n} new connections were proposed, refereed and added to the atlas.` : 'No new bridges survived the referee.');
    } catch (e) {
      app.flash(e instanceof Error ? e.message : 'Bridge search failed.', 'error');
    } finally {
      app.set({ busy: null });
    }
  };

  const shown = paths[focus] ?? paths[0];
  const map = shown ? pathMap(shown.nodes, g) : { nodes: [], links: [] };

  return (
    <>
      <Constellation graph={g} nodes={map.nodes} links={map.links} fit="all" offset={window.innerWidth > 1100 ? 0.27 : 0} onSelect={(id) => app.begin(id)} />
      <section className="study">
        <span className="label">Find a path</span>
        <h2>Between any two things</h2>
        <p className="lede">Not the most similar route: the most meaningful ones. Every step is a connection you can inspect.</p>
        <div className="pair">
          <ConceptSearch value={a.text} onChange={(t) => setA({ text: t, id: '' })} placeholder="From…" onPick={(v) => setA({ text: v.text, id: v.id ?? '' })} />
          <span className="amp">&amp;</span>
          <ConceptSearch value={b.text} onChange={(t) => setB({ text: t, id: '' })} placeholder="To…" onPick={(v) => setB({ text: v.text, id: v.id ?? '' })} />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn primary" disabled={!a.text || !b.text || !!busy} onClick={() => run()}>Find paths</button>
          {pair && app.ai.available && <button className="btn" disabled={!!busy} onClick={() => bridge(pair[0], pair[1])}>Search for more bridges</button>}
          {!pair && (
            <span className="label" style={{ marginLeft: 6 }}>
              try{' '}
              {SUGGESTIONS.map(([x, y], i) => (
                <button key={i} className="prov" style={{ marginRight: 10 }} onClick={() => {
                  const na = { id: x, text: g.get(x)!.title }, nb = { id: y, text: g.get(y)!.title };
                  setA(na); setB(nb); void run(na, nb);
                }}>{g.get(x)?.title} &amp; {g.get(y)?.title}</button>
              ))}
            </span>
          )}
        </div>
        {busy && <p className="writing"><span className="orbit" /> {busy}</p>}
        {note && <p className="lede" style={{ marginTop: 16 }}>{note}</p>}

        {pair && (
          <div className="modes" role="group" aria-label="Kinds of path">
            <button aria-pressed={only === 'all'} onClick={() => setOnly('all')}>All</button>
            {PATH_MODES.map((m) => <button key={m.id} aria-pressed={only === m.id} onClick={() => setOnly(m.id)}>{m.label}</button>)}
          </div>
        )}

        {paths.map((p, pi) => {
          const info = PATH_MODES.find((m) => m.id === p.mode)!;
          return (
            <div key={p.nodes.join('>')} className="path" onMouseEnter={() => setFocus(pi)}>
              <div className="ptitle">
                <span className="label">
                  <b>{info.label}</b>
                  {p.also.map((m) => <b key={m}> · {PATH_MODES.find((x) => x.id === m)!.label}</b>)}
                  {' '}· {p.also.length ? 'several kinds of path agree on this route.' : info.blurb}
                </span>
                <span className="label">{p.score.steps} steps · weakest link {Math.round(p.score.weakest * 100)}%</span>
              </div>
              <div className="chain">
                {p.nodes.map((id, i) => {
                  const e = p.edges[i];
                  const key = `${pi}:${i}`;
                  return (
                    <span key={id} style={{ display: 'contents' }}>
                      <button className="c" onClick={() => app.begin(id)}>{g.get(id)?.title}</button>
                      {e && (
                        <button className="link" aria-expanded={open === key} title={e.why} onClick={() => setOpen(open === key ? null : key)}
                          style={{ borderBottom: `1px solid ${familyVar(FAMILY_OF[e.type])}` }}>→</button>
                      )}
                    </span>
                  );
                })}
              </div>
              {p.edges.map((e, i) => open === `${pi}:${i}` && (
                <div key={e.id} className="reason">
                  <span className="label">{g.get(p.nodes[i])?.title} → {g.get(p.nodes[i + 1])?.title} · {e.type} · {e.status} · {Math.round(e.confidence * 100)}%</span>
                  {e.why}{' '}
                  <button className="prov" onClick={() => app.set({ overlay: { kind: 'edge', edgeId: e.id, from: p.nodes[i] } })}>provenance</button>
                </div>
              ))}
              <div style={{ marginTop: 12 }}>
                <button className="btn quiet" onClick={() => app.walk(p.nodes)}>Walk this path →</button>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
