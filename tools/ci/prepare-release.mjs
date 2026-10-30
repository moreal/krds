import {readdirSync} from 'node:fs';
import {assertNode, command, git, root, yarn} from './common.mjs';
import {assertApplySourceCommit, preparationArgs} from './release-policy.mjs';
assertNode();
const args = process.argv.slice(2);
if (args.length !== 1 || !['--dry-run', '--apply'].includes(args[0])) throw new Error('Usage: prepare-release.mjs --dry-run|--apply');
command(process.execPath, ['tools/ci/check-release-config.mjs', '--expect-initial-source'], {stdio: 'inherit'});
if (!readdirSync(`${root}/.nx/version-plans`).some(file => file.endsWith('.md'))) throw new Error('No reviewed Nx version plans; candidate version/changelog preparation is pending');
if (args[0] === '--apply') assertApplySourceCommit(git(['rev-parse', '--verify', 'HEAD^{commit}']), process.env.KRDS_RELEASE_SOURCE_SHA);
// Only Nx authors versions and changelogs. Root git settings are all false and publish is explicitly skipped.
yarn(preparationArgs({dryRun: args[0] === '--dry-run'}), {stdio: 'inherit'});
if (args[0] === '--apply') command(process.execPath, ['tools/ci/check-release-config.mjs', '--expect-initial-candidate'], {stdio: 'inherit'});
