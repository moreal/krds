import type { Meta, StoryObj } from 'storybook-framework-qwik';
import { PatternStory } from './story';
const meta={id:'krds-pattern-search-results',title:'Patterns/search-results',component:PatternStory,args:{patternId:'search-results'}} satisfies Meta<typeof PatternStory>;
export default meta;
type Story=StoryObj<typeof PatternStory>;
export const Success:Story={name:'success',args:{variant:'success'}};
export const Loading:Story={name:'loading',args:{variant:'loading'}};
export const Error:Story={name:'error',args:{variant:'error'}};
export const Empty:Story={name:'empty',args:{variant:'empty'}};
