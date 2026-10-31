import DefaultTheme from 'vitepress/theme-without-fonts';
import { h } from 'vue';
import './style.css';
import HomeIntro from './HomeIntro.vue';

function focusMain(event: MouseEvent) {
  const main = document.querySelector('main');
  if (!main) return;
  event.preventDefault();
  const previous = main.getAttribute('tabindex');
  main.setAttribute('tabindex', '-1');
  main.addEventListener('blur', () => {
    if (previous === null) main.removeAttribute('tabindex');
    else main.setAttribute('tabindex', previous);
  }, { once: true });
  main.focus();
  main.scrollIntoView({ block: 'start' });
}

function DocsLayout() {
  return h(DefaultTheme.Layout, null, {
    'layout-top': () => h('a', { class: 'docs-skip-link', href: '#VPContent', tabindex: 0, onClick: focusMain }, '본문 바로가기')
  });
}

export default { ...DefaultTheme, Layout: DocsLayout, enhanceApp({ app }: Parameters<NonNullable<typeof DefaultTheme.enhanceApp>>[0]) { app.component('HomeIntro', HomeIntro); } };
