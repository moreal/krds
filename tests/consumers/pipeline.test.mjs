import {test} from 'node:test';
import assert from 'node:assert/strict';
import {gzipSync} from 'node:zlib';
import {unpack,inspect} from '../../tools/inspect-tarballs.mjs';
import {internalRange} from './lib.mjs';
function archive(name,type='0',data='payload') {const header=Buffer.alloc(512);header.write(name,0);header.write('0000644\0',100);header.write('0000000\0',108);header.write('0000000\0',116);header.write(data.length.toString(8).padStart(11,'0')+'\0',124);header.write('00000000000\0',136);header.fill(32,148,156);header.write(type,156);header.write('ustar\0',257);header.write([...header].reduce((sum,byte)=>sum+byte,0).toString(8).padStart(6,'0')+'\0 ',148);return gzipSync(Buffer.concat([header,Buffer.from(data),Buffer.alloc(512-data.length),Buffer.alloc(1024)]));}
test('packed internal ranges cannot hide a mismatched candidate with consumer overrides',()=>{assert.equal(internalRange('0.0.0','^0.0.0'),true);assert.equal(internalRange('0.0.1','^0.0.0'),false);assert.equal(internalRange('0.0.0-next.0','^0.0.0'),false);assert.equal(internalRange('0.0.0-next.0','^0.0.0-next.0'),true);assert.equal(internalRange('0.0.0-next.1','^0.0.0-next.0'),true);assert.equal(internalRange('0.0.0','workspace:^'),false);});
test('actual tar parser rejects extraction escapes and executable symlinks',()=>{assert.throws(()=>unpack(archive('package/../escape')),/Unsafe tar path/u);assert.throws(()=>unpack(archive('package/link','2')),/Unsupported tar member/u);assert.equal(unpack(archive('package/LICENSE.md')).get('LICENSE.md').toString(),'payload');});
test('source drift rejects previous evidence before inspecting any tarballs',async()=>{await assert.rejects(inspect({sourceFingerprint:'stale',packages:[]}),/Stale|Missing|Incomplete/u);});

test('debug-only inventory cannot satisfy final candidate verification',async()=>{await assert.rejects(inspect({debugOnly:true,packages:[]}),/Debug inventories cannot satisfy final artifact gates/u);});
