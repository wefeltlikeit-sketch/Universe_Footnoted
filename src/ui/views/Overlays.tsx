import { useEffect, useState, type ReactNode } from 'react';
import type { Settings } from '../../model/types';
import { app, useApp } from '../state';
import * as J from '../../narrative/journey';
import { FAMILY_LABEL, FAMILY_OF, STATUS_TEXT, familyVar, DASH } from '../map/visual';
import { PROVIDER_PRESETS } from '../../ai/providers';
import { IconClose } from '../components/Icons';

function Sheet({ children, label }: { children: ReactNode; label: string }) {
  useEffect(() => {
    const on = (e: KeyboardEvent) => e.key === 'Escape' && app.set({ overlay: null });
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, []);
  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && app.set({ overlay: null })}>
      <section className="sheet" role="dialog" aria-label={label}>
        <button className="iconbtn close" onClick={() => app.set({ overlay: null })} aria-label="Close"><IconClose /></button>
        {children}
      </section>
    </div>
  );
}

/** HOW DID I GET HERE? — the route from the origin, each arrow expandable to its reason. */
export function HowDidIGetHere() {
  const journey = useApp((s) => s.journey);
  const [open, setOpen] = useState<number | null>(null);
  if (!journey) return null;
  const g = app.graph;
  const line = J.lineage(journey);
  return (
    <Sheet label="How did I get here?">
      <span className="label">How did I get here?</span>
      <h3>{line.length - 1} steps from {g.get(journey.steps[line[0]].conceptId)?.title}</h3>
      <ol className="lineage">
        {line.map((i, k) => {
          const s = journey.steps[i];
          const c = g.get(s.conceptId);
          const e = s.edgeId ? g.edges.get(s.edgeId) : undefined;
          const last = k === line.length - 1;
          return (
            <li key={i}>
              {k > 0 && (
                <button className="arrow" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                  ↓ {e ? `${e.type} · ${e.status}` : 'jump'}{s.via === 'surprise' ? ' · unexpected' : ''}
                  {open === i && e && (
                    <span className="why">
                      {e.why}{' '}
                      <span className="prov" role="link" onClick={(ev) => { ev.stopPropagation(); app.set({ overlay: { kind: 'edge', edgeId: e.id } }); }}>provenance</span>
                    </span>
                  )}
                </button>
              )}
              <button className={`stop ${last ? 'here' : ''}`} onClick={() => app.revisit(i)}>{c?.title}</button>
            </li>
          );
        })}
      </ol>
    </Sheet>
  );
}

/** The provenance layer: why two concepts are connected, how sure we are, and who says so. */
export function EdgeCard({ edgeId, from }: { edgeId: string; from?: string }) {
  useApp((s) => s.graphVersion);
  const g = app.graph;
  const e = g.edges.get(edgeId);
  if (!e) return null;
  const [a, b] = from === e.b ? [e.b, e.a] : [e.a, e.b];
  const fam = FAMILY_OF[e.type];
  const origin = e.origin;
  const originText =
    origin.kind === 'seed' ? 'Curated by hand for the seed atlas.'
    : origin.kind === 'ai' ? `Proposed by ${origin.model ?? 'a model'}${origin.validatedBy ? `, refereed by ${origin.validatedBy}` : ''}.`
    : origin.kind === 'wikipedia' ? 'Found as a mention in a Wikipedia summary. Not refereed.'
    : origin.kind === 'import' ? 'Imported from a shared journey.' : 'Added by you.';

  return (
    <Sheet label="Why are these connected?">
      <span className="label">Provenance</span>
      <h3>{g.get(a)?.title} <span style={{ color: 'var(--faint)' }}>⟷</span> {g.get(b)?.title}</h3>
      <p className="why-big">{e.why}</p>
      <div className="kv">
        <span className="label">Type</span>
        <span><span className="glyph" style={{ background: familyVar(fam), marginRight: 8 }} />{e.type} <span style={{ color: 'var(--faint)' }}>({FAMILY_LABEL[fam]})</span></span>
        <span className="label">Strength</span>
        <span>{e.strength}</span>
        <span className="label">Status</span>
        <span><span className="status-pill" style={{ color: e.status === 'factual' ? 'var(--ok)' : e.status === 'speculative' ? 'var(--bad)' : 'var(--warn)' }}>{e.status}</span>
          <span style={{ display: 'block', color: 'var(--muted)', fontStyle: 'italic', fontSize: 15, marginTop: 6 }}>{STATUS_TEXT[e.status]}</span></span>
        <span className="label">Confidence</span>
        <span><span className="bar"><i style={{ width: `${e.confidence * 100}%` }} /></span>{Math.round(e.confidence * 100)}%</span>
        <span className="label">Origin</span>
        <span style={{ fontStyle: 'italic' }}>{originText}</span>
        <span className="label">Sources</span>
        <ul className="sources">
          {e.sources.length === 0 && <li style={{ color: 'var(--faint)', fontStyle: 'italic' }}>No source recorded. Weigh accordingly.</li>}
          {e.sources.map((id) => {
            const s = g.sources.get(id);
            if (!s) return <li key={id}>{id}</li>;
            return (
              <li key={id}>
                {s.url ? <a href={s.url} target="_blank" rel="noreferrer">{s.title}</a> : s.title}
                <span style={{ color: 'var(--faint)' }}> · {s.publisher}</span>
                {s.verifiedAt && <span className="v" style={{ color: 'var(--ok)' }}>✓ checked</span>}
                {s.note && <span className="v" style={{ color: 'var(--warn)' }}>{s.note}</span>}
              </li>
            );
          })}
        </ul>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {app.state.journey && J.current(app.state.journey).conceptId === a && (
          <button className="btn primary" onClick={() => app.follow(b, 'footnote')}>Travel to {g.get(b)?.title}</button>
        )}
      </div>
    </Sheet>
  );
}

