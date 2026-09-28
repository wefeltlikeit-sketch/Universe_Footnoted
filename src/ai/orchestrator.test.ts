import { describe, expect, it } from 'vitest';
import { Orchestrator } from './orchestrator';
import { Repository } from '../store/repository';
import { DEFAULT_SETTINGS } from '../model/types';
import type { CompletionRequest, Provider } from './providers/types';
import { parseBody } from '../graph/markup';

/** A scripted provider: returns canned JSON per function, and counts calls (to prove caching). */
function fakeProvider(calls: string[]): Provider {
  return {
    id: 'fake', label: 'Fake', model: (t) => `fake-${t}`,
    async complete<T>(req: CompletionRequest) {
      calls.push(req.system.includes('write one page') ? 'explain' : req.system.includes('referee one move') ? 'referee' : req.system.includes('bridges') ? 'bridge' : 'validate');
      if (req.system.includes('write one page')) {
        return { model: 'fake-deep', data: {
          title: 'Tea', kicker: 'Leaves, water, empire', domain: 'food', gravity: 2, wiki: 'Tea',
          body: 'Tea contains [caffeine](Caffeine), shaped the [opium trade](Opium Wars), and is steeped in [water](Water memory).',
          exits: [
            { target: 'Caffeine', domain: 'chemistry', type: 'chemical', strength: 'direct', status: 'factual', confidence: 0.95, why: 'Tea leaves contain caffeine.', source: 'Caffeine' },
            { target: 'Opium Wars', domain: 'history', type: 'historical', strength: 'strong', status: 'factual', confidence: 0.9, why: 'Britain’s tea trade deficit with China drove opium exports.', source: 'First Opium War' },
            { target: 'Water memory', domain: 'medicine', type: 'analogical', strength: 'subtle', status: 'factual', confidence: 0.8, why: 'Water remembers the tea.', source: 'Water memory' },
          ],
        } as T };
      }
      if (req.system.includes('referee one move')) {
        return { model: 'fake-fast', data: { verdict: 'valid', type: 'historical', status: 'factual', confidence: 0.8, why: 'A fair step.' } as T };
      }
      // Validation: reject the pseudo-scientific exit (index 2).
      return { model: 'fake-fast', data: { verdicts: [
        { index: 0, keep: true, status: 'factual', confidence: 0.97, note: '' },
        { index: 1, keep: true, status: 'factual', confidence: 0.88, note: '' },
        { index: 2, keep: false, status: 'speculative', confidence: 0.05, note: 'Water memory is pseudoscience.' },
      ] } as T };
    },
  };
}

describe('AI orchestration pipeline', () => {
  it('writes a page, keeps refereed exits, drops rejected ones, and caches', async () => {
    const repo = await Repository.open();
    const calls: string[] = [];
    const settings = { ...DEFAULT_SETTINGS, provider: 'anthropic' as const, apiKey: 'x', verifySources: false };
    const ai = new Orchestrator(repo, () => settings, () => fakeProvider(calls));

    const id = await ai.explore('tea');
    const tea = repo.graph.get(id)!;
    expect(tea.title).toBe('Tea');
    const targets = parseBody(tea.body).footnotes.map((f) => f.target);
    expect(targets).toContain('caffeine');           // reused the existing seed concept
    expect(targets).toContain('opium-wars');         // new concept, created as a stub
    expect(targets).not.toContain('water-memory');   // rejected by the referee → unlinked
    expect(tea.body).toContain('water');             // …but its words remain
    expect(repo.graph.get('opium-wars')?.stub).toBe(true);
    const e = repo.graph.edge('tea', 'caffeine')!;
    expect(e.origin).toMatchObject({ kind: 'ai', model: 'fake-deep', validatedBy: 'fake-fast' });
    expect(calls).toEqual(['explain', 'validate']);

    // A written concept is stable knowledge: exploring again makes no calls.
    await ai.explore('Tea');
    expect(calls).toHaveLength(2);
  });

  it('referees a game move and records the edge with provenance', async () => {
    const repo = await Repository.open();
    const calls: string[] = [];
    const settings = { ...DEFAULT_SETTINGS, provider: 'anthropic' as const, apiKey: 'x' };
    const ai = new Orchestrator(repo, () => settings, () => fakeProvider(calls));
    const r = await ai.referee('moon', 'insurance', 'Tide tables and shipping risk');
    expect(r?.verdict).toBe('valid');
    expect(repo.graph.edge('moon', 'insurance')?.origin.kind).toBe('ai');
  });
});
