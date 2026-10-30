import {pathToFileURL} from 'node:url';
import {assertNode, command, git, writeJson} from './common.mjs';

export function parsePhase(args) {
  if (args.length !== 2 || args[0] !== '--phase' || !['prepare-versions', 'verify-candidate'].includes(args[1])) {
    throw new Error('Select an explicit release phase: --phase prepare-versions|verify-candidate');
  }
  return args[1];
}

export function assertVerifySource({head, expectedSha, trackedChanges, untrackedFiles}) {
  if (!/^[a-f0-9]{40}$/i.test(head ?? '')) throw new Error('verify-candidate requires a real HEAD commit');
  if (!/^[a-f0-9]{40}$/i.test(expectedSha ?? '') || head !== expectedSha) throw new Error('verify-candidate requires the exact requested source SHA');
  // Match the existing T16 generated-evidence exceptions; source/version/license/changelog files remain strict.
  const generated = path => /^(?:docs\/releases\/|artifacts\/|test-results\/|\.nx\/|\.superpowers\/|\.agents\/|\.codex\/|\.aws\/)/u.test(path);
  const changedSource = [...trackedChanges, ...untrackedFiles].filter(path => !generated(path));
  if (changedSource.length) throw new Error(`verify-candidate source differs from reviewed HEAD: ${changedSource.slice(0, 8).join(', ')}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  assertNode();
  const phase = parsePhase(process.argv.slice(2));
  let sourceSha;
  if (phase === 'verify-candidate') {
    sourceSha = git(['rev-parse', '--verify', 'HEAD^{commit}']);
    assertVerifySource({
      head: sourceSha,
      expectedSha: process.env.KRDS_RELEASE_SOURCE_SHA,
      trackedChanges: git(['diff', '--name-only', '--no-ext-diff', '-z', sourceSha]).split('\0').filter(Boolean),
      untrackedFiles: git(['ls-files', '--others', '--exclude-standard', '-z']).split('\0').filter(Boolean),
    });
  } else {
    try { sourceSha = git(['rev-parse', '--verify', 'HEAD^{commit}']); }
    catch { sourceSha = null; } // A source preview is never accepted as a candidate; the real changelog dry-run still needs HEAD.
  }
  command(process.execPath, ['tools/ci/check-release-config.mjs', phase === 'verify-candidate' ? '--expect-initial-candidate' : '--expect-initial-source'], {stdio: 'inherit'});
  writeJson('test-results/ci/release-phase.json', {phase, status: 'phase-entry-checked', sourceSha, candidateAcceptanceRequested: phase === 'verify-candidate', publicationAuthorized: false});
  console.log(phase === 'prepare-versions' ? 'Version preview only; no candidate acceptance or T16 result is claimed' : 'Reviewed candidate phase entry checked; full same-HEAD execution and T16 acceptance remain required');
}
