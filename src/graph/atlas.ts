import type { Journey } from '../model/types';
import { KnowledgeGraph } from './KnowledgeGraph';

/**
 * THE ATLAS — structure that emerges from exploration.
 *
 * No categories are predefined: clusters come from label propagation over the concepts a person has
 * actually visited, weighted by the edges they actually travelled. A cluster is named after its most
 * prominent member.
 */
export interface AtlasData {
  visits: Map<string, number>;
  travelled: Map<string, number>; // edge id → times traversed
  clusters: Cluster[];
  clusterOf: Map<string, number>;
}

export interface Cluster {
  id: number;
  label: string;
  members: string[];
  weight: number;
}

export function buildAtlas(g: KnowledgeGraph, journeys: Journey[]): AtlasData {
  const visits = new Map<string, number>();
  const travelled = new Map<string, number>();
  for (const j of journeys) {
    for (const s of j.steps) {
      if (!g.get(s.conceptId)) continue;
      visits.set(s.conceptId, (visits.get(s.conceptId) ?? 0) + 1);
      if (s.edgeId) travelled.set(s.edgeId, (travelled.get(s.edgeId) ?? 0) + 1);
    }
  }
  const { clusters, clusterOf } = cluster(g, visits, travelled);
  return { visits, travelled, clusters, clusterOf };
}

function cluster(g: KnowledgeGraph, visits: Map<string, number>, travelled: Map<string, number>) {
  const nodes = [...visits.keys()].sort();
  const label = new Map(nodes.map((n, i) => [n, i]));
  const within = (id: string) => g.neighbors(id).filter((n) => visits.has(n.id));

  for (let round = 0; round < 12; round++) {
    let moved = false;
    for (const n of nodes) {
      const votes = new Map<number, number>();
      for (const { edge, id } of within(n)) {
        const w = 1 + 2 * (travelled.get(edge.id) ?? 0) + edge.confidence;
        const l = label.get(id)!;
        votes.set(l, (votes.get(l) ?? 0) + w);
      }
      if (!votes.size) continue;
      const best = [...votes].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0][0];
      if (best !== label.get(n)) {
        label.set(n, best);
        moved = true;
      }
    }
    if (!moved) break;
  }

  const groups = new Map<number, string[]>();
  for (const [n, l] of label) groups.set(l, [...(groups.get(l) ?? []), n]);
  const prominence = (id: string) => (visits.get(id) ?? 0) * (0.5 + g.gravity(id));

  const clusters: Cluster[] = [...groups.values()]
    .map((members) => {
      const sorted = [...members].sort((a, b) => prominence(b) - prominence(a));
      return {
        id: 0,
        label: g.get(sorted[0])!.title,
        members: sorted,
        weight: members.reduce((s, m) => s + (visits.get(m) ?? 0), 0),
      };
    })
    .sort((a, b) => b.weight - a.weight)
    .map((c, i) => ({ ...c, id: i }));

  const clusterOf = new Map<string, number>();
  for (const c of clusters) for (const m of c.members) clusterOf.set(m, c.id);
  return { clusters, clusterOf };
}

/**
 * UNCHARTED TERRITORY — regions adjacent to the atlas that are rarely entered.
 * Not a judgement of anyone's knowledge; just the edges of the map.
 */
export interface Frontier {
  id: string;
  score: number;
  near: string; // the most-visited known concept it borders
  message: string;
}

export function uncharted(g: KnowledgeGraph, atlas: AtlasData, limit = 5): Frontier[] {
  const out: Frontier[] = [];
  for (const c of g.concepts.values()) {
    if (atlas.visits.has(c.id) || c.stub) continue;
    let score = 0;
    let near = '';
    let nearWeight = 0;
    for (const { edge, id } of g.neighbors(c.id)) {
      const v = atlas.visits.get(id);
      if (!v) continue;
      const w = Math.log2(1 + v) * edge.confidence;
      score += w;
      if (w > nearWeight) {
        nearWeight = w;
        near = id;
      }
    }
    if (!near) continue;
    score *= 0.4 + g.gravity(c.id);
    out.push({ id: c.id, score, near, message: '' });
  }
  out.sort((a, b) => b.score - a.score);

  // Prefer frontiers bordering different regions of the atlas, then fill with the strongest rest.
  const picked: Frontier[] = [];
  const usedRegion = new Set<number>();
  for (const f of out) {
    const region = atlas.clusterOf.get(f.near) ?? -1;
    if (usedRegion.has(region)) continue;
    usedRegion.add(region);
    picked.push(f);
    if (picked.length >= limit) break;
  }
  for (const f of out) {
    if (picked.length >= limit) break;
    if (!picked.includes(f)) picked.push(f);
  }
  picked.sort((a, b) => b.score - a.score);
  for (const f of picked) f.message = phrase(g, atlas, f);
  return picked;
}

function phrase(g: KnowledgeGraph, atlas: AtlasData, f: Frontier): string {
  const region = atlas.clusters[atlas.clusterOf.get(f.near) ?? -1];
  const nearTitle = g.get(f.near)!.title;
  const target = g.get(f.id)!.title;
  const times = atlas.visits.get(f.near) ?? 0;
  if (region && region.members.length >= 8) {
    return `You have explored the region around ${region.label} extensively, but never crossed into ${target}.`;
  }
  if (region && region.members.length >= 4) {
    return `You have been wandering around ${region.label}, but have not yet crossed into ${target}.`;
  }
  if (times >= 3) {
    return `Your paths keep passing through ${nearTitle}, but never turn toward ${target}.`;
  }
  return `${target} lies just beyond ${nearTitle}, unvisited.`;
}
