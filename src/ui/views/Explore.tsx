import { useEffect, useMemo, useRef, useState } from 'react';
import { app, useApp } from '../state';
import Constellation from '../map/Constellation';
import { journeyMap } from '../map/data';
import * as J from '../../narrative/journey';
import Reader from './Reader';
import { IconBook, IconZoomOut } from '../components/Icons';

/**
 * Wandering. The page floats over the map of where you have been; following a footnote moves the
 * camera across the sky while the previous page slides into the trail.
 */
export default function Explore() {
  const journey = useApp((s) => s.journey);
  const version = useApp((s) => s.graphVersion);
  const mapOnly = useApp((s) => s.mapOnly);
  const rabbit = useApp((s) => s.settings.rabbitHole);
  const width = useWidth();
  const pageRef = useRef<HTMLDivElement>(null);
  const cursorKey = journey ? `${journey.id}:${journey.cursor}` : '';

  // Each arrival starts at the top of its page.
  useEffect(() => {
    pageRef.current?.scrollTo({ top: 0 });
  }, [cursorKey]);

  const map = useMemo(() => (journey ? journeyMap(journey, app.graph) : null), [journey, version]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest('input, textarea')) return;
      if (e.key === 'm') app.set({ mapOnly: !app.state.mapOnly });
      if (e.key === '?') app.set({ overlay: { kind: 'howdid' } });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!journey || !map) return null;
  const here = J.current(journey).conceptId;
  const concept = app.graph.get(here);
  const originId = J.origin(journey).conceptId;
  const depth = J.depth(journey);
  const sink = rabbit ? Math.min(1, depth / 18) : 0;
  const offset = mapOnly || width < 760 ? 0 : Math.min(0.32, (Math.min(880, width - 44) + 22) / (2 * width));

  return (
    <div className={rabbit ? 'rabbit' : ''} style={{ ['--sink' as string]: sink, position: 'absolute', inset: 0 }}>
      <Constellation
        graph={app.graph}
        nodes={map.nodes}
        links={map.links}
        focus={mapOnly ? null : here}
        fit={mapOnly ? 'all' : 'focus'}
        offset={offset}
        sink={sink}
        originId={originId}
        onSelect={(id) => app.follow(id, 'map')}
      />
      <div className="vignette" />

      <div className={`page-wrap ${mapOnly ? 'away' : ''}`}>
        <Trail />
        <div className="page" ref={pageRef}>{concept && <Reader concept={concept} journey={journey} />}</div>
        <div className="actions">
          <button className="btn primary" onClick={() => app.surprise()}>✦ Take me somewhere unexpected</button>
          {depth > 0 && <button className="btn" onClick={() => app.set({ overlay: { kind: 'howdid' } })}>How did I get here?</button>}
          <button className="btn quiet" onClick={() => app.set({ mapOnly: true })}>Zoom out</button>
        </div>
      </div>

      <div className="mapcontrols">
        <button className="iconbtn" title={mapOnly ? 'Back to the page (m)' : 'Zoom out to the whole journey (m)'} onClick={() => app.set({ mapOnly: !mapOnly })}>
          {mapOnly ? <IconBook /> : <IconZoomOut />}
        </button>
      </div>

      {(rabbit || mapOnly) && depth > 0 && (
        <div className="depthbox" aria-live="polite">
          <span className="d">DEPTH {depth}</span>
          <span className="began">You began with {app.graph.get(originId)?.title}</span>
          <span className="now">You are now exploring {concept?.title}</span>
        </div>
      )}
    </div>
  );
}

/** Previous context stays visible: the route from the origin, each stop one click away. */
function Trail() {
  const journey = useApp((s) => s.journey)!;
  const line = J.lineage(journey);
  const g = app.graph;
  const shown = line.length > 7 ? [line[0], -1, ...line.slice(-5)] : line;
  return (
    <nav className="trail" aria-label="Your path">
      {shown.map((i, k) => {
        const last = k === shown.length - 1;
        return (
          <span key={`${i}-${k}`} style={{ display: 'contents' }}>
            {i === -1 ? (
              <button onClick={() => app.set({ overlay: { kind: 'howdid' } })} title="Show the whole route">…</button>
            ) : last ? (
              <span className="here">{g.get(journey.steps[i].conceptId)?.title}</span>
            ) : (
              <button onClick={() => app.revisit(i)}>{g.get(journey.steps[i].conceptId)?.title}</button>
            )}
            {!last && <span className="sep">→</span>}
          </span>
        );
      })}
    </nav>
  );
}

function useWidth() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return w;
}
