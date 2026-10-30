import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'KRDS Native',
  description: 'Independent native framework components. Source, contracts, and recorded support in one place.',
  lang: 'en-US',
  cleanUrls: true,
  srcExclude: ['README.md'],
  markdown: { theme: { light: 'github-light-high-contrast', dark: 'github-dark-high-contrast' } },
  lastUpdated: false,
  // Native routes use the local preview server; source/legal files are checked
  // against actual generated public/dist files by the documentation link tests.
  ignoreDeadLinks: [/^\/native\//, /^\/sources\//, /^\/_legal\//],
  head: [['meta', { name: 'theme-color', content: '#12354b' }]],
  vite: {
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
    search: { provider: 'local' },
    nav: [
      { text: 'Get started', link: '/getting-started/installation' },
      { text: 'Components', link: '/components/' },
      { text: 'Patterns', link: '/patterns/' },
      { text: 'Compatibility', link: '/compatibility/' },
      { text: 'Sources & rights', link: '/legal/' }
    ],
    sidebar: {
      '/getting-started/': [{ text: 'Build with confidence', items: [
        { text: 'Local installation', link: '/getting-started/installation' },
        { text: 'Recorded local artifacts', link: '/getting-started/artifacts' },
        { text: 'CSS, tokens & fonts', link: '/getting-started/styling' },
        { text: 'Forms & controlled state', link: '/getting-started/forms' },
        { text: 'Locale & dates', link: '/getting-started/locale-dates' },
        { text: 'Portals & server rendering', link: '/getting-started/ssr-portals' },
        { text: 'Stories & behavior tests', link: '/getting-started/testing' }
      ] }],
      '/components/': [{ text: 'Component reference', items: [
        { text: 'All 54 web entries', link: '/components/' },
        { text: 'Button', link: '/components/button' },
        { text: 'Native select', link: '/components/native-select' },
        { text: 'Modal', link: '/components/modal' },
        { text: 'Tabs', link: '/components/tabs' },
        { text: 'Calendar', link: '/components/calendar' },
        { text: 'Date input', link: '/components/date-input' }
      ] }],
      '/compatibility/': [{ text: 'Evidence & boundaries', items: [
        { text: 'Framework matrix', link: '/compatibility/' },
        { text: 'Native examples', link: '/compatibility/examples' },
        { text: 'Solid 1 → 2', link: '/compatibility/solid-migration' }
      ] }],
      '/legal/': [{ text: 'Sources & redistribution', items: [{ text: 'Rights and attribution', link: '/legal/' }] }],
      '/patterns/': [{ text: 'Service patterns', items: [
        { text: 'Local pattern foundation', link: '/patterns/' },
        { text: 'Native composition handoff', link: '/patterns/native-handoff' },
        { text: 'Guidance and sources', link: '/patterns/sources' }
      ] }]
    },
    outline: [2, 3],
    footer: { message: 'Independent implementation. Not an official KRDS or government service.', copyright: 'Independent code © 2026 Lee Dogeon. KRDS and third-party materials retain their own terms.' }
  }
});
