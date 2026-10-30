import type {Meta} from '@storybook/web-components-vite';
import {presentation,snapshot} from './presentation.js';
export default {id:'krds-pattern-form-errors',title:'KRDS/Patterns/form-errors',render:presentation} satisfies Meta;
export const Editing=snapshot('form-errors','editing');
export const Invalid=snapshot('form-errors','invalid');
export const Loading=snapshot('form-errors','loading');
export const Error=snapshot('form-errors','error');
export const Success=snapshot('form-errors','success');
