import test from 'node:test';
import assert from 'node:assert/strict';
import { createPatternState, transition, searchResources } from '../../dist/patterns/flows.js';
import { createLocalDriver } from '../../dist/patterns/local-driver.js';

// These tests catch erased invalid drafts, wrong focus destinations, a page that
// survives a narrowing filter, premature modal closure and stale local replies.
test('invalid submission preserves drafts and routes summary links to the real field', () => {
  let state = createPatternState('form-errors');
  state = transition(state, { type: 'field', field: 'title', value: '  ' }).state;
  const invalid = transition(state, { type: 'submit' });
  assert.equal(invalid.state.phase, 'invalid');
  assert.equal(invalid.state.values.title, '  ');
  assert.deepEqual(invalid.state.errors.map(error => error.field), ['title', 'category']);
  assert.deepEqual(invalid.effects, [{ type: 'focus', targetId: 'example-form-title' }]);
  assert.deepEqual(transition(invalid.state, { type: 'error-link', field: 'category' }).effects,
    [{ type: 'focus', targetId: 'example-form-category' }]);
  assert.deepEqual(transition(invalid.state, { type: 'error-link', field: 'detail' }).effects, []);
});

test('submission waits for local completion, ignores duplicates and preserves content on retry', () => {
  const driver = createLocalDriver('form-errors', { seed: 'error-once' });
  driver.dispatch({ type: 'field', field: 'title', value: '  예제 입력폼 연습  ' });
  driver.dispatch({ type: 'field', field: 'category', value: 'practice' });
  driver.dispatch({ type: 'submit' });
  assert.equal(driver.getState().phase, 'loading');
  driver.dispatch({ type: 'submit' });
  assert.equal(driver.getState().requestId, 1);
  driver.settle();
  assert.equal(driver.getState().phase, 'error');
  assert.equal(driver.getState().values.title, '  예제 입력폼 연습  ');
  driver.dispatch({ type: 'retry' });
  assert.equal(driver.getState().phase, 'loading');
  driver.settle();
  assert.equal(driver.getState().phase, 'success');
  assert.equal(driver.getState().receipt.title, '예제 입력폼 연습');
  assert.equal(driver.getState().requestId, 2);
  driver.dispose();
});

test('the local submission payload normalizes its title without rewriting the raw draft', () => {
  let state = createPatternState('form-errors');
  state = transition(state, { type: 'field', field: 'title', value: '  예제 제목  ' }).state;
  state = transition(state, { type: 'field', field: 'category', value: 'feedback' }).state;
  const pending = transition(state, { type: 'submit' });
  assert.equal(pending.effects[0].payload.title, '예제 제목');
  assert.equal(pending.state.values.title, '  예제 제목  ');
});

test('reset invalidates pending work so a late completion cannot replace reset values', () => {
  let state = createPatternState('form-errors');
  state = transition(state, { type: 'field', field: 'title', value: '예제 작성 연습' }).state;
  state = transition(state, { type: 'field', field: 'category', value: 'practice' }).state;
  state = transition(state, { type: 'submit' }).state;
  state = transition(state, { type: 'reset' }).state;
  const late = transition(state, { type: 'resolve', requestId: 1, ok: true });
  assert.equal(late.state.phase, 'editing');
  assert.equal(late.state.values.title, '');
});

test('a category filter resets page three and returns the first three matching records', () => {
  const driver = createLocalDriver('search-results', { caseId: 'filter-resets-page' });
  assert.equal(driver.getState().page, 3);
  driver.dispatch({ type: 'filter', category: 'example' });
  assert.equal(driver.getState().page, 1);
  assert.equal(driver.getState().phase, 'loading');
  driver.settle();
  const state = driver.getState();
  assert.equal(state.total, 4);
  assert.equal(state.pageCount, 2);
  assert.deepEqual(state.items.map(item => item.id), ['resource-02', 'resource-05', 'resource-08']);
  driver.dispatch({ type: 'page', page: 2 });
  driver.settle();
  assert.deepEqual(driver.getState().items.map(item => item.id), ['resource-11']);
  driver.dispatch({ type: 'page', page: 3 });
  assert.equal(driver.getState().phase, 'success');
  assert.equal(driver.getState().page, 2);
  driver.dispose();
});

