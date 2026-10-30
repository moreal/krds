import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Pilots from './Pilots.vue';
const meta={title:'KRDS/Button',component:Pilots,args:{component:'button'}} satisfies Meta<typeof Pilots>;
export default meta;
export const Disabled:StoryObj<typeof meta>={};
