import assert from 'node:assert/strict';
import {patternRouteForUrl} from '../../../apps/fixture-qwik/src/examples/routing.ts';
for(const id of ['form-errors','search-results','consent-confirmation','service-layout'])assert.deepEqual(patternRouteForUrl(`/examples/${id}?case=real&query=abc`),{patternId:id,caseId:'real',search:'?case=real&query=abc'});
for(const url of ['/examples/form-errors/extra','/examples/form-errors/','/examples/form-errors-other','/fixtures/form-errors','/examples/','/examples/nope'])assert.equal(patternRouteForUrl(url),null,url);
console.log('Exact four native routes accepted; six nested/near-match routes rejected');
