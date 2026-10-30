import { componentWrapperDecorator, type Preview } from '@storybook/angular';
const preview: Preview = {
  decorators: [(storyFn, context) => componentWrapperDecorator(story => ['krds-pattern-','krds-masthead--','krds-skip-link--','krds-header--','krds-footer--','krds-critical-alert--'].some(prefix => context.id.startsWith(prefix)) ? `<div>${story}</div>` : `<main>${story}</main>`)(storyFn, context)],
  parameters: { layout: 'padded' },
};
export default preview;
