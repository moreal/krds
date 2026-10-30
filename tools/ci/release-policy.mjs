import {readJson} from './common.mjs';
export const initialCandidate = readJson('tools/ci/initial-candidate.json');

export function preparationArgs({dryRun}) {
  return ['nx', 'release', `--preid=${initialCandidate.preview.preid}`, '--skip-publish', '--first-release', ...(dryRun ? ['--dry-run'] : [])];
}

export function previewChannel(version) {
  if (version === initialCandidate.preview.sourceVersion) return 'next';
  if (version === initialCandidate.preview.version) return initialCandidate.preview.preid;
  throw new Error(`Unexpected initial preview version ${version}; expected the bootstrap or proposed ${initialCandidate.preview.version} prerelease`);
}

export function assertApplySourceCommit(sourceSha, expectedSha) {
  if (!/^[a-f0-9]{40}$/i.test(sourceSha ?? '')) throw new Error('Initial candidate apply requires a real source commit; an unborn branch is not a candidate');
  if (expectedSha && sourceSha !== expectedSha) throw new Error('Initial candidate apply source commit does not match the requested source SHA');
}
