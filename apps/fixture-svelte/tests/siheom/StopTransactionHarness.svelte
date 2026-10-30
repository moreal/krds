<script lang="ts">
import TutorialExample from '../../src/TutorialExample.svelte';
let snapshot=$state<Record<string,unknown>>({running:true,open:false,activePanel:'help',activeTaskId:'task',activeStepId:'one',startActionId:'fix2-start',fallbackFocusId:'fix2-fallback',tasks:[{id:'task',title:'Task',steps:[{id:'one',title:'One',targetId:'fix2-target',instruction:'Do one'}]}],__host:{startActionPresent:false}});
function patch(next:Record<string,unknown>){snapshot={...snapshot,...next};}
function emit(_name:string,_detail:unknown,next?:Record<string,unknown>){if(next)patch(next);}
</script>
<TutorialExample componentId="tutorial-panel" state={snapshot} {emit} {patch}/><button id="fix2-fallback" type="button">Fallback</button>
