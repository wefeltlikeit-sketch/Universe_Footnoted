/**
 * The knowledge model.
 *
 * Two kinds of data live in this app, and they are kept apart on purpose:
 *
 *   STABLE KNOWLEDGE — Concept, Edge, Source. Generated (or curated) once, cached forever,
 *   shared by every journey. A concept is never regenerated once it has a body.
 *
 *   SESSION NARRATIVE — Journey, Session, the Atlas derived from them. This is the story of
 *   one person's curiosity: which footnotes they followed, in what order, and why.
 */

/** Broad field of a concept. Used only to measure how far a leap travels ("strangeness"),
 *  never shown as a category — clusters in the Atlas emerge from the graph itself. */
export type Domain =
  | 'food' | 'biology' | 'medicine' | 'chemistry' | 'physics' | 'mathematics'
  | 'astronomy' | 'earth' | 'history' | 'geography' | 'technology' | 'art'
  | 'language' | 'philosophy' | 'economics' | 'politics' | 'person';

export interface Concept {
  id: string;                 // stable slug, e.g. "penicillium"
  title: string;              // display name
  kicker: string;             // one-line italic gloss under the title
  /** Body with inline footnote markup: `[visible text](target-id)`. Empty for stubs. */
  body: string;
  domain: Domain;
  /** Intrinsic intellectual gravity, 1 (local) … 5 (connects to everything). */
  gravity: number;
  aliases?: string[];
  /** Reference article title on Wikipedia, used for provenance and verification. */
  wiki?: string;
  /** A stub is known to exist (something links to it) but has not been written yet. */
  stub?: boolean;
  origin: Origin;
}

export type EdgeType =
  | 'biological' | 'production' | 'historical' | 'causal' | 'geographical'
  | 'linguistic' | 'mathematical' | 'technological' | 'cultural' | 'biographical'
  | 'analogical' | 'controversial' | 'chemical' | 'physical' | 'economic' | 'conceptual'
  | 'political';

/** How tightly the two concepts are bound. */
export type Strength = 'direct' | 'strong' | 'subtle';

/** Epistemic status — the heart of the provenance layer. */
export type Status = 'factual' | 'interpretive' | 'analogical' | 'speculative';

export interface Edge {
  id: string;                 // `${a}~${b}` with a < b — edges are undirected for travel
  a: string;
  b: string;
  type: EdgeType;
  strength: Strength;
  status: Status;
  confidence: number;         // 0–1: how sure we are the connection holds as stated
  /** Why A is connected to B. Written to read sensibly in both directions. */
  why: string;
  sources: string[];          // Source ids
  origin: Origin;
}

export interface Source {
  id: string;
  title: string;
  publisher: string;          // "Wikipedia", "Britannica", a journal, a book…
  url?: string;
  /** Set when the source's existence was checked against the live web. */
  verifiedAt?: number;
  note?: string;
}

/** Who made a piece of knowledge and how it was checked. */
export interface Origin {
  kind: 'seed' | 'ai' | 'wikipedia' | 'user' | 'import';
  model?: string;             // model id that generated it
  validatedBy?: string;       // model id (or "graph") that checked it
  at?: number;
}

/* ─────────────────────────── narrative ─────────────────────────── */

export type Via = 'origin' | 'footnote' | 'exit' | 'surprise' | 'path' | 'search' | 'map';

export interface JourneyStep {
  conceptId: string;
  /** Index of the step we travelled from. null for the origin. Forms a tree:
   *  going back and taking another footnote branches instead of erasing history. */
  parent: number | null;
  edgeId: string | null;
  via: Via;
  at: number;
}

export interface Journey {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  steps: JourneyStep[];
  /** The step the traveller is standing on. */
  cursor: number;
  /** Easter eggs found on this journey. */
  marginalia?: string[];
}

export interface Session {
  id: string;
  startedAt: number;
  lastActiveAt: number;
  journeyIds: string[];
}

export interface Settings {
  provider: 'none' | 'anthropic' | 'openai-compatible';
  apiKey: string;
  baseUrl: string;
  fastModel: string;
  deepModel: string;
  theme: 'night' | 'paper';
  /** 0 = familiar … 1 = strange */
  strangeness: number;
  rabbitHole: boolean;
  verifySources: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  provider: 'none',
  apiKey: '',
  baseUrl: '',
  fastModel: 'claude-haiku-4-5',
  deepModel: 'claude-opus-5',
  theme: 'night',
  strangeness: 0.5,
  rabbitHole: false,
  verifySources: true,
};

export function edgeId(x: string, y: string): string {
  return x < y ? `${x}~${y}` : `${y}~${x}`;
}

export function other(e: Edge, id: string): string {
  return e.a === id ? e.b : e.a;
}

export function slugify(s: string): string {
  return s
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
