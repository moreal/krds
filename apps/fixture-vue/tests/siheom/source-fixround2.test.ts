import {test,expect} from 'vitest';
import {render,screen} from '@testing-library/vue';
import {defineComponent,h,nextTick} from 'vue';
import {MainMenu,Tooltip,InPageNavigation} from '@unofficial-krds/vue';
import '@unofficial-krds/styles/reset.css';
import '@unofficial-krds/styles/all.css';
const settle=async()=>{await nextTick();await new Promise(resolve=>setTimeout(resolve,25));await nextTick();};

test('R1 progressive MainMenu exposes at most three levels and retains deep destination plus real back focus',async()=>{
 const items=[{id:'a',label:'A',children:[{id:'b',label:'B',children:[{id:'c',label:'C',children:[{id:'d',label:'D',href:'/local/deep-destination'}]}]}]}];
 render(MainMenu,{props:{items}});
 const nav=screen.getByRole('navigation',{name:'메인 메뉴'});
 for(const name of ['A','B','C']){const trigger=screen.getByRole('button',{name});trigger.focus();trigger.click();await settle();}
 expect(screen.getByRole('link',{name:'D'}).getAttribute('href')).toBe('/local/deep-destination');
 const maxDepth=Math.max(...[...nav.querySelectorAll('a,button')].filter(node=>(node as HTMLElement).getClientRects().length).map(node=>{let depth=0;for(let parent=node.parentElement;parent&&parent!==nav;parent=parent.parentElement)if(parent.tagName==='UL')depth++;return depth;}));
 expect(maxDepth).toBeLessThanOrEqual(3);
 expect(document.activeElement).toBe(screen.getByRole('button',{name:'C'}));
 screen.getByRole('button',{name:'이전 메뉴'}).click();await settle();
 expect(screen.getByRole('button',{name:'A'})).toBeVisible();
 expect(document.activeElement).toBe(screen.getByRole('button',{name:'C'}));
});

async function escapedTooltip(){
 render(defineComponent({setup:()=>()=>h('div',[h(Tooltip,{text:'Supplement',triggerLabel:'Help',triggerId:'review-tooltip',textId:'review-tooltip-text'}),h('button',{id:'outside'},'Outside')])}));
 const trigger=screen.getByRole('button',{name:'Help'}),root=trigger.parentElement!;
 const pointer=(type:string)=>root.dispatchEvent(new PointerEvent(type,{pointerType:'mouse'}));
 pointer('pointerenter');await settle();expect(screen.getByRole('tooltip')).toBeVisible();
 document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));await settle();
 expect(trigger).toHaveFocus();expect(screen.queryByRole('tooltip')).toBeNull();
 return{trigger,pointer};
}
test('R2 pointer leave and reentry alone never clear accepted Escape suppression',async()=>{
 const {pointer}=await escapedTooltip();pointer('pointerleave');pointer('pointerenter');await settle();expect(screen.queryByRole('tooltip')).toBeNull();
});
test('R2 Tab departure does not let pointer reset suppression before actual focus reentry',async()=>{
 const {trigger,pointer}=await escapedTooltip();
 trigger.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',bubbles:true,cancelable:true}));screen.getByRole('button',{name:'Outside'}).focus();await settle();
 pointer('pointerenter');await settle();expect(screen.queryByRole('tooltip')).toBeNull();
 trigger.focus();await settle();expect(screen.getByRole('tooltip')).toBeVisible();
});

test('R3 third-level outline has a genuine current anchor and keyboard activation focuses its actual target',async()=>{
 const events:unknown[]=[];
 render(defineComponent({setup:()=>()=>h('div',[h(InPageNavigation,{sections:[{id:'one',label:'One',children:[{id:'two',label:'Two',children:[{id:'three',label:'Three'}]}]}],activeId:'three',onActiveChange:(event:unknown)=>events.push(event)}),h('section',{id:'one',tabindex:-1},'First section'),h('section',{id:'two',tabindex:-1},'Second section'),h('section',{id:'three',tabindex:-1},'Third section')])}));
 const anchor=screen.getByRole('link',{name:'Three'});expect(anchor.getAttribute('href')).toBe('#three');expect(anchor.getAttribute('aria-current')).toBe('location');
 anchor.focus();anchor.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));await settle();
 expect(document.activeElement).toBe(document.getElementById('three'));expect(events).toEqual([]);
});

test('R3 third-level keyboard navigation commits an uncontrolled location and emits one actual activation',async()=>{
 const events:unknown[]=[];
 render(defineComponent({setup:()=>()=>h('div',[h(InPageNavigation,{sections:[{id:'alpha',label:'Alpha',children:[{id:'beta',label:'Beta',children:[{id:'gamma',label:'Gamma'}]}]}],onActiveChange:(event:unknown)=>events.push(event)}),h('section',{id:'alpha',tabindex:-1},'Alpha section'),h('section',{id:'beta',tabindex:-1},'Beta section'),h('section',{id:'gamma',tabindex:-1},'Gamma section')])}));
 const anchor=screen.getByRole('link',{name:'Gamma'});anchor.focus();anchor.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));await settle();
 expect(anchor.getAttribute('aria-current')).toBe('location');expect(document.activeElement).toBe(document.getElementById('gamma'));expect(events).toEqual([{id:'gamma',reason:'activation'}]);
});

test('R1 delayed accepted Back restores the replaced trigger while rejected Back keeps actual focus',async()=>{
 const events:unknown[]=[];
 const items=[{id:'a',label:'A',children:[{id:'b',label:'B',children:[{id:'c',label:'C',children:[{id:'d',label:'D',href:'/local/deep-destination'}]}]}]}];
 const view=render(MainMenu,{props:{items,expandedId:'c',onExpandedChange:(event:unknown)=>events.push(event)}});
 const back=screen.getByRole('button',{name:'이전 메뉴'});back.focus();back.click();await settle();
 expect(back).toHaveFocus();expect(events).toEqual([{id:'b'}]);
 await view.rerender({expandedId:'b'});await settle();expect(screen.getByRole('button',{name:'C'})).toHaveFocus();
});

test('R1 delayed accepted deep Escape returns to the actual top-level trigger',async()=>{
 const items=[{id:'a',label:'A',children:[{id:'b',label:'B',children:[{id:'c',label:'C',children:[{id:'d',label:'D',href:'/local/deep-destination'}]}]}]}];
 const events:unknown[]=[];const view=render(MainMenu,{props:{items,expandedId:'c',onExpandedChange:(event:unknown)=>events.push(event)}});
 const trigger=screen.getByRole('button',{name:'C'});trigger.focus();trigger.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));await settle();
 expect(trigger).toHaveFocus();expect(events).toEqual([{id:null}]);await view.rerender({expandedId:null});await settle();expect(screen.getByRole('button',{name:'A'})).toHaveFocus();
});
