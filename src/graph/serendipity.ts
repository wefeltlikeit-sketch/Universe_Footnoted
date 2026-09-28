import { KnowledgeGraph, leap } from './KnowledgeGraph';
import { findPath, hopDistances, type Path } from './paths';

/**
 * TAKE ME SOMEWHERE UNEXPECTED — controlled serendipity, not randomness.
 *
 * Candidates must be (1) several steps away, (2) reachable by a path whose every edge is defensible,
 * (3) outside the traveller's current neighbourhood, and (4) in a different field. Among the best few
 * we pick with a weighted draw, so the button can surprise twice without ever being arbitrary.
 */
export interface Leap {
  target: string;
  path: Path;
  reason: string;
}

export function surprise(
  g: KnowledgeGraph, from: string, opts: { visited: Set<string>; strangeness: number; rng?: () => number },
): Leap | null {
  const rng = opts.rng ?? Math.random;
  const origin = g.get(from);
  if (!origin) return null;
  const lo = 2 + Math.round(opts.strangeness * 2); // 2 (familiar) … 4 (strange)
  const hi = lo + 2;
  const dist = hopDistances(g, from, hi);
  const nearby = new Set(g.neighbors(from).map((n) => n.id));

  const scored: { id: string; score: number }[] = [];
  for (const [id, d] of dist) {
    if (d < lo || d > hi || nearby.has(id) || opts.visited.has(id)) continue;
    const c = g.get(id);
    if (!c || c.stub) continue;
    const distance = leap(origin, c);
    const gravity = g.gravity(id);
    // Moderate gravity is most satisfying: hubs are predictable, leaves can feel trivial.
    const pull = 1 - Math.abs(gravity - 0.45) * 1.4;
    const score = distance * (0.6 + opts.strangeness) + pull * 0.7 + (d - lo) * 0.1 * opts.strangeness;
    scored.push({ id, score });
  }
  scored.sort((a, b) => b.score - a.score);

  for (const cand of weightedOrder(scored.slice(0, 6), rng)) {
    const path = findPath(g, from, cand.id, 'strangest', { maxSteps: hi + 1 });
    if (path && path.score.weakest >= 0.6 && path.edges.every((e) => e.status !== 'speculative')) {
      return { target: cand.id, path, reason: describe(g, path) };
    }
  }
  return null;
}

function weightedOrder<T extends { score: number }>(items: T[], rng: () => number): T[] {
  const pool = [...items];
  const out: T[] = [];
  while (pool.length) {
    const min = Math.min(...pool.map((p) => p.score));
    const weights = pool.map((p) => (p.score - min + 0.25) ** 2);
    let r = rng() * weights.reduce((a, b) => a + b, 0);
    let i = 0;
    while (i < pool.length - 1 && (r -= weights[i]) > 0) i++;
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}

function describe(g: KnowledgeGraph, p: Path): string {
  const a = g.get(p.nodes[0])!.title;
  const b = g.get(p.nodes[p.nodes.length - 1])!.title;
  const weakest = Math.round(p.score.weakest * 100);
  return `${p.score.steps} steps from ${a} to ${b}. Every link holds; the weakest is ${weakest}% sure.`;
}
