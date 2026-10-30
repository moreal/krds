<script lang="ts">
import Catalog from '../../src/CatalogExamples.svelte';let snapshot=$state<Record<string,any>>({label:'Local summary',summary:'Apply and save.',locale:'ko-KR',state:'idle',__host:{mounted:true}});let events=$state<{name:string;detail:any}[]>([]);export function patch(next:Record<string,any>){snapshot={...snapshot,...next};}function emit(name:string,detail:any,next?:Record<string,any>){events=[...events,{name,detail}];if(next)patch(next);}
</script>
<Catalog componentId="tts" state={snapshot} {emit} {patch}/><output data-events>{JSON.stringify(events)}</output>
