import type { Concept, Domain, Edge, Source } from '../model/types';
import { other, slugify } from '../model/types';

export interface Neighbor {
  edge: Edge;
  id: string;
}

/**
 * The in-memory knowledge graph: stable knowledge only (concepts, edges, sources).
 * Pure data structure — no storage, no AI, no UI. Persistence and orchestration wrap it.
 */
export class KnowledgeGraph {
  readonly concepts = new Map<string, Concept>();
  readonly edges = new Map<string, Edge>();
  readonly sources = new Map<string, Source>();
  private adj = new Map<string, Set<string>>();
  private names = new Map<string, string>();
  private listeners = new Set<() => void>();
  /** Incremented on every mutation; UI subscribes to it. */
  version = 0;

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private changed() {
    this.version++;
    for (const fn of this.listeners) fn();
  }

  /** Add or merge a concept. A written concept is never downgraded to a stub. */
  upsertConcept(c: Concept, silent = false): Concept {
    const prev = this.concepts.get(c.id);
    let next = c;
    if (prev) {
      if (c.stub && !prev.stub) next = { ...prev, aliases: mergeAliases(prev.aliases, c.aliases) };
      else next = { ...prev, ...c, aliases: mergeAliases(prev.aliases, c.aliases) };
    }
    this.concepts.set(c.id, next);
    this.index(next);
    if (!silent) this.changed();
    return next;
  }

  /** Add or merge an edge. Curated (seed) edges win over generated ones unless explicitly replaced. */
  upsertEdge(e: Edge, silent = false): Edge {
    const prev = this.edges.get(e.id);
    let next = e;
    if (prev && prev.origin.kind === 'seed' && e.origin.kind !== 'seed') {
      next = { ...prev, sources: [...new Set([...prev.sources, ...e.sources])] };
    }
    this.edges.set(e.id, next);
    for (const id of [e.a, e.b]) {
      if (!this.adj.has(id)) this.adj.set(id, new Set());
      this.adj.get(id)!.add(e.id);
    }
    if (!silent) this.changed();
    return next;
  }

  upsertSource(s: Source, silent = false) {
    this.sources.set(s.id, { ...this.sources.get(s.id), ...s });
    if (!silent) this.changed();
  }

  /** Bulk load without firing a notification per item. */
  load(data: { concepts?: Concept[]; edges?: Edge[]; sources?: Source[] }) {
    data.sources?.forEach((s) => this.upsertSource(s, true));
    data.concepts?.forEach((c) => this.upsertConcept(c, true));
    data.edges?.forEach((e) => this.upsertEdge(e, true));
    this.changed();
  }

  get(id: string): Concept | undefined {
    return this.concepts.get(id);
  }

  edge(a: string, b: string): Edge | undefined {
    return this.edges.get(a < b ? `${a}~${b}` : `${b}~${a}`);
  }

  neighbors(id: string): Neighbor[] {
    const out: Neighbor[] = [];
    for (const eid of this.adj.get(id) ?? []) {
      const edge = this.edges.get(eid)!;
      out.push({ edge, id: other(edge, id) });
    }
    return out;
  }

  degree(id: string): number {
    return this.adj.get(id)?.size ?? 0;
  }

  /**
   * Intellectual gravity, 0–1. Blends the curated/generated intrinsic gravity with how connected the
   * concept actually is in this graph, so gravity can grow as exploration reveals more links.
   */
  gravity(id: string): number {
    const c = this.concepts.get(id);
    const intrinsic = ((c?.gravity ?? 1) - 1) / 4;
    const connected = Math.min(1, this.degree(id) / 16);
    return 0.65 * intrinsic + 0.35 * connected;
  }

  /** Find a concept by id, title or alias; forgiving about case, accents and articles. */
  resolve(query: string): Concept | undefined {
    const key = normalize(query);
    if (!key) return undefined;
    const id = this.names.get(key) ?? this.names.get(slugify(query));
    return id ? this.concepts.get(id) : undefined;
  }

  /** Ranked autocomplete over titles and aliases. */
  search(query: string, limit = 8): Concept[] {
    const q = normalize(query);
    if (!q) return [];
    const scored: [number, Concept][] = [];
    for (const c of this.concepts.values()) {
      const names = [c.title, ...(c.aliases ?? [])].map(normalize);
      let best = 0;
      for (const n of names) {
        if (n === q) best = Math.max(best, 100);
        else if (n.startsWith(q)) best = Math.max(best, 60 - n.length / 10);
        else if (n.split(' ').some((w) => w.startsWith(q))) best = Math.max(best, 40);
        else if (q.length >= 4 && n.includes(q)) best = Math.max(best, 20);
      }
      if (best > 0) scored.push([best + this.gravity(c.id) * 5 - (c.stub ? 10 : 0), c]);
    }
    return scored.sort((a, b) => b[0] - a[0]).slice(0, limit).map(([, c]) => c);
  }

  private index(c: Concept) {
    for (const n of [c.id, c.title, ...(c.aliases ?? [])]) {
      const key = normalize(n);
      if (key && !this.names.has(key)) this.names.set(key, c.id);
    }
    this.names.set(normalize(c.id), c.id);
  }
}

function mergeAliases(a?: string[], b?: string[]) {
  const all = [...(a ?? []), ...(b ?? [])];
  return all.length ? [...new Set(all)] : undefined;
}

export function normalize(s: string): string {
  return s
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/^(the|a|an)\s+/, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/* ───────────────────────── distance between fields ───────────────────────── */

const FAMILY: Record<Domain, string> = {
  physics: 'nature', chemistry: 'nature', astronomy: 'nature', earth: 'nature', mathematics: 'form',
  biology: 'life', medicine: 'life', food: 'life',
  history: 'society', politics: 'society', economics: 'society', geography: 'society',
  art: 'culture', language: 'culture', philosophy: 'culture',
  technology: 'craft', person: 'person',
};

/**
 * How far a single step travels intellectually, 0 (same field) … 1 (different world).
 * Used for strangeness, serendipity and path originality — never shown as a category.
 */
export function leap(a?: Concept, b?: Concept): number {
  if (!a || !b) return 0.5;
  if (a.domain === b.domain) return 0;
  const fa = FAMILY[a.domain], fb = FAMILY[b.domain];
  if (fa === 'person' || fb === 'person') return 0.4;
  if (fa === fb) return 0.45;
  return 1;
}
