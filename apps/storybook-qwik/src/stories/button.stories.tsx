import type {Meta,StoryObj} from 'storybook-framework-qwik';
import {PilotStory,type PilotStoryProps} from './pilots';
const meta={id:'krds-button',title:'KRDS/button',component:PilotStory,args:{component:'button'}} satisfies Meta<PilotStoryProps>;
export default meta;
type Story=StoryObj<PilotStoryProps>;
export const Disabled:Story={args:{disabled:true}};