export function SettingsSheet() {
  const s = useApp((st) => st.settings);
  const version = useApp((st) => st.graphVersion);
  const [draft, setDraft] = useState<Settings>(s);
  const [confirmForget, setConfirmForget] = useState(false);
  const set = (patch: Partial<Settings>) => setDraft((d) => ({ ...d, ...patch }));
  const g = app.graph;
  const generated = [...g.concepts.values()].filter((c) => c.origin.kind !== 'seed' && !c.stub).length;
  void version;

  return (
    <Sheet label="Settings">
      <div className="settings">
        <span className="label">Settings</span>
        <h3>The engine room</h3>

        <label className="label">AI provider</label>
        <div className="radios">
          {(['none', 'anthropic', 'openai-compatible'] as const).map((p) => (
            <button key={p} aria-pressed={draft.provider === p} onClick={() => set({ provider: p, ...PROVIDER_PRESETS[p] })}>
              {p === 'none' ? 'None (seed + Wikipedia)' : p === 'anthropic' ? 'Claude (Anthropic)' : 'OpenAI-compatible / local'}
            </button>
          ))}
        </div>
        <p className="fine">
          {draft.provider === 'none'
            ? 'The curated atlas works fully offline. Unknown topics are looked up on Wikipedia and their links are marked unrefereed.'
            : draft.provider === 'anthropic'
              ? 'Your key is stored only in this browser and sent only to api.anthropic.com. A fast model referees every connection a deep model proposes.'
              : 'Any /chat/completions endpoint: Ollama, LM Studio, llama.cpp, or a hosted gateway.'}
        </p>

        {draft.provider !== 'none' && (
          <>
            {draft.provider === 'openai-compatible' && (
              <>
                <label className="label" htmlFor="base">Base URL</label>
                <input id="base" type="text" value={draft.baseUrl} onChange={(e) => set({ baseUrl: e.target.value })} />
              </>
            )}
            <label className="label" htmlFor="key">API key</label>
            <input id="key" type="password" autoComplete="off" value={draft.apiKey} placeholder={draft.provider === 'anthropic' ? 'sk-ant-…' : 'optional'} onChange={(e) => set({ apiKey: e.target.value })} />
            <div className="row">
              <div>
                <label className="label" htmlFor="deep">Deep model (writes & bridges)</label>
                <input id="deep" type="text" value={draft.deepModel} onChange={(e) => set({ deepModel: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="fast">Fast model (referees)</label>
                <input id="fast" type="text" value={draft.fastModel} onChange={(e) => set({ fastModel: e.target.value })} />
              </div>
            </div>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 14 }}>
              <input type="checkbox" checked={draft.verifySources} onChange={(e) => set({ verifySources: e.target.checked })} />
              <span>Verify cited sources against Wikipedia (unverified links lose confidence)</span>
            </label>
          </>
        )}

        <label className="label">Experience</label>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="checkbox" checked={draft.rabbitHole} onChange={(e) => set({ rabbitHole: e.target.checked })} />
          <span>Rabbit hole mode: the world darkens and your origin recedes as you go deeper</span>
        </label>

        <div style={{ display: 'flex', gap: 8, marginTop: 22, flexWrap: 'wrap' }}>
          <button className="btn primary" onClick={() => { void app.saveSettings(draft); app.set({ overlay: null }); }}>Save</button>
          <button className="btn quiet" onClick={() => app.set({ overlay: null })}>Cancel</button>
        </div>

        <hr style={{ border: 0, borderTop: '1px solid var(--rule)', margin: '26px 0 14px' }} />
        <span className="label">Knowledge</span>
        <p className="fine">{g.concepts.size} concepts · {g.edges.size} connections · {generated} written beyond the seed.</p>
        <div className="legend">
          {(['science', 'history', 'culture', 'analogy'] as const).map((f) => (
            <span key={f}><span className="glyph" style={{ background: familyVar(f) }} />{FAMILY_LABEL[f]}</span>
          ))}
          {(Object.keys(DASH) as (keyof typeof DASH)[]).map((st) => (
            <span key={st}><svg width="22" height="4"><line x1="0" y1="2" x2="22" y2="2" stroke="currentColor" strokeDasharray={DASH[st].join(' ')} /></svg>{st}</span>
          ))}
        </div>
        <div style={{ marginTop: 14 }}>
          {confirmForget ? (
            <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
              <span className="fine" style={{ margin: 0 }}>Forget all generated pages and the AI cache? Journeys are kept.</span>
              <button className="btn" onClick={async () => { await app.repo.forgetGenerated(); location.reload(); }}>Forget</button>
              <button className="btn quiet" onClick={() => setConfirmForget(false)}>Keep</button>
            </span>
          ) : (
            <button className="btn quiet" onClick={() => setConfirmForget(true)}>Forget generated knowledge…</button>
          )}
        </div>
      </div>
    </Sheet>
  );
}
