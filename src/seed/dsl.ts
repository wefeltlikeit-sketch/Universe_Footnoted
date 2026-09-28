import type { Concept, Domain, Edge, EdgeType, Status, Strength } from '../model/types';
import { edgeId } from '../model/types';

/**
 * A tiny authoring DSL for the curated seed graph.
 *
 *   C(id, title, domain, gravity, kicker, body, { wiki, aliases })
 *   E(a, b, type, strength, status, confidence, why, extraSourceIds?)
 *
 * Bodies use `[visible text](target-id)` for footnotes. Every footnote must have an edge
 * (in either direction) — `seed.test.ts` enforces this, along with no dangling targets.
 */
export interface SeedBundle {
  concepts: Concept[];
  edges: Edge[];
}

export function seedBundle() {
  const concepts: Concept[] = [];
  const edges: Edge[] = [];

  const C = (
    id: string, title: string, domain: Domain, gravity: number,
    kicker: string, body: string,
    opts: { wiki?: string; aliases?: string[] } = {},
  ) => {
    concepts.push({
      id, title, domain, gravity, kicker,
      body: body.trim().replace(/\s*\n\s*/g, ' '),
      wiki: opts.wiki ?? title.replace(/ /g, '_'),
      aliases: opts.aliases,
      origin: { kind: 'seed' },
    });
  };

  const E = (
    a: string, b: string, type: EdgeType, strength: Strength, status: Status,
    confidence: number, why: string, sources: string[] = [],
  ) => {
    edges.push({
      id: edgeId(a, b), a, b, type, strength, status, confidence,
      why: why.trim().replace(/\s*\n\s*/g, ' '),
      sources, origin: { kind: 'seed' },
    });
  };

  return { C, E, bundle: (): SeedBundle => ({ concepts, edges }) };
}
