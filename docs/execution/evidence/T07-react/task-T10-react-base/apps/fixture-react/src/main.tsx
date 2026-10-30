import '@unofficial-krds/styles/reset.css';
import '@unofficial-krds/styles/fonts.css';
import '@unofficial-krds/styles/all.css';
import { createRoot } from 'react-dom/client';
import { FixtureApp } from './FixtureApp';
createRoot(document.getElementById('app')!).render(<FixtureApp />);
