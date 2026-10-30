<script setup lang="ts">
import { shallowRef, watch } from 'vue';
import CatalogExamples from './CatalogExamples.vue';
import { catalogSeed } from './catalog-state';
const p=defineProps<{componentId:string;caseId:string}>();
const state=shallowRef(catalogSeed(p.componentId,p.caseId));
const materialize=()=>{const s=state.value;for(const record of s.files??[]){const material=(s.__host.fileFixtures??[]).find((x:any)=>x.id===(record.fileFixtureId??record.id)||x.name===record.file?.name)??record.file??record;record.file=new File([material.contents??'local fixture'],material.name??'example.txt',{type:material.type??'text/plain',lastModified:0});}};
materialize();watch(()=>[p.componentId,p.caseId],()=>{state.value=catalogSeed(p.componentId,p.caseId);materialize();});
function patch(next:Record<string,any>){state.value={...state.value,...next};}
function emit(name:string,detail:any,next?:Record<string,any>){if(next){next={...next};for(const key of ['value','checked','open','index','playing','expandedId','expandedIds','expanded','mobileOpen','openIds','selectedTopicId','activePanel'])if(state.value[key]===undefined)delete next[key];}if(next&&state.value.__host.acceptChanges!==false&&!(name==='openChange'&&detail.open===false&&state.value.__host.acceptClose===false))patch(next);}
</script>
<template><CatalogExamples :component-id="componentId" :state="state" :patch="patch" :emit="emit"/></template>
