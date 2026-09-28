import type { Concept, Edge, Journey, Session, Settings, Source } from '../model/types';
import { DEFAULT_SETTINGS } from '../model/types';
import { KnowledgeGraph } from '../graph/KnowledgeGraph';
import { loadSeed } from '../seed';
import { openStore, type KV } from './db';

/**
 * The repository joins the graph to storage.
 *
 * Stable knowledge: the seed ships in the bundle and is loaded fresh on every start; only knowledge
 * generated or imported beyond the seed is persisted (concepts / edges / sources stores).
 * Narrative: journeys and sessions are persisted separately and never mixed into the graph.
 */
export class Repository {
  private constructor(readonly kv: KV, readonly graph: KnowledgeGraph) {}

  static async open(): Promise<Repository> {
    const kv = await openStore();
    const graph = new KnowledgeGraph();
    const seed = loadSeed();
    const [concepts, edges, sources] = await Promise.all([
      kv.getAll<Concept>('concepts'), kv.getAll<Edge>('edges'), kv.getAll<Source>('sources'),
    ]);
    graph.load({
      sources: [...seed.sources, ...sources],
      concepts: [...seed.concepts, ...concepts],
      edges: [...seed.edges, ...edges],
    });
    return new Repository(kv, graph);
  }

  /* stable knowledge — write-through, skipping untouched seed records */
  async saveConcept(c: Concept) {
    const saved = this.graph.upsertConcept(c);
    if (saved.origin.kind !== 'seed') await this.kv.put('concepts', saved.id, saved);
  }

  async saveEdge(e: Edge) {
    const saved = this.graph.upsertEdge(e);
    if (saved.origin.kind !== 'seed') await this.kv.put('edges', saved.id, saved);
  }

  async saveSource(s: Source) {
    this.graph.upsertSource(s);
    await this.kv.put('sources', s.id, this.graph.sources.get(s.id));
  }

  async saveKnowledge(k: { concepts?: Concept[]; edges?: Edge[]; sources?: Source[] }) {
    for (const s of k.sources ?? []) await this.saveSource(s);
    for (const c of k.concepts ?? []) await this.saveConcept(c);
    for (const e of k.edges ?? []) await this.saveEdge(e);
  }

  /** Forget everything generated beyond the seed (the seed itself is immutable). */
  async forgetGenerated() {
    await Promise.all([this.kv.clear('concepts'), this.kv.clear('edges'), this.kv.clear('aicache')]);
  }

  /* narrative */
  journeys = () => this.kv.getAll<Journey>('journeys');
  saveJourney = (j: Journey) => this.kv.put('journeys', j.id, j);
  deleteJourney = (id: string) => this.kv.delete('journeys', id);
  saveSession = (s: Session) => this.kv.put('sessions', s.id, s);

  /* settings */
  async settings(): Promise<Settings> {
    return { ...DEFAULT_SETTINGS, ...(await this.kv.get<Partial<Settings>>('kv', 'settings')) };
  }
  saveSettings = (s: Settings) => this.kv.put('kv', 'settings', s);

  /* AI response cache (keyed by a hash of model + prompt) */
  cacheGet = <T,>(key: string) => this.kv.get<T>('aicache', key);
  cachePut = <T,>(key: string, value: T) => this.kv.put('aicache', key, value);
}
