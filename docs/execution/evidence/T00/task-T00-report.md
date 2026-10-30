# T00 execution report

Status: **DONE_WITH_CONCERNS**

The baseline is concrete and reviewable. Later tasks can consume 55 canonical identities (54 web-applicable), six commit-pinned kit source files, exact published native/compiler/testing versions, and explicit public-identity gates. This status completes T00 metadata work only; it does not declare framework support, installation, production builds or browser behavior complete.

## Files created

- `upstream/krds/manifest.json`
- `compatibility/toolchain.json`
- `compatibility/frameworks.json`
- `compatibility/testing.json`
- `docs/execution/progress.md`
- `docs/execution/decisions.md`
- `compliance/project-identity.json`

Additional raw evidence created by T00 (19 fetched files + collection log):

- `upstream/krds/raw/kit/tokens/figma_token.json`
- `upstream/krds/raw/kit/tokens/transformed_tokens.json`
- `upstream/krds/raw/kit/resources/css/token/krds_tokens.css`
- `upstream/krds/raw/kit/resources/css/common/common.css`
- `upstream/krds/raw/kit/resources/css/component/component.css`
- `upstream/krds/raw/kit/resources/js/component/ui-script.js`
- `upstream/krds/raw/selected/@solidjs__compiler-2.0.0-rc.19.json`
- `upstream/krds/raw/selected/@solidjs__babel-plugin-2.0.0-rc.19.json`
- `upstream/krds/raw/selected/@babel__core-7.28.5.json`
- `upstream/krds/raw/selected/@babel__preset-typescript-7.28.5.json`
- `upstream/krds/raw/selected/@types__node-24.13.3.json`
- `upstream/krds/raw/selected/@types__react-latest.json`
- `upstream/krds/raw/selected/@types__react-dom-latest.json`
- `upstream/krds/raw/selected/playwright-1.64.1.json`
- `upstream/krds/raw/selected/@internationalized__date-latest.json`
- `upstream/krds/raw/selected/vue-tsc-latest.json`
- `upstream/krds/raw/selected/svelte-check-latest.json`
- `upstream/krds/raw/selected/krds-uiux-1.1.0.json`
- `upstream/krds/raw/selected/@solidjs__router-1.0.0.json`
- `upstream/krds/raw/collection-t00.json`

Report: `.superpowers/sdd/PLAN/task-T00-report.md`. Original `PLAN.md`, task briefs and pre-existing recovered raw evidence are unchanged. Total raw snapshot: 194 files, including collection logs; 105 published package manifests are indexed by exact name/version. The report's command appendices reproduce the temporary validators; no project package installation was performed.

## Validation results

- `python3 /private/tmp/t00-verify.py` — exit 0. PASS: five JSON documents; 55 unique detail IDs/URLs; 54 web items; 194 source/log SHA-256 checks; six Git blob matches; 98 unique selected published pins; mandatory test integrations retained as pending; publish gate closed. Validator source is reproduced below.
- `/Users/moreal/.local/share/mise/installs/node/24.18.0/bin/node /private/tmp/t00-peers.cjs` — exit 0. 85 selected native-profile packages, 91 Node engine checks, 269 peer checks, zero missing required peers and zero failures. Uses semver 7.8.5 unpacked in `/private/tmp/krds-t00-semver/package`; its downloaded tarball SHA-512 matched the frozen npm integrity. Checker source and bootstrap command are reproduced below.
- `/Users/moreal/.local/share/mise/installs/node/24.18.0/bin/node --version` — exit 0, `v24.18.0`. `mise ls node --json` confirms this existing installed binary. No global runtime was changed.
- Repository status/identity observations: `git -c core.fsmonitor=false status --short`, `git remote -v`; unborn `implement/krds-native`, origin `git@github.com:moreal/krds.git`. Existing git fsmonitor errored under the default status command; disabling that hook for the read-only observation succeeds. No AGENTS.md was present in this project.
- No Yarn install, lockfile, compiler execution, Storybook build, siheom browser test, Playwright browser install or production consumer build was run in T00. Those statuses are explicitly pending.

## Evidence and decisions

