import { sha256 } from '../../../tools/docs-previews/contract.mjs';
/**
 * Page-scoped source join. A ranged source inlines only its hash-checked excerpts (the full file
 * stays a download and is fetched on demand); an unranged source inlines its full, hash-checked file.
 * `read(downloadUrl)` returns the published bytes.
 */
export async function demoFiles(record, read) {
 const text = async (url, expected, path) => { const bytes = await read(url); if (!bytes || sha256(bytes)!==expected) throw new Error(`Stale preview source: ${path} (${url})`); return Buffer.from(bytes).toString('utf8'); };
 return Promise.all((record.sources ?? []).map(async source => source.excerpts?.length
  ? { ...source, excerpts: await Promise.all(source.excerpts.map(async excerpt => ({ ...excerpt, value: await text(excerpt.downloadUrl, excerpt.sha256, source.path) }))) }
  : { ...source, value: await text(source.downloadUrl, source.sha256, source.path) }));
}
