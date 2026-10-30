import type {Meta,StoryObj} from '@storybook/react-vite';
import {PatternPresentation} from '../../../../../packages/react/examples/patterns/PatternPresentation';
import {snapshot} from './PatternStories';
const meta={title:'KRDS Pattern/Service Layout',component:PatternPresentation} satisfies Meta<typeof PatternPresentation>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story=snapshot('service-layout','default');
