import { test } from 'node:test';
import assert from 'node:assert/strict';
test('built public Qwik entry imports without a document and exports six native components', async () => {
    assert.equal(typeof globalThis.document, 'undefined');
    const library = await import('../dist/index.qwik.mjs');
    for (const name of ['Button', 'NativeSelect', 'Modal', 'Tabs', 'Calendar', 'DateInput', 'KrdsProvider'])
        assert.equal(typeof library[name], 'function', name);
    assert.equal(library.WorkspaceProbe, undefined);
});

import {fullCatalogDefinitions} from '@unofficial-krds/contracts';
test('all 48 catalog native components and exact public subpaths import without a document',async()=>{const root=await import('../dist/index.qwik.mjs');for(const [id,definition]of Object.entries(fullCatalogDefinitions)){assert.equal(typeof root[definition.exportName],'function',id);const subpath=await import('@unofficial-krds/qwik/'+id);assert.equal(subpath[definition.exportName],root[definition.exportName],id);}});
