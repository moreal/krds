import type {Meta} from '@storybook/web-components-vite';
import {presentation,snapshot} from './presentation.js';
export default {id:'krds-pattern-consent-confirmation',title:'KRDS/Patterns/consent-confirmation',render:presentation} satisfies Meta;
export const Editing=snapshot('consent-confirmation','editing');
export const Invalid=snapshot('consent-confirmation','invalid');
export const Confirming=snapshot('consent-confirmation','confirming');
export const Loading=snapshot('consent-confirmation','loading');
export const Error=snapshot('consent-confirmation','error');
export const Success=snapshot('consent-confirmation','success');
