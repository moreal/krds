import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { startProductionSsr } from '../../../apps/fixture-qwik/server.mjs';
const server = await startProductionSsr(), results = [];
try {
    for (const [name, expected] of [['date-range-null', 'TypeError'], ['calendar-range-null', 'TypeError'], ['date-partial-range', 'RangeError'], ['calendar-reference', 'RangeError'], ['select-duplicate', 'TypeError'], ['tabs-value', 'TypeError'], ['button-variant', 'TypeError']]) {
        const response = await fetch(`${server.origin}/configuration.html?case=${name}`), body = await response.text();
        results.push({ name, status: response.status, expected, body: response.status === 500 ? body : undefined });
    }
    await writeFile('.superpowers/sdd/PLAN/t07q-qwik-logs/configuration.json', JSON.stringify(results, null, 2));
    for (const result of results) {
        assert.equal(result.status, 500, result.name);
        assert.match(result.body, new RegExp(result.expected), result.name);
    }
    console.log(`Production configuration failures surfaced correctly: ${results.length}`);
}
finally {
    await server.close();
}
