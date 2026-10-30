import pathlib,os,json,hashlib,re,datetime,difflib
R=pathlib.Path('.');L=R/'.superpowers/sdd/PLAN/scope-integration-logs';B=L/'before';B.mkdir(parents=True,exist_ok=True)
excludeRoot={'.git','.superpowers','.nx','.yarn','upstream'};excludeParts={'node_modules','dist','coverage','playwright-report','test-results','storybook-static','.svelte-kit','.angular','.vite','.vite-temp','.cache','LICENSES'}
excludePrefixes=['docs/execution/evidence/','docs/releases/','compatibility/evidence/','compliance/']
excludeFiles={'PLAN.md','catalog/coverage.json','docs/execution/progress.md','docs/execution/decisions.md','compatibility/testing.json','compatibility/toolchain.json'}
legalNames={'LICENSE.md','ATTRIBUTION.md','THIRD-PARTY-NOTICES.md','provenance.json'}
exts={'.json','.md','.ts','.tsx','.js','.jsx','.mjs','.cjs','.css','.vue','.svelte','.yml','.yaml','.html','.txt','.sh'}
mutations=[];beforeEntries=[]
for base,dirs,files in os.walk(R):
 relbase=pathlib.Path(base).relative_to(R);dirs[:]=[d for d in dirs if d not in excludeParts and not(not relbase.parts and d in excludeRoot) and not any((str(relbase/d)+'/').startswith(x) for x in excludePrefixes)]
 for name in files:
  p=pathlib.Path(base)/name;rel=str(p.relative_to(R))
  if rel in excludeFiles or name in legalNames or (p.suffix not in exts and name not in ['AGENTS.md','.yarnrc.yml']):continue
  try:raw=p.read_bytes();old=raw.decode()
  except (OSError,UnicodeDecodeError):continue
  new=old.replace('@krds-native/','@unofficial-krds/')
  if rel=='packages/angular/package.json':new=new.replace('krds-native-angular','unofficial-krds-angular')
  if rel=='package.json' or re.fullmatch(r'packages/[^/]+/package.json',rel):
   obj=json.loads(new)
   if rel=='package.json' or obj.get('private') is not True:
    repository={'type':'git','url':'https://github.com/moreal/krds'}
    if rel!='package.json':repository['directory']=str(p.parent)
    obj['repository']=repository;new=json.dumps(obj,indent=2,ensure_ascii=False)+'\n'
  if rel=='AGENTS.md':
   identity='- The user selected npm namespace `@unofficial-krds` and repository metadata `https://github.com/moreal/krds`. This confirms naming/location intent, not authenticated npm or repository ownership. Use the confirmed independent-code MIT holder/grant and separate official KRDS attribution in `compliance/project-identity.json`; publication, pushing and tagging remain unauthorized.\n'
   assert identity not in new;new=new.replace('# KRDS Native workspace rules\n','# KRDS Native workspace rules\n\n'+identity,1)
  if new==old:continue
  target=B/rel;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(raw)
  p.write_text(new)
  row={'path':rel,'beforeSha256':hashlib.sha256(raw).hexdigest(),'afterSha256':hashlib.sha256(new.encode()).hexdigest(),'oldScopeOccurrences':old.count('@krds-native/'),'newScopeOccurrences':new.count('@unofficial-krds/'),'scopeReplacementOnly':new==old.replace('@krds-native/','@unofficial-krds/')}
  mutations.append(row)
  beforeEntries.append(''.join(difflib.unified_diff(old.splitlines(True),new.splitlines(True),fromfile='a/'+rel,tofile='b/'+rel)))
raw=(R/'yarn.lock').read_bytes();(B/'yarn.lock').write_bytes(raw);text=raw.decode();res=sorted(set(re.findall(r'^  resolution: "([^"]+)"$',text,re.M)));npm=sorted(x for x in res if '@npm:' in x and '@patch:' not in x);patch=sorted(x for x in res if '@patch:' in x);work=sorted(x for x in res if '@workspace:' in x);checks={}
for block in text.split('\n\n'):
 m=re.search(r'^  resolution: "([^"]+)"$',block,re.M);c=re.search(r'^  checksum: (.+)$',block,re.M)
 if m and c and m[1] in npm:checks[m[1]]=c[1]
sha=lambda xs:hashlib.sha256(('\n'.join(xs)+'\n').encode()).hexdigest()
record={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'lockSha256':hashlib.sha256(raw).hexdigest(),'resolutionCount':len(res),'npmArtifactCount':len(npm),'patchCount':len(patch),'workspaceCount':len(work),'npmArtifactSetSha256':sha(npm),'patchSetSha256':sha(patch),'npmChecksums':checks,'npmArtifacts':npm,'patches':patch,'workspaces':work,'allResolutions':res}
(L/'lock-baseline.frozen.json').write_text(json.dumps(record,indent=2)+'\n');(L/'source-mutations.json').write_text(json.dumps(sorted(mutations,key=lambda x:x['path']),indent=2)+'\n');(L/'source-scope.diff').write_text('\n'.join(beforeEntries))
print('Applied namespace/source metadata mutation to',len(mutations),'files. No compliance, upstream, history, active lead or generated-output edits.')
print('Frozen lock baseline',record['lockSha256'],'npm artifacts',len(npm),'patches',len(patch),'workspaces',len(work))
print('Non-literal scope-only edits:',[x['path'] for x in mutations if not x['scopeReplacementOnly']])
