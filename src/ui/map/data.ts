import type { Journey } from '../../model/types';
import type { KnowledgeGraph } from '../../graph/KnowledgeGraph';
import type { AtlasData } from '../../graph/atlas';
import * as J from '../../narrative/journey';
import type { MapLink, MapNode } from './Constellation';

/** The constellation for one journey: every step taken, plus faint unexplored exits around "here". */
export function journeyMap(j: Journey, g: KnowledgeGraph, opts: { exits?: boolean } = {}): { nodes: MapNode[]; links: MapLink[] } {
  const here = J.current(j).conceptId;
  const originId = J.origin(j).conceptId;
  const order = new Map(J.discoveryOrder(j).map((s, i) => [s.conceptId, i]));
  const onLineage = new Set(J.lineage(j).map((i) => j.steps[i].conceptId));

  const nodes: MapNode[] = [...order.keys()].map((id) => ({
    id,
    role: id === here ? 'current' : id === originId ? 'origin' : onLineage.has(id) ? 'path' : 'visited',
    order: order.get(id),
  }));
  const links: MapLink[] = [];
  const seen = new Set<string>();
  for (const s of j.steps) {
    if (s.parent === null || !s.edgeId || seen.has(s.edgeId)) continue;
    seen.add(s.edgeId);
    const from = j.steps[s.parent].conceptId;
    const bothOnLineage = onLineage.has(from) && onLineage.has(s.conceptId);
    links.push({ a: from, b: s.conceptId, edgeId: s.edgeId, role: bothOnLineage ? 'path' : 'travelled' });
  }

  if (opts.exits !== false) {
    const exits = g.neighbors(here)
      .filter((n) => !order.has(n.id))
      .sort((a, b) => g.gravity(b.id) - g.gravity(a.id))
      .slice(0, 16);
    for (const { edge, id } of exits) {
      nodes.push({ id, role: 'exit' });
      links.push({ a: here, b: id, edgeId: edge.id, role: 'exit' });
    }
  }
  return { nodes, links };
}

/** The whole seed graph as a faint sky (landing page). */
export function skyMap(g: KnowledgeGraph): { nodes: MapNode[]; links: MapLink[] } {
  const nodes: MapNode[] = [...g.concepts.values()].filter((c) => !c.stub).map((c) => ({ id: c.id, role: 'ghost' }));
  const ids = new Set(nodes.map((n) => n.id));
  const links: MapLink[] = [...g.edges.values()]
    .filter((e) => ids.has(e.a) && ids.has(e.b))
    .map((e) => ({ a: e.a, b: e.b, edgeId: e.id, role: 'ghost' }));
  return { nodes, links };
}

/** The personal Atlas: everything ever visited, sized by visits, grouped into emergent clusters. */
export function atlasMap(atlas: AtlasData, g: KnowledgeGraph, frontier: string[]): { nodes: MapNode[]; links: MapLink[] } {
  const nodes: MapNode[] = [...atlas.visits].map(([id, v]) => ({
    id, role: 'visited', weight: v, cluster: atlas.clusterOf.get(id),
  }));
  const links: MapLink[] = [];
  const ids = new Set(atlas.visits.keys());
  for (const id of ids) {
    for (const { edge, id: other } of g.neighbors(id)) {
      if (id < other && ids.has(other)) {
        links.push({ a: id, b: other, edgeId: edge.id, role: atlas.travelled.has(edge.id) ? 'travelled' : 'ghost' });
      }
    }
  }
  for (const f of frontier) {
    nodes.push({ id: f, role: 'exit' });
    for (const { edge, id } of g.neighbors(f)) if (ids.has(id)) links.push({ a: id, b: f, edgeId: edge.id, role: 'exit' });
  }
  return { nodes, links };
}

/** A path from the pathfinder. */
export function pathMap(nodes: string[], g: KnowledgeGraph): { nodes: MapNode[]; links: MapLink[] } {
  return {
    nodes: nodes.map((id, i) => ({ id, role: i === 0 ? 'origin' : i === nodes.length - 1 ? 'current' : 'path', order: i })),
    links: nodes.slice(1).map((id, i) => {
      const e = g.edge(nodes[i], id)!;
      return { a: nodes[i], b: id, edgeId: e.id, role: 'path' as const };
    }),
  };
}
