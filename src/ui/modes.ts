import type { View } from './state';

/**
 * Exploration modes shown in the navigation. To add a mode:
 *   1. add its id to `View` in ui/state.ts
 *   2. write a component in ui/views/
 *   3. register it here and in the switch in ui/App.tsx
 * Graph logic belongs in src/graph (pure, testable); AI calls go through src/ai/orchestrator.
 */
export const MODES: { id: View; label: string; needsJourney?: boolean }[] = [
  { id: 'explore', label: 'Wander', needsJourney: true },
  { id: 'paths', label: 'Find a path' },
  { id: 'game', label: 'Six degrees' },
  { id: 'atlas', label: 'Atlas' },
  { id: 'journeys', label: 'Journeys' },
];
