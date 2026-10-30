import '@unofficial-krds/styles/reset.css';
import '@unofficial-krds/styles/fonts.css';
import '@unofficial-krds/styles/all.css';
import type { Preview } from '@storybook/react-vite';
const preview: Preview = { decorators: [Story => <main lang="ko-KR"><h1>KRDS React</h1><Story /></main>] };
export default preview;
