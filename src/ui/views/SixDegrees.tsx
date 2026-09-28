import { useMemo, useState } from 'react';
import { app, useApp } from '../state';
import { describeScore, pickPair, scoreChain, type Step } from '../../graph/game';
import { findPath, usable } from '../../graph/paths';
import Constellation from '../map/Constellation';
import { pathMap } from '../map/data';
import ConceptSearch from '../components/ConceptSearch';

/** SIX DEGREES OF KNOWLEDGE — you connect; the referee judges each step. */
export default function SixDegrees() {
  useApp((s) => s.graphVersion);
  const busy = useApp((s) => s.busy);
  const g = app.graph;
  const [played, setPlayed] = useState<string[]>([]);
  const [pair, setPair] = useState<[string, string]>(() => pickPair(g));
  const [chain, setChain] = useState<Step[]>([]);
  const [rejected, setRejected] = useState<Step | null>(null);
  const [next, setNext] = useState('');
  const [reason, setReason] = useState('');
  const [reveal, setReveal] = useState(false);

  const [a, b] = pair;
  const at = chain.length ? chain[chain.length - 1].to : a;
  const done = at === b;
  const score = useMemo(() => (done ? scoreChain(g, a, b, chain) : null), [done, chain]);

  const newPair = () => {
    const p = pickPair(g, Math.random, [...played, `${a}|${b}`]);
    setPlayed([...played, `${a}|${b}`]);
    setPair(p);
    setChain([]);
    setRejected(null);
    setReveal(false);
  };

  const move = async (pick: { id?: string; text: string }) => {
    setRejected(null);
    let to = pick.id ?? g.resolve(pick.text)?.id;
    if (!to && app.ai.available) to = (await app.ensure(pick.text)) ?? undefined;
    if (!to) {
      setRejected({ from: at, to: pick.text, verdict: 'rejected', confidence: 0, judge: 'graph', explanation: `“${pick.text}” is not in the atlas yet. Connect an AI referee in Settings to play with anything.` });
      return;
    }
    if (to === at) return;
    const step = await judge(at, to, reason.trim());
    if (step.verdict === 'rejected') setRejected(step);
    else {
      setChain([...chain, step]);
      setNext('');
      setReason('');
    }
  };

  const judge = async (from: string, to: string, why: string): Promise<Step> => {
    const e = g.edge(from, to);
    if (e && usable(e)) {
      return { from, to, edge: e, judge: 'graph', confidence: e.confidence, verdict: e.confidence >= 0.7 ? 'valid' : 'weak', explanation: e.why };
    }
    if (app.ai.available) {
      app.set({ busy: 'The referee is considering…' });
      try {
        const r = await app.ai.referee(from, to, why || undefined);
        if (r) return { from, to, judge: 'ai', confidence: r.confidence, verdict: r.verdict, explanation: r.why, edge: g.edge(from, to) };
      } catch (err) {
        app.flash(err instanceof Error ? err.message : 'The referee is unavailable.', 'error');
      } finally {
        app.set({ busy: null });
      }
    }
    if (why) return { from, to, judge: 'player', confidence: 0.3, verdict: 'unrefereed', explanation: `Your claim: ${why}` };
    return { from, to, judge: 'graph', confidence: 0, verdict: 'rejected', explanation: 'The atlas knows no connection here. Add your justification to claim it (it will count as unrefereed), or try another step.' };
  };

  const best = reveal || done ? findPath(g, a, b, 'shortest') : null;
  const strange = reveal || done ? findPath(g, a, b, 'strangest') : null;
  const route = [a, ...chain.map((c) => c.to)];
  const map = pathMap(route, g);
  if (!route.includes(b)) map.nodes.push({ id: b, role: 'current' });

  const verdictColor = { valid: 'var(--ok)', weak: 'var(--warn)', unrefereed: 'var(--muted)', rejected: 'var(--bad)' } as const;

  return (
    <>
      <Constellation graph={g} nodes={map.nodes} links={map.links} fit="all" offset={window.innerWidth > 1100 ? 0.27 : 0} />
      <section className="study">
        <span className="label">Six degrees of knowledge</span>
        <h2>{g.get(a)?.title} <span style={{ color: 'var(--faint)', fontStyle: 'italic' }}>to</span> {g.get(b)?.title}</h2>
        <p className="lede">Connect them one defensible step at a time. {app.ai.available ? 'An AI referee judges steps the atlas does not already know.' : 'The atlas referees; connect an AI provider to play beyond it.'}</p>

        <ul className="moves">
          {chain.map((s, i) => (
            <li key={i}>
              <span>{g.get(s.from)?.title} → <b style={{ fontWeight: 500 }}>{g.get(s.to)?.title}</b></span>
              <span className="verdict" style={{ color: verdictColor[s.verdict] }}>{s.verdict} · {s.judge}</span>
              <span className="ex">{s.explanation}</span>
            </li>
          ))}
        </ul>

        {!done && (
          <>
            <span className="label">From {g.get(at)?.title}, step to…</span>
            <div style={{ display: 'grid', gap: 10, marginTop: 8 }}>
              <ConceptSearch className="field left" value={next} onChange={setNext} placeholder="the next concept" onPick={(v) => void move(v)} />
              <input className="field left" style={{ fontSize: 16 }} value={reason} onChange={(e) => setReason(e.target.value)}
                placeholder="why? (optional, but the referee listens)" aria-label="Your justification" />
            </div>
            {busy && <p className="writing"><span className="orbit" /> {busy}</p>}
            {rejected && (
              <p className="reason" style={{ borderColor: 'var(--bad)' }}>
                <span className="label" style={{ color: 'var(--bad)' }}>Not accepted</span>{rejected.explanation}
              </p>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
              {chain.length > 0 && <button className="btn quiet" onClick={() => setChain(chain.slice(0, -1))}>Undo step</button>}
              <button className="btn quiet" onClick={() => setReveal(true)}>Reveal a route</button>
              <button className="btn quiet" onClick={newPair}>New pair</button>
            </div>
          </>
        )}

        {score && (
          <>
            <h3 style={{ fontWeight: 400, fontSize: 28, margin: '10px 0 0' }}>Connected in {score.steps} steps.</h3>
            <div className="score">
              <div><span className="label">Validity</span><div className="big">{Math.round(score.validity * 100)}</div><div className="word">{describeScore(score.validity)}</div></div>
              <div><span className="label">Elegance</span><div className="big">{Math.round(score.elegance * 100)}</div><div className="word">{describeScore(score.elegance)}</div></div>
              <div><span className="label">Originality</span><div className="big">{Math.round(score.originality * 100)}</div><div className="word">{describeScore(score.originality)}</div></div>
              <div><span className="label">Steps</span><div className="big">{score.steps}</div><div className="word">{score.optimal ? `atlas best: ${score.optimal}` : ''}</div></div>
            </div>
            {score.notes.map((n, i) => <p key={i} className="lede" style={{ margin: '0 0 6px' }}>{n}</p>)}
            <p className="label" style={{ marginTop: 14 }}>A game, not a measurement. The scores compare your chain with what this atlas happens to know.</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button className="btn primary" onClick={newPair}>Another pair</button>
              <button className="btn" onClick={() => app.walk(route)}>Wander this chain</button>
            </div>
          </>
        )}

        {(reveal || done) && (best || strange) && (
          <div style={{ marginTop: 26 }}>
            <span className="label">Routes the atlas knows</span>
            {[best, strange].filter(Boolean).map((p, i) => (
              <p key={i} style={{ margin: '8px 0', fontStyle: 'italic', color: 'var(--muted)' }}>
                {i === 0 ? 'Shortest: ' : 'Strangest: '}{p!.nodes.map((id) => g.get(id)?.title).join(' → ')}
              </p>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
