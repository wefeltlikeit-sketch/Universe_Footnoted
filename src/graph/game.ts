import type { Edge } from '../model/types';
import { KnowledgeGraph, leap } from './KnowledgeGraph';
import { findPath, hopDistances } from './paths';

/**
 * SIX DEGREES OF KNOWLEDGE — a game, refereed.
 *
 * Scores are descriptive, not measurements: they say how a chain compares to what the local graph
 * knows, and every number is explained in words next to it.
 */
export const CURATED_PAIRS: [string, string][] = [
  ['gothic-cathedral', 'quantum-computing'],
  ['epoisses', 'dirac'],
  ['coffee', 'bells-theorem'],
  ['passport', 'entropy'],
  ['chalk', 'cryptography'],
  ['moon', 'antibiotic-resistance'],
  ['camembert', 'hilbert-space'],
  ['footnote', 'plate-tectonics'],
  ['zero', 'impressionism'],
  ['coins', 'dna'],
];

export function pickPair(g: KnowledgeGraph, rng = Math.random, avoid: string[] = []): [string, string] {
  const pool = CURATED_PAIRS.filter(([a, b]) => g.get(a) && g.get(b) && !avoid.includes(`${a}|${b}`));
  if (pool.length && rng() < 0.6) return pool[Math.floor(rng() * pool.length)];
  // Otherwise generate: far apart in the graph and in field.
  const ids = [...g.concepts.values()].filter((c) => !c.stub).map((c) => c.id);
  for (let tries = 0; tries < 40; tries++) {
    const a = ids[Math.floor(rng() * ids.length)];
    const dist = hopDistances(g, a, 8);
    const far = [...dist].filter(([id, d]) => d >= 4 && leap(g.get(a), g.get(id)) === 1).map(([id]) => id);
    if (far.length) return [a, far[Math.floor(rng() * far.length)]];
  }
  return pool[0] ?? [ids[0], ids[1]];
}

export type Verdict = 'valid' | 'weak' | 'rejected' | 'unrefereed';

export interface Step {
  from: string;
  to: string;
  verdict: Verdict;
  confidence: number;
  explanation: string;
  edge?: Edge;
  judge: 'graph' | 'ai' | 'player';
}

export interface GameScore {
  validity: number;
  elegance: number;
  originality: number;
  steps: number;
  optimal: number | null;
  notes: string[];
}

export function scoreChain(g: KnowledgeGraph, a: string, b: string, chain: Step[]): GameScore {
  const steps = chain.length;
  const best = findPath(g, a, b, 'shortest');
  const optimal = best ? best.score.steps : null;
  const weight: Record<Verdict, number> = { valid: 1, weak: 0.6, unrefereed: 0.3, rejected: 0 };
  const validity = steps ? chain.reduce((s, c) => s + weight[c.verdict] * Math.max(0.3, c.confidence), 0) / steps : 0;
  const elegance = optimal && steps ? Math.min(1, optimal / steps) : 0;

  const middle = chain.slice(0, -1).map((s) => s.to);
  const onBest = new Set(best?.nodes ?? []);
  const fresh = middle.length ? middle.filter((n) => !onBest.has(n)).length / middle.length : 0;
  const leaps = chain.reduce((s, c) => s + leap(g.get(c.from), g.get(c.to)), 0) / Math.max(1, steps);
  const originality = Math.min(1, 0.6 * fresh + 0.4 * leaps + (middle.some((n) => !g.get(n)) ? 0.1 : 0));

  const notes: string[] = [];
  if (optimal !== null) {
    notes.push(steps === optimal
      ? `Matches the shortest route the atlas knows (${optimal} steps).`
      : `The atlas knows a ${optimal}-step route; yours took ${steps}.`);
  }
  if (fresh > 0.5) notes.push('Most of your stepping stones are off the obvious route.');
  const weak = chain.filter((c) => c.verdict !== 'valid').length;
  if (weak) notes.push(`${weak} step${weak > 1 ? 's' : ''} did not fully convince the referee.`);
  return { validity, elegance, originality, steps, optimal, notes };
}

export function describeScore(x: number): string {
  if (x >= 0.85) return 'excellent';
  if (x >= 0.65) return 'good';
  if (x >= 0.4) return 'fair';
  return 'thin';
}
