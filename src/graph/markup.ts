/**
 * Footnote markup: `[visible text](target-id)` inside a concept body.
 * Parsing yields a flat list of segments so the reader can render text and numbered
 * footnote markers without any HTML injection.
 */
export type Segment =
  | { kind: 'text'; text: string }
  | { kind: 'note'; text: string; target: string; n: number };

export interface ParsedBody {
  segments: Segment[];
  /** Footnotes in order of first appearance, one per target. */
  footnotes: { n: number; target: string; text: string }[];
}

const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

export function parseBody(body: string): ParsedBody {
  const segments: Segment[] = [];
  const footnotes: ParsedBody['footnotes'] = [];
  const numberOf = new Map<string, number>();
  let last = 0;
  for (const m of body.matchAll(LINK)) {
    if (m.index! > last) segments.push({ kind: 'text', text: body.slice(last, m.index) });
    const target = m[2];
    let n = numberOf.get(target);
    if (n === undefined) {
      n = footnotes.length + 1;
      numberOf.set(target, n);
      footnotes.push({ n, target, text: m[1] });
    }
    segments.push({ kind: 'note', text: m[1], target, n });
    last = m.index! + m[0].length;
  }
  if (last < body.length) segments.push({ kind: 'text', text: body.slice(last) });
  return { segments, footnotes };
}

/** Plain text of a body, markers removed. */
export function plainText(body: string): string {
  return body.replace(LINK, '$1');
}

/** Remove the footnote on a given target (keeping its text), e.g. when validation rejects an edge. */
export function unlinkTarget(body: string, target: string): string {
  return body.replace(LINK, (whole, text, t) => (t === target ? text : whole));
}

/** Rewrite targets (e.g. titles the AI used → canonical ids). */
export function mapTargets(body: string, fn: (target: string) => string | null): string {
  return body.replace(LINK, (_w, text, t) => {
    const mapped = fn(t);
    return mapped ? `[${text}](${mapped})` : text;
  });
}
