import {PatternPresentation} from '../../../../../packages/react/examples/patterns/PatternPresentation';
import {consentContent,demoIdentity,fieldIds,formCategories,layoutNavigation,layoutSections,resourceCategories,getPresentation,type PatternId} from '@unofficial-krds/test-contracts/patterns';
const content={consentContent,demoIdentity,fieldIds,formCategories,layoutNavigation,layoutSections,resourceCategories};
/** Inject a cloned snapshot. Stories have no local driver or integration play. */
export function snapshot(patternId:PatternId,variant:string) {return {args:{state:getPresentation(patternId,variant).state,content},render:PatternPresentation};}
