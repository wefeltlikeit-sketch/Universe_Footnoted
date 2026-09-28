import { useSyncExternalStore } from 'react';
import type { Journey, Session, Settings, Via } from '../model/types';
import { DEFAULT_SETTINGS } from '../model/types';
import { Repository } from '../store/repository';
import { Orchestrator } from '../ai/orchestrator';
import { KnowledgeGraph } from '../graph/KnowledgeGraph';
import * as J from '../narrative/journey';
import { checkMarginalia } from '../narrative/marginalia';
import { surprise } from '../graph/serendipity';

/**
 * UI state. Views are exploration modes: registering a new one means adding its id to `View`,
 * a component in ui/views, and an entry in ui/modes.ts.
 */
export type View = 'home' | 'explore' | 'paths' | 'game' | 'atlas' | 'journeys';

export type Overlay =
  | { kind: 'howdid' }
  | { kind: 'edge'; edgeId: string; from?: string }
  | { kind: 'settings' }
  | { kind: 'replay'; journeyId: string }
  | null;

export interface State {
  ready: boolean;
  view: View;
  settings: Settings;
  journey: Journey | null;
  journeys: Journey[];
  overlay: Overlay;
  busy: string | null;
  pending: string | null; // concept id being written
  toast: { text: string; kind: 'margin' | 'error' | 'info' } | null;
  mapOnly: boolean;
  leap: { text: string } | null;
  graphVersion: number;
}

class App {
  state: State = {
    ready: false, view: 'home', settings: DEFAULT_SETTINGS, journey: null, journeys: [], overlay: null,
    busy: null, pending: null, toast: null, mapOnly: false, leap: null, graphVersion: 0,
  };
  repo!: Repository;
  ai!: Orchestrator;
  private listeners = new Set<() => void>();
  private session: Session = { id: `s-${Date.now().toString(36)}`, startedAt: Date.now(), lastActiveAt: Date.now(), journeyIds: [] };
  private toastTimer: number | undefined;

