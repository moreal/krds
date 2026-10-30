import assert from 'node:assert/strict';
export const stableTargets=['react','solid','svelte','vue','lit','qwik','angular'];
export const previewTargets=['solid-next'];
const expectedTargets=[...stableTargets,...previewTargets];
function exactIds(actual,expected,label){
 assert.ok(Array.isArray(actual)&&actual.length>0,`${label} must be a nonempty matrix`);
 assert.equal(new Set(actual).size,actual.length,`${label} contains duplicate targets`);
 assert.deepEqual([...actual].sort(),[...expected].sort(),`${label} must contain every expected target exactly once`);
}
export function validateCompatibilityMatrix(matrix,toolchain){
 exactIds(matrix?.stableTargets,stableTargets,'Stable matrix');exactIds(matrix?.previewTargets,previewTargets,'Preview matrix');
 exactIds(matrix?.frameworks?.map(row=>row.id),expectedTargets,'Framework matrix');
 for(const row of matrix.frameworks){
  assert.equal(row.supportChannel,stableTargets.includes(row.id)?'stable-target':'preview-target',`Incorrect target channel: ${row.id}`);
  for(const [label,value]of [['runtime/compiler pins',row.pins],['public peers',row.intendedPublicPeerDependencies],['toolchain pins',toolchain.environments?.[row.toolchain]?.pins]])assert.ok(value&&Object.keys(value).length>0,`Missing ${label} for ${row.id}`);
 }
}
export function expectedCompatibilityChecks(framework,toolchain,{metadataOnly=false}={}){
 return [...Object.keys(framework.intendedPublicPeerDependencies).map(name=>`peer-runtime-copy:${name}`),...Object.keys(framework.pins).map(name=>`compiler-runtime-resolution:${name}`),...Object.keys(toolchain.environments[framework.toolchain].pins).map(name=>`toolchain-resolution:${name}`),...(metadataOnly?[]:['package-types','package-build','fixture-types','fixture-build'].map(kind=>`${kind}:`))].sort();
}
export function validateCompatibilityRows(rows,matrix,toolchain,options){
 validateCompatibilityMatrix(matrix,toolchain);exactIds(rows.map(row=>row.framework),expectedTargets,'Executed framework rows');
 for(const framework of matrix.frameworks){const row=rows.find(row=>row.framework===framework.id);assert.ok(Array.isArray(row.checks)&&row.checks.length>0,`Empty executed checks: ${framework.id}`);const keys=row.checks.map(check=>`${check.kind}:${check.name??''}`);assert.equal(new Set(keys).size,keys.length,`Duplicate executed checks: ${framework.id}`);assert.deepEqual(keys.sort(),expectedCompatibilityChecks(framework,toolchain,options),`Incomplete executed checks: ${framework.id}`);}
}
