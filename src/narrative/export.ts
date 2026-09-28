import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY, type SimulationNodeDatum } from 'd3-force';
import type { Concept, Edge, Journey, Source } from '../model/types';
import type { KnowledgeGraph } from '../graph/KnowledgeGraph';
import * as J from './journey';

/**
 * Journeys are portable artifacts. The JSON export carries every concept, edge and source the journey
 * touches, so it can be re-opened on another machine with full provenance, even for AI-written pages.
 */
export const FORMAT = 'universe-footnoted/journey';

export interface JourneyFile {
  format: typeof FORMAT;
  version: 1;
  exportedAt: string;
  journey: Journey;
  concepts: Concept[];
  edges: Edge[];
  sources: Source[];
}

export function toJSON(j: Journey, g: KnowledgeGraph): string {
  const ids = J.conceptIds(j);
  const edges = [...new Set(j.steps.map((s) => s.edgeId).filter(Boolean) as string[])]
    .map((id) => g.edges.get(id)).filter(Boolean) as Edge[];
  const sources = [...new Set(edges.flatMap((e) => e.sources))].map((id) => g.sources.get(id)).filter(Boolean) as Source[];
  const file: JourneyFile = {
    format: FORMAT, version: 1, exportedAt: new Date().toISOString(),
    journey: j,
    concepts: [...ids].map((id) => g.get(id)).filter(Boolean) as Concept[],
    edges, sources,
  };
  return JSON.stringify(file, null, 2);
}

export function parseJourneyFile(text: string): JourneyFile {
  const f = JSON.parse(text) as JourneyFile;
  if (f.format !== FORMAT || !f.journey?.steps?.length) throw new Error('This is not a journey file.');
  return f;
}

export function toMarkdown(j: Journey, g: KnowledgeGraph): string {
  const title = J.displayName(j, g);
  const lines = [`# ${title}`, '', `*A journey through The Universe Has Footnotes, begun ${new Date(j.createdAt).toDateString()}.*`, ''];
  for (const s of J.discoveryOrder(j)) {
    const c = g.get(s.conceptId);
    if (!c) continue;
    const e = s.edgeId ? g.edges.get(s.edgeId) : undefined;
    const from = s.parent !== null ? g.get(j.steps[s.parent].conceptId) : undefined;
    if (e && from) {
      lines.push(`↓ *${from.title} → ${c.title}* · ${e.type}, ${e.status}, ${Math.round(e.confidence * 100)}% confident`);
      lines.push(`> ${e.why}`, '');
    }
    lines.push(`## ${c.title}`, c.kicker ? `*${c.kicker}*` : '', '');
  }
  const deepest = Math.max(...j.steps.map((_, i) => J.depth(j, i)));
  lines.push('---', `${J.discoveryOrder(j).length} concepts · deepest point ${deepest} steps from the origin.`);
  return lines.join('\n');
}

/** A static constellation image of the journey, laid out offline with the same forces as the map. */
export function toSVG(j: Journey, g: KnowledgeGraph, theme: 'night' | 'paper' = 'night'): string {
  const P = theme === 'night'
    ? { bg: '#0b0d12', text: '#e8e2d4', muted: '#a49d8e', rubric: '#e36a41', gold: '#d8b765', rule: 'rgba(232,226,212,0.08)' }
    : { bg: '#f2ede2', text: '#211e1a', muted: '#6d665b', rubric: '#b8401e', gold: '#99731f', rule: 'rgba(33,30,26,0.08)' };
  type N = SimulationNodeDatum & { id: string };
  const order = J.discoveryOrder(j);
  const nodes: N[] = order.map((s, i) => ({ id: s.conceptId, x: Math.cos(i) * i * 12, y: Math.sin(i) * i * 12 }));
  const links = j.steps.filter((s) => s.parent !== null).map((s) => ({ source: j.steps[s.parent!].conceptId, target: s.conceptId }));
  forceSimulation(nodes)
    .force('charge', forceManyBody().strength(-320))
    .force('link', forceLink(links).id((n) => (n as N).id).distance(95))
    .force('collide', forceCollide(34))
    .force('x', forceX(0).strength(0.03))
    .force('y', forceY(0).strength(0.03))
    .stop()
    .tick(400);
  const xs = nodes.map((n) => n.x!), ys = nodes.map((n) => n.y!);
  const pad = 140;
  const minX = Math.min(...xs) - pad, minY = Math.min(...ys) - pad - 40;
  const w = Math.max(...xs) - minX + pad + 60, h = Math.max(...ys) - minY + pad;
  const pos = new Map(nodes.map((n) => [n.id, n]));
  const here = J.current(j).conceptId, origin = J.origin(j).conceptId;
  const esc = (s: string) => s.replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c]!);

  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${w} ${h}" width="${Math.round(w)}" height="${Math.round(h)}">`,
    `<rect x="${minX}" y="${minY}" width="${w}" height="${h}" fill="${P.bg}"/>`,
  ];
  const o = pos.get(origin)!;
  for (let r = 160; r < Math.max(w, h) * 1.5; r += 160) parts.push(`<circle cx="${o.x}" cy="${o.y}" r="${r}" fill="none" stroke="${P.rule}"/>`);
  for (const l of links) {
    const a = pos.get(idOf(l.source))!, b = pos.get(idOf(l.target))!;
    parts.push(`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${P.muted}" stroke-opacity="0.55" stroke-width="1.2"/>`);
  }
  for (const n of nodes) {
    const c = g.get(n.id);
    const r = 3 + 9 * g.gravity(n.id);
    const fill = n.id === here ? P.rubric : n.id === origin ? P.gold : P.text;
    parts.push(`<circle cx="${n.x}" cy="${n.y}" r="${r.toFixed(1)}" fill="${fill}"/>`);
    parts.push(`<text x="${n.x! + r + 6}" y="${n.y! + 5}" font-family="Newsreader, Georgia, serif" font-size="15" fill="${P.text}">${esc(c?.title ?? n.id)}</text>`);
  }
  parts.push(`<text x="${minX + 40}" y="${minY + 56}" font-family="Newsreader, Georgia, serif" font-style="italic" font-size="26" fill="${P.text}">${esc(J.displayName(j, g))}</text>`);
  parts.push(`<text x="${minX + 40}" y="${minY + 80}" font-family="IBM Plex Mono, monospace" font-size="11" letter-spacing="2" fill="${P.muted}">THE UNIVERSE HAS FOOTNOTES</text>`);
  parts.push('</svg>');
  return parts.join('\n');
}

export function download(filename: string, content: string, mime: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function filenameFor(j: Journey, g: KnowledgeGraph, ext: string) {
  return `${J.displayName(j, g).replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').toLowerCase() || 'journey'}.${ext}`;
}

function idOf(x: unknown): string {
  return typeof x === 'string' ? x : (x as { id: string }).id;
}
