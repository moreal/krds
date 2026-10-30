import { expect, test } from 'vitest';
import { assertions, createReactSiheom, given, query } from '@siheom/react';
import { FixtureApp } from '../../src/FixtureApp';
import scenarios from '../../../../catalog/full-catalog-scenarios.json';
const { runSiheom } = createReactSiheom();
const firstCases = scenarios.cases.filter(item => item.caseId === 'outcome-01');
for (const scenario of firstCases) {
  test(`${scenario.componentId}: supported native siheom render and concrete semantic subject`, async () => {
    await runSiheom(given.render(<FixtureApp componentId={scenario.componentId} caseId={scenario.caseId} />), assertions.textContent(query.status('Fixture health'), 'ready'));
    if(scenario.componentId==='favicon')expect(document.head.querySelector('link[rel="icon"]')).not.toBeNull();
    else if(!(scenario.componentId==='coach-mark'&&!('open' in scenario.initialState ? scenario.initialState.open : scenario.initialState.defaultOpen))) expect(document.querySelector(`[data-krds-component="${scenario.componentId}"][data-krds-part="root"]`)).not.toBeNull();
    expect(document.body.textContent).not.toContain('Component not implemented');
  });
}
