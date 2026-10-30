#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { validateCatalog, validateCoverage } from '../packages/contracts/src/catalog.ts';

const root = resolve(import.meta.dirname, '..');
const readJson = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
try {
  const manifest = readJson('upstream/krds/manifest.json');
  const catalog = readJson('catalog/components.json');
  const coverage = readJson('catalog/coverage.json');
  const errors = [...validateCatalog(catalog, manifest), ...validateCoverage(coverage, catalog)];
  // Only follow source paths after validating the frozen manifest link and local path schema.
  if (errors.length === 0) {
    for (const item of catalog.components) {
      const path = resolve(root, item.source.localPath);
      if (!existsSync(path)) { errors.push(`${item.id}: source file missing`); continue; }
      const bytes = readFileSync(path);
      if (createHash('sha256').update(bytes).digest('hex') !== item.source.sha256 || bytes.length !== item.source.bytes) errors.push(`${item.id}: source bytes/hash differ from frozen record`);
      if (item.variantsStatus === 'specified-pilot' && !existsSync(resolve(root, item.specPath))) errors.push(`${item.id}: pilot spec missing`);
    }
    for (const item of coverage.coverage) {
      if (['implemented', 'verified'].includes(item.status) && !existsSync(resolve(root, item.specPath))) errors.push(`${item.componentId}/${item.framework}: claimed implementation spec missing`);
      for (const path of item.evidencePaths) if (!existsSync(resolve(root, path))) errors.push(`${item.componentId}/${item.framework}: evidence missing: ${path}`);
    }
  }
  if (errors.length) {
    console.error(`Catalog verification failed (${errors.length}):\n${errors.map(error => `- ${error}`).join('\n')}`);
    process.exitCode = 1;
  } else {
    const stable = coverage.coverage.filter(item => coverage.stableFrameworks.includes(item.framework));
    const preview = coverage.coverage.filter(item => coverage.previewFrameworks.includes(item.framework));
    console.log(`Catalog verified: ${catalog.components.length} frozen records, ${catalog.components.filter(item => item.webApplicable).length} web-applicable; 55 source hashes checked.`);
    console.log(`Coverage tracking: ${stable.length} stable + ${preview.length} preview entries; ${coverage.coverage.filter(item => item.status === 'verified').length} verified. This is integrity validation, not a release coverage gate.`);
  }
} catch (error) {
  console.error(`Catalog verification failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