test('search uses all query tokens, stable ordering and a truthful empty state', () => {
  assert.deepEqual(searchResources({ query: '접근성 예제', category: 'all', page: 1 }).items.map(x => x.id), ['resource-02']);
  const result = searchResources({ query: '존재하지않는예제', category: 'all', page: 8 });
  assert.equal(result.total, 0);
  assert.equal(result.pageCount, 0);
  assert.equal(result.page, 1);
  assert.deepEqual(result.items, []);
});

test('out-of-order search replies cannot show results for the previous filter', () => {
  let state = createPatternState('search-results');
  state = transition(state, { type: 'filter', category: 'guide' }).state;
  state = transition(state, { type: 'filter', category: 'example' }).state;
  const ignored = transition(state, { type: 'resolve', requestId: 1, ok: true });
  assert.equal(ignored.state.category, 'example');
  assert.equal(ignored.state.phase, 'loading');
  const current = transition(state, { type: 'resolve', requestId: 2, ok: true });
  assert.equal(current.state.phase, 'success');
  assert.deepEqual(current.state.items.map(x => x.id), ['resource-02', 'resource-05', 'resource-08']);
});

test('typing during a search does not relabel the results of an already submitted query', () => {
  const driver = createLocalDriver('search-results');
  driver.dispatch({ type: 'query', value: '접근성' });
  driver.dispatch({ type: 'search' });
  driver.dispatch({ type: 'query', value: '대화상자' });
  driver.settle();
  assert.equal(driver.getState().query, '대화상자');
  assert.equal(driver.getState().appliedQuery, '접근성');
  assert.equal(driver.getState().total, 4);
  driver.dispatch({ type: 'filter', category: 'reference' });
  driver.settle();
  assert.equal(driver.getState().appliedQuery, '접근성');
  assert.deepEqual(driver.getState().items.map(x => x.id), ['resource-03', 'resource-12']);
  driver.dispose();
});

test('search retry repeats the failed submitted query after its draft changes', () => {
  const driver = createLocalDriver('search-results', { seed: 'error-once' });
  driver.dispatch({ type: 'query', value: '접근성' });
  driver.dispatch({ type: 'search' });
  driver.settle();
  assert.equal(driver.getState().phase, 'error');
  driver.dispatch({ type: 'query', value: '대화상자' });
  driver.dispatch({ type: 'retry' });
  driver.settle();
  assert.equal(driver.getState().phase, 'success');
  assert.equal(driver.getState().appliedQuery, '접근성');
  assert.equal(driver.getState().total, 4);
  driver.dispose();
});

test('required refusal blocks confirmation; optional refusal still permits completion', () => {
  const driver = createLocalDriver('consent-confirmation', { seed: 'error-once' });
  driver.dispatch({ type: 'consent', field: 'requiredChoice', value: false });
  const invalid = driver.dispatch({ type: 'review' });
  assert.equal(invalid.state.modalOpen, false);
  assert.deepEqual(invalid.effects, [{ type: 'focus', targetId: 'example-consent-required-agree' }]);
  driver.dispatch({ type: 'consent', field: 'requiredChoice', value: true });
  driver.dispatch({ type: 'review' });
  assert.equal(driver.getState().modalOpen, true);
  driver.dispatch({ type: 'confirm' });
  driver.settle();
  assert.equal(driver.getState().phase, 'error');
  assert.equal(driver.getState().modalOpen, true);
  driver.dispatch({ type: 'retry' });
  driver.settle();
  assert.equal(driver.getState().phase, 'success');
  assert.equal(driver.getState().modalOpen, false);
  assert.equal(driver.getState().receipt.optionalChoice, false);
  driver.dispose();
});

