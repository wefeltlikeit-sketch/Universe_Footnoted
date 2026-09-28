/**
 * Prompts for each intellectual function. Each function has one job and one schema; the orchestrator
 * composes them. Keep the system prompts stable (they are part of the cache key).
 */

const DOMAINS = ['food', 'biology', 'medicine', 'chemistry', 'physics', 'mathematics', 'astronomy', 'earth',
  'history', 'geography', 'technology', 'art', 'language', 'philosophy', 'economics', 'politics', 'person'];
const EDGE_TYPES = ['biological', 'production', 'historical', 'causal', 'geographical', 'linguistic',
  'mathematical', 'technological', 'cultural', 'biographical', 'analogical', 'controversial', 'chemical',
  'physical', 'economic', 'conceptual', 'political'];
const STATUS = ['factual', 'interpretive', 'analogical', 'speculative'];
const STRENGTH = ['direct', 'strong', 'subtle'];

export const PRIME_DIRECTIVE = `You are the footnote engine of "The Universe Has Footnotes", an application for intellectual wandering.
Everything has footnotes: every ordinary thing contains defensible paths into the rest of human knowledge.

The Prime Directive: every connection must be defensible. You must be able to say precisely why A is connected to B.
- Never invent facts, dates, quotations or sources. If unsure, lower the confidence or leave the connection out.
- Distinguish status honestly: "factual" (documented), "interpretive" (a scholarly reading that others dispute or that requires judgement), "analogical" (a structural parallel, not a causal or historical link), "speculative" (an open or fringe idea — use sparingly and say so).
- Strange is encouraged. Random is not. Clever-sounding associations without a real bridge are forbidden.`;

export const EXPLAIN_SYSTEM = `${PRIME_DIRECTIVE}

Your job now: write one page of the book for a topic, and curate its footnotes.

THE PAGE
- 110–170 words. Precise, vivid, concrete; the voice of a brilliant, generous scholar writing marginalia. No filler, no hype, no lists.
- Lead with what the thing is, then reveal hidden history, causes and consequences.
- Embed 4–7 footnotes inline using the exact form [visible words](Target Title), where Target Title exactly matches one of your exits' "target".

THE FOOTNOTES (exits)
Do not hyperlink every noun. The goal is maximum curiosity per link. Prefer exits that:
reveal hidden history · cross disciplines · expose causal chains · connect everyday things with profound ideas · create surprising but defensible transitions.
Avoid obvious low-value exits (e.g. "food" from "cheese", "country" from "France").
Mix distances: include some close exits and at least two that travel to a genuinely different field.
When a concept from the KNOWN list fits, use its exact title so the graph stays connected.
Each exit's "why" is one or two sentences that would convince a sceptical expert. "source" is the English Wikipedia article title that best supports the connection.`;

export const explainSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'kicker', 'domain', 'gravity', 'wiki', 'body', 'exits'],
  properties: {
    title: { type: 'string', description: 'Canonical display name' },
    kicker: { type: 'string', description: 'A short evocative subtitle, under 8 words' },
    domain: { type: 'string', enum: DOMAINS },
    gravity: { type: 'integer', description: '1 = narrow; 5 = connects to vast areas of knowledge (energy, information, language, time…)' },
    wiki: { type: 'string', description: 'English Wikipedia article title for this topic' },
    body: { type: 'string' },
    exits: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['target', 'domain', 'type', 'strength', 'status', 'confidence', 'why', 'source'],
        properties: {
          target: { type: 'string' },
          domain: { type: 'string', enum: DOMAINS },
          type: { type: 'string', enum: EDGE_TYPES },
          strength: { type: 'string', enum: STRENGTH },
          status: { type: 'string', enum: STATUS },
          confidence: { type: 'number' },
          why: { type: 'string' },
          source: { type: 'string' },
        },
      },
    },
  },
} as const;

export interface ExplainResult {
  title: string;
  kicker: string;
  domain: string;
  gravity: number;
  wiki: string;
  body: string;
  exits: ProposedEdge[];
}

export interface ProposedEdge {
  target: string;
  domain: string;
  type: string;
  strength: string;
  status: string;
  confidence: number;
  why: string;
  source: string;
}

