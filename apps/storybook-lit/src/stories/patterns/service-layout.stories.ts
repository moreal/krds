import type {Meta} from '@storybook/web-components-vite';
import {presentation,snapshot} from './presentation.js';
export default {id:'krds-pattern-service-layout',title:'KRDS/Patterns/service-layout',render:presentation} satisfies Meta;
export const Default=snapshot('service-layout','default');
