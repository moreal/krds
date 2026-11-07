import { readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { sha256, readContained, validateArtifact } from './contract.mjs';
/** modules is {identity, inputs:[{id,package,version,sha256,originals:[{path,sha256}]}]}; inputs MUST come from the native bundler's module graph, never a source glob. */
export function writeArtifactManifest({ framework, outputDir, bindings, modules, definitions, root = process.cwd() }) {
    const files = [];
    function walk(dir = '') {
        for (const entry of readdirSync(resolve(outputDir, dir), { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
            const path = dir ? `${dir}/${entry.name}` : entry.name;
            if (path === 'artifact-manifest.json')
                continue;
            if (entry.isSymbolicLink())
                throw new Error(`${path}: symlink rejected`);
            if (entry.isDirectory())
                walk(path);
            else {
                const bytes = readContained(outputDir, path);
                files.push({ path, sha256: sha256(bytes), size: bytes.length });
            }
        }
    }
    walk();
    const manifest = { schemaVersion: 1, framework, identity: modules.identity, files: files.sort((a, b) => a.path.localeCompare(b.path)), modules: [...modules.inputs].sort((a, b) => a.id.localeCompare(b.id)), bindings: bindings.map(b => ({ ...b })).sort((a, b) => `${a.componentId}/${a.exampleId}/${a.sourcePath}`.localeCompare(`${b.componentId}/${b.exampleId}/${b.sourcePath}`)) };
    validateArtifact(manifest, definitions, { root, outputDir });
    writeFileSync(resolve(outputDir, 'artifact-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
    return manifest;
}
