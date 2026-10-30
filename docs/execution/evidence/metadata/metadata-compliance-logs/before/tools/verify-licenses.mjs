#!/usr/bin/env node
import { readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { loadCompliance, expectedArtifacts, noticeFiles, commandRoot, safePath } from './generate-notices.mjs';
// Readiness requires a completed independent-code grant, not just confirmed identity.
// Normalize line wrapping only; permission, condition and disclaimer wording stays exact.
const mitTerms = `Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;
const normalized = (text) => text.replace(/\s+/gu, ' ').trim();
const incompleteNotice = /unconfirmed|not a completed|incomplete.{0,40}grant|intended.{0,40}(?:permission|terms)|미확정|확정되지|적용할 계획|적용 계획|릴리스 차단/iu;
async function independentCodeReleaseGates(state, identity) {
  const gates = [];
  const policy = state.policy.independentCode;
  if (policy?.intent !== 'MIT' || policy.holderStatus !== 'confirmed' || policy.releaseAllowed !== true) gates.push('independent-code license policy is incomplete');
  const holder = identity?.copyright?.independentCodeHolder;
  const year = identity?.copyright?.independentCodeYear;
  const copyright = typeof holder === 'string' && holder.trim() && /^\d{4}$/u.test(String(year)) ? `Copyright (c) ${year} ${holder}` : null;
  const termsPath = policy?.termsPath;
  let completeGrant = false;
  if (copyright && typeof termsPath === 'string' && termsPath.startsWith('LICENSES/') && state.policy.sourceDocuments?.[termsPath]) {
    const grant = await readFile(safePath(state.root, termsPath), 'utf8');
    completeGrant = normalized(grant) === normalized(`MIT License\n\n${copyright}\n\n${mitTerms}`);
  }
  if (!completeGrant) gates.push('independent-code grant must contain the complete MIT terms and confirmed copyright holder/year, with its preserved source hash');
  const licenses = [join(state.root, 'LICENSE.md'), ...state.packages.map(({ folder }) => join(folder, 'LICENSE.md'))];
  const attributions = [join(state.root, 'ATTRIBUTION.md'), ...state.packages.map(({ folder }) => join(folder, 'ATTRIBUTION.md'))];
  for (const path of [...licenses, ...attributions]) {
    const text = await readFile(path, 'utf8');
    if (incompleteNotice.test(text) || (licenses.includes(path) && (!copyright || !text.includes(copyright) || typeof termsPath !== 'string' || !text.includes(termsPath)))) {
      gates.push('independent-code notices are incomplete or disagree with the confirmed policy/grant');
      break;
    }
  }
  return gates;
}
export async function verify(root, { release = false } = {}) {
  const state = await loadCompliance(root);
  if (state.policy.dependencyInventoryPath) {
    const inventory = JSON.parse(await readFile(safePath(root, state.policy.dependencyInventoryPath), 'utf8'));
    const lock = await readFile(join(root, 'yarn.lock'));
    const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
    if (hash(lock) !== inventory.lockfileSha256) throw new Error('Dependency inventory lockfile hash is stale; refresh provenance for the new resolution.');
    const resolutions = new Set();
    for (const match of lock.toString().matchAll(/^  resolution: "([^"\n]+)"/gmu)) {
      const value = match[1];
      if (value.includes('@npm:')) resolutions.add(value);
      else if (value.includes('#npm:')) {
        const [name] = value.split('@virtual:');
        resolutions.add(`${name}@npm:${value.split('#npm:').at(-1)}`);
      }
    }
    const recorded = new Set((inventory.missingManifests ?? []).map(([name, version]) => `${name}@npm:${version}`));
    for (const entry of Object.values(inventory.packages ?? {})) {
      recorded.add(`${entry.name}@npm:${entry.version}`);
      if (hash(await readFile(safePath(root, entry.manifestPath))) !== entry.manifestSha256) throw new Error(`Dependency inventory manifest hash drift: ${entry.name}@${entry.version}`);
    }
    if (inventory.lockResolutionCount !== resolutions.size || recorded.size !== resolutions.size || [...resolutions].some((entry) => !recorded.has(entry))) throw new Error('Dependency inventory does not cover every exact npm lock resolution.');
  }
  for (const { pkg } of state.packages) {
    for (const file of noticeFiles) if (!pkg.files?.some((f) => f.replace(/\/$/u, '') === file)) throw new Error(`${pkg.name}: files whitelist must explicitly include ${file}`);
    if (pkg.license !== 'SEE LICENSE IN LICENSE.md') throw new Error(`${pkg.name}: unconfirmed independent-code holder requires SEE LICENSE IN LICENSE.md at this snapshot`);
  }
  const outputs = await expectedArtifacts(state);
  for (const [path, expected] of outputs) {
    const actual = await readFile(path);
    if (!actual.equals(Buffer.from(expected))) throw new Error(`Stale generated notice: ${path}`);
  }
  // A stale license copied in an earlier generation must not masquerade as used material.
  async function checkDirectory(path) {
    for (const entry of await readdir(path, { withFileTypes: true })) {
      const file = join(path, entry.name);
      if (entry.isDirectory()) await checkDirectory(file);
      else if (!outputs.has(file)) throw new Error(`Unused generated license notice: ${file}`);
    }
  }
  for (const { folder } of state.packages) await checkDirectory(join(folder, 'LICENSES'));
  const gates = [];
  let identity;
  try {
    identity = JSON.parse(await readFile(join(root, 'compliance/project-identity.json'), 'utf8'));
    if (!identity.scopeOwnership?.publishAuthorized || identity.scopeOwnership.status !== 'confirmed') gates.push('scope ownership and publish authority');
    if (identity.copyright?.status !== 'confirmed' || !identity.copyright.independentCodeHolder) gates.push('independent-code copyright holder');
    if (!identity.repository?.ownershipVerified || !identity.repository.releaseMetadataRepositoryUrl) gates.push('published repository ownership/URL');
  } catch (error) { if (error.code !== 'ENOENT') throw error; if (release) gates.push('project identity record'); }
  gates.push(...await independentCodeReleaseGates(state, identity));
  if (release && gates.length) throw new Error(`Release blocked: ${gates.join('; ')}`);
  console.log(`License verification passed: ${state.entries.length} source records, ${state.packages.length} public package notice sets.`);
  if (gates.length) console.log(`Release readiness gates remain unresolved: ${gates.join('; ')}. Local verification does not authorize release.`);
  return state;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { await verify(commandRoot(), { release: process.argv.includes('--release') }); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
