import {fullCatalogScenarios,fullCatalogStoryCases} from '@unofficial-krds/test-contracts';
export function catalogSeed(componentId:string,caseId:string):Record<string,unknown>{
 const scenario=fullCatalogScenarios.find(item=>item.componentId===componentId&&item.caseId===caseId);
 const story=fullCatalogStoryCases.find(item=>item.componentId===componentId&&item.caseId===caseId);const source=scenario??story;
 if(!source)throw new TypeError('Unknown catalog fixture '+componentId+'/'+caseId);
 const state=structuredClone('initialState' in source?source.initialState:source.state) as Record<string,any>;state.__host=structuredClone(source.host);state.__environment=structuredClone(source.environment);
 for(const [key,defaultKey] of [['open','defaultOpen'],['selectedTopicId','defaultSelectedTopicId'],['expandedId','defaultExpandedId'],['expandedIds','defaultExpandedIds'],['openIds','defaultOpenIds'],['index','defaultIndex'],['playing','defaultPlaying'],['activePanel','defaultActivePanel'],['mobileOpen','defaultMobileOpen'],['expanded','defaultExpanded'],['stepId','defaultStepId']])if(state[key]===undefined&&state[defaultKey]!==undefined){state[key]=state[defaultKey];delete state[defaultKey];}
 if(componentId==='checkbox'&&state.__host.children?.length){const eligible=state.__host.children.filter((child:any)=>!child.disabled);state.checked=eligible.every((child:any)=>child.defaultChecked??child.checked??false);state.indeterminate=eligible.some((child:any)=>child.defaultChecked??child.checked??false)&&!state.checked;delete state.defaultChecked;}
 return state;
}
