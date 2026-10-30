import type { Meta,StoryObj } from 'storybook-framework-qwik';
import { CatalogStory } from '../catalog-story';
const meta={id:'krds-masthead',title:'KRDS/masthead',component:CatalogStory,args:{componentId:'masthead'}} satisfies Meta<typeof CatalogStory>;
export default meta;
type Story=StoryObj<typeof CatalogStory>;
export const DefaultSpecimen:Story={name:"default-specimen",args:{caseId:"default-specimen"}};
export const NarrowZoom:Story={name:"narrow-zoom",args:{caseId:"narrow-zoom"}};
export const PageOrder:Story={name:"page-order",args:{caseId:"page-order"}};
