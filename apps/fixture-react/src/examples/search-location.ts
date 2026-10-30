import {createPatternState,searchResources,type Category} from '@unofficial-krds/test-contracts/patterns';
/** Browser-location normalization belongs to the fixture, never the pure model. */
export function searchLocation(search:string,caseId:string) {
 const base=createPatternState('search-results',caseId);
 const params=new URLSearchParams(search);
 const query=params.get('query')??'';
 const category=(['all','guide','example','reference'].includes(params.get('category')??'')?params.get('category'):'all') as Category;
 const rawPage=params.get('page');
 const page=rawPage!==null&&/^\d+$/.test(rawPage)&&Number.isSafeInteger(Number(rawPage))&&Number(rawPage)>0?Number(rawPage):base.page;
 return {...base,query,appliedQuery:query,category,...searchResources({query,category,page})};
}
