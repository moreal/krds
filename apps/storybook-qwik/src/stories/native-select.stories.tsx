import type {Meta,StoryObj} from 'storybook-framework-qwik';
import {PilotStory,type PilotStoryProps} from './pilots';
const meta={id:'krds-native-select',title:'KRDS/native-select',component:PilotStory,args:{component:'native-select'}} satisfies Meta<PilotStoryProps>;
export default meta;
type Story=StoryObj<PilotStoryProps>;
export const Controlled:Story={args:{value:'seoul'}};
