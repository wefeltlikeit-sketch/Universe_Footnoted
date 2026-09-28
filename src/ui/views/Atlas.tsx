import { useMemo } from 'react';
import { app, useApp } from '../state';
import { buildAtlas, uncharted } from '../../graph/atlas';
import Constellation from '../map/Constellation';
import { atlasMap } from '../map/data';
import * as J from '../../narrative/journey';

/** THE ATLAS — every evening's curiosity, combined. Structure emerges; nothing is pre-sorted. */
export default function Atlas() {
  const journeys = useApp((s) => s.journeys);
  const version = useApp((s) => s.graphVersion);
  const g = app.graph;
  const atlas = useMemo(() => buildAtlas(g, journeys), [journeys, version]);
  const frontier = useMemo(() => uncharted(g, atlas, 5), [atlas]);
  const map = useMemo(() => atlasMap(atlas, g, frontier.map((f) => f.id)), [atlas, frontier]);
  const deepest = journeys.reduce((m, j) => Math.max(m, ...j.steps.map((_, i) => J.depth(j, i))), 0);

  const explore = (near: string, target: string) => {
    void app.begin(near).then(() => app.follow(target, 'exit'));
  };

  return (
    <>
      <Constellation
        graph={g} nodes={map.nodes} links={map.links} fit="all"
        offset={window.innerWidth > 1100 ? 0.25 : 0}
        clusterLabels={atlas.clusters.slice(0, 8).map((c) => ({ cluster: c.id, label: c.label }))}
        onSelect={(id) => app.begin(id)}
      />
      <section className="study" style={{ width: 'min(520px, calc(100vw - 44px))' }}>
        <span className="label">Your atlas</span>
        <h2>The shape of your curiosity</h2>
        {atlas.visits.size === 0 ? (
          <p className="lede">Empty for now. Every journey you take adds to it: concepts you return to grow brighter, and regions form on their own.</p>
        ) : (
          <>
            <div className="stats">
              <div><div className="big">{atlas.visits.size}</div><span className="label">concepts visited</span></div>
              <div><div className="big">{journeys.length}</div><span className="label">journeys</span></div>
              <div><div className="big">{deepest}</div><span className="label">deepest dive</span></div>
            </div>

            <span className="label">Regions that emerged</span>
            <div className="legend" style={{ marginBottom: 26 }}>
              {atlas.clusters.slice(0, 10).map((c) => (
                <button key={c.id} className="chip" onClick={() => app.begin(c.members[0])} title={c.members.map((m) => g.get(m)?.title).join(', ')}>
                  {c.label} <span style={{ color: 'var(--faint)' }}>{c.members.length}</span>
                </button>
              ))}
            </div>

            <span className="label">Uncharted territory</span>
            <ul className="frontier">
              {frontier.map((f) => (
                <li key={f.id}>
                  <p>{f.message}</p>
                  <button className="btn quiet" style={{ paddingLeft: 0 }} onClick={() => explore(f.near, f.id)}>
                    Cross from {g.get(f.near)?.title} into {g.get(f.id)?.title} →
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  );
}
