import type { Concept, Domain, Edge, EdgeType, Settings, Source, Status, Strength } from '../model/types';
import { edgeId, slugify } from '../model/types';
import type { Repository } from '../store/repository';
import { mapTargets, parseBody, unlinkTarget } from '../graph/markup';
import { normalize } from '../graph/KnowledgeGraph';
import { createProvider } from './providers';
import type { CompletionRequest, Provider } from './providers/types';
import * as P from './prompts';
import { verifyTitles, wikiSearch, wikiSummary } from './wikipedia';
import { wikiSource } from '../seed/sources';

/**
 * AI ORCHESTRATION — separate intellectual functions, not one chatbot.
 *
 *   explore:  TOPIC → [cache?] → EXPLAIN+CURATE (deep) → VALIDATE (fast) → SOURCES (Wikipedia) → GRAPH UPDATE
 *   bridge:   A + B → CANDIDATE CHAINS (deep) → VALIDATE each step (fast) → SOURCES → GRAPH UPDATE
 *             (the paths shown to the user are then found by local graph search, never taken verbatim)
 *   referee:  A → B (+ player's reason) → JUDGE (fast) → GRAPH UPDATE if it holds
 *
 * Caching happens at two levels: a written concept is never regenerated (stable knowledge), and
 * every model response is cached by a hash of model + prompt, so re-asking costs nothing.
 * With no provider configured, `explore` falls back to Wikipedia with honestly-labelled,
 * unrefereed links, and the seed graph carries everything else.
 */
export type Progress = (stage: string) => void;

export class Orchestrator {
  constructor(
    private repo: Repository,
    private settings: () => Settings,
    private makeProvider: (s: Settings) => Provider | null = createProvider,
  ) {}

  private get provider(): Provider | null {
    return this.makeProvider(this.settings());
  }

  get available(): boolean {
    return this.provider !== null;
  }

  get graph() {
    return this.repo.graph;
  }

  /* ─────────────────────────────── explore ─────────────────────────────── */

  /** Ensure a concept exists with a written page. Returns its id. */
  async explore(query: string, ctx: { fromId?: string; progress?: Progress } = {}): Promise<string> {
    const g = this.graph;
    const known = g.resolve(query);
    if (known && !known.stub) return known.id;

    const topic = known?.title ?? query.trim();
    const provider = this.provider;
    if (!provider) return this.exploreFromWikipedia(topic, ctx.progress);

    const from = ctx.fromId ? g.get(ctx.fromId) : undefined;
    const arrival = from && known ? g.edge(from.id, known.id) : undefined;

    ctx.progress?.('Writing the page and choosing its footnotes…');
    const draft = await this.ask<P.ExplainResult>(provider, {
      tier: 'deep',
      system: P.EXPLAIN_SYSTEM,
      prompt: P.explainPrompt(topic, {
        arrivedFrom: from?.title, why: arrival?.why, strangeness: this.settings().strangeness,
        known: this.knownTitles(from?.id),
      }),
      schema: P.explainSchema,
    });

    const id = known?.id ?? (slugify(draft.title) || slugify(topic));
    const exits = draft.exits.filter((x) => x.target && normalize(x.target) !== normalize(draft.title)).slice(0, 8);

    ctx.progress?.('Refereeing each connection…');
    const verdicts = await this.validate(provider, exits.map((x) => ({ from: draft.title, to: x.target, why: x.why, status: x.status })));

    ctx.progress?.('Checking sources…');
    const verified = this.settings().verifySources
      ? await verifyTitles([draft.wiki, ...exits.map((x) => x.source)])
      : new Map();

    const fastModel = provider.model('fast');
    const deepModel = provider.model('deep');
    const origin = { kind: 'ai' as const, model: deepModel, validatedBy: fastModel, at: Date.now() };
    const concepts: Concept[] = [];
    const edges: Edge[] = [];
    const sources: Source[] = [];
    const targetIds = new Map<string, string>();

    exits.forEach((x, i) => {
      const v = verdicts[i];
      if (!v?.keep) return;
      const targetId = this.idFor(x.target);
      if (targetId === id) return;
      targetIds.set(x.target, targetId);
      if (!g.get(targetId)) concepts.push(stub(targetId, x.target, x.domain, origin));
      const src = this.sourceFor(x.source, verified);
      if (src) sources.push(src);
      edges.push(this.edge(id, targetId, x, v, src, origin));
    });

    // Rewrite footnote targets to ids; unlink any whose connection was rejected.
    let body = mapTargets(draft.body, (t) => targetIds.get(t) ?? targetIds.get(exits.find((x) => normalize(x.target) === normalize(t))?.target ?? '') ?? null);
    for (const f of parseBody(body).footnotes) if (!edges.some((e) => e.id === edgeId(id, f.target))) body = unlinkTarget(body, f.target);

    const wiki = verified.get(draft.wiki)?.title ?? draft.wiki;
    const mainSource = this.sourceFor(draft.wiki, verified);
    if (mainSource) sources.push(mainSource);
    concepts.unshift({
      id, title: known?.title ?? draft.title, kicker: draft.kicker, body,
      domain: asDomain(draft.domain), gravity: clamp(Math.round(draft.gravity), 1, 5),
      aliases: normalize(query) !== normalize(draft.title) ? [query.trim()] : undefined,
      wiki, origin: { kind: 'ai', model: deepModel, at: Date.now() },
    });

    await this.repo.saveKnowledge({ concepts, edges, sources });
    return id;
  }

