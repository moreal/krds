import type {Meta,StoryObj} from 'storybook-framework-qwik';
import {PilotStory,type PilotStoryProps} from './pilots';
const meta={id:'krds-tabs',title:'KRDS/tabs',component:PilotStory,args:{component:'tabs'}} satisfies Meta<PilotStoryProps>;
export default meta;
type Story=StoryObj<PilotStoryProps>;
export const Manual:Story={args:{}};
