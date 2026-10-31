import { defineConfig } from 'vitepress';
import type { Plugin } from 'postcss';

// Public component styles include their own tokens/base. Limit every selector to
// the example so the default VitePress shell keeps its typography and theme.
const scopeExampleCss: Plugin = {
  postcssPlugin: 'krds-docs-example-scope',
  Once(root) {
    if (!/[/\\]packages[/\\](?:styles|tokens)[/\\]dist[/\\]/.test(root.source?.input.file ?? '')) return;
    root.walkRules(rule => {
      rule.selectors = rule.selectors.map(selector => /^:(?:root|host)$/.test(selector) ? '.krds-demo' : `.krds-demo ${selector}`);
    });
  }
};

export default defineConfig({
  title: 'KRDS Native',
  description: '각 프레임워크의 고유 렌더러로 구현하는 비공식 KRDS 컴포넌트. API, 출처와 지원 기록을 확인하세요.',
  lang: 'ko-KR',
  base: '/krds/',
  cleanUrls: false,
  // VitePress 1.6.4 inserts search documents as async renders finish. Serial
  // indexing fixes MiniSearch document IDs and therefore every dependent hash.
  buildConcurrency: 1,
  srcExclude: ['README.md'],
  markdown: {
    theme: { light: 'github-light-high-contrast', dark: 'github-dark-high-contrast' },
    config(md) {
      const render = md.renderer.render.bind(md.renderer);
      md.renderer.render = (tokens, options, env) => {
        const html = render(tokens, options, env);
        if (typeof env.relativePath !== 'string') return html;
        const lang = ['index.md', 'getting-started/installation.md'].includes(env.relativePath) ? 'ko-KR' : 'en';
        // Keep the Korean shell while giving unchanged English source content
        // its own language for pronunciation, including SSR and client routes.
        return `<div lang="${lang}">\n${html}</div>\n`;
      };
    }
  },
  lastUpdated: false,
  // Native routes use the local preview server; source/legal files are checked
  // against actual generated public/dist files by the documentation link tests.
  ignoreDeadLinks: [/^\/native\//, /^\/sources\//, /^\/_legal\//],
  head: [['meta', { name: 'theme-color', content: '#12354b' }]],
  vite: {
    css: { postcss: { plugins: [scopeExampleCss] } },
    plugins: [{
      name: 'krds-docs-yarn-store-vue-chunks',
      enforce: 'post',
      configResolved(config) {
        if (config.build.ssr) return;
        const outputs = config.build.rollupOptions.output;
        for (const output of Array.isArray(outputs) ? outputs : outputs ? [outputs] : []) {
          const classify = output.manualChunks;
          if (typeof classify !== 'function') continue;
          output.manualChunks = function (id, context) {
            // VitePress's theme/framework split assumes conventional @vue/runtime
            // paths. Yarn's pnpm linker uses .store/@vue-runtime-*; combine those
            // boot chunks so the selected linker cannot create an initialization cycle.
            if (/[/\\]\.store[/\\]@vue-(?:runtime|shared|reactivity)-/.test(id)) return 'docs-runtime';
            const chunk = classify.call(this, id, context);
            return chunk === 'framework' || chunk === 'theme' ? 'docs-runtime' : chunk;
          };
        }
      }
    }]
  },
  themeConfig: {
    logo: '/mark.svg',
    siteTitle: 'KRDS Native',
    search: { provider: 'local', options: { locales: { root: { translations: { button: { buttonText: '문서 검색', buttonAriaLabel: '문서 검색' }, modal: { noResultsText: '검색 결과가 없습니다', resetButtonTitle: '검색 지우기', footer: { selectText: '선택', navigateText: '이동', closeText: '닫기' } } } } } } },
    outlineTitle: '이 페이지에서',
    docFooter: { prev: '이전', next: '다음' },
    sidebarMenuLabel: '문서 메뉴',
    returnToTopLabel: '맨 위로',
    darkModeSwitchLabel: '테마',
    darkModeSwitchTitle: '어두운 테마로 전환',
    lightModeSwitchTitle: '밝은 테마로 전환',
    nav: [
      { text: '빠른 시작', link: '/getting-started/installation' },
      { text: '컴포넌트', link: '/components/' },
      { text: '패턴', link: '/patterns/' },
      { text: '호환성', link: '/compatibility/' },
      { text: '출처와 권리', link: '/legal/' }
    ],
    sidebar: {
      '/getting-started/': [{ text: '시작하기', items: [
        { text: '로컬 설치', link: '/getting-started/installation' },
        { text: '과거 로컬 산출물 기록', link: '/getting-started/artifacts' },
        { text: 'CSS, 토큰과 글꼴', link: '/getting-started/styling' },
        { text: '폼과 제어 상태', link: '/getting-started/forms' },
        { text: '언어와 날짜', link: '/getting-started/locale-dates' },
        { text: '포털과 서버 렌더링', link: '/getting-started/ssr-portals' },
        { text: '스토리와 동작 검사', link: '/getting-started/testing' }
      ] }],
      '/components/': [{ text: '컴포넌트 참조', items: [
        { text: '54개 웹 컴포넌트', link: '/components/' },
        { text: 'Button', link: '/components/button' },
        { text: 'Native select', link: '/components/native-select' },
        { text: 'Modal', link: '/components/modal' },
        { text: 'Tabs', link: '/components/tabs' },
        { text: 'Calendar', link: '/components/calendar' },
        { text: 'Date input', link: '/components/date-input' }
      ] }],
      '/compatibility/': [{ text: '기록과 지원 경계', items: [
        { text: '프레임워크 지원 기록', link: '/compatibility/' },
        { text: '네이티브 예시', link: '/compatibility/examples' },
        { text: 'Solid 1 → 2', link: '/compatibility/solid-migration' }
      ] }],
      '/legal/': [{ text: '출처와 재배포', items: [{ text: '권리와 출처 표시', link: '/legal/' }] }],
      '/patterns/': [{ text: '서비스 패턴', items: [
        { text: '로컬 패턴 기초', link: '/patterns/' },
        { text: '네이티브 조합 안내', link: '/patterns/native-handoff' },
        { text: '가이드와 출처', link: '/patterns/sources' }
      ] }]
    },
    outline: [2, 3],
    footer: { message: '독립적으로 구현한 비공식 프로젝트입니다. 공식 KRDS 또는 정부 서비스가 아닙니다.', copyright: 'Independent code © 2026 Lee Dogeon. KRDS and third-party materials retain their own terms.' }
  }
});
