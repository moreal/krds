import type { Meta, StoryObj } from 'storybook-framework-qwik';
import { PatternStory } from './story';
const meta={id:'krds-pattern-service-layout',title:'Patterns/service-layout',component:PatternStory,args:{patternId:'service-layout'}} satisfies Meta<typeof PatternStory>;
export default meta;
type Story=StoryObj<typeof PatternStory>;
export const Default:Story={name:'default',args:{variant:'default'}};
