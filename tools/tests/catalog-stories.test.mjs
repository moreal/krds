import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {selectOptions} from '../testing/selection.mjs';
import {selectCatalogStories,validateCatalogStoryIndex,inspectCatalogRenderer,selectStoryDist} from '../testing/catalog-stories.mjs';
const manifest=JSON.parse(await readFile(new URL('../../catalog/full-catalog-stories.json',import.meta.url),'utf8'));
test('catalog story selection is explicit344 distinct frozen states and never changes canonical default6',()=>{
 assert.equal(selectOptions(['--framework','vue'],'story').catalog,undefined);
 const options=selectOptions(['--catalog','--framework','vue'],'story');assert.equal(options.catalog,true);
 const selected=selectCatalogStories(manifest,options);assert.equal(selected.length,344);assert.equal(new Set(selected.map(item=>item.id)).size,344);assert.equal(new Set(selected.map(item=>item.componentId)).size,48);
 assert.equal(selectCatalogStories(manifest,{...options,component:'toast',caseId:'information'})[0].id,'krds-toast--information');
 assert.throws(()=>selectCatalogStories(manifest,{...options,component:'missing'}),/Zero required/);
 assert.throws(()=>selectCatalogStories(manifest,{...options,component:'toast',caseId:'missing'}),/Zero required/);
 assert.throws(()=>selectCatalogStories({cases:[]},options),/Zero required/);
 assert.throws(()=>selectCatalogStories({cases:[selected[0],selected[0]]},options),/Duplicate/);
 assert.throws(()=>selectCatalogStories({cases:[{...selected[0],id:'foreign--story'}]},options),/Frozen catalog ID/);
 for(const args of [['--catalog','--probe','--framework','vue'],['--case','information','--framework','vue'],['--catalog','--framework','solid-next']])assert.throws(()=>selectOptions(args,'story'));
});
test('required native story index must contain every exact story ID as a real story, not docs or aliases',()=>{
 const selected=selectCatalogStories(manifest,{component:'toast',caseId:'information'}),story=selected[0];
 const valid={entries:{[story.id]:{id:story.id,type:'story',importPath:'./src/stories/toast.stories.ts',title:'KRDS/toast',exportName:'Information'}}};
 assert.equal(validateCatalogStoryIndex(valid,selected).length,1);
 assert.throws(()=>validateCatalogStoryIndex({entries:{}},selected),/Missing required/);
 assert.throws(()=>validateCatalogStoryIndex({entries:{[story.id]:{...valid.entries[story.id],type:'docs'}}},selected),/real native story/);
 assert.throws(()=>validateCatalogStoryIndex({entries:{[story.id]:{...valid.entries[story.id],id:'other'}}},selected),/exact ID/);
});
test('declared consuming Storybook renderer rejects foreign renderer and absent native adapter',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'krds-story-renderer-'));await mkdir(join(directory,'.storybook'));
 try{
  const write=async dependencies=>{await writeFile(join(directory,'package.json'),JSON.stringify({name:'@unofficial-krds/storybook-vue',devDependencies:dependencies}));};
  await write({'@storybook/vue3-vite':'10.6.5','@unofficial-krds/vue':'workspace:^'});await writeFile(join(directory,'.storybook/main.ts'),"export default {framework:'@storybook/vue3-vite'};");
  assert.equal((await inspectCatalogRenderer(directory,'vue')).framework,'vue');
  await write({'@storybook/react-vite':'10.6.5'});await assert.rejects(inspectCatalogRenderer(directory,'vue'),/native renderer/);
  await write({'@storybook/vue3-vite':'10.6.5','@unofficial-krds/vue':'workspace:^','@storybook/react-vite':'10.6.5'});await assert.rejects(inspectCatalogRenderer(directory,'vue'),/Foreign renderer/);
 }finally{await rm(directory,{recursive:true,force:true});}
});

test('explicit immutable Storybook dist override is bounded to exactly one selected native framework',()=>{
 assert.equal(selectStoryDist('/workspace','react',['react']),'/workspace/apps/storybook-react/dist');
 assert.equal(selectStoryDist('/workspace','react',['react'],'/private/tmp/real-react-story-snapshot'),'/private/tmp/real-react-story-snapshot');
 assert.throws(()=>selectStoryDist('/workspace','react',['react','vue'],'/private/tmp/snapshot'),/exactly one/);
});
