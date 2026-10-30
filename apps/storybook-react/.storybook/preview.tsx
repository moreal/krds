import '@unofficial-krds/styles/reset.css';
import '@unofficial-krds/styles/fonts.css';
import '@unofficial-krds/styles/all.css';
import type { Preview } from '@storybook/react-vite';
const preview: Preview = { decorators: [(Story, context) => <div lang="ko-KR">{!context.title.startsWith('KRDS Pattern/') && <h1>KRDS React</h1>}<Story /></div>] };
export default preview;
