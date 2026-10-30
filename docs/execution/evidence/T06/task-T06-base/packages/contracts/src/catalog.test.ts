import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { validateCatalog, validateCoverage } from './catalog.js';
const load = (path: string) => JSON.parse(readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8'));
const manifest = load('upstream/krds/manifest.json');
const catalog = load('catalog/components.json');
const coverage = load('catalog/coverage.json');
const copy = <T>(value: T): T => structuredClone(value);

describe('frozen catalog integrity', () => {
  it('accepts all frozen identities, including the non-web guidance', () => {
    expect(validateCatalog(catalog, manifest)).toEqual([]);
    expect(catalog.components).toHaveLength(55);
    expect(catalog.components.filter((c: { webApplicable: boolean }) => c.webApplicable)).toHaveLength(54);
    expect(catalog.components.find((c: { id: string }) => c.id === 'native-select').canonicalId).toBe('component_06_03');
  });
  it.each(['id', 'slug', 'canonicalId', 'exportName'])('rejects duplicate %s', (field) => {
    const value = copy(catalog); value.components[1][field] = value.components[0][field];
    expect(validateCatalog(value, manifest).length).toBeGreaterThan(0);
  });
  it.each(['canonicalUrl', 'kind', 'sourceId', 'webApplicable'])('rejects drift in %s', (field) => {
    const value = copy(catalog); value.components[0][field] = field === 'webApplicable' ? false : 'incorrect';
    expect(validateCatalog(value, manifest).length).toBeGreaterThan(0);
  });
  it('rejects source hash drift', () => {
    const value = copy(catalog); value.components[0].source.sha256 = '0'.repeat(64);
    expect(validateCatalog(value, manifest).length).toBeGreaterThan(0);
  });
  it('rejects narrowing the catalog to the pilot', () => {
    const value = copy(catalog); value.components.splice(6);
    expect(validateCatalog(value, manifest).length).toBeGreaterThan(0);
  });
  it('rejects changing the frozen baseline', () => {
    const value = copy(catalog); value.krdsBaselineId = 'new-baseline';
    expect(validateCatalog(value, manifest).length).toBeGreaterThan(0);
  });
  it.each([null, [], {}, { components: [null] }])('reports malformed input %j without crashing', (value) => {
    expect(validateCatalog(value, manifest).length).toBeGreaterThan(0);
  });
  it('rejects empty implementation ownership', () => {
    const value = copy(catalog); value.components[0].implementationOwners = {};
    expect(validateCatalog(value, manifest).length).toBeGreaterThan(0);
  });
});

describe('honest native coverage', () => {
  it('accepts all planned stable and preview entries without implementation claims', () => {
    expect(validateCoverage(coverage, catalog)).toEqual([]);
    expect(coverage.coverage).toHaveLength(432);
    expect(coverage.coverage.every((c: { status: string }) => c.status === 'planned')).toBe(true);
  });
  it('rejects missing native framework work', () => {
    const value = copy(coverage); value.coverage.pop();
    expect(validateCoverage(value, catalog).length).toBeGreaterThan(0);
  });
  it('rejects duplicate component/framework entries', () => {
    const value = copy(coverage); value.coverage[1] = value.coverage[0];
    expect(validateCoverage(value, catalog).length).toBeGreaterThan(0);
  });
  it.each(['implemented', 'verified'])('rejects %s claims without evidence', (status) => {
    const value = copy(coverage); value.coverage[0].status = status;
    expect(validateCoverage(value, catalog).length).toBeGreaterThan(0);
  });
  it('rejects a probe masquerading as verification', () => {
    const value = copy(coverage); value.coverage[0].status = 'verified'; value.coverage[0].evidencePaths = ['packages/solid/tests/workspace-probe.test.ts'];
    expect(validateCoverage(value, catalog).length).toBeGreaterThan(0);
  });
  it('rejects non-web guidance counted as native implementation', () => {
    const value = copy(coverage); value.coverage[0].componentId = 'splash-screen';
    expect(validateCoverage(value, catalog).length).toBeGreaterThan(0);
  });
  it('rejects an unsupported renderer name', () => {
    const value = copy(coverage); value.coverage[0].framework = 'react-wrapper';
    expect(validateCoverage(value, catalog).length).toBeGreaterThan(0);
  });
  it.each([null, [], {}, { coverage: [null] }])('reports malformed coverage %j', (value) => {
    expect(validateCoverage(value, catalog).length).toBeGreaterThan(0);
  });
});
