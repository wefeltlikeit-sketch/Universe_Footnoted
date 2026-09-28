import type { EdgeType, Status } from '../../model/types';

/**
 * Relationship types are grouped into four visual families (colour), and epistemic status is drawn
 * as line style. Sixteen types would be unreadable; four hues and four strokes are not.
 */
export type Family = 'science' | 'history' | 'culture' | 'analogy';

export const FAMILY_OF: Record<EdgeType, Family> = {
  physical: 'science', chemical: 'science', biological: 'science', mathematical: 'science',
  technological: 'science', causal: 'science', production: 'science',
  historical: 'history', biographical: 'history', political: 'history', controversial: 'history',
  cultural: 'culture', linguistic: 'culture', geographical: 'culture', economic: 'culture',
  analogical: 'analogy', conceptual: 'analogy',
};

export const FAMILY_LABEL: Record<Family, string> = {
  science: 'mechanism', history: 'history', culture: 'culture & place', analogy: 'idea & analogy',
};

export const DASH: Record<Status, number[]> = {
  factual: [],
  interpretive: [6, 3],
  analogical: [2, 4],
  speculative: [1, 5],
};

export const STATUS_TEXT: Record<Status, string> = {
  factual: 'Documented fact: the connection is established in reliable sources.',
  interpretive: 'Interpretation: a scholarly reading that requires judgement, or that others dispute.',
  analogical: 'Analogy: a structural parallel between ideas, not a causal or historical link.',
  speculative: 'Speculation: an open or unproven idea, included because it is provocative. Treat with care.',
};

export function familyVar(f: Family): string {
  return `var(--${f})`;
}

export interface Palette {
  text: string; muted: string; faint: string; rule: string; rubric: string; gold: string; star: string; bg: string;
  science: string; history: string; culture: string; analogy: string;
}

export function readPalette(): Palette {
  const cs = getComputedStyle(document.documentElement);
  const v = (n: string) => cs.getPropertyValue(`--${n}`).trim();
  return {
    text: v('text'), muted: v('muted'), faint: v('faint'), rule: v('rule'), rubric: v('rubric'),
    gold: v('gold'), star: v('star'), bg: v('bg'),
    science: v('science'), history: v('history'), culture: v('culture'), analogy: v('analogy'),
  };
}

export function withAlpha(color: string, a: number): string {
  if (color.startsWith('#')) {
    const n = color.length === 4
      ? color.slice(1).split('').map((c) => parseInt(c + c, 16))
      : [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16));
    return `rgba(${n[0]},${n[1]},${n[2]},${a})`;
  }
  const m = color.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const [r, g, b] = m[1].split(',').map((x) => x.trim());
    return `rgba(${r},${g},${b},${a})`;
  }
  return color;
}
