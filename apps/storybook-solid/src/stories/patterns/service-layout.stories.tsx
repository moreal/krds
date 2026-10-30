import type {Meta,StoryObj} from 'storybook-solidjs-vite';
import {getPresentation} from '@unofficial-krds/test-contracts/patterns';
import {StoryPresentation} from './presentation';
const meta={id:'krds-pattern-service-layout',title:'KRDS patterns/service-layout',component:StoryPresentation,parameters:{layout:'fullscreen'},render:(args)=><StoryPresentation {...args}/>} satisfies Meta<typeof StoryPresentation>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={args:{state:getPresentation('service-layout','default').state}};
