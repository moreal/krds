import { createApp } from 'vue';
import { FixtureApp } from './FixtureApp';
const app = createApp(FixtureApp);
app.mount('#app');
window.addEventListener('pagehide', () => app.unmount(), { once: true });
