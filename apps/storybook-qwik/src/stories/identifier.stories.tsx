import type { Meta,StoryObj } from 'storybook-framework-qwik';
import { CatalogStory } from '../catalog-story';
const meta={id:'krds-identifier',title:'KRDS/identifier',component:CatalogStory,args:{componentId:'identifier'}} satisfies Meta<typeof CatalogStory>;
export default meta;
type Story=StoryObj<typeof CatalogStory>;
export const Light:Story={name:"light",args:{caseId:"light"}};
export const Dark:Story={name:"dark",args:{caseId:"dark"}};
export const FooterPlacement:Story={name:"footer-placement",args:{caseId:"footer-placement"}};
