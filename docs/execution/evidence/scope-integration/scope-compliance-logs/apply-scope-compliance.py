from pathlib import Path
import json,hashlib,re,datetime,copy
root=Path('/Users/moreal/github/moreal/krds');logs=root/'.superpowers/sdd/PLAN/scope-compliance-logs';hash=lambda b:hashlib.sha256(b).hexdigest();old='136bebc1c213d0bc274b905ee291fa096beefa4dbbaece6ecf915689adadf4f4';new='fb40749425ddd90ce46937551ae72c63d4bdf7caa53706edf073f4ccc69b0b58';lock=(root/'yarn.lock').read_bytes();assert hash(lock)==new
snap=root/'.superpowers/sdd/PLAN/scope-integration-logs';baseline=json.loads((snap/'lock-baseline.frozen.json').read_text());after=json.loads((snap/'lock-after.json').read_text());assert baseline['lockSha256']==old and after['lockSha256']==new
resolutions=set(json.loads(v) for v in re.findall(r'^  resolution: (.*)$',lock.decode(),re.M));norm=lambda values:{json.loads(v) if v.startswith('"') else v for v in values};assert resolutions==norm(after['allResolutions']);assert len(resolutions)==1915
assert {v.replace('@unofficial-krds/','@krds-native/') for v in resolutions}==norm(baseline['allResolutions'])
npm=set();patch=set();workspaces=set()
for v in resolutions:
 if '@npm:' in v:npm.add(v)
 elif '#npm:' in v:npm.add(v.split('@virtual:',1)[0]+'@npm:'+v.rsplit('#npm:',1)[1])
 elif '@patch:' in v:patch.add(v)
 elif '@workspace:' in v:workspaces.add(v)
assert len(npm)==1878 and len(patch)==5 and len(workspaces)==32
assert npm==norm(baseline['npmArtifacts'])==norm(after['npmArtifacts']);assert patch==norm(baseline['patches'])==norm(after['patches'])
checksums={};resolution=None
for line in lock.decode().splitlines():
 if line and not line.startswith(' '):resolution=None
 if line.startswith('  resolution: '):resolution=json.loads(line.split(': ',1)[1])
 if line.startswith('  checksum: ') and resolution in npm:
  value=line.split(': ',1)[1];checksums[resolution]=json.loads(value) if value.startswith('"') else value
assert checksums==baseline['npmChecksums']==after['npmChecksums'];assert len(checksums)==1544
invPath=root/'compliance/provenance-dependencies.json';invBytes=invPath.read_bytes();inv=json.loads(invBytes);assert inv['lockfileSha256']==old
recorded={n+'@npm:'+v for n,v in inv['missingManifests']};recorded.update(p['name']+'@npm:'+p['version'] for p in inv['packages'].values());assert npm==recorded;assert inv['lockResolutionCount']==1878
invAfter=invBytes.replace(old.encode(),new.encode());assert invAfter.replace(new.encode(),old.encode())==invBytes;invPath.write_bytes(invAfter)
provPath=root/'compliance/provenance.json';provBytes=provPath.read_bytes();beforeRows=json.loads(provBytes);targetCount=sum(len([v for v in row['distributedIn'] if v.startswith('@krds-native/')]) for row in beforeRows);assert targetCount==18
for row in beforeRows:
 for key,value in row.items():
  if '@krds-native/' in json.dumps(value,ensure_ascii=False):assert key=='distributedIn'
provAfter=provBytes.replace(b'@krds-native/',b'@unofficial-krds/');assert provAfter.replace(b'@unofficial-krds/',b'@krds-native/')==provBytes;afterRows=json.loads(provAfter);public={json.loads(p.read_text())['name'] for p in (root/'packages').glob('*/package.json') if not json.loads(p.read_text()).get('private')};assert len(public)==13
for row in afterRows:
 assert all(name in public for name in row['distributedIn'])
 if row['rightsStatus']=='unresolved':assert not row['distributedIn']
restored=copy.deepcopy(afterRows)
for row in restored:row['distributedIn']=[v.replace('@unofficial-krds/','@krds-native/') for v in row['distributedIn']]
assert restored==beforeRows;provPath.write_bytes(provAfter)
p=root/'compliance/project-identity.json';identity=json.loads(p.read_text());assert identity['localPackageScope']=='@unofficial-krds';identity['scopeNaming']['integrationStatus']='applied-source-manifests-lock-provenance-and-notices; production-rebuild-validation-pending-T01';identity['metadataReadiness']['scopeIntegration']='applied-to-current-source-manifests-lock-provenance-and-notices; production-rebuild-validation-pending-T01';identity['releaseMetadata']['missing']=[v for v in identity['releaseMetadata']['missing'] if v!='Atomic requested-scope integration by T01'];identity['checkedAt']=datetime.datetime.now(datetime.timezone.utc).isoformat();assert identity['scopeOwnership']['publishAuthorized'] is False and identity['repository']['ownershipVerified'] is False and identity['publicationAuthorization']['authorized'] is False;p.write_text(json.dumps(identity,ensure_ascii=False,indent=2)+'\n')
for path,expected in json.loads((logs/'protected-hashes.json').read_text()).items():assert hash((root/path).read_bytes())==expected,path
result={'status':'passed','oldLockSha256':old,'newLockSha256':new,'resolutionCount':len(resolutions),'unchangedNpmArtifacts':len(npm),'unchangedPatchedResolutions':len(patch),'scopeMappedWorkspaceResolutions':len(workspaces),'unchangedNpmChecksumRecords':len(checksums),'normalizedNpmSetSha256':hash(('\n'.join(sorted(npm))+'\n').encode()),'scopeNormalizedAllResolutionSetEqual':True,'provenanceRows':len(afterRows),'renamedDistributedInRecords':sum(a['distributedIn']!=b['distributedIn'] for a,b in zip(beforeRows,afterRows)),'renamedDistributedInReferences':targetCount,'publicPackageCount':len(public),'allOtherProvenanceFieldsAndBytesUnchanged':True,'inventoryOnlyFingerprintBytesChanged':True,'protectedOfficialMetadataGrantAndUpstreamHashesUnchanged':True};(logs/'scope-comparison.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