test('closing a pending modal invalidates its reply and retains the users choices', () => {
  let state = createPatternState('consent-confirmation');
  state = transition(state, { type: 'consent', field: 'requiredChoice', value: true }).state;
  state = transition(state, { type: 'review' }).state;
  state = transition(state, { type: 'confirm' }).state;
  state = transition(state, { type: 'close' }).state;
  state = transition(state, { type: 'resolve', requestId: 1, ok: true }).state;
  assert.equal(state.phase, 'editing');
  assert.equal(state.modalOpen, false);
  assert.equal(state.requiredChoice, true);
  assert.equal(state.receipt, null);
});

test('layout route selection is independent from disclosure and closes the mobile menu', () => {
  let state = createPatternState('service-layout');
  state = transition(state, { type: 'expand', id: 'help', expanded: true }).state;
  assert.deepEqual(state.expandedIds, ['examples', 'help']);
  assert.equal(state.currentId, 'overview');
  state = transition(state, { type: 'mobile', open: true }).state;
  const navigation = transition(state, { type: 'navigate', id: 'search' });
  assert.equal(navigation.state.currentId, 'search');
  assert.equal(navigation.state.mobileOpen, false);
  assert.deepEqual(navigation.effects, [{ type: 'focus', targetId: 'example-main-heading' }]);
  assert.equal(transition(state, { type: 'navigate', id: 'unknown' }).state.currentId, 'overview');
});

test('navigating from a footer to a hidden branch exposes the newly current destination', () => {
  const state = transition(createPatternState('service-layout'), { type: 'navigate', id: 'privacy' }).state;
  assert.equal(state.currentId, 'privacy');
  assert.deepEqual(state.expandedIds, ['examples', 'help']);
});

for (const { mobileOpen, collapseCurrentBranch, expectedBranches } of [
  { mobileOpen: true, collapseCurrentBranch: false, expectedBranches: ['examples', 'help'] },
  { mobileOpen: false, collapseCurrentBranch: true, expectedBranches: ['help', 'examples'] },
  { mobileOpen: true, collapseCurrentBranch: true, expectedBranches: ['help', 'examples'] },
]) {
  test(`activating the current destination resolves mobile=${mobileOpen} and collapsed=${collapseCurrentBranch}`, () => {
    let state = createPatternState('service-layout');
    state = transition(state, { type: 'expand', id: 'help', expanded: true }).state;
    if (collapseCurrentBranch) state = transition(state, { type: 'expand', id: 'examples', expanded: false }).state;
    state = transition(state, { type: 'mobile', open: mobileOpen }).state;
    const activation = transition(state, { type: 'navigate', id: 'overview' });
    assert.equal(activation.state.currentId, 'overview');
    assert.equal(activation.state.mobileOpen, false);
    assert.deepEqual(activation.state.expandedIds, expectedBranches);
    assert.deepEqual(activation.effects, [{ type: 'focus', targetId: 'example-main-heading' }]);
    assert.equal(activation.state.requestId, 0);
  });
}

test('activating the current visible destination without a mobile layer is a genuine no-op', () => {
  const state = createPatternState('service-layout');
  const activation = transition(state, { type: 'navigate', id: 'overview' });
  assert.deepEqual(activation.state, state);
  assert.deepEqual(activation.effects, []);
});

test('driver subscribers receive independent snapshots and disposal cancels pending work', () => {
  const driver = createLocalDriver('search-results', { seed: 'loading' });
  let calls = 0;
  const unsubscribe = driver.subscribe(state => { calls++; state.query = 'tampered'; });
  driver.dispatch({ type: 'query', value: '접근성' });
  assert.equal(driver.getState().query, '접근성');
  assert.equal(calls, 1);
  unsubscribe();
  const copy = driver.getState(); copy.query = 'tampered';
  assert.equal(driver.getState().query, '접근성');
  driver.dispose();
  assert.throws(() => driver.settle(), /disposed/);
});

