import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import { startProductionSsr } from '../server.mjs';

const server = await startProductionSsr(), browser = await chromium.launch(), results = [];
async function run(id, action, setup) {
    const page = await browser.newPage(), errors = [], transferRequests = [];
    page.on('request', request => { if (!['GET', 'HEAD'].includes(request.method())) transferRequests.push({ method: request.method(), url: request.url() }); });
    page.on('pageerror', error => errors.push(String(error)));
    if (setup) await setup(page);
    try {
        const response = await page.goto(server.origin + '/source-file-contracts.html?case=' + (id.startsWith('single') ? 'single' : 'multiple'));
        assert.equal(response.status(), 200);
        await expect(page.locator('#file-ready')).toHaveText('ready');
        await action(page);
        assert.deepEqual(errors, []);
        assert.deepEqual(transferRequests, [], 'Selecting, removing and inspecting committed Files must not transfer them');
        results.push({ id, status: 'passed', ...(id==='cold-first-drop-before-native-owner'?{bootstrap:await page.evaluate(()=>window.__fileContractColdReceipt),qerrors:await page.evaluate(()=>window.__fileContractColdQErrors)}:{}) });
    } catch (error) { results.push({ id, status: 'failed', error: String(error), runtimeErrors: errors, transferRequests }); }
    await page.close();
}
const roots = page => page.locator('[data-krds-component="file-upload"][data-krds-part="root"]');
const primary = page => roots(page).nth(0), other = page => roots(page).nth(1);
const items = page => primary(page).locator('[data-krds-part="item"]');
const removes = page => primary(page).getByRole('button', { name: / 삭제$/ });
async function drop(page, keys, index = 0) {
    await page.evaluate(({ keys, index }) => {
        window.__fileContractHandles ??= new Map();
        const transfer = new DataTransfer();
        for (const key of keys) {
            if (!window.__fileContractHandles.has(key)) window.__fileContractHandles.set(key, new File(['body'], key.startsWith('bad') ? 'bad.png' : key.startsWith('same') ? 'same.txt' : key + '.txt', { type: key.startsWith('bad') ? 'image/png' : 'text/plain', lastModified: 123 }));
            transfer.items.add(window.__fileContractHandles.get(key));
        }
        document.querySelectorAll('[data-krds-component="file-upload"][data-krds-part="dropzone"]')[index].dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: transfer }));
    }, { keys, index });
}
async function calls(page, count) { await expect(page.locator('#file-calls')).toHaveText(String(count)); }
async function submit(page) {
    // Establish an actual successful sibling control value before native FormData collection.
    await page.getByRole('textbox', { name: 'Sibling field', exact: true }).fill('sibling');
    const committed = await page.locator('#file-contract-form').evaluate(form => new FormData(form).getAll('shared').map(value => typeof value === 'string' ? value : { name: value.name, size: value.size, type: value.type }));
    await page.getByRole('button', { name: 'Submit files', exact: true }).click();
    await expect(page.locator('#file-receipt')).toHaveText(JSON.stringify(committed));
    return committed;
}
try {
    await run('cold-first-drop-before-native-owner', async page => {
        assert.equal(await page.evaluate(() => window.__fileContractColdReceipt?.delegated), true, 'Actual framework document-drop delegation is required');
        assert.equal(await page.evaluate(() => window.__fileContractColdNativeOwner), false, 'Probe must dispatch before FileUpload document-ready native ownership');
        assert.equal(await page.evaluate(() => window.__fileContractColdReceipt?.rootConnected), true);
        await calls(page, 1); await expect(items(page)).toHaveCount(1);
        assert.deepEqual(await submit(page), ['sibling', { name: 'cold.txt', size: 4, type: 'text/plain' }]);
        assert.equal(await page.evaluate(()=>window.__fileContractColdRoot?.isConnected&&window.__fileContractColdRoot===document.querySelector('[data-krds-component="file-upload"][data-krds-part="root"]')),true,'Same connected native SSR root after cold delivery');
        assert.deepEqual(await page.evaluate(()=>window.__fileContractColdQErrors),[]);
    }, async page => page.addInitScript(() => {
        let nativeOwner = false, delegated = false, dispatched = false;
        window.__fileContractColdQErrors=[];
        document.addEventListener('qerror', event=>window.__fileContractColdQErrors.push(String(event.detail?.error??event.detail)));
        const add = EventTarget.prototype.addEventListener;
        const dispatch=()=>{
            if(dispatched)return;dispatched=true;
            const root=document.querySelector('[data-krds-component="file-upload"][data-krds-part="root"]');
            window.__fileContractColdRoot=root;
            window.__fileContractColdNativeOwner=nativeOwner;
            window.__fileContractColdReceipt={delegated,nativeOwner,rootConnected:!!root?.isConnected,readyState:document.readyState,at:performance.now()};
            const transfer=new DataTransfer();transfer.items.add(new File(['cold'],'cold.txt',{type:'text/plain'}));
            root?.querySelector('[data-krds-part="dropzone"]').dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:transfer}));
        };
        EventTarget.prototype.addEventListener = function(type, ...args) {
            if (type === 'drop' && this instanceof Element && this.matches('[data-krds-component="file-upload"][data-krds-part="root"]')) nativeOwner = true;
            const result=add.call(this,type,...args);
            if(type==='drop'&&this===document){delegated=true;queueMicrotask(dispatch);}
            return result;
        };
    }));
    await run('same-File-identity-and-single-delivery', async page => {
        await drop(page, ['same-a']); await calls(page, 1); await expect(items(page)).toHaveCount(1);
        await drop(page, ['same-a']); await page.waitForTimeout(250); await calls(page, 1);
        await drop(page, ['same-b']); await calls(page, 2); await expect(items(page)).toHaveCount(2);
        const history = JSON.parse(await page.locator('#file-history').textContent());
        assert.equal(new Set(history.at(-1).ids).size, 2);
        assert.deepEqual(history.map(entry => entry.addedIds.length), [1, 1]);
        const originalId = history[0].ids[0];
        await removes(page).first().click(); await calls(page, 3); await expect(items(page)).toHaveCount(1);
        await drop(page, ['same-a']); await calls(page, 4); await expect(items(page)).toHaveCount(2);
        const reselection = JSON.parse(await page.locator('#file-history').textContent()).at(-1);
        assert.notEqual(reselection.addedIds[0], originalId, 'A removed actual File can be staged again with a fresh stable ID');
    });
    await run('native-FormData-same-name-siblings', async page => {
        await primary(page).locator('input[type="file"]').setInputFiles({ name: 'picker.txt', mimeType: 'text/plain', buffer: Buffer.from('pick') });
        await calls(page, 1); await drop(page, ['drop']); await calls(page, 2);
        await drop(page, ['other'], 1); await expect(other(page).locator('[data-krds-part="item"]')).toHaveCount(1);
        assert.deepEqual(await submit(page), ['sibling', { name: 'picker.txt', size: 4, type: 'text/plain' }, { name: 'drop.txt', size: 4, type: 'text/plain' }, { name: 'other.txt', size: 4, type: 'text/plain' }]);
        await removes(page).first().click(); await calls(page, 3); await expect(items(page)).toHaveCount(1);
        assert.deepEqual(await submit(page), ['sibling', { name: 'drop.txt', size: 4, type: 'text/plain' }, { name: 'other.txt', size: 4, type: 'text/plain' }]);
    });
    await run('accepted-rejected-removal-focus', async page => {
        await drop(page, ['first', 'second']); await calls(page, 1); await expect(items(page)).toHaveCount(2);
        await page.getByRole('button', { name: 'Toggle acceptance', exact: true }).click();
        await removes(page).nth(1).click(); await calls(page, 2); await expect(items(page)).toHaveCount(2); await expect(removes(page).nth(1)).toBeFocused();
        await page.getByRole('button', { name: 'Toggle acceptance', exact: true }).click();
        await removes(page).nth(1).click(); await calls(page, 3); await expect(items(page)).toHaveCount(1); await expect(removes(page).first()).toBeFocused();
        await removes(page).first().click(); await calls(page, 4); await expect(items(page)).toHaveCount(0); await expect(primary(page).getByRole('button', { name: '파일 선택', exact: true })).toBeFocused();
    });
    await run('controlled-transient-reset', async page => {
        await drop(page, ['keep']); await calls(page, 1); await drop(page, ['bad']); await expect(page.locator('#file-rejected')).toHaveText('1');
        await page.getByRole('button', { name: 'Toggle canceled reset', exact: true }).click();
        await page.getByRole('button', { name: 'Reset files', exact: true }).click(); await expect(primary(page).getByRole('alert')).toHaveCount(1);
        await page.getByRole('button', { name: 'Toggle canceled reset', exact: true }).click();
        await page.getByRole('button', { name: 'Reset files', exact: true }).click(); await expect(primary(page).getByRole('alert')).toHaveCount(0);
        await calls(page, 1); await expect(items(page)).toHaveCount(1);
        assert.deepEqual(await submit(page), ['sibling', { name: 'keep.txt', size: 4, type: 'text/plain' }]);
    });
    await run('single-valid-invalid-multi-replacement', async page => {
        await drop(page, ['original']); await calls(page, 1);
        const initial = JSON.parse(await page.locator('#file-history').textContent())[0].ids[0];
        await drop(page, ['bad']); await expect(page.locator('#file-rejected')).toHaveText('1'); await calls(page, 1);
        await drop(page, ['a', 'b']); await expect(page.locator('#file-rejected')).toHaveText('2'); await calls(page, 1); await expect(items(page)).toHaveCount(1);
        await drop(page, ['replacement']); await calls(page, 2); await expect(items(page)).toHaveCount(1);
        const history = JSON.parse(await page.locator('#file-history').textContent());
        assert.deepEqual(history[1].removedIds, [initial]); assert.equal(history[1].addedIds.length, 1);
        assert.notEqual(history[1].ids[0], initial);
        assert.deepEqual(await submit(page), ['sibling', { name: 'replacement.txt', size: 4, type: 'text/plain' }]);
        await page.waitForTimeout(150); await calls(page, 2); await expect(page.locator('#file-rejected')).toHaveText('2');
    });
} finally { await browser.close(); await server.close(); }
console.log(JSON.stringify(results, null, 2));
if (results.some(result => result.status !== 'passed')) process.exitCode = 1;
