import {test,expect} from 'vitest';
import {render} from '@testing-library/vue';
import {defineComponent,h,shallowRef,nextTick} from 'vue';
import {fullCatalogScenarios} from '@unofficial-krds/test-contracts';
import TutorialExample from '../../src/TutorialExample.vue';
const settle=async()=>{await nextTick();await new Promise(resolve=>setTimeout(resolve,30));await nextTick();};
for(const [caseId,linked] of [['outcome-03',false],['outcome-04',true]] as const)test(`real Coach fixture uses ${linked?'linked Stop':'standalone openChange'} authority without the other protocol`,async()=>{
 const source=fullCatalogScenarios.find(item=>item.componentId==='coach-mark'&&item.caseId===caseId)!;
 const state=shallowRef<Record<string,any>>({...structuredClone(source.initialState),__host:structuredClone(source.host)}),events:{name:string;detail:unknown}[]=[];
 const patch=(next:Record<string,any>)=>state.value={...state.value,...next};
 render(defineComponent({setup:()=>()=>h(TutorialExample,{componentId:'coach-mark',state:state.value,emit:(name:string,detail:unknown,next?:Record<string,any>)=>{events.push({name,detail});if(next)patch(next);},patch})}));
 await settle();expect(document.querySelector('[data-krds-component=tutorial-panel][data-krds-part=root]')!==null).toBe(linked);
 const stop=document.querySelector<HTMLButtonElement>('[data-krds-component=coach-mark][data-krds-part=stop]')!;stop.focus();stop.click();await settle();
 expect(document.querySelector('[data-krds-component=coach-mark][data-krds-part=popover]')).toBeNull();
 if(linked)expect(events).toEqual([{name:'stop',detail:{reason:'stop',running:false,returnTo:{panel:'tutorial',open:true,startActionId:state.value.startActionId}}}]);
 else expect(events).toEqual([{name:'openChange',detail:{open:false}}]);
});
