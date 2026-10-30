from pathlib import Path
import json,hashlib,difflib,collections
root=Path('/Users/moreal/github/moreal/krds');logs=root/'.superpowers/sdd/PLAN/metadata-compliance-logs';index=json.loads((logs/'before-index.json').read_text());changes=json.loads((logs/'changed-file-inventory.json').read_text());expectedChanges={x['path']:x for x in changes}
sha=lambda b:hashlib.sha256(b).hexdigest()
def generated(path):
 parts=Path(path).parts
 return path=='THIRD-PARTY-NOTICES.md' or (len(parts)>=3 and parts[0]=='packages' and (parts[2] in ['LICENSE.md','ATTRIBUTION.md','THIRD-PARTY-NOTICES.md','provenance.json','LICENSES']))
patches={'authored':[],'generated':[],'official-evidence':[]};current=[];manifest=[]
for item in sorted(index,key=lambda x:x['path']):
 path=Path(item['path']);file=root/path;exists=file.exists();new=file.read_bytes() if exists else b'';old=(logs/'before'/path).read_bytes() if item['exists'] else b''
 if exists:
  saved=logs/'after'/path;saved.parent.mkdir(parents=True,exist_ok=True);saved.write_bytes(new)
 current.append({'path':str(path),'exists':exists,'sha256':sha(new) if exists else None,'bytes':len(new)})
 if str(path) in expectedChanges:
  assert (sha(new) if exists else None)==expectedChanges[str(path)]['afterSha256'],str(path)
 if old!=new or item['exists']!=exists:
  category='generated' if generated(str(path)) else 'official-evidence' if str(path).startswith('compliance/evidence/metadata/') else 'authored'
  patches[category].extend(difflib.unified_diff(old.decode().splitlines(keepends=True),new.decode().splitlines(keepends=True),fromfile='before/'+str(path) if item['exists'] else '/dev/null',tofile='after/'+str(path) if exists else '/dev/null'))
 if generated(str(path)):
  record={'path':str(path),'exists':exists,'sha256':sha(new) if exists else None,'bytes':len(new),'change':'unchanged' if old==new and item['exists']==exists else 'added' if not item['exists'] else 'deleted' if not exists else 'modified'}
  if '/LICENSES/' in str(path) and path.name!='README.md' and exists:
   source=Path('LICENSES')/Path(*path.parts[3:]);sourceBytes=(root/source).read_bytes();assert sourceBytes==new;record.update(sourcePath=str(source),sourceSha256=sha(sourceBytes),mapping='Exact source-document bytes')
  elif path.name=='LICENSE.md':record.update(mapping='Root LICENSE.md plus package-specific scope and provenance-derived notice body',templateSource='LICENSE.md',templateSha256=sha((logs/'after/LICENSE.md').read_bytes()))
  elif path.name=='ATTRIBUTION.md' and exists and new==(logs/'after/ATTRIBUTION.md').read_bytes():record.update(mapping='Exact KRDS root attribution bytes for the package using KRDS material',sourcePath='ATTRIBUTION.md',sourceSha256=sha(new))
  else:record['mapping']='Deterministic tools/generate-notices.mjs template and package-filtered provenance'
  manifest.append(record)
for category,parts in patches.items():(logs/(category+'-unified.diff')).write_text(''.join(parts))
(logs/'current-scoped-hashes.json').write_text(json.dumps(current,ensure_ascii=False,indent=2)+'\n');(logs/'generated-notice-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
summary={'generatedExistingCount':sum(x['exists'] for x in manifest),'generatedChangeCounts':dict(collections.Counter(x['change'] for x in manifest)),'grantCopies':[x['path'] for x in manifest if x.get('sourcePath')=='LICENSES/MIT.txt'],'krdsAttributionCopies':[x['path'] for x in manifest if x.get('sourcePath')=='ATTRIBUTION.md'],'diffBytes':{name:(logs/(name+'-unified.diff')).stat().st_size for name in patches},'protectedHashes':json.loads((logs/'protected-input-hashes.json').read_text())}
assert len(summary['grantCopies'])==13
(logs/'generated-summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n');print(json.dumps(summary,ensure_ascii=False,indent=2))
