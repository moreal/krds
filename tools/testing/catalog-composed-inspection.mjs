import {expect} from '@playwright/test';

// Return actual native nodes in rendered tree order. This is browser inspection,
// including slots and open native Shadow roots, with no UI renderer or wrappers.
export function composedElements(node){
  const result=[];
  function visit(current){
    if(current.nodeType===1)result.push(current);
    const slotted=current.nodeType===1&&current.localName==='slot'?current.assignedNodes({flatten:true}):[];
    const children=slotted.length?slotted:(current.shadowRoot??current).childNodes;
    for(const child of children??[])visit(child);
  }
  visit(node);return result;
}
export async function nativeComposedOrder(container,locators,{controlsOnly=false}={}){
  const nodes=await container.evaluateHandle(composedElements);
  const targets=[];for(const locator of locators){await expect(locator).toHaveCount(1);targets.push(await locator.elementHandle());}
  try{return await nodes.evaluate((elements,{targets,controlsOnly})=>{
    const ordered=controlsOnly?elements.filter(node=>['A','BUTTON','NAV'].includes(node.tagName)):elements;
    return targets.map(target=>ordered.indexOf(target));
  },{targets,controlsOnly});}finally{await nodes.dispose();for(const target of targets)await target.dispose();}
}
export async function lastComposedSubdivision(identifier,footer){
  const ancestor=await footer.elementHandle();
  try{return await identifier.evaluate((node,footer)=>{
    const parentOf=node=>node.assignedSlot??node.parentNode??node.host;
    for(let current=node;current;){
      const parent=parentOf(current);if(!parent)return false;
      if(parent.shadowRoot!==current){
        const significant=[...parent.childNodes].filter(child=>child.nodeType===1?!child.matches('script,style,link'):child.nodeType===3&&child.textContent.trim());
        if(significant.at(-1)!==current)return false;
      }
      if(parent===footer)return true;
      current=parent;
    }
    return false;
  },ancestor);}finally{await ancestor.dispose();}
}