- Official live summary has 55 distinct detail-link destinations despite displaying37. Every fetched detail is classified as component/composition/asset/integration/not-applicable, with web and platform responsibility. The detail URLs come from the summary; shared-root og:url is not canonical identity evidence.
- SplashScreen is explicitly mobile-app-only in the official summary/detail and delegates launch presentation to the OS. No web splash requirement was found in the frozen detail. Web loading feedback remains Spinner. Other mobile-category controls remain in the web catalog.
- Kit1.1.0 tag/main commit `d6bb184c823e4757f05807ea4646a23e3133b6e6` is distinct from live web guidance. Six token/CSS/JS source bytes were matched against the corresponding Git blob hashes. Release metadata contains no attached assets. Published npm1.1.0 manifest and distribution integrity are preserved; the npm tarball was not downloaded.
- Selected installed Node24.18.0 is officially recorded Krypton LTS and satisfies selected engines. Latest observed24.22.2 is informational. Yarn4.14.1/Corepack0.36.0/Nx24.0.2, TS6.0.2, Vite8.3.5 and Qwik-specific Vite7.3.1 are exact published choices. Do not use the ambient Node26.13.0 implicitly.
- Angular22.2.4 runtime/compiler and22.2.5 CLI/build/ng-packagr require TS>=6<6.1. Qwik1.20.3 requires Vite>=5<8. Solid2rc.19 and native compiler/plugin use a dedicated Vite8 path. Root runtime/compiler resolutions must not merge these environments.
- siheom core/React0.4.1 and other five adapters0.3.2 require Vitest^4.1.10; browser provider4.1.10 requires exactly Vitest4.1.10. All seven Storybook and six siheom combinations stay mandatory/pending after direct-peer metadata validation. Solid Testing Library's required router peer1.0.0 is explicit.

## Concerns and follow-up owners

1. Public identity remains unconfirmed: @krds-native is a local working scope; independent-code copyright holder and publication/repository authority are unknown. Observed origin does not prove ownership. Local work proceeds; release metadata gate is unmet and publishing is prohibited until confirmed.
2. Rights are not flattened to MIT or ISC. English policy describes KOGL Type1; Korean metadata qualifies free use by ownership of all rights. Git/npm package metadata says ISC while pinned README defers to KRDS terms. Korean dynamic body was not verified: its actual control script URL returned HTTP400; an earlier guessed URL returned404. Font paths/hashes are identified but no redistribution clearance is asserted. T03 must reconcile per-file terms and notices.
3. Nx compatibility reference URLs returned404. Nx manifests have no Node engine range; exact CLI/task execution on selected Node remains T01 work. Other selected compiler/build/test engines passed metadata checks.
4. Qwik Storybook README still says7; published0.6.1 depends on builder^10.3.3 and has dev Storybook10.3.3. Candidate core10.6.5 is selected by published range; actual execution remains T05. Qwik siheom dev metadata references private/local package patches; published artifacts with selected unpatched Qwik1.20.3 and TL1.7.1 require real compiler/browser validation. Qwik serialization/resume/first interaction require production fixtures.
5. Lit has no published siheom adapter (registry404). Solid1 siheom peer excludes Solid2. Native fixtures/Playwright remain required. Community Storybook advertises Solid2 and has prerelease peers, but the `vite-plugin-solid` specifier versus `@solidjs/vite-plugin` compiler path needs a tested workspace-local alias/configuration; preview integration is pending, not supported-by-assertion.
6. No Git commit was created or amended: exact active model identity hook is unavailable, so the mandated Assisted-by trailer cannot be safely produced. Changes remain uncommitted as instructed.

## Reproducible verifier sources

Save each block to the indicated temporary path and execute the exact commands above from the repository root. The only network bootstrap fetches the already frozen semver7.8.5 tarball, validates its recorded SRI, and unpacks it to a temporary directory; it does not run installation scripts.

`/private/tmp/t00-verify.py`:

```python
import json,pathlib,hashlib,re,collections
root=pathlib.Path('/Users/moreal/github/moreal/krds')
paths=['upstream/krds/manifest.json','compatibility/toolchain.json','compatibility/frameworks.json','compatibility/testing.json','compliance/project-identity.json']
docs=[json.loads((root/p).read_text()) for p in paths];m,t,f,test,ident=docs
assert len({d['krdsBaselineId'] for d in docs})==1
urls=[x['canonicalUrl'] for x in m['components']];assert len(urls)==len(set(urls))==55
assert len({x['id'] for x in m['components']})==55
assert sum(x['webApplicable'] for x in m['components'])==54
assert collections.Counter(x['kind'] for x in m['components'])==m['catalog']['kindCounts']
summary=(root/'upstream/krds/raw/component_summary.html').read_text()
linked={x for x in re.findall(r'href="\./(component_\d+_\d+)\.html"',summary)}
assert linked=={x['id'] for x in m['components']}
assert len({x['url'] for x in m['sources']})==len(m['sources'])
hashes=0
for x in m['sources']+m['collectionLogs']:
 if 'localPath' in x:
  assert hashlib.sha256((root/x['localPath']).read_bytes()).hexdigest()==x['sha256'],x['localPath'];hashes+=1
for x in m['components']:
 s=x['source'];assert hashlib.sha256((root/s['localPath']).read_bytes()).hexdigest()==s['sha256']
 assert x['kind'] in ['component','composition','asset','integration','not-applicable']
 assert x['scopeReason'] and x['scopeEvidenceUrls']
 assert x['platformScope']['mobileWeb']==x['webApplicable']
for x in m['resources']:
 b=(root/x['localPath']).read_bytes();assert hashlib.sha256(b).hexdigest()==x['sha256']
 assert hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==x['gitBlobSha1']
assert set(test['requiredStorybookFrameworks'])==set(f['stableTargets'])
assert set(test['requiredSiheomFrameworks'])=={'react','solid','svelte','vue','qwik','angular'}
assert all(x['status']=='pending' for x in test['siheom']+test['storybook'])
assert ident['releaseMetadata']['publishAllowed']==False
pins=[]
for e in t['environments'].values():pins.extend(e['pins'].items())
for x in f['frameworks']:
 pins.extend(x['pins'].items())
 if x['ark']:pins.append((x['ark']['package'],x['ark']['version']))
for x in test['siheom']:pins.extend(x['directDevDependencies'].items())
for x in test['storybook']:pins.extend([(x['integration'],x['version']),('storybook',x['storybook'])])
pins.extend(t['sharedPins'].items());pins.extend(f['sharedBehavior']['zag'].items());pins.extend([('nx',t['orchestration']['nx']),('@nx/js',t['orchestration']['@nx/js']),('corepack',t['packageManager']['corepackVersion']),('@yarnpkg/cli-dist',t['packageManager']['version'])])
for name,version in pins:
 assert name+'@'+version in t['publishedPackages'],(name,version)
 d=t['publishedPackages'][name+'@'+version];raw=json.loads((root/d['localManifest']).read_text())
 assert raw['name']==name and raw['version']==version
 assert hashlib.sha256((root/d['localManifest']).read_bytes()).hexdigest()==d['sha256']
 assert re.fullmatch(r'\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?',version),version
print(f'PASS: {len(paths)} JSON documents; 55 unique detail IDs/URLs; 54 web items; {hashes} source/log SHA-256 checks; 6 Git blob matches; {len(set(pins))} exact selected published pins; all mandatory integrations retained/pending; publish gate closed.')
```

