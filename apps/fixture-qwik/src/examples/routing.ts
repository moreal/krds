const patternIds=['form-errors','search-results','consent-confirmation','service-layout'];
/** Exact fixture routes; nested/near-match paths do not receive the service host. */
export function patternRouteForUrl(url:string){
 const u=new URL(url,'http://localhost');
 const patternId=patternIds.find(id=>u.pathname===`/examples/${id}`);
 return patternId?{patternId,caseId:u.searchParams.get('case')??'',search:u.search}:null;
}
