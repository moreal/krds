import {component$}from '@builder.io/qwik';
import {CatalogStory}from './full-catalog-fixture';
/** Request-time production SSR of the same explicit native public compositions. */
export const CatalogProduction=component$<{componentId:string;caseId:string}>(props=><main><h1>Qwik production catalog resume</h1><CatalogStory componentId={props.componentId} caseId={props.caseId}/></main>);
