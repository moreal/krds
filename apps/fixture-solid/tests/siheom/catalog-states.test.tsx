import { expect, test } from 'vitest';
import { assertions, given, query, runSiheom } from '@siheom/solid';
import { fullCatalogStoryCases } from '@unofficial-krds/test-contracts';
import { FixtureApp } from '../../src/fixture-app';
for(const componentId of new Set(fullCatalogStoryCases.map(item=>item.componentId))){
 test(`${componentId} native host initializes the frozen first outcome through supported siheom`,async()=>{
  await runSiheom(given.render(()=><FixtureApp componentId={componentId} caseId="outcome-01"/>),assertions.textContent(query.status('Fixture health'),'ready'));
  expect(window.__KRDS_FIXTURE__?.framework).toBe('solid');
  expect(window.__KRDS_FIXTURE__?.readEvents()).toEqual([]);
 });
}
