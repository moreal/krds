/**
 * Make the Qwik docs-preview bytes independent of the machine that built them. Owned by the
 * preview tooling and consumed by apps/fixture-qwik/src/docs-preview/build.mjs and entry.ssr.tsx.
 *
 * Qwik's client manifest is deployed (q-manifest.json) and its `manifestHash` is written into
 * every prerendered page as `q:manifest-hash`. Two things in it vary between hosts: the
 * `assets` map follows filesystem emit order, and `platform.os` names the build OS. The
 * `q:instance` container id is a fresh random value per render unless the host supplies one.
 * The deployable preview may carry none of these, so the builder sorts the assets, drops the
 * OS name, recomputes the hash the way the optimizer does, and derives the instance id from
 * the preview identity.
 */
/** Qwik optimizer `hashCode`: 32-bit string hash, base 36. */
export const hashCode = (text, hash = 0) => {
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Number(Math.abs(hash)).toString(36);
};
const byCodeUnit = ([a], [b]) => (a < b ? -1 : a > b ? 1 : 0);
export function normalizeClientManifest(manifest) {
  const { manifestHash: _hash, platform, ...rest } = manifest;
  if (rest.assets) rest.assets = Object.fromEntries(Object.entries(rest.assets).sort(byCodeUnit));
  // The optimizer hashes the manifest before it appends `manifestHash` and `platform`.
  const normalized = { ...rest, manifestHash: hashCode(JSON.stringify(rest)) };
  if (platform) {
    const { os: _os, ...portable } = platform;
    normalized.platform = portable;
  }
  return normalized;
}
/** Stable `q:instance` for one prerendered preview document. */
export const instanceId = (componentId, exampleId) => hashCode(`${componentId}/${exampleId}`);
