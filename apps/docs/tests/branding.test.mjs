import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';

const site = resolve(import.meta.dirname, '..');
const root = resolve(site, '../..');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const read = path => readFile(resolve(root, path));

test('branding is outlined, source-pinned and byte-reproducible at every output size', async () => {
  const manifest = JSON.parse(await read('apps/docs/branding/source.json'));
  const inventory = await read('compliance/distribution-provenance.json');
  for (const source of manifest.fonts) assert.equal(hash(await read(source.path)), source.sha256);
  const before = new Map();
  for (const record of manifest.outputs) {
    const bytes = await read(record.path); before.set(record.path, bytes);
    assert.equal(hash(bytes), record.sha256, record.path);
    if (record.path.endsWith('.svg')) {
      const svg = bytes.toString();
      assert.doesNotMatch(svg, /<(?:text|image|foreignObject|use)\b|(?:href|font-family|@font-face|url\()/i);
      assert.match(svg, /<path\b/);
      assert.doesNotMatch(svg, /#[0-9a-f]{6}/i, 'use monochrome black/white names');
    }
    if (record.path.endsWith('.png')) {
      assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
      assert.equal(bytes.readUInt32BE(16), record.width, record.path);
      assert.equal(bytes.readUInt32BE(20), record.height, record.path);
      if (record.background === 'transparent') {
        assert.equal(bytes[25], 6, 'RGBA PNG retains transparency');
        const {channels} = await sharp(bytes).stats();
        assert.equal(channels[3].min, 0); assert.equal(channels[3].max, 255);
      }
    }
    if (record.path.endsWith('.ico')) {
      assert.equal(bytes.readUInt16LE(2), 1); assert.equal(bytes.readUInt16LE(4), 3);
      for(let i=0;i<3;i++){const entry=6+i*16,size=[16,32,48][i],offset=bytes.readUInt32LE(entry+12);assert.equal(bytes[entry],size);assert.equal(bytes[entry+1],size);assert.equal(bytes.readUInt32BE(offset+16),size);assert.equal(bytes.readUInt32BE(offset+20),size);}
    }
  }
  for (let run = 0; run < 2; run++) {
    const result = spawnSync(process.execPath, ['scripts/generate-branding.mjs'], { cwd: site, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    for (const [path, bytes] of before) assert.deepEqual(await read(path), bytes, path);
    assert.deepEqual(JSON.parse(await read('apps/docs/branding/source.json')), manifest);
    assert.deepEqual(await read('compliance/distribution-provenance.json'), inventory);
  }
  assert.deepEqual(await read('apps/docs/public/mark.svg'), await read('apps/docs/public/local-assets/branding/favicon.svg'));
});
