import { expect, test } from 'vitest';
import { assertions, given, query, runSiheom } from '@siheom/svelte';
import App from '../../src/App.svelte';
test('disabled KRDS button renders after native fixture health', async () => {
    window.history.replaceState({}, '', '/fixtures/button?case=disabled');
    await runSiheom(given.render(App), assertions.textContent(query.status('Fixture health'), 'ready'));
    expect(window.__KRDS_FIXTURE__?.framework).toBe('svelte');
    await runSiheom(assertions.disabled(query.button('저장')));
});