  /** No AI: build a page from Wikipedia and link any known concepts it mentions, clearly unrefereed. */
  private async exploreFromWikipedia(topic: string, progress?: Progress): Promise<string> {
    const g = this.graph;
    progress?.('Looking it up…');
    const title = (await wikiSearch(topic)) ?? topic;
    const summary = await wikiSummary(title);
    if (!summary) throw new Error(`Nothing found for “${topic}”. Try one of the suggestions, or connect an AI provider in Settings.`);

    const existing = g.resolve(summary.title) ?? g.resolve(topic);
    if (existing && !existing.stub) return existing.id;
    const id = existing?.id ?? slugify(summary.title);

    let body = summary.extract;
    const edges: Edge[] = [];
    const candidates = [...g.concepts.values()]
      .filter((c) => !c.stub && c.id !== id)
      .flatMap((c) => [c.title, ...(c.aliases ?? [])].filter((n) => n.length >= 4).map((n) => ({ c, n })))
      .sort((a, b) => b.n.length - a.n.length);
    const linked = new Set<string>();
    for (const { c, n } of candidates) {
      if (linked.has(c.id) || linked.size >= 7) continue;
      const re = new RegExp(`(^|[^\\p{L}\\[])(${escapeRe(n)})(?=[^\\p{L}\\]]|$)`, 'iu');
      if (!re.test(body)) continue;
      body = body.replace(re, (_m, pre, word) => `${pre}[${word}](${c.id})`);
      linked.add(c.id);
      edges.push({
        id: edgeId(id, c.id), a: id, b: c.id, type: 'conceptual', strength: 'subtle', status: 'interpretive',
        confidence: 0.5, sources: [`wp:${summary.title.replace(/ /g, '_')}`],
        why: `“${c.title}” is mentioned in the Wikipedia summary of ${summary.title}. This link has not been refereed; connect an AI provider to validate and explain it.`,
        origin: { kind: 'wikipedia', at: Date.now() },
      });
    }
    const src = wikiSource(summary.title.replace(/ /g, '_'));
    await this.repo.saveKnowledge({
      sources: [{ ...src, verifiedAt: Date.now() }],
      concepts: [{
        id, title: existing?.title ?? summary.title, kicker: summary.description ?? 'From Wikipedia',
        body, domain: existing?.domain ?? 'history', gravity: 2, wiki: summary.title.replace(/ /g, '_'),
        aliases: normalize(topic) !== normalize(summary.title) ? [topic] : undefined,
        origin: { kind: 'wikipedia', at: Date.now() },
      }],
      edges,
    });
    return id;
  }

