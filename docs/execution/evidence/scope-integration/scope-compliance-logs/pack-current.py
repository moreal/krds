from pathlib import Path
import json,subprocess,tarfile,hashlib,datetime
root=Path('/Users/moreal/github/moreal/krds');logs=root/'.superpowers/sdd/PLAN/scope-compliance-logs';out=Path('/private/tmp/krds-scope-pack');out.mkdir(exist_ok=True);entries=json.loads((root/'compliance/provenance.json').read_text());results=[];sha=lambda b:hashlib.sha256(b).hexdigest();grant=(root/'LICENSES/MIT.txt').read_bytes()
for manifest in sorted((root/'packages').glob('*/package.json')):
 pkg=json.loads(manifest.read_text())
 if pkg.get('private'):continue
 assert pkg['name']=='@unofficial-krds/'+manifest.parent.name
 tar=out/(manifest.parent.name+'.tgz');run=subprocess.run(['node','tools/yarn.mjs','workspace',pkg['name'],'pack','--out',str(tar)],cwd=root,capture_output=True,text=True)
 if run.returncode:raise RuntimeError(run.stdout+run.stderr)
 with tarfile.open(tar) as tf:
  members={v.name:v for v in tf.getmembers() if v.isfile()};packed=json.loads(tf.extractfile('package/package.json').read());assert packed['name']==pkg['name'];assert packed['repository']['url']=='https://github.com/moreal/krds';assert packed['repository']['directory']=='packages/'+manifest.parent.name
  assert tf.extractfile('package/LICENSES/MIT.txt').read()==grant;assert 'package/LICENSES/MIT-intended.txt' not in members
  for legal in ['LICENSE.md','ATTRIBUTION.md','THIRD-PARTY-NOTICES.md','provenance.json']:
   assert tf.extractfile('package/'+legal).read()==(manifest.parent/legal).read_bytes()
  licenseFiles=[v for v in members if v.startswith('package/LICENSES/')];assert licenseFiles
  for v in licenseFiles:assert tf.extractfile(v).read()==(manifest.parent/v.removeprefix('package/')).read_bytes()
  selected=[e for e in entries if pkg['name'] in e['distributedIn']];assetCount=0
  for e in selected:
   for path in e['localPaths']:
    prefix=str(manifest.parent.relative_to(root))+'/'
    if path.startswith(prefix) and path[len(prefix):].split('/')[0] in pkg['files']:
     name='package/'+path[len(prefix):]
     if not any(c in name for c in ['*','?']):
      assert name in members,(pkg['name'],name)
      assert tf.extractfile(name).read()==(root/path).read_bytes()
      if not e['modified']:assert sha(tf.extractfile(name).read())==e['sha256']
      assetCount+=1
  results.append({'name':pkg['name'],'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'tarball':str(tar),'sha256':sha(tar.read_bytes()),'packageManifestSha256':sha((manifest.parent/'package.json').read_bytes()),'fileCount':len(members),'licenseFiles':licenseFiles,'MITGrantSha256':sha(grant),'distributedSourceRecords':len(selected),'checkedShippedMaterialPaths':assetCount,'status':'passed'})
 print(pkg['name'],'PASS',len(members),'files',len(licenseFiles),'license docs',len(selected),'source records',assetCount,'material paths',flush=True)
assert len(results)==13;(logs/'pack-results.json').write_text(json.dumps(results,indent=2)+'\n')
