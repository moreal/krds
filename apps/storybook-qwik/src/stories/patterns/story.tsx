import { component$ } from '@builder.io/qwik';
import { getPresentation, demoIdentity, formCategories, resourceCategories, consentContent, layoutNavigation, layoutSections, type PatternId } from '@unofficial-krds/test-contracts/patterns';
import { PatternView } from '../../../../../packages/qwik/examples/patterns/view';
/** Stories clone only local presentation JSON. No driver, bridge, request or play. */
export const PatternStory=component$<{patternId:PatternId;variant:string}>((p)=>{
 const snapshot=getPresentation(p.patternId,p.variant);
 const content=JSON.parse(JSON.stringify({identity:demoIdentity,formCategories,resourceCategories,consent:consentContent,navigation:layoutNavigation,sections:layoutSections}));
 return <PatternView state={snapshot.state} content={content} caseId="presentation" onAction$={()=>{}}/>;
});
