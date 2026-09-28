import { useMemo } from 'react';
import { app, useApp } from '../state';
import Constellation from '../map/Constellation';
import { skyMap } from '../map/data';
import ConceptSearch from '../components/ConceptSearch';
import { displayName } from '../../narrative/journey';

/** Seven ordinary things. Each is three clicks from something profound. */
const STARTERS: [string, string][] = [
  ['Cheese', 'cheese'],
  ['A clock', 'clock'],
  ['A photograph', 'photography'],
  ['A cup of coffee', 'coffee'],
  ['The Moon', 'moon'],
  ['A passport', 'passport'],
  ['A number', 'number'],
];

export default function Home() {
  const version = useApp((s) => s.graphVersion);
  const journeys = useApp((s) => s.journeys);
  const busy = useApp((s) => s.busy);
  const sky = useMemo(() => skyMap(app.graph), [version > 0]);

  return (
    <>
      <Constellation graph={app.graph} nodes={sky.nodes} links={sky.links} fit="all" labels="none" interactive={false} />
      <main className="landing">
        <h1>Everything you know leads <em>somewhere else.</em></h1>
        <nav className="starters" aria-label="Begin with an ordinary thing">
          {STARTERS.map(([label, id], i) => (
            <button key={id} data-n={i + 1} onClick={() => app.begin(id)}>{label}</button>
          ))}
        </nav>
        <div className="begin">
          <span className="label">or begin with anything</span>
          <ConceptSearch placeholder="a word, a place, a person, a thing…" onPick={(v) => app.begin(v.id ?? v.text)} />
        </div>
        {busy && <p className="writing"><span className="orbit" /> {busy}</p>}
        {journeys.length > 0 && !busy && (
          <div className="recent">
            <span className="label">continue a journey</span>
            {journeys.slice(0, 3).map((j) => (
              <button key={j.id} onClick={() => app.openJourney(j.id)}>{displayName(j, app.graph)}</button>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
