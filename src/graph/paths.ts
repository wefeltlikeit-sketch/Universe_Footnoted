import type { Edge, EdgeType } from '../model/types';
import { KnowledgeGraph, leap } from './KnowledgeGraph';

/**
 * Pathfinding over the local knowledge graph.
 *
 * AI never "invents" a path directly: it only proposes candidate edges, which are validated and added
 * to the graph. The paths themselves are found here, deterministically, by Dijkstra with a cost
 * function per mode. That keeps every path inspectable and every transition defensible.
 */
export type PathMode = 'shortest' | 'historical' | 'scientific' | 'cultural' | 'strangest';

export interface PathModeInfo {
  id: PathMode;
  label: string;
  blurb: string;
}

export const PATH_MODES: PathModeInfo[] = [
  { id: 'shortest', label: 'Shortest', blurb: 'The fewest defensible steps.' },
  { id: 'historical', label: 'Historical', blurb: 'Through people, events and causes.' },
  { id: 'scientific', label: 'Scientific', blurb: 'Through mechanisms, mathematics and matter.' },
  { id: 'cultural', label: 'Cultural', blurb: 'Through places, words, markets and art.' },
  { id: 'strangest', label: 'Strangest defensible', blurb: 'The longest leaps that still hold. Strange, never random.' },
];

const PREFERRED: Partial<Record<PathMode, EdgeType[]>> = {
  historical: ['historical', 'biographical', 'causal', 'political', 'controversial'],
  scientific: ['physical', 'chemical', 'biological', 'mathematical', 'causal', 'technological'],
  cultural: ['cultural', 'linguistic', 'geographical', 'economic', 'production', 'political'],
};

/** Edges below this confidence, or speculative ones, are never used to build a path. */
export const MIN_CONFIDENCE = 0.55;

export interface Path {
  mode: PathMode;
  /** Other modes whose best route turned out to be this same one. */
  also: PathMode[];
  nodes: string[];
  edges: Edge[];
  score: PathScore;
}

export interface PathScore {
  steps: number;
  meanConfidence: number;
  weakest: number;
  /** Total field-crossing distance along the path. */
  leaps: number;
  analogies: number;
}

export function usable(e: Edge): boolean {
  return e.status !== 'speculative' && e.confidence >= MIN_CONFIDENCE;
}

function cost(g: KnowledgeGraph, mode: PathMode, e: Edge, from: string, to: string): number {
  const doubt = (1 - e.confidence) * 2;
  const analogy = e.status === 'analogical' ? 0.5 : 0;
  switch (mode) {
    case 'shortest':
      return 1 + doubt * 0.1;
    case 'strangest': {
      // Reward leaps between distant fields; avoid high-gravity hubs (they make every path the same).
      const l = leap(g.get(from), g.get(to));
      return 1.05 - 0.6 * l + doubt + analogy * 0.5 + 0.35 * g.gravity(to);
    }
    default: {
      const pref = PREFERRED[mode]!.includes(e.type) ? 0.45 : 1.25;
      return pref + doubt * 0.5 + analogy;
    }
  }
}

