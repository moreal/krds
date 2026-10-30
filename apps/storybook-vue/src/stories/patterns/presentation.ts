import {demoIdentity,formCategories,resourceCategories,consentContent,layoutNavigation,layoutSections,type PatternState,type LayoutId} from '@unofficial-krds/test-contracts/patterns';
import type {Presentation} from '../../../../../packages/vue/examples/patterns/presentation';

export const identity={...demoIdentity};
export function mapPresentation(state:PatternState,caseId:string):Presentation {
  const busy=state.phase==='loading';
  if(state.patternId==='form-errors')return {kind:'form',busy,error:state.error,values:{...state.values},errors:state.errors.map(x=>({...x})),receipt:state.receipt?{id:state.receipt.id,title:state.receipt.title}:null,categories:formCategories.map(x=>({...x}))};
  if(state.patternId==='search-results')return {kind:'search',busy,error:state.error,ready:state.phase==='success',query:state.query,appliedQuery:state.appliedQuery,category:state.category,total:state.total,page:state.page,pageCount:state.pageCount,items:state.items.map(x=>({...x})),categories:resourceCategories.map(x=>({...x}))};
  if(state.patternId==='consent-confirmation')return {kind:'consent',busy,error:state.error,invalid:state.phase==='invalid',open:state.modalOpen,requiredChoice:state.requiredChoice,optionalChoice:state.optionalChoice,receipt:state.receipt?{id:state.receipt.id,optionalChoice:state.receipt.optionalChoice}:null,groups:consentContent.map(x=>({id:x.id,title:x.title,paragraphs:[...x.paragraphs]}))};
  const href=(section:LayoutId)=>`/examples/service-layout?${new URLSearchParams({case:caseId,section})}`;
  return {kind:'layout',currentId:state.currentId,expandedIds:[...state.expandedIds],mobileOpen:state.mobileOpen,title:layoutSections[state.currentId].title,body:layoutSections[state.currentId].body,logo:{src:'/local-assets/specimen-logo.svg',alt:demoIdentity.name},homeHref:href('overview'),privacyHref:href('privacy'),helpHref:href('accessibility'),navigation:layoutNavigation.map(group=>({...group,children:group.children?.map(item=>({...item,href:href(item.id as LayoutId)}))}))};
}
