<script lang="ts">
import {untrack} from 'svelte';import Catalog from '../../src/CatalogExamples.svelte';let {componentId,initial}:{componentId:string;initial:Record<string,any>}=$props();let snapshot=$state(untrack(()=>({...initial})));let events=$state<{name:string;detail:any}[]>([]);export function patch(next:Record<string,any>){snapshot={...snapshot,...next};}function emit(name:string,detail:any,next?:Record<string,any>){events=[...events,{name,detail}];if(next)patch(next);}
</script>
<Catalog {componentId} state={snapshot} {emit} {patch}/><output data-events>{JSON.stringify(events)}</output>