test('URL-ready search initialization exposes the correct page without a synthetic request or completion', () => {
  const initialState = {
    ...createPatternState('search-results', 'filter-resets-page'),
    query: '예제', appliedQuery: '예제', category: 'example',
    ...searchResources({ query: '예제', category: 'example', page: 2 }),
  };
  const driver = createLocalDriver('search-results', { caseId: 'filter-resets-page', seed: 'error-once', initialState });
  let notifications = 0;
  driver.subscribe(() => notifications++);
  const ready = driver.getState();
  assert.equal(ready.phase, 'success');
  assert.equal(ready.query, '예제');
  assert.equal(ready.page, 2);
  assert.equal(ready.total, 4);
  assert.deepEqual(ready.items.map(item => item.id), ['resource-11']);
  assert.equal(ready.requestId, 0);
  assert.equal(ready.pendingRequestId, null);
  assert.deepEqual(driver.settle(), { state: ready, effects: [] });
  assert.equal(notifications, 0);
  assert.deepEqual(driver.dispatch({ type: 'filter', category: 'example' }).effects, []);
  assert.equal(driver.getState().requestId, 0);
  driver.dispatch({ type: 'search' });
  driver.settle();
  assert.equal(driver.getState().phase, 'error');
  assert.equal(driver.getState().requestId, 1);
  driver.dispatch({ type: 'retry' });
  driver.settle();
  assert.equal(driver.getState().phase, 'success');
  assert.equal(driver.getState().requestId, 2);
  driver.dispose();
});

test('adopted initialization clones nested data instead of sharing the URL owner snapshot', () => {
  const initialState = { ...createPatternState('search-results'), query: '접근성', appliedQuery: '접근성', ...searchResources({ query: '접근성' }) };
  const driver = createLocalDriver('search-results', { initialState });
  initialState.query = 'caller mutation';
  initialState.items[0].title = 'caller mutation';
  assert.equal(driver.getState().query, '접근성');
  assert.equal(driver.getState().items[0].title, '접근성 점검 가이드');
  const copy = driver.getState(); copy.items[0].title = 'view mutation';
  assert.equal(driver.getState().items[0].title, '접근성 점검 가이드');
  driver.dispatch({ type: 'reset' });
  assert.equal(driver.getState().query, '');
  assert.equal(driver.getState().category, 'all');
  assert.equal(driver.getState().page, 1);
  driver.dispose();
});

test('driver initialization refuses a different pattern and any in-flight or failed request state', () => {
  assert.throws(() => createLocalDriver('search-results', { initialState: createPatternState('form-errors') }), /pattern/i);
  const ready = createPatternState('search-results');
  for (const patch of [
    { phase: 'loading' }, { phase: 'error' }, { phase: 'editing' }, { error: 'Failed request' },
    { pendingRequestId: 1 }, { pendingPayload: { query: '', category: 'all', page: 1 } },
    { failedPayload: { query: '', category: 'all', page: 1 } }, { requestId: -1 }, { requestId: 1.5 },
  ]) assert.throws(() => createLocalDriver('search-results', { initialState: { ...ready, ...patch } }), /initial|ready|pending/i);
});

test('driver initialization rejects URL criteria that disagree with their visible result slice', () => {
  const ready = createPatternState('search-results');
  for (const patch of [
    { appliedQuery: '접근성' }, { category: 'example' }, { total: 99 }, { pageCount: 9 },
    { page: 99 }, { pageSize: 6 }, { items: [] },
  ]) assert.throws(() => createLocalDriver('search-results', { initialState: { ...ready, ...patch } }), /search|result|initial/i);
});

test('adoption preserves caller-applied case actions once and leaves loading seed completion-only', () => {
  let initialState = createPatternState('form-errors');
  initialState = transition(initialState, { type: 'field', field: 'title', value: '예제 입력폼 연습' }).state;
  initialState = transition(initialState, { type: 'field', field: 'category', value: 'practice' }).state;
  const driver = createLocalDriver('form-errors', { caseId: 'retry-success', seed: 'loading', initialState });
  assert.equal(driver.getState().values.title, '예제 입력폼 연습');
  assert.equal(driver.getState().phase, 'editing');
  assert.equal(driver.getState().requestId, 0);
  const submit = driver.dispatch({ type: 'submit' });
  assert.equal(submit.effects.filter(effect => effect.type === 'request').length, 1);
  assert.equal(driver.getState().requestId, 1);
  driver.settle();
  assert.equal(driver.getState().phase, 'loading');
  driver.settle({ ok: true });
  assert.equal(driver.getState().phase, 'success');
  driver.dispose();
});