export function explainPrompt(topic: string, ctx: { arrivedFrom?: string; why?: string; strangeness: number; known: string[] }): string {
  const dial = ctx.strangeness < 0.34
    ? 'The traveller wants FAMILIAR territory: keep most exits close to the topic.'
    : ctx.strangeness > 0.66
      ? 'The traveller wants STRANGE territory: favour distant, cross-disciplinary exits — still strictly defensible.'
      : 'Balance close and distant exits.';
  return [
    `TOPIC: ${topic}`,
    ctx.arrivedFrom ? `The traveller arrived here from "${ctx.arrivedFrom}"${ctx.why ? ` (because: ${ctx.why})` : ''}. Do not simply link back.` : '',
    dial,
    `KNOWN concepts (reuse exact titles where they genuinely fit): ${ctx.known.join('; ')}`,
  ].filter(Boolean).join('\n\n');
}

export const VALIDATE_SYSTEM = `${PRIME_DIRECTIVE}

Your job now: act as a strict fact-checking referee. For each proposed connection, decide whether it is defensible as stated.
Reject connections that are false, unsupported, trivially generic, or merely associative. Correct the status if it is overstated (e.g. an analogy labelled factual) and set a calibrated confidence (0–1).`;

export const validateSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['verdicts'],
  properties: {
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['index', 'keep', 'status', 'confidence', 'note'],
        properties: {
          index: { type: 'integer' },
          keep: { type: 'boolean' },
          status: { type: 'string', enum: STATUS },
          confidence: { type: 'number' },
          note: { type: 'string', description: 'Short reason, especially when rejecting or correcting' },
        },
      },
    },
  },
} as const;

export interface ValidateResult {
  verdicts: { index: number; keep: boolean; status: string; confidence: number; note: string }[];
}

export function validatePrompt(items: { from: string; to: string; why: string; status: string }[]): string {
  return items.map((c, i) => `${i}. ${c.from} → ${c.to} [claimed ${c.status}]: ${c.why}`).join('\n');
}

export const BRIDGE_SYSTEM = `${PRIME_DIRECTIVE}

Your job now: find meaningful conceptual bridges between two concepts. Do not rely on surface similarity.
Propose up to 4 chains, each 2–7 steps, of different character: historical, scientific, cultural, and the strangest defensible one.
Every step must be justified on its own. Prefer KNOWN concepts as stepping stones when they truly fit.`;

export const bridgeSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['chains'],
  properties: {
    chains: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['character', 'steps'],
        properties: {
          character: { type: 'string', enum: ['historical', 'scientific', 'cultural', 'strangest'] },
          steps: explainSchema.properties.exits,
        },
      },
    },
  },
} as const;

export interface BridgeResult {
  chains: { character: string; steps: ProposedEdge[] }[];
}

export function bridgePrompt(a: string, b: string, known: string[]): string {
  return `FROM: ${a}\nTO: ${b}\n\nEach chain is a list of steps; step 1 goes from "${a}" to its target, each following step starts where the previous one ended, and the final target must be exactly "${b}".\n\nKNOWN concepts: ${known.join('; ')}`;
}

export const REFEREE_SYSTEM = `${PRIME_DIRECTIVE}

Your job now: referee one move in a game where a player connects two concepts step by step.
Judge only whether the single step from A to B is intellectually defensible. Be fair but firm: "valid" if a knowledgeable person would accept it, "weak" if it holds only loosely or needs a charitable reading, "rejected" if it does not hold.
If the player supplied a justification, judge that justification too.`;

export const refereeSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['verdict', 'type', 'status', 'confidence', 'why'],
  properties: {
    verdict: { type: 'string', enum: ['valid', 'weak', 'rejected'] },
    type: { type: 'string', enum: EDGE_TYPES },
    status: { type: 'string', enum: STATUS },
    confidence: { type: 'number' },
    why: { type: 'string', description: 'The best defensible statement of the connection, or why it fails' },
  },
} as const;

export interface RefereeResult {
  verdict: 'valid' | 'weak' | 'rejected';
  type: string;
  status: string;
  confidence: number;
  why: string;
}

export function refereePrompt(a: string, b: string, justification?: string): string {
  return `A: ${a}\nB: ${b}${justification ? `\nPlayer's justification: ${justification}` : ''}`;
}

export { DOMAINS, EDGE_TYPES, STATUS, STRENGTH };
