import {test,expect} from 'vitest';
import {render,screen} from '@testing-library/vue';
import {defineComponent,h,shallowRef,nextTick} from 'vue';
import {fullCatalogScenarios} from '@unofficial-krds/test-contracts';
import CatalogExamples from '../../src/CatalogExamples.vue';
import {LocalSpeechDriver} from '../../src/local-speech-driver';
const settle=async()=>{await nextTick();await new Promise(resolve=>setTimeout(resolve,25));await nextTick();};
test('TTS host owns a real active driver and disposes its operation with only the permitted lifecycle Stop delta',async()=>{
 const source=fullCatalogScenarios.find(item=>item.componentId==='tts'&&item.caseId==='outcome-06')!;
 const state=shallowRef<Record<string,any>>({...structuredClone(source.initialState),__host:structuredClone(source.host)}),events:unknown[]=[];
 const patch=(next:Record<string,any>)=>state.value={...state.value,...next};
 render(defineComponent({setup:()=>()=>h(CatalogExamples,{componentId:'tts',state:state.value,emit:(name:string,detail:unknown,next?:Record<string,any>)=>{events.push({name,detail});if(next)patch(next);},patch})}));
 screen.getByRole('button',{name:'음성 안내 재생'}).click();await settle();
 expect(document.querySelector('[data-krds-host=speech-driver-active]')).toHaveTextContent('true');
 expect(document.querySelector('[data-krds-host=speech-driver-lifecycle]')).toHaveTextContent('playing');
 const before=[...events];patch({__host:{...state.value.__host,mounted:false}});await settle();
 expect(document.querySelector('[data-krds-host=speech-driver-active]')).toHaveTextContent('false');
 expect(document.querySelector('[data-krds-host=speech-driver-lifecycle]')).toHaveTextContent('disposed');
 expect(document.querySelector('[data-krds-host=speech-state]')).toHaveTextContent('idle');const delta=events.slice(before.length);expect(delta.length).toBeLessThanOrEqual(1);for(const event of delta)expect(event).toEqual({name:'request',detail:{action:'stop',summary:source.initialState.summary,locale:source.initialState.locale}});
});


test('the local speech operation remains pending while paused and is actually aborted and settled by disposal',async()=>{
 const driver=new LocalSpeechDriver();driver.play('Summary','ko-KR');const signal=driver.signal!;let settled=false;void driver.settled.then(()=>settled=true);
 expect(signal.aborted).toBe(false);expect(driver.snapshot.active).toBe(true);driver.pause();await Promise.resolve();expect(settled).toBe(false);expect(driver.snapshot.state).toBe('paused');expect(driver.snapshot.active).toBe(true);driver.resume();expect(driver.snapshot.state).toBe('playing');driver.dispose();await driver.settled;expect(signal.aborted).toBe(true);expect(settled).toBe(true);expect(driver.snapshot).toMatchObject({active:false,state:'idle',lifecycle:'disposed'});
});
