import type { Concept, Edge, Source } from '../model/types';
import life from './life';
import matter from './matter';
import mind from './mind';
import { SEED_SOURCES, wikiSource } from './sources';

/** Bump when seed content changes, so persisted caches know to refresh seed-origin records. */
export const SEED_VERSION = 1;

export interface Seed {
  concepts: Concept[];
  edges: Edge[];
  sources: Source[];
}

let cached: Seed | null = null;

/** The curated seed graph. Each edge also cites the reference articles of both endpoints. */
export function loadSeed(): Seed {
  if (cached) return cached;
  const concepts = [...life.concepts, ...matter.concepts, ...mind.concepts];
  const byId = new Map(concepts.map((c) => [c.id, c]));
  const sources = new Map(SEED_SOURCES.map((s) => [s.id, s]));
  for (const c of concepts) if (c.wiki) sources.set(`wp:${c.wiki}`, wikiSource(c.wiki));

  const edges = [...life.edges, ...matter.edges, ...mind.edges].map((e) => {
    const refs = [e.a, e.b].map((id) => byId.get(id)?.wiki).filter(Boolean).map((w) => `wp:${w}`);
    return { ...e, sources: [...e.sources, ...refs] };
  });

  cached = { concepts, edges, sources: [...sources.values()] };
  return cached;
}
