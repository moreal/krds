import { onSettled } from 'solid-js';
import { render } from '@solidjs/web';
import '@unofficial-krds/styles/reset.css';
import '@unofficial-krds/styles/fonts.css';
import '@unofficial-krds/styles/all.css';
import './preview.css';
import { createPreviewHost } from '../../../../tools/docs-previews/host';
import { ButtonExample } from './ButtonExample';
import { NativeSelectExample } from './NativeSelectExample';
import { ModalExample } from './ModalExample';
import { TabsExample } from './TabsExample';
import { CalendarExample } from './CalendarExample';
import { DateInputExample } from './DateInputExample';
const root = document.getElementById('preview-root')!;
const params = new URLSearchParams(location.search);
const examples = { button: ButtonExample, 'native-select': NativeSelectExample, modal: ModalExample, tabs: TabsExample, calendar: CalendarExample, 'date-input': DateInputExample };
const componentId = params.get('component');
const Example = componentId && Object.hasOwn(examples, componentId) ? examples[componentId as keyof typeof examples] : null;
const host = createPreviewHost({ framework: 'solid-next', root });
function App() {
  onSettled(() => { host.ready(); return () => host.dispose(); });
  return Example ? <Example /> : <p role="alert">지원하지 않는 예제입니다.</p>;
}
if (!Example || params.get('example') !== 'default') {
  root.textContent = '지원하지 않는 예제입니다.';
  host.error('Unknown Solid 2 component or example');
} else {
  const dispose = render(() => <App />, root);
  window.addEventListener('pagehide', dispose, { once: true });
}
