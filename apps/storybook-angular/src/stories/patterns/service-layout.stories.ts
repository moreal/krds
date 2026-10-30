import {moduleMetadata,type Meta,type StoryObj} from '@storybook/angular';
import {getPresentation} from '@unofficial-krds/test-contracts/patterns';
import {PatternPresentation} from '../../../../../packages/angular/examples/patterns/presentation';
import {content,urls} from './presentation-content';
const meta:Meta<PatternPresentation>={id:'krds-pattern-service-layout',title:'KRDS patterns/service-layout',decorators:[moduleMetadata({imports:[PatternPresentation]})],render:args=>({props:{...args,content,urls},template:`<krds-pattern-presentation [view]="view" [content]="content" [urls]="urls"/>`})};
export default meta;
type Story=StoryObj<PatternPresentation>;
export const Default:Story={args:{view:structuredClone(getPresentation('service-layout','default').state)}};
