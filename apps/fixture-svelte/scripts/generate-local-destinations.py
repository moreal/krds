"""Independent, offline local navigation documents for the native test hosts.
No upstream KRDS markup/assets or foreign renderer code is incorporated.
Use --check to verify current bytes; --write explicitly materializes documents.
"""
from pathlib import Path
import argparse, hashlib, html, json, urllib.parse
root = Path(__file__).resolve().parents[3]
parser = argparse.ArgumentParser(); parser.add_argument('--write', action='store_true'); parser.add_argument('--check', action='store_true'); args = parser.parse_args()
records = json.loads((root/'catalog/full-catalog-scenarios.json').read_text())['cases'] + json.loads((root/'catalog/full-catalog-stories.json').read_text())['cases']
links = {}
def visit(value):
    if isinstance(value, dict):
        for key, item in value.items():
            if key in ['href','fallbackHref','hrefTemplate'] and isinstance(item,str) and item.startswith('/local/'):
                path = urllib.parse.urlsplit(item.replace('{page}','1')).path.rstrip('/')
                links.setdefault(path, value.get('label') or value.get('nativeLabel') or value.get('title') or '로컬 예제 문서')
            visit(item)
    elif isinstance(value,list):
        for item in value: visit(item)
for record in records: visit(record)
manifest = []; mismatches = []
for route,label in sorted(links.items()):
    source = '<!doctype html>\n<html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+html.escape(label)+'</title><main><h1>'+html.escape(label)+'</h1><p>독립 KRDS 예제의 로컬 탐색 목적지입니다. 이 문서는 실제 서버, 로그인 또는 업무 API에 연결하지 않습니다.</p><p>경로: '+html.escape(route)+'</p><a href="/">예제 시작 화면</a></main></html>\n'
    data = source.encode()
    for host in ['apps/fixture-svelte/public','apps/storybook-svelte/public']:
        target = root/(host+route)/'index.html'
        if args.write: target.parent.mkdir(parents=True,exist_ok=True); target.write_bytes(data)
        actual = target.read_bytes() if target.exists() else None
        if actual != data: mismatches.append(str(target.relative_to(root)))
        manifest.append({'path':str(target.relative_to(root)),'route':route,'title':label,'bytes':len(actual or b''),'sha256':hashlib.sha256(actual or b'').hexdigest(),'matchesGenerator':actual==data})
output = root/'.superpowers/sdd/PLAN/t10-svelte-logs/local-destination-inventory.json'
output.write_text(json.dumps({'generator':str(Path(__file__).relative_to(root)),'generatorSha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'origin':'Independent local test HTML authored from shared semantic href/label fixture data; no upstream KRDS markup or renderer code copied','distribution':'Private fixture and Storybook public documents; excluded from public adapter package files','sources':[{'path':str(path.relative_to(root)),'sha256':hashlib.sha256(path.read_bytes()).hexdigest()} for path in [root/'catalog/full-catalog-scenarios.json',root/'catalog/full-catalog-stories.json']],'files':manifest,'mismatches':mismatches},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'routesPerHost':len(links),'files':len(manifest),'mismatches':mismatches},ensure_ascii=False))
if mismatches: raise SystemExit(1)
