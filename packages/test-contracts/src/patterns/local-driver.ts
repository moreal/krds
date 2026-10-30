import { createPatternState, searchResources, transition } from './flows.js';
import type { PatternId, PatternState, PatternStateMap, PatternAction, PatternEffect, TransitionResult } from './types.js';

export type LocalSeed = 'success' | 'error-once' | 'error' | 'loading';
export interface LocalDriver<P extends PatternId> {
  getState(): PatternStateMap[P];
  dispatch(action: PatternAction): TransitionResult<PatternStateMap[P]>;
  settle(options?: { ok?: boolean }): TransitionResult<PatternStateMap[P]>;
  subscribe(listener: (state: PatternStateMap[P]) => void): () => void;
  dispose(): void;
}

function validateInitialState(patternId: PatternId, state: PatternState): void {
  if (state.patternId !== patternId) throw new RangeError('Initial state must match the requested pattern.');
  const readyPhases: Record<PatternId, readonly string[]> = {
    'form-errors': ['editing', 'invalid', 'success'],
    'search-results': ['success'],
    'consent-confirmation': ['editing', 'invalid', 'confirming', 'success'],
    'service-layout': ['success'],
  };
  if (!readyPhases[patternId].includes(state.phase) || !Number.isSafeInteger(state.requestId) || state.requestId < 0
    || state.pendingRequestId !== null || state.pendingPayload !== null || state.failedPayload !== null
    || (state.phase !== 'invalid' && state.error !== null)) {
    throw new RangeError('Initial state must be ready with a valid request counter and no pending or failed request.');
  }
  if (state.patternId === 'search-results') {
    const expected = searchResources({ query: state.appliedQuery, category: state.category, page: state.page });
    if (state.page !== expected.page || state.pageSize !== expected.pageSize || state.total !== expected.total || state.pageCount !== expected.pageCount
      || state.items.length !== expected.items.length || expected.items.some((item, index) => {
        const actual = state.items[index];
        return actual.id !== item.id || actual.title !== item.title || actual.category !== item.category || actual.summary !== item.summary || actual.date !== item.date;
      })) throw new RangeError('Initial search results must match the normalized applied criteria and page.');
  }
}

/** Fixture-only local completion driver. No timers, fetch, storage or DOM. */
export function createLocalDriver<P extends PatternId>(patternId: P, { caseId = '', seed = 'success', initialState }: { caseId?: string; seed?: LocalSeed; initialState?: PatternStateMap[NoInfer<P>] } = {}): LocalDriver<P> {
  if (!['success', 'error-once', 'error', 'loading'].includes(seed)) throw new RangeError('Unknown local seed.');
  let state = initialState === undefined ? createPatternState(patternId, caseId) : structuredClone(initialState);
  validateInitialState(patternId, state);
  let queued: Extract<PatternEffect, { type: 'request' }> | null = null;
  let disposed = false;
  let completions = 0;
  const subscribers = new Set<(state: PatternStateMap[P]) => void>();
  const active = () => { if (disposed) throw new Error('Local driver is disposed.'); };
  const getState = () => structuredClone(state);
  function dispatch(action: PatternAction): TransitionResult<PatternStateMap[P]> {
    active();
    const output = transition(state, action);
    state = output.state;
    const pending = output.effects.find(effect => effect.type === 'request');
    if (pending) queued = pending;
    if (state.pendingRequestId === null) queued = null;
    for (const subscriber of subscribers) subscriber(getState());
    return structuredClone(output);
  }
  function settle({ ok }: { ok?: boolean } = {}): TransitionResult<PatternStateMap[P]> {
    active();
    if (!queued || (seed === 'loading' && ok === undefined)) return { state: getState(), effects: [] };
    const requestId = queued.requestId;
    queued = null;
    completions++;
    return dispatch({ type: 'resolve', requestId, ok: ok ?? (seed !== 'error' && !(seed === 'error-once' && completions === 1)) });
  }
  return {
    getState, dispatch, settle,
    subscribe(listener) { active(); subscribers.add(listener); return () => subscribers.delete(listener); },
    dispose() { disposed = true; queued = null; subscribers.clear(); },
  };
}
