"""Refresh only the current npm graph from the sole Yarn lock and original cache bytes.
Retained records and historical manifests/licenses are never rewritten or deleted.
"""
from pathlib import Path
import hashlib, json, re, zipfile
from datetime import datetime, timezone
root = Path(__file__).resolve().parents[1]
def digest(data): return hashlib.sha256(data).hexdigest()
def write(path, data):
    target = root / path
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.exists() and target.read_bytes() != data:
        raise RuntimeError(f'Refusing to replace preserved original {path}')
    if not target.exists(): target.write_bytes(data)
lock = (root / 'yarn.lock').read_bytes()
resolutions, conditions, current = set(), {}, None
for line in lock.decode().splitlines():
    if line and not line.startswith(' '): current = None
    if line.startswith('  resolution: '):
        value = json.loads(line.split(': ', 1)[1])
        current = value.split('@virtual:', 1)[0] + '@npm:' + value.rsplit('#npm:', 1)[1] if '#npm:' in value else value
        if '@npm:' in current: resolutions.add(current)
    elif current and line.startswith('  conditions: '): conditions[current] = line.split(': ', 1)[1].strip('"')
path = root / 'compliance/provenance-dependencies.json'
previous = json.loads(path.read_text())
records = {key: value for key, value in previous['packages'].items() if value['name'] + '@npm:' + value['version'] in resolutions}
needed = resolutions - {value['name'] + '@npm:' + value['version'] for value in records.values()}
# Read unmodified originals directly from Yarn's checksum-protected cache.
for cache in sorted((root / '.yarn/cache').glob('*.zip')):
    with zipfile.ZipFile(cache) as archive:
        manifests = [name for name in archive.namelist() if re.fullmatch(r'node_modules/(?:@[^/]+/)?[^/]+/package.json', name)]
        if len(manifests) != 1: continue
        raw = archive.read(manifests[0]); manifest = json.loads(raw)
        name, version = manifest.get('name'), manifest.get('version')
        resolution = f'{name}@npm:{version}'
        if resolution not in needed: continue
        stem = re.sub(r'[^A-Za-z0-9.-]', '_', f'{name}_{version}')
        manifest_path = f'compliance/provenance-dependency-manifests/{stem}.json'
        write(manifest_path, raw)
        prefix = manifests[0][:-len('package.json')]
        documents = []
        for entry in archive.namelist():
            if not entry.startswith(prefix): continue
            relative = entry[len(prefix):]
            if '/' in relative or not re.match(r'^(?:licen[cs]e|copying|notice|copyright)(?:$|[.-])', relative, re.I): continue
            if entry.endswith('/'): continue
            data = archive.read(entry); destination = f'LICENSES/dependencies/{stem}/{relative}'
            write(destination, data); documents.append({'localPath': destination, 'sha256': digest(data)})
        records[f'{name}@{version}'] = {'name': name, 'version': version, 'licenseMetadata': manifest.get('license'), 'manifestPath': manifest_path, 'manifestSha256': digest(raw), 'licenseDocuments': documents, 'cacheFile': cache.name, 'cacheSha256': digest(cache.read_bytes())}
        needed.remove(resolution)
notes = {row['resolution']: row for row in previous['unfetchedResolutionNotes']}
updated = {**previous, 'lockfileSha256': digest(lock), 'lockResolutionCount': len(resolutions), 'packages': dict(sorted(records.items())), 'missingManifests': [value.rsplit('@npm:', 1) for value in sorted(needed)], 'unfetchedResolutionNotes': [notes.get(value, {'resolution': value, 'conditions': conditions.get(value), 'rightsStatus': 'unresolved', 'distributedIn': [], 'note': 'Not fetched for this host; exact license metadata/terms not asserted. Resolve original rights evidence before any copying or bundling.'}) for value in sorted(needed)]}
if previous['lockfileSha256'] != digest(lock) or 'lastRefresh' not in previous:
    updated['lastRefresh'] = {'observedAt': datetime.now(timezone.utc).isoformat(), 'lockfileSha256': digest(lock), 'method': 'Current npm graph rebound to original local Yarn cache manifests and license bytes; original retrieval records retained.'}
path.write_text(json.dumps(updated, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'npmResolutions': len(resolutions), 'cachedOriginalManifests': len(records), 'unfetched': len(needed), 'addedCurrentRecords': sorted(set(records) - set(previous['packages'])), 'removedCurrentRecords': sorted(set(previous['packages']) - set(records)), 'lockfileSha256': digest(lock)}, indent=2))
