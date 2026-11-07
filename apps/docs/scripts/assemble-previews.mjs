#!/usr/bin/env node
/**
 * First step of docs build:local. Assembles the eight fresh, validated native
 * preview artifacts into public/ or fails; it never builds a native preview.
 */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assemble } from '../../../tools/docs-previews/assemble.mjs';

export function assemblePreviews({ root = resolve(import.meta.dirname, '../../..') } = {}) {
  try {
    return assemble({ root, complete: true });
  } catch (error) {
    throw new Error(`Native preview assembly failed: ${error.message}\nBuild every fixture docs-preview target first (node tools/yarn.mjs nx run krds-docs:docs-previews, or restore the CI docs-preview-<framework> artifacts). build:local does not build native previews or reuse partial output.`, { cause: error });
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const registry = assemblePreviews();
    console.log(`Assembled ${registry.length} native preview registry entries.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