export function findPath(
  g: KnowledgeGraph, from: string, to: string, mode: PathMode,
  opts: { avoidEdges?: Set<string>; avoidNodes?: Set<string>; maxSteps?: number } = {},
): Path | null {
  if (!g.get(from) || !g.get(to)) return null;
  const maxSteps = opts.maxSteps ?? 12;
  const dist = new Map<string, number>([[from, 0]]);
  const hops = new Map<string, number>([[from, 0]]);
  const prev = new Map<string, { node: string; edge: Edge }>();
  const done = new Set<string>();
  const heap = new MinHeap<string>();
  heap.push(from, 0);

  while (heap.size) {
    const [u, du] = heap.pop()!;
    if (done.has(u)) continue;
    done.add(u);
    if (u === to) break;
    if (hops.get(u)! >= maxSteps) continue;
    for (const { edge, id: v } of g.neighbors(u)) {
      if (!usable(edge) || opts.avoidEdges?.has(edge.id)) continue;
      if (opts.avoidNodes?.has(v) && v !== to) continue;
      const nd = du + cost(g, mode, edge, u, v);
      if (nd < (dist.get(v) ?? Infinity)) {
        dist.set(v, nd);
        hops.set(v, hops.get(u)! + 1);
        prev.set(v, { node: u, edge });
        heap.push(v, nd);
      }
    }
  }
  if (!prev.has(to) && from !== to) return null;

  const nodes = [to];
  const edges: Edge[] = [];
  let cur = to;
  while (cur !== from) {
    const p = prev.get(cur)!;
    edges.unshift(p.edge);
    nodes.unshift(p.node);
    cur = p.node;
  }
  return { mode, also: [], nodes, edges, score: scorePath(g, nodes, edges) };
}

export function scorePath(g: KnowledgeGraph, nodes: string[], edges: Edge[]): PathScore {
  const confs = edges.map((e) => e.confidence);
  let leaps = 0;
  for (let i = 1; i < nodes.length; i++) leaps += leap(g.get(nodes[i - 1]), g.get(nodes[i]));
  return {
    steps: edges.length,
    meanConfidence: confs.length ? confs.reduce((a, b) => a + b, 0) / confs.length : 1,
    weakest: confs.length ? Math.min(...confs) : 1,
    leaps,
    analogies: edges.filter((e) => e.status === 'analogical').length,
  };
}

/** One path per mode, plus alternates, with duplicates removed. */
export function findPaths(g: KnowledgeGraph, from: string, to: string, modes: PathMode[] = PATH_MODES.map((m) => m.id)): Path[] {
  const out: Path[] = [];
  const seen = new Map<string, Path>();
  const add = (p: Path | null) => {
    if (!p) return;
    const key = p.nodes.join('>');
    const same = seen.get(key);
    if (same) {
      if (same.mode !== p.mode && !same.also.includes(p.mode)) same.also.push(p.mode);
      return;
    }
    seen.set(key, p);
    out.push(p);
  };
  for (const mode of modes) add(findPath(g, from, to, mode));
  // If modes collapsed onto the same route, look for a genuinely different second route.
  const first = out[0];
  if (first && out.length < 3 && first.nodes.length > 2) {
    add(findPath(g, from, to, 'shortest', { avoidNodes: new Set(first.nodes.slice(1, -1)) }));
  }
  return out;
}

/** Plain hop distance (usable edges only), for scoring games and serendipity. */
export function hopDistances(g: KnowledgeGraph, from: string, max = 8): Map<string, number> {
  const d = new Map([[from, 0]]);
  const q = [from];
  while (q.length) {
    const u = q.shift()!;
    const du = d.get(u)!;
    if (du >= max) continue;
    for (const { edge, id } of g.neighbors(u)) {
      if (usable(edge) && !d.has(id)) {
        d.set(id, du + 1);
        q.push(id);
      }
    }
  }
  return d;
}

class MinHeap<T> {
  private items: [T, number][] = [];
  get size() {
    return this.items.length;
  }
  push(v: T, p: number) {
    const a = this.items;
    a.push([v, p]);
    let i = a.length - 1;
    while (i > 0) {
      const j = (i - 1) >> 1;
      if (a[j][1] <= a[i][1]) break;
      [a[i], a[j]] = [a[j], a[i]];
      i = j;
    }
  }
  pop(): [T, number] | undefined {
    const a = this.items;
    if (!a.length) return undefined;
    const top = a[0];
    const last = a.pop()!;
    if (a.length) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < a.length && a[l][1] < a[m][1]) m = l;
        if (r < a.length && a[r][1] < a[m][1]) m = r;
        if (m === i) break;
        [a[i], a[m]] = [a[m], a[i]];
        i = m;
      }
    }
    return top;
  }
}