  get graph(): KnowledgeGraph {
    return this.repo.graph;
  }

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };

  set(patch: Partial<State>) {
    this.state = { ...this.state, ...patch };
    for (const fn of this.listeners) fn();
  }

  private initialising: Promise<void> | null = null;

  init(): Promise<void> {
    return (this.initialising ??= this.load());
  }

  private async load() {
    this.repo = await Repository.open();
    this.ai = new Orchestrator(this.repo, () => this.state.settings);
    this.graph.subscribe(() => this.set({ graphVersion: this.graph.version }));
    const [settings, journeys] = await Promise.all([this.repo.settings(), this.repo.journeys()]);
    journeys.sort((a, b) => b.updatedAt - a.updatedAt);
    document.documentElement.dataset.theme = settings.theme;
    const fromHash = this.readHash();
    this.set({ ready: true, settings, journeys, graphVersion: this.graph.version });
    if (fromHash) void this.begin(fromHash);
    window.addEventListener('popstate', () => {
      const id = this.readHash();
      if (id && id !== this.currentId()) this.follow(id, 'map');
    });
  }

  /* ───────── navigation ───────── */

  go(view: View) {
    this.set({ view, overlay: null, mapOnly: false });
  }

  currentId(): string | null {
    return this.state.journey ? J.current(this.state.journey).conceptId : null;
  }

  /** Start a fresh journey from anything: a concept id, a title, or free text. */
  async begin(query: string) {
    const id = await this.ensure(query);
    if (!id) return;
    const j = J.newJourney(id);
    this.session.journeyIds.push(j.id);
    this.set({ journey: j, view: 'explore', overlay: null, mapOnly: false, leap: null });
    await this.persist(j);
  }

  /** Follow a footnote (or any exit) from the current concept. */
  async follow(targetId: string, via: Via = 'footnote') {
    const j = this.state.journey;
    if (!j) return this.begin(targetId);
    const onPath = j.steps.findIndex((s, i) => s.conceptId === targetId && J.lineage(j).includes(i));
    const next = onPath >= 0 && via === 'map' ? J.revisit(j, onPath) : J.travel(j, targetId, via);
    this.set({ journey: next, view: 'explore', overlay: null, mapOnly: false, leap: null });
    this.afterMove(next);
    await this.persist(next);
    const c = this.graph.get(targetId);
    if (c?.stub) await this.write(targetId);
  }

  /** Step back to any step already on the journey (no new step is recorded). */
  revisit(stepIndex: number) {
    const j = this.state.journey;
    if (!j) return;
    const next = J.revisit(j, stepIndex);
    this.set({ journey: next, overlay: null, mapOnly: false, view: 'explore', leap: null });
    this.writeHash(J.current(next).conceptId);
    void this.persist(next);
  }

  /** Walk a multi-step route (from a found path), as a new journey or continuing this one. */
  async walk(route: string[], fresh = true) {
    let j = fresh || !this.state.journey ? J.newJourney(route[0]) : this.state.journey;
    j = J.travelRoute(j, route, 'path');
    if (fresh) this.session.journeyIds.push(j.id);
    this.set({ journey: j, view: 'explore', overlay: null, mapOnly: false });
    this.afterMove(j);
    await this.persist(j);
  }

  surprise() {
    const j = this.state.journey;
    if (!j) return;
    const visited = new Set(this.state.journeys.flatMap((x) => x.steps.map((s) => s.conceptId)));
    for (const s of j.steps) visited.add(s.conceptId);
    const leap = surprise(this.graph, J.current(j).conceptId, { visited, strangeness: this.state.settings.strangeness });
    if (!leap) {
      this.flash('No unexpected destination within reach yet. Explore a little further, or add AI to grow the map.', 'info');
      return;
    }
    const next = J.travelRoute(j, leap.path.nodes, 'surprise');
    this.set({ journey: next, leap: { text: leap.reason }, overlay: null, mapOnly: false });
    this.afterMove(next);
    void this.persist(next);
  }

  openJourney(id: string) {
    const j = this.state.journeys.find((x) => x.id === id);
    if (!j) return;
    this.set({ journey: j, view: 'explore', overlay: null, mapOnly: false, leap: null });
    this.writeHash(J.current(j).conceptId);
  }

  /* ───────── knowledge ───────── */

  /** Resolve a query to a written concept, generating it if needed. */
  async ensure(query: string): Promise<string | null> {
    const known = this.graph.get(query) ?? this.graph.resolve(query);
    if (known && !known.stub) return known.id;
    try {
      this.set({ busy: 'Looking…', pending: known?.id ?? null });
      return await this.ai.explore(query, { progress: (busy) => this.set({ busy }) });
    } catch (e) {
      this.flash(errorText(e), 'error');
      return null;
    } finally {
      this.set({ busy: null, pending: null });
    }
  }

  /** Write the page for a stub the traveller has arrived at. */
  async write(id: string) {
    const from = this.state.journey ? this.parentOfCurrent() : undefined;
    this.set({ pending: id, busy: 'Writing this page…' });
    try {
      await this.ai.explore(this.graph.get(id)?.title ?? id, { fromId: from, progress: (busy) => this.set({ busy }) });
    } catch (e) {
      this.flash(errorText(e), 'error');
    } finally {
      this.set({ pending: null, busy: null });
    }
  }

  private parentOfCurrent(): string | undefined {
    const j = this.state.journey!;
    const p = J.current(j).parent;
    return p === null ? undefined : j.steps[p].conceptId;
  }

  /* ───────── journeys ───────── */

  async persist(j: Journey) {
    const journeys = [j, ...this.state.journeys.filter((x) => x.id !== j.id)];
    this.set({ journeys, journey: this.state.journey?.id === j.id ? j : this.state.journey });
    this.writeHash(J.current(j).conceptId);
    await this.repo.saveJourney(j);
    this.session.lastActiveAt = Date.now();
    await this.repo.saveSession(this.session);
  }

  async rename(id: string, name: string) {
    const j = this.state.journeys.find((x) => x.id === id);
    if (j) await this.persist({ ...j, name });
  }

  async remove(id: string) {
    await this.repo.deleteJourney(id);
    this.set({
      journeys: this.state.journeys.filter((x) => x.id !== id),
      journey: this.state.journey?.id === id ? null : this.state.journey,
    });
  }

  private afterMove(j: Journey) {
    const m = checkMarginalia(j, this.graph);
    if (!m) return;
    const next = { ...j, marginalia: [...(j.marginalia ?? []), m.id] };
    this.set({ journey: next });
    void this.persist(next);
    this.flash(m.note, 'margin', 7000);
  }

  /* ───────── settings & feedback ───────── */

  async saveSettings(patch: Partial<Settings>) {
    const settings = { ...this.state.settings, ...patch };
    document.documentElement.dataset.theme = settings.theme;
    this.set({ settings });
    await this.repo.saveSettings(settings);
  }

  flash(text: string, kind: 'margin' | 'error' | 'info' = 'info', ms = 5000) {
    window.clearTimeout(this.toastTimer);
    this.set({ toast: { text, kind } });
    this.toastTimer = window.setTimeout(() => this.set({ toast: null }), ms);
  }

  private readHash(): string | null {
    const m = location.hash.match(/^#\/c\/(.+)$/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  private writeHash(id: string) {
    const h = `#/c/${encodeURIComponent(id)}`;
    if (location.hash !== h) history.pushState(null, '', h);
  }
}

function errorText(e: unknown): string {
  return e instanceof Error ? e.message : 'Something went wrong.';
}

export const app = new App();

export function useApp<T>(select: (s: State) => T): T {
  return useSyncExternalStore(app.subscribe, () => select(app.state));
}