  /* ─────────────────────────────── bridge ─────────────────────────────── */

  /** Ask for candidate chains between two concepts, validate every step, and add what holds. */
  async bridge(aId: string, bId: string, progress?: Progress): Promise<number> {
    const provider = this.provider;
    if (!provider) return 0;
    const g = this.graph;
    const a = g.get(aId)!, b = g.get(bId)!;
    progress?.('Searching for conceptual bridges…');
    const res = await this.ask<P.BridgeResult>(provider, {
      tier: 'deep', system: P.BRIDGE_SYSTEM, schema: P.bridgeSchema,
      prompt: P.bridgePrompt(a.title, b.title, this.knownTitles()),
    });

    const steps: { from: string; x: P.ProposedEdge }[] = [];
    for (const chain of res.chains) {
      let from = a.title;
      for (const x of chain.steps) {
        steps.push({ from, x });
        from = x.target;
      }
    }
    progress?.('Refereeing every step…');
    const verdicts = await this.validate(provider, steps.map((s) => ({ from: s.from, to: s.x.target, why: s.x.why, status: s.x.status })));
    progress?.('Checking sources…');
    const verified = this.settings().verifySources ? await verifyTitles(steps.map((s) => s.x.source)) : new Map();

    const origin = { kind: 'ai' as const, model: provider.model('deep'), validatedBy: provider.model('fast'), at: Date.now() };
    const concepts: Concept[] = [];
    const edges: Edge[] = [];
    const sources: Source[] = [];
    steps.forEach(({ from, x }, i) => {
      const v = verdicts[i];
      if (!v?.keep) return;
      const fromId = this.idFor(from, aId, a.title);
      const toId = this.idFor(x.target, bId, b.title);
      if (fromId === toId) return;
      if (!g.get(toId) && !concepts.some((c) => c.id === toId)) concepts.push(stub(toId, x.target, x.domain, origin));
      if (!g.get(fromId) && !concepts.some((c) => c.id === fromId)) concepts.push(stub(fromId, from, 'history', origin));
      const src = this.sourceFor(x.source, verified);
      if (src) sources.push(src);
      edges.push(this.edge(fromId, toId, x, v, src, origin));
    });
    await this.repo.saveKnowledge({ concepts, edges, sources });
    return edges.length;
  }

  /* ─────────────────────────────── referee ─────────────────────────────── */

  async referee(aId: string, bId: string, justification?: string): Promise<P.RefereeResult & { model: string } | null> {
    const provider = this.provider;
    if (!provider) return null;
    const g = this.graph;
    const a = g.get(aId)!, b = g.get(bId)!;
    const { data, model } = await this.askWithModel<P.RefereeResult>(provider, {
      tier: 'fast', system: P.REFEREE_SYSTEM, schema: P.refereeSchema,
      prompt: P.refereePrompt(a.title, b.title, justification),
    });
    if (data.verdict !== 'rejected') {
      await this.repo.saveEdge({
        id: edgeId(aId, bId), a: aId, b: bId, type: asType(data.type), strength: data.verdict === 'valid' ? 'strong' : 'subtle',
        status: asStatus(data.status), confidence: clamp(data.confidence, 0.05, data.verdict === 'valid' ? 0.95 : 0.65),
        why: data.why, sources: [], origin: { kind: 'ai', model, validatedBy: model, at: Date.now() },
      });
    }
    return { ...data, model };
  }

  /* ─────────────────────────────── helpers ─────────────────────────────── */

