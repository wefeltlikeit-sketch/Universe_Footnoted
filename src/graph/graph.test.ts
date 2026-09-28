import { describe, expect, it } from 'vitest';
import { KnowledgeGraph } from './KnowledgeGraph';
import { findPath, findPaths, PATH_MODES } from './paths';
import { surprise } from './serendipity';
import { buildAtlas, uncharted } from './atlas';
import { scoreChain } from './game';
import { loadSeed } from '../seed';
import { newJourney, travel, lineage, depth, revisit } from '../narrative/journey';

const graph = () => {
  const g = new KnowledgeGraph();
  g.load(loadSeed());
  return g;
};

describe('the journeys the specification promises', () => {
  const g = graph();
  const chain = (ids: string[]) => ids.slice(1).every((id, i) => g.edge(ids[i], id));

  it.each([
    ['camembert milk domestication neolithic-revolution cities writing mathematics astronomy'],
    ['camembert penicillium microorganisms germ-theory antibiotics fleming antibiotic-resistance evolution darwin'],
    ['camembert normandy geology plate-tectonics radioactivity quantum-mechanics'],
    ['paris metric-system french-revolution enlightenment newton'],
    ['photography silver alchemy chemistry atomic-theory'],
    ['gothic-cathedral geometry linear-algebra hilbert-space quantum-mechanics entanglement quantum-computing'],
    ['microorganisms germ-theory experimental-science measurement probability quantum-mechanics bells-theorem'],
  ])('can walk %s', (route) => {
    expect(chain(route.split(' '))).toBe(true);
  });
});

describe('pathfinding', () => {
  const g = graph();
  it('connects Époisses to Paul Dirac in every mode', () => {
    const paths = findPaths(g, 'epoisses', 'dirac');
    expect(paths.length).toBeGreaterThanOrEqual(2);
    for (const p of paths) {
      expect(p.nodes[0]).toBe('epoisses');
      expect(p.nodes.at(-1)).toBe('dirac');
      expect(p.edges.every((e) => e.status !== 'speculative')).toBe(true);
    }
  });

  it('finds a path for each mode between distant concepts', () => {
    for (const m of PATH_MODES) expect(findPath(g, 'coffee', 'bells-theorem', m.id)).not.toBeNull();
  });

  it('the strangest path leaps further than the shortest', () => {
    const s = findPath(g, 'cheese', 'quantum-mechanics', 'shortest')!;
    const x = findPath(g, 'cheese', 'quantum-mechanics', 'strangest')!;
    expect(x.score.leaps / x.score.steps).toBeGreaterThanOrEqual(s.score.leaps / s.score.steps - 1e-9);
  });
});

describe('serendipity', () => {
  const g = graph();
  it('lands somewhere several defensible steps away, outside the neighbourhood', () => {
    let seed = 1;
    const rng = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const leap = surprise(g, 'cheese', { visited: new Set(['cheese']), strangeness: 0.7, rng })!;
    expect(leap).not.toBeNull();
    expect(leap.path.score.steps).toBeGreaterThanOrEqual(3);
    expect(g.neighbors('cheese').map((n) => n.id)).not.toContain(leap.target);
    expect(leap.path.score.weakest).toBeGreaterThanOrEqual(0.6);
  });
});

describe('journeys, atlas and games', () => {
  const g = graph();
  it('journeys branch instead of forgetting', () => {
    let j = newJourney('cheese');
    j = travel(j, 'penicillium', 'footnote');
    j = travel(j, 'fleming', 'footnote');
    j = revisit(j, 1);
    j = travel(j, 'antibiotics', 'footnote');
    expect(j.steps).toHaveLength(4);
    expect(lineage(j).map((i) => j.steps[i].conceptId)).toEqual(['cheese', 'penicillium', 'antibiotics']);
    expect(depth(j)).toBe(2);
  });

  it('builds an atlas with emergent clusters and frontiers', () => {
    let j = newJourney('cheese');
    for (const id of ['penicillium', 'antibiotics', 'evolution', 'darwin']) j = travel(j, id, 'footnote');
    const atlas = buildAtlas(g, [j]);
    expect(atlas.visits.size).toBe(5);
    expect(atlas.clusters.length).toBeGreaterThan(0);
    const frontier = uncharted(g, atlas);
    expect(frontier.length).toBeGreaterThan(0);
    expect(frontier.every((f) => !atlas.visits.has(f.id))).toBe(true);
  });

  it('scores a refereed chain', () => {
    const steps = ['gothic-cathedral', 'geometry', 'linear-algebra', 'hilbert-space', 'quantum-computing'];
    const chain = steps.slice(1).map((to, i) => ({
      from: steps[i], to, verdict: 'valid' as const, confidence: 0.9, explanation: '', judge: 'graph' as const,
    }));
    const s = scoreChain(g, 'gothic-cathedral', 'quantum-computing', chain);
    expect(s.validity).toBeCloseTo(0.9);
    expect(s.elegance).toBeGreaterThan(0.5);
  });
});
