import type { Journey, JourneyStep, Via } from '../model/types';
import { edgeId } from '../model/types';
import type { KnowledgeGraph } from '../graph/KnowledgeGraph';

/**
 * Journeys are trees, not lists. Going back and following a different footnote branches rather than
 * erasing what came before, so "How did I get here?" is always the unique route from the origin to
 * the cursor, and the map shows every branch you tried.
 */
export function newJourney(originId: string, name?: string): Journey {
  const now = Date.now();
  return {
    id: `j-${now.toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    name: name ?? '',
    createdAt: now,
    updatedAt: now,
    steps: [{ conceptId: originId, parent: null, edgeId: null, via: 'origin', at: now }],
    cursor: 0,
  };
}

export function current(j: Journey): JourneyStep {
  return j.steps[j.cursor];
}

export function origin(j: Journey): JourneyStep {
  return j.steps[0];
}

/** Travel from the cursor to a concept. Returns a new journey (immutable updates). */
export function travel(j: Journey, to: string, via: Via): Journey {
  const from = current(j).conceptId;
  if (from === to) return j;
  const now = Date.now();
  const step: JourneyStep = { conceptId: to, parent: j.cursor, edgeId: edgeId(from, to), via, at: now };
  return { ...j, steps: [...j.steps, step], cursor: j.steps.length, updatedAt: now };
}

/** Travel a multi-step route (Surprise me, a found path), one recorded step per hop. */
export function travelRoute(j: Journey, route: string[], via: Via): Journey {
  let next = j;
  for (const id of route.slice(route[0] === current(j).conceptId ? 1 : 0)) next = travel(next, id, via);
  return next;
}

/** Move the cursor to a concept already on this journey, without adding a step. */
export function revisit(j: Journey, stepIndex: number): Journey {
  if (stepIndex < 0 || stepIndex >= j.steps.length) return j;
  return { ...j, cursor: stepIndex, updatedAt: Date.now() };
}

/** Step indices from the origin to the given step: the answer to "How did I get here?". */
export function lineage(j: Journey, stepIndex = j.cursor): number[] {
  const out: number[] = [];
  for (let i: number | null = stepIndex; i !== null; i = j.steps[i].parent) out.unshift(i);
  return out;
}

export function depth(j: Journey, stepIndex = j.cursor): number {
  return lineage(j, stepIndex).length - 1;
}

/** Unique concepts in discovery order (for replay and export). */
export function discoveryOrder(j: Journey): JourneyStep[] {
  const seen = new Set<string>();
  return j.steps.filter((s) => !seen.has(s.conceptId) && seen.add(s.conceptId));
}

export function conceptIds(j: Journey): Set<string> {
  return new Set(j.steps.map((s) => s.conceptId));
}

/** A name worth keeping, e.g. "Cheese → Bell’s theorem", until the traveller writes their own. */
export function autoName(j: Journey, g: KnowledgeGraph): string {
  const a = g.get(origin(j).conceptId)?.title ?? 'Somewhere';
  const deepest = j.steps.reduce((best, _s, i) => (depth(j, i) > depth(j, best) ? i : best), 0);
  const b = g.get(j.steps[deepest].conceptId)?.title;
  return b && deepest !== 0 ? `${a} → ${b}` : a;
}

export function displayName(j: Journey, g: KnowledgeGraph): string {
  return j.name.trim() || autoName(j, g);
}
