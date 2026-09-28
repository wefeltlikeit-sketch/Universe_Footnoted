import type { Journey } from '../model/types';
import type { KnowledgeGraph } from '../graph/KnowledgeGraph';
import { current, depth, lineage, origin } from './journey';

/**
 * Marginalia: small handwritten-style acknowledgements for unlikely arrivals.
 * Rare by design. Each fires at most once per journey, and they never score or rank anything.
 */
export interface Marginalia {
  id: string;
  test: (j: Journey, g: KnowledgeGraph) => boolean;
  note: (j: Journey, g: KnowledgeGraph) => string;
}

const at = (j: Journey) => current(j).conceptId;
const route = (j: Journey) => lineage(j).map((i) => j.steps[i].conceptId);
const startDomain = (j: Journey, g: KnowledgeGraph) => g.get(origin(j).conceptId)?.domain;

export const MARGINALIA: Marginalia[] = [
  {
    id: 'cheese-to-quantum',
    test: (j, g) => startDomain(j, g) === 'food' &&
      ['quantum-mechanics', 'bells-theorem', 'entanglement', 'dirac', 'hilbert-space'].includes(at(j)),
    note: (j, g) => `From ${g.get(origin(j).conceptId)!.title.toLowerCase()} to the quantum in ${depth(j)} steps. The universe has footnotes.`,
  },
  {
    id: 'footnote',
    test: (j) => at(j) === 'footnote',
    note: () => 'You have found the footnote to the footnotes.',
  },
  {
    id: 'ouroboros',
    test: (j) => depth(j) >= 4 && at(j) === origin(j).conceptId,
    note: (j) => `Back where you began, ${depth(j)} steps later. The circle closes; the view has changed.`,
  },
  {
    id: 'lucasian',
    test: (j) => { const r = route(j); return r.includes('newton') && at(j) === 'dirac'; },
    note: () => 'Two Lucasian Professors on one path, three centuries apart.',
  },
  {
    id: 'coffee-odds',
    test: (j) => { const r = route(j); return r.includes('coffee') && at(j) === 'probability'; },
    note: () => 'A cup of coffee, priced by the laws of chance. Lloyd’s would approve.',
  },
  {
    id: 'moon-silver',
    test: (j) => { const r = route(j); return r.includes('moon') && r.includes('silver') && at(j) === 'photography'; },
    note: () => 'The alchemists’ lunar metal, holding light. Luna would be pleased.',
  },
  {
    id: 'deep',
    test: (j) => depth(j) === 17,
    note: (j, g) => `Depth 17. You began with ${g.get(origin(j).conceptId)!.title}. Remember?`,
  },
  {
    id: 'forty-two',
    test: (j) => depth(j) === 42,
    note: () => 'Depth 42. Some would say you have found the answer. The question remains open.',
  },
  {
    id: 'return-of-the-king',
    test: (j) => { const r = route(j); return r[0] === 'cheese' && at(j) === 'epoisses' && r.length > 5; },
    note: () => 'Brillat-Savarin is said to have called it the king of cheeses. You took the long road to meet it.',
  },
];

export function checkMarginalia(j: Journey, g: KnowledgeGraph): { id: string; note: string } | null {
  const seen = new Set(j.marginalia ?? []);
  for (const m of MARGINALIA) {
    if (!seen.has(m.id) && m.test(j, g)) return { id: m.id, note: m.note(j, g) };
  }
  return null;
}
