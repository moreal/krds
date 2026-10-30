import type { FrameworkId } from './types.js';

export const frameworkIds: readonly FrameworkId[] = ['solid', 'react', 'svelte', 'vue', 'lit', 'qwik', 'angular', 'solid-next'];
export type ComponentKind = 'component' | 'composition' | 'asset' | 'integration' | 'not-applicable';
export interface CatalogSource {
  localPath: string;
  retrievedAt: string;
  sha256: string;
  bytes: number;
  status: string;
}
export interface CatalogTypeHeading { text: string; level: 'h4' | 'h5'; line: number; endLine: number; sourcePath: string; }
export interface CatalogEntry {
  id: string;
  slug: string;
  exportName: string;
  canonicalId: string;
  sourceId: string;
  canonicalUrl: string;
  nameKo: string;
  nameEn: string;
  kind: ComponentKind;
  webApplicable: boolean;
  source: CatalogSource;
  variants: string[];
  variantsStatus: 'specified-pilot' | 'specified-T10' | 'pending-T10';
  sourceKind?: ComponentKind;
  classificationPolicy?: string;
  variantsPolicy?: string;
  contractStatus?: 'scoped-approved';
  coverageAcceptance?: false;
  officialTypeHeadings?: readonly CatalogTypeHeading[];
  officialTypesPolicy?: string;
  presentationAxes?: Readonly<Record<string, readonly string[]>>;
  sourceTensionResolution?: string;
  specPath: string;
  implementationOwner: string;
  implementationOwners: Record<FrameworkId, string>;
  scopeReason: string;
}
export interface ComponentCatalog {
  schemaVersion: 1;
  krdsBaselineId: string;
  sourceManifest: string;
  components: CatalogEntry[];
}

const approvedProjectKinds: Readonly<Record<string, {source: ComponentKind; project: ComponentKind}>> = {
  'text-list': {source: 'composition', project: 'component'},
  'help-panel': {source: 'component', project: 'composition'},
  'coach-mark': {source: 'component', project: 'composition'},
  'file-upload': {source: 'component', project: 'integration'},
  'back-button': {source: 'component', project: 'integration'},
};

type RecordValue = Record<string, unknown>;
const object = (value: unknown): value is RecordValue => typeof value === 'object' && value !== null && !Array.isArray(value);
const text = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const list = (value: unknown): value is unknown[] => Array.isArray(value);
const kebab = (value: string): string => value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const localPath = (value: unknown): value is string => text(value) && !value.startsWith('/') && !value.includes('\\') && !value.split('/').some(p => p === '..' || p === '.' || p === '') && !value.includes(':');
const sameMembers = (actual: unknown, expected: readonly unknown[]): boolean => list(actual) && actual.length === expected.length && new Set(actual).size === expected.length && expected.every(value => actual.includes(value));

