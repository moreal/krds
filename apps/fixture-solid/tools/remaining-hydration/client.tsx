import { hydrate } from 'solid-js/web';
import App from './App';
const dispose = hydrate(() => <App/>, document.getElementById('app')!);
Object.assign(window, { __remainingHydrationReady: true, __remainingHydrationDispose: dispose });
