import { fullCatalogStoryCases, fullCatalogScenarios } from '@unofficial-krds/test-contracts';

export function catalogSeed(componentId: string, caseId: string) {
 const scenario = fullCatalogScenarios.find(item => item.componentId === componentId && item.caseId === caseId);
 const story = fullCatalogStoryCases.find(item => item.componentId === componentId && item.caseId === caseId);
 const source = scenario ?? story;
 if (!source) throw new TypeError(`Unknown catalog case ${componentId}/${caseId}`);
 const state = structuredClone('initialState' in source ? source.initialState : source.state) as Record<string, any>;
 state.__host = structuredClone(source.host);
 if(componentId==='checkbox'&&state.__host.children?.length){const eligible=state.__host.children.filter((item:any)=>!item.disabled);state.checked=eligible.every((item:any)=>item.defaultChecked??item.checked??false);state.indeterminate=eligible.some((item:any)=>item.defaultChecked??item.checked??false)&&!state.checked;delete state.defaultChecked;}
 if(!['radio-group','checkbox','switch','text-input','textarea','range-slider','quantity-toggle','file-upload'].includes(componentId)){
  for(const [key,defaultKey] of [['open','defaultOpen'],['selectedTopicId','defaultSelectedTopicId'],['expandedId','defaultExpandedId'],['expandedIds','defaultExpandedIds'],['openIds','defaultOpenIds'],['index','defaultIndex'],['playing','defaultPlaying'],['activePanel','defaultActivePanel'],['mobileOpen','defaultMobileOpen'],['expanded','defaultExpanded'],['stepId','defaultStepId']]){
   if(state[key]===undefined&&state[defaultKey]!==undefined){state[key]=state[defaultKey];delete state[defaultKey];}
  }
 }
 state.__environment = structuredClone(source.environment);
 return state;
}
export function serializable(value: any): any {
 if (value instanceof File) return {name:value.name,size:value.size,type:value.type,lastModified:value.lastModified};
 if (Array.isArray(value)) return value.map(serializable);
 if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([,v])=>v!==undefined).map(([k,v])=>[k,serializable(v)]));
 return value;
}
