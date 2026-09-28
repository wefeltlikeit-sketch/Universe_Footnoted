import { describe, expect, it } from 'vitest';
import { edgeId } from '../model/types';
import { parseBody } from '../graph/markup';
import life from './life';
import matter from './matter';
import mind from './mind';
import { loadSeed } from './index';

/** The Prime Directive, enforced: every footnote in the seed must be a defensible, explained edge. */
describe('seed integrity', () => {
  const seed = loadSeed();
  const ids = new Set(seed.concepts.map((c) => c.id));
  const edgeIds = new Set(seed.edges.map((e) => e.id));
  const sourceIds = new Set(seed.sources.map((s) => s.id));

  it('has unique concept ids', () => {
    expect(ids.size).toBe(seed.concepts.length);
  });

  it('defines each edge exactly once', () => {
    const all = [...life.edges, ...matter.edges, ...mind.edges].map((e) => e.id);
    const dupes = all.filter((id, i) => all.indexOf(id) !== i);
    expect(dupes).toEqual([]);
  });

  it('has no dangling edge endpoints or self-loops', () => {
    const bad = seed.edges.filter((e) => !ids.has(e.a) || !ids.has(e.b) || e.a === e.b).map((e) => e.id);
    expect(bad).toEqual([]);
  });

  it('backs every footnote with an explained edge', () => {
    const missing: string[] = [];
    for (const c of seed.concepts) {
      for (const f of parseBody(c.body).footnotes) {
        if (!ids.has(f.target)) missing.push(`${c.id} → ${f.target} (no such concept)`);
        else if (!edgeIds.has(edgeId(c.id, f.target))) missing.push(`${c.id} → ${f.target} (no edge)`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('gives every concept a body with at least three exits', () => {
    const thin = seed.concepts.filter((c) => parseBody(c.body).footnotes.length < 3).map((c) => c.id);
    expect(thin).toEqual([]);
  });

  it('cites only known sources and keeps confidence in range', () => {
    const bad = seed.edges.filter(
      (e) => e.sources.some((s) => !sourceIds.has(s)) || e.confidence <= 0 || e.confidence > 1 || e.why.length < 20,
    );
    expect(bad.map((e) => e.id)).toEqual([]);
  });

  it('is connected — every concept is reachable from Cheese', () => {
    const adj = new Map<string, string[]>();
    for (const e of seed.edges) {
      adj.set(e.a, [...(adj.get(e.a) ?? []), e.b]);
      adj.set(e.b, [...(adj.get(e.b) ?? []), e.a]);
    }
    const seen = new Set(['cheese']);
    const queue = ['cheese'];
    while (queue.length) for (const n of adj.get(queue.shift()!) ?? []) if (!seen.has(n)) { seen.add(n); queue.push(n); }
    expect([...ids].filter((id) => !seen.has(id))).toEqual([]);
  });
});
