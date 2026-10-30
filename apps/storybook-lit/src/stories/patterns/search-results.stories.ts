import type {Meta} from '@storybook/web-components-vite';
import {presentation,snapshot} from './presentation.js';
export default {id:'krds-pattern-search-results',title:'KRDS/Patterns/search-results',render:presentation} satisfies Meta;
export const Success=snapshot('search-results','success');
export const Loading=snapshot('search-results','loading');
export const Error=snapshot('search-results','error');
export const Empty=snapshot('search-results','empty');
