import pathlib,json,re,hashlib
L=pathlib.Path('.superpowers/sdd/PLAN/scope-integration-logs');before=json.load(open(L/'lock-baseline.frozen.json'));raw=pathlib.Path('yarn.lock').read_bytes();text=raw.decode();res=sorted(set(re.findall(r'^  resolution: "([^"]+)"$',text,re.M)));npm=sorted(x for x in res if '@npm:' in x and '@patch:' not in x);patch=sorted(x for x in res if '@patch:' in x);work=sorted(x for x in res if '@workspace:' in x);checks={}
for block in text.split('\n\n'):
 m=re.search(r'^  resolution: "([^"]+)"$',block,re.M);c=re.search(r'^  checksum: (.+)$',block,re.M)
 if m and c and m[1] in npm:checks[m[1]]=c[1]
sha=lambda xs:hashlib.sha256(('\n'.join(xs)+'\n').encode()).hexdigest()
after={'lockSha256':hashlib.sha256(raw).hexdigest(),'resolutionCount':len(res),'npmArtifactCount':len(npm),'patchCount':len(patch),'workspaceCount':len(work),'npmArtifactSetSha256':sha(npm),'patchSetSha256':sha(patch),'npmChecksums':checks,'npmArtifacts':npm,'patches':patch,'workspaces':work,'allResolutions':res}
assert len(res)==1915 and len(npm)==1878 and len(patch)==5 and len(work)==32
assert npm==before['npmArtifacts'] and patch==before['patches'] and checks==before['npmChecksums']
assert sorted(x.replace('@krds-native/','@unofficial-krds/') for x in before['allResolutions'])==res
(L/'lock-after.json').write_text(json.dumps(after,indent=2)+'\n')
summary={'oldLockSha256':before['lockSha256'],'newLockSha256':after['lockSha256'],'resolutions':len(res),'unchangedNpmArtifacts':len(npm),'unchangedPatchedResolutions':len(patch),'renamedWorkspaceResolutions':len(work),'unchangedNpmChecksumRecords':len(checks),'npmArtifactSetSha256':sha(npm),'scopeNormalizedResolutionSetEqual':True,'npmAdded':[],'npmRemoved':[]}
(L/'lock-comparison.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps(summary,indent=2))