/** Validate untrusted catalog data against the separately frozen manifest, without I/O. */
export function validateCatalog(input: unknown, manifest: unknown): string[] {
  const errors: string[] = [];
  if (!object(input) || !object(manifest) || !list(input.components) || !list(manifest.components) || !object(manifest.catalog)) return ['catalog and frozen manifest must contain component arrays and scope metadata'];
  if (input.schemaVersion !== 1) errors.push('catalog schemaVersion must be 1');
  if (input.krdsBaselineId !== manifest.krdsBaselineId) errors.push('catalog baseline differs from frozen manifest');
  if (input.sourceManifest !== 'upstream/krds/manifest.json') errors.push('catalog must link the frozen source manifest');
  if (input.components.length !== manifest.components.length || input.components.length !== manifest.catalog.uniqueCanonicalCount) errors.push('catalog must preserve every frozen record');
  const sources = new Map(manifest.components.filter(object).map(c => [c.id, c]));
  const seen = new Map<string, Set<unknown>>(['id', 'slug', 'canonicalId', 'exportName'].map(field => [field, new Set()]));
  const canonicalIds = new Set<unknown>();
  let webCount = 0;
  for (const [index, item] of input.components.entries()) {
    const at = `component[${index}]`;
    if (!object(item)) { errors.push(`${at} must be an object`); continue; }
    for (const [field, values] of seen) {
      if (!text(item[field]) || values.has(item[field])) errors.push(`${at} requires unique nonempty ${field}`);
      values.add(item[field]);
    }
    canonicalIds.add(item.canonicalId);
    const source = sources.get(item.canonicalId);
    if (!source) { errors.push(`${at} has no frozen canonicalId`); continue; }
    const expectedId = text(source.key) ? kebab(source.key) : '';
    if (item.id !== expectedId || item.slug !== expectedId || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(expectedId)) errors.push(`${at} must use semantic kebab-case identity ${expectedId}`);
    if (item.exportName !== source.key) errors.push(`${at} exportName differs from frozen key`);
    for (const [field, expected] of [['sourceId', source.id], ['canonicalUrl', source.canonicalUrl], ['webApplicable', source.webApplicable], ['nameKo', source.nameKo], ['nameEn', source.nameEn], ['scopeReason', source.scopeReason]] as const) {
      if (item[field] !== expected) errors.push(`${at} ${field} differs from frozen source`);
    }
    const correction = approvedProjectKinds[expectedId];
    if (correction) {
      if (source.kind !== correction.source || item.sourceKind !== correction.source || item.kind !== correction.project) errors.push(`${at} project completion kind must preserve the approved source/project classification`);
    } else if (item.kind !== source.kind || (item.sourceKind !== undefined && item.sourceKind !== source.kind)) errors.push(`${at} kind differs from frozen source`);
    if (item.webApplicable === true) webCount++;
    if (!object(item.source) || !object(source.source)) errors.push(`${at} source metadata missing`);
    else {
      for (const key of ['localPath', 'retrievedAt', 'sha256', 'bytes', 'status']) {
        if (item.source[key] !== source.source[key]) errors.push(`${at} source.${key} differs from frozen source`);
      }
      if (!localPath(item.source.localPath) || !text(item.source.sha256) || !/^[a-f0-9]{64}$/.test(item.source.sha256)) errors.push(`${at} source path/hash invalid`);
    }
    if (!list(item.variants) || !item.variants.every(text) || new Set(item.variants).size !== item.variants.length) errors.push(`${at} variants must be unique nonempty strings`);
    if (!['specified-pilot', 'specified-T10', 'pending-T10'].includes(String(item.variantsStatus))) errors.push(`${at} variantsStatus invalid`);
    if (['specified-pilot', 'specified-T10'].includes(String(item.variantsStatus)) && (!list(item.variants) || !item.variants.length)) errors.push(`${at} specified variants cannot be empty`);
    if (item.variantsStatus === 'specified-T10') {
      if (item.contractStatus !== 'scoped-approved' || item.coverageAcceptance !== false || !text(item.classificationPolicy) || !text(item.variantsPolicy) || !text(item.officialTypesPolicy)) errors.push(`${at} T10 metadata must distinguish specification, independent classification/cases and non-awarded native coverage`);
      if (!list(item.officialTypeHeadings) || item.officialTypeHeadings.some(heading => !object(heading) || !text(heading.text) || !['h4','h5'].includes(String(heading.level)) || !Number.isInteger(heading.line) || Number(heading.line) < 1 || !Number.isInteger(heading.endLine) || Number(heading.endLine) < Number(heading.line) || !object(item.source) || heading.sourcePath !== item.source.localPath)) errors.push(`${at} official type headings must preserve exact frozen source path and positive line ranges`);
      if (!object(item.presentationAxes) || Object.values(item.presentationAxes).some(values => !list(values) || !values.length || !values.every(text) || new Set(values).size !== values.length)) errors.push(`${at} presentation axes must be distinct nonempty value arrays`);
    }
    if (item.specPath !== `specs/components/${expectedId}.md`) errors.push(`${at} specPath must match its semantic ID`);
    if (!text(item.implementationOwner) || !object(item.implementationOwners) || !frameworkIds.every(f => object(item.implementationOwners) && text(item.implementationOwners[f]))) errors.push(`${at} requires an implementation owner for every native framework`);
  }
  if (webCount !== manifest.catalog.webApplicableCount) errors.push('catalog web scope differs from frozen manifest');
  if ([...sources.keys()].some(id => !canonicalIds.has(id))) errors.push('catalog omits frozen canonical IDs');
  return errors;
}

/** Validate per-framework work tracking. File existence and release evidence are later gates. */
export function validateCoverage(input: unknown, catalog: unknown): string[] {
  const errors: string[] = [];
  if (!object(input) || !object(catalog) || !list(input.coverage) || !list(catalog.components)) return ['coverage and catalog must contain arrays'];
  if (input.schemaVersion !== 1) errors.push('coverage schemaVersion must be 1');
  if (input.krdsBaselineId !== catalog.krdsBaselineId) errors.push('coverage baseline differs from catalog');
  if (!sameMembers(input.stableFrameworks, frameworkIds.filter(f => f !== 'solid-next')) || !sameMembers(input.previewFrameworks, ['solid-next'])) errors.push('coverage must separate seven stable frameworks and Solid 2 preview');
  const entries = catalog.components.filter(object);
  if (!sameMembers(input.excludedCanonicalIds, entries.filter(c => c.webApplicable === false).map(c => c.canonicalId))) errors.push('coverage exclusions differ from frozen non-web scope');
  const components = new Map(entries.filter(c => c.webApplicable === true).map(c => [c.id, c]));
  const expected = new Set([...components.keys()].flatMap(id => frameworkIds.map(f => `${id}:${f}`)));
  const seen = new Set<string>();
  for (const [index, item] of input.coverage.entries()) {
    const at = `coverage[${index}]`;
    if (!object(item)) { errors.push(`${at} must be an object`); continue; }
    const pair = `${item.componentId}:${item.framework}`;
    if (!expected.has(pair) || seen.has(pair)) errors.push(`${at} unknown, non-web, or duplicate component/framework`);
    seen.add(pair);
    if (!['planned', 'in-progress', 'implemented', 'verified', 'blocked'].includes(String(item.status))) errors.push(`${at} invalid status`);
    if (item.specPath !== components.get(item.componentId)?.specPath) errors.push(`${at} specPath differs from catalog`);
    if (!list(item.evidencePaths) || !item.evidencePaths.every(localPath) || new Set(item.evidencePaths).size !== item.evidencePaths.length) errors.push(`${at} evidence must be unique repository-relative paths`);
    else {
      if (item.evidencePaths.some(path => /(?:probe|bootstrap)/i.test(String(path)))) errors.push(`${at} bootstrap probes cannot count as evidence`);
      if (['implemented', 'verified'].includes(String(item.status)) && item.evidencePaths.length === 0) errors.push(`${at} implementation claims require evidence`);
    }
  }
  if (expected.size !== input.coverage.length || [...expected].some(pair => !seen.has(pair))) errors.push('coverage must track every web component in every native framework');
  return errors;
}
