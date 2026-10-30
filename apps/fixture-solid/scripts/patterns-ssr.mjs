import {createServer} from 'vite';
import solid from 'vite-plugin-solid';
import assert from 'node:assert/strict';
import {presentationCases} from '@unofficial-krds/test-contracts/patterns';
console.log('SSR_PUBLIC_ENTRY',import.meta.resolve('@unofficial-krds/solid'),'NODE',process.version);
const server=await createServer({configFile:false,plugins:[solid({ssr:true,hot:false})],server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try {const {renderPresentationSnapshot}=await server.ssrLoadModule('/src/examples/ssr-entry.tsx');for(const item of presentationCases){const html=renderPresentationSnapshot(item.patternId,item.variant);assert.match(html,item.patternId==='service-layout'?/<header/:/<main/);if(item.patternId==='form-errors')assert.match(html,/<form/);if(item.patternId==='search-results')assert.match(html,/example-search-query/);if(item.patternId==='consent-confirmation')assert.match(html,/type="radio"/);console.log(`PASS public-native-SSR ${item.id} ${Buffer.byteLength(html)} bytes`);}}finally{await server.close();}
