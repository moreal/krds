import type {Meta,StoryObj} from 'storybook-framework-qwik';
import {PilotStory,type PilotStoryProps} from './pilots';
const meta={id:'krds-calendar',title:'KRDS/calendar',component:PilotStory,args:{component:'calendar'}} satisfies Meta<PilotStoryProps>;
export default meta;
type Story=StoryObj<PilotStoryProps>;
export const SelectedRange:Story={args:{value:{start:'2024-02-12',end:'2024-02-18'}}};
