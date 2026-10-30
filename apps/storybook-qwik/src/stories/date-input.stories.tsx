import type {Meta,StoryObj} from 'storybook-framework-qwik';
import {PilotStory,type PilotStoryProps} from './pilots';
const meta={id:'krds-date-input',title:'KRDS/date-input',component:PilotStory,args:{component:'date-input'}} satisfies Meta<PilotStoryProps>;
export default meta;
type Story=StoryObj<PilotStoryProps>;
export const Invalid:Story={args:{invalid:true,errorMessage:'YYYY-MM-DD 형식의 올바른 날짜를 입력하세요'}};
