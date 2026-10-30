import { test, expect } from 'vitest';
import { given, assertions, query, runSiheom } from '@siheom/vue';
import { FixtureApp } from '../../src/FixtureApp';

test('native six pilots expose semantic controls rather than probe placeholders', async () => {
  history.replaceState(null, '', '/fixtures/calendar?case=selection-confirm');
  await runSiheom(given.render(FixtureApp), assertions.textContent(query.status('Fixture health'), 'ready'));
  expect(document.querySelector('table[data-krds-part="table"]')).not.toBeNull();
  expect(document.querySelectorAll('tbody tr')).toHaveLength(6);
  expect(document.querySelectorAll('tbody td')).toHaveLength(42);
});