  private async validate(provider: Provider, items: { from: string; to: string; why: string; status: string }[]) {
    if (!items.length) return [];
    const res = await this.ask<P.ValidateResult>(provider, {
      tier: 'fast', system: P.VALIDATE_SYSTEM, schema: P.validateSchema, prompt: P.validatePrompt(items),
    });
    const out: (P.ValidateResult['verdicts'][number] | undefined)[] = items.map(() => undefined);
    for (const v of res.verdicts) if (v.index >= 0 && v.index < items.length) out[v.index] = v;
    return out;
  }

  private edge(a: string, b: string, x: P.ProposedEdge, v: P.ValidateResult['verdicts'][number] | undefined, src: Source | null, origin: Edge['origin']): Edge {
    let confidence = clamp(Math.min(x.confidence, v?.confidence ?? x.confidence), 0.05, 0.97);
    if (this.settings().verifySources && !src?.verifiedAt) confidence = Math.max(0.05, confidence - 0.15);
    return {
      id: edgeId(a, b), a, b, type: asType(x.type), strength: asStrength(x.strength),
      status: asStatus(v?.status ?? x.status), confidence,
      why: v?.note && v.note.length > 12 && asStatus(v.status) !== asStatus(x.status) ? `${x.why} (Referee: ${v.note})` : x.why,
      sources: src ? [src.id] : [], origin,
    };
  }

  private sourceFor(title: string, verified: Map<string, { title: string; url: string }>): Source | null {
    if (!title) return null;
    const v = verified.get(title);
    const article = (v?.title ?? title).replace(/ /g, '_');
    return { ...wikiSource(article), ...(v ? { url: v.url, verifiedAt: Date.now() } : { note: 'Not verified' }) };
  }

  /** Map a free-text title to an existing concept id (or a new slug). */
  private idFor(title: string, fallbackId?: string, fallbackTitle?: string): string {
    if (fallbackId && fallbackTitle && normalize(title) === normalize(fallbackTitle)) return fallbackId;
    return this.graph.resolve(title)?.id ?? slugify(title);
  }

  /** Titles the model should prefer to reuse: high-gravity concepts plus the neighbourhood. */
  private knownTitles(near?: string): string[] {
    const g = this.graph;
    const all = [...g.concepts.values()].filter((c) => !c.stub);
    const nearIds = new Set(near ? g.neighbors(near).map((n) => n.id) : []);
    return all
      .sort((x, y) => Number(nearIds.has(y.id)) - Number(nearIds.has(x.id)) || g.gravity(y.id) - g.gravity(x.id))
      .slice(0, 160)
      .map((c) => c.title);
  }

  private async ask<T>(provider: Provider, req: CompletionRequest): Promise<T> {
    return (await this.askWithModel<T>(provider, req)).data;
  }

  private async askWithModel<T>(provider: Provider, req: CompletionRequest): Promise<{ data: T; model: string }> {
    const key = await hash(`${provider.id}|${provider.model(req.tier)}|${req.system}|${req.prompt}`);
    const hit = await this.repo.cacheGet<{ data: T; model: string }>(key);
    if (hit) return hit;
    const res = await provider.complete<T>(req);
    await this.repo.cachePut(key, res);
    return res;
  }
}

function stub(id: string, title: string, domain: string, origin: Concept['origin']): Concept {
  return { id, title, kicker: '', body: '', domain: asDomain(domain), gravity: 2, stub: true, origin };
}

async function hash(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Number.isFinite(x) ? x : lo));
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pick = <T extends string>(allowed: readonly string[], v: string, d: T) => (allowed.includes(v) ? v : d) as T;
const asDomain = (v: string) => pick<Domain>(P.DOMAINS, v, 'history');
const asType = (v: string) => pick<EdgeType>(P.EDGE_TYPES, v, 'conceptual');
const asStatus = (v: string) => pick<Status>(P.STATUS, v, 'interpretive');
const asStrength = (v: string) => pick<Strength>(P.STRENGTH, v, 'subtle');