Semver bootstrap:

```sh
python3 - <<'PY'
import json,pathlib,urllib.request,hashlib,base64,tarfile,io
d=json.loads(pathlib.Path("upstream/krds/raw/selected/semver-latest.json").read_text())
b=urllib.request.urlopen(d["dist"]["tarball"],timeout=35).read()
kind,sri=d["dist"]["integrity"].split("-",1)
assert base64.b64encode(hashlib.new(kind,b).digest()).decode()==sri
out=pathlib.Path("/private/tmp/krds-t00-semver");out.mkdir(exist_ok=True)
with tarfile.open(fileobj=io.BytesIO(b),mode="r:gz") as archive:archive.extractall(out,filter="data")
print("semver",d["version"],"SRI matched")
PY
```

`/private/tmp/t00-peers.cjs`:

```javascript
const fs = require('node:fs');
const semver = require('/private/tmp/krds-t00-semver/package');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const tc = read('compatibility/toolchain.json');
const fw = read('compatibility/frameworks.json');
const tests = read('compatibility/testing.json');
let engines = 0, peers = 0, missing = [], failures = [];
const allSelected = new Set();
for (const target of fw.frameworks) {
 const env = { ...tc.environments[target.toolchain].pins, ...target.pins };
 const behavior = target.ark ? { [target.ark.package]: target.ark.version } : {};
 Object.assign(env, behavior);
 if(target.supportChannel === 'stable-target') {
  const siheom = tests.siheom.find(x => x.framework === target.id);
  if (siheom) Object.assign(env, siheom.directDevDependencies);
  const storybook = tests.storybook.find(x => x.framework === target.id);
  Object.assign(env, {[storybook.integration]:storybook.version,storybook:storybook.storybook});
 }
 if (target.id === 'react') Object.assign(env, {'@types/react':'19.3.0','@types/react-dom':'19.3.0'});
 for (const [name,version] of Object.entries(env)) {
  const metadata=tc.publishedPackages[name+'@'+version];
  if (!metadata) throw new Error(`Missing published metadata ${name}@${version}`);
  allSelected.add(name+'@'+version);
  const engine=metadata.engines?.node;
  if(engine) { engines++;if(!semver.satisfies(tc.node.version,engine))failures.push(`${target.id}: ${name} Node ${engine}`); }
  for(const [peer,range] of Object.entries(metadata.peerDependencies||{})) {
   if(!env[peer]) {if(!metadata.peerDependenciesMeta?.[peer]?.optional)missing.push(`${target.id}: ${name} requires ${peer} ${range}`);continue;}
   peers++;if(!semver.satisfies(env[peer],range))failures.push(`${target.id}: ${name} requires ${peer} ${range}, selected ${env[peer]}`);
  }
 }
}
for(const [name,version] of [['corepack',tc.packageManager.corepackVersion],['@yarnpkg/cli-dist',tc.packageManager.version]]) {
 const engine=tc.publishedPackages[name+'@'+version].engines.node;engines++;if(!semver.satisfies(tc.node.version,engine))failures.push(name+' Node '+engine);
}
console.log(JSON.stringify({selectedPackages:allSelected.size,engineChecks:engines,peerChecks:peers,missing,failures},null,2));
if(missing.length||failures.length)process.exitCode=1;
```
