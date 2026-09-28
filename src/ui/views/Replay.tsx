import { useEffect, useMemo, useRef, useState } from 'react';
import { app, useApp } from '../state';
import Constellation from '../map/Constellation';
import { journeyMap } from '../map/data';
import * as J from '../../narrative/journey';

/** Visual replay: the constellation redrawn in the order it was discovered. */
export default function Replay({ journeyId }: { journeyId: string }) {
  const journey = useApp((s) => s.journeys.find((j) => j.id === journeyId));
  const [t, setT] = useState(0.001);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const raf = useRef(0);
  const g = app.graph;

  const order = useMemo(() => (journey ? J.discoveryOrder(journey) : []), [journey]);
  const map = useMemo(() => (journey ? journeyMap(journey, g, { exits: false }) : { nodes: [], links: [] }), [journey]);
  const n = order.length;

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setT((x) => {
        const next = Math.min(n, x + dt * 0.7 * speed);
        if (next >= n) setPlaying(false);
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing, speed, n]);

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.key === 'Escape') app.set({ overlay: null });
      if (e.key === ' ') { e.preventDefault(); setPlaying((p) => !p); }
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, []);

  if (!journey) return null;
  const idx = Math.max(0, Math.min(n - 1, Math.ceil(t) - 1));
  const step = order[idx];
  const c = g.get(step.conceptId);
  const e = step.edgeId ? g.edges.get(step.edgeId) : undefined;
  const from = step.parent !== null ? g.get(journey.steps[step.parent].conceptId) : undefined;

  return (
    <div className="replay-root">
      <Constellation graph={g} nodes={map.nodes} links={map.links} replay={t} originId={J.origin(journey).conceptId} />
      <div className="replaybar">
        <button className="btn" onClick={() => { if (t >= n) setT(0.001); setPlaying(!playing); }}>{playing ? 'Pause' : t >= n ? 'Again' : 'Play'}</button>
        <button className="btn quiet" onClick={() => setSpeed(speed === 1 ? 2.5 : 1)}>{speed === 1 ? '1×' : '2.5×'}</button>
        <span className="label">{idx + 1} / {n} · {J.displayName(journey, g)}</span>
        <button className="btn quiet" onClick={() => app.set({ overlay: null })}>Close</button>
      </div>
      <div className="replaycap" key={idx}>
        <div className="t page-inner">{c?.title}</div>
        {e && from && <div className="w page-inner">from {from.title}: {e.why}</div>}
      </div>
    </div>
  );
}
