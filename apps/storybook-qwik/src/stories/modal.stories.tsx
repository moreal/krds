import type {Meta,StoryObj} from 'storybook-framework-qwik';
import {PilotStory,type PilotStoryProps} from './pilots';
const meta={id:'krds-modal',title:'KRDS/modal',component:PilotStory,args:{component:'modal'}} satisfies Meta<PilotStoryProps>;
export default meta;
type Story=StoryObj<PilotStoryProps>;
export const Open:Story={args:{open:true}};
