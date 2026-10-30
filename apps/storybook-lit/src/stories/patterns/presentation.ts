import {html} from 'lit';
import { getPresentation, fieldIds, demoIdentity, formCategories, resourceCategories, consentContent, layoutNavigation, layoutSections, type PatternId } from '@unofficial-krds/test-contracts/patterns';
import {registerPatternPresentation} from '../../../../../packages/lit/examples/patterns/presentation.js';
import type {PatternView} from '../../../../../packages/lit/examples/patterns/types.js';
registerPatternPresentation(customElements);
const content={fieldIds,demoIdentity,formCategories,resourceCategories,consentContent,layoutNavigation,layoutSections};
export const snapshot=(id:PatternId,variant:string)=>({args:{state:getPresentation(id,variant).state}});
export const presentation=(args:Record<string,unknown>)=>html`<krds-pattern-presentation .state=${structuredClone(args.state as PatternView)} .content=${content} .onAction=${()=>{}}></krds-pattern-presentation>`;
