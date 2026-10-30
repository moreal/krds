import {expect} from '@playwright/test';
export const officialMastheadSentence='이 누리집은 대한민국 공식 전자정부 누리집입니다.';
export async function assertMastheadPolicy(page,fixture){
  const {initialState:state,host}=fixture;
  expect(typeof state.governmentService).toBe('boolean');
  expect(typeof host.specimenLabel).toBe('string');
  const notices=page.getByText(host.specimenLabel,{exact:true}).filter({visible:true});
  await expect(notices).not.toHaveCount(0);
  const component=page.locator('[data-krds-component="masthead"][data-krds-part="root"]');
  if(!state.governmentService){
    await expect(page.getByText(officialMastheadSentence,{exact:true})).toHaveCount(0);
    return component;
  }
  // A local simulation never verifies that this actual host is a government site.
  expect(host.authorizedGovernmentHost).toBe(false);
  await expect(component).toHaveCount(1);await expect(component).toBeVisible();await expect(component).toBeInViewport();await expect(component).toContainText(officialMastheadSentence);
  const text=component.getByText(officialMastheadSentence,{exact:true}).or(component.and(page.getByText(officialMastheadSentence,{exact:true})));await expect(text.filter({visible:true})).not.toHaveCount(0);
  const root=await component.elementHandle();let adjacent=false;
  try{
    for(const notice of await notices.all()){
      adjacent=await notice.evaluate((notice,root)=>{
        const parent=node=>node.assignedSlot??node.parentNode??node.host;
        const inside=(node,owner)=>{for(let current=node;current;current=parent(current))if(current===owner)return true;return false;};
        const sequence=[];
        function visit(node){
          if(node.nodeType===3&&node.textContent.trim()){
            const element=node.parentElement;if(!element||!element.getClientRects().length||['SCRIPT','STYLE'].includes(element.tagName))return;
            for(let current=element;current;current=parent(current))if(current.nodeType===1){const style=getComputedStyle(current);if(Number(style.opacity)===0||style.visibility!=='visible'||style.display==='none')return;if(current.getAttribute('data-krds-component')==='skip-link'||(current.getAttribute('role')==='status'&&current.getAttribute('aria-label')==='Fixture health'))return;}
            const kind=inside(node,root)?'masthead':inside(node,notice)?'notice':'other';if(sequence.at(-1)!==kind)sequence.push(kind);return;
          }
          const assigned=node.nodeType===1&&node.localName==='slot'?node.assignedNodes({flatten:true}):[];
          for(const child of assigned.length?assigned:(node.shadowRoot??node).childNodes??[])visit(child);
        }
        visit(document.body);
        const a=sequence.indexOf('masthead'),b=sequence.indexOf('notice');return a>=0&&b>=0&&Math.abs(a-b)===1;
      },root);
      if(adjacent)break;
    }
  }finally{await root.dispose();}
  expect(adjacent,'The exact nonofficial simulation notice must be adjacent in the composed reading order').toBe(true);
  return component;
}
