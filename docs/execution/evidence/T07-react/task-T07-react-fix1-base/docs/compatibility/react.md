# React pilot compatibility

The selected native profile uses React/React DOM 19.3.1, TypeScript 6.0.2 and Vite 8.3.5. Public peers remain React 19.3.1-compatible, with exact development copies. JSX, context, layout effects and portals are React-native; no adapter imports another adapter.

All six public components are emitted as ESM with declaration files at root and component subpaths. Browser-free imports and ReactDOMServer rendering are exercised by `packages/react/tests/ssr.test.mjs`. Closed Modal and DateInput popup content are omitted during SSR; client effects attach the native portal and synchronize focus/isolation. A server-rendered open modal requires client mounting before it is interactive.

`node tools/yarn.mjs workspace @unofficial-krds/react build:local` builds only this package. React fixture and Storybook builds consume public distribution entries. Native browser behavior uses the selected `@siheom/react` adapter with React Testing Library for additional observable form/lifecycle cases, separate from stories. Local Vite test deduplication prevents duplicate React module instances; it does not change dependency versions or add root resolutions.

The implementation supports the six frozen pilot contracts, not the full KRDS catalog. Date values are strict Gregorian date-only strings; no time-zone conversion, host date parsing or implicit current clock is used. Calendar uses a Sunday-first 6×7 table, all enabled dates remain sequential Tab stops, and Korean visible days include `일` while full accessible date/state names follow the accepted specification.

Independent package/runtime installation, full-catalog support, complete assistive-technology testing and release/publishing checks remain later gates. Firefox has the inherited environment profile-creation blocker; Chromium and WebKit results are recorded separately in the task report. Visual evidence uses actual production Storybook controls at normal width, 320px with doubled computed root font size, an effective 200% layout using a 640×450 CSS viewport at device pixel ratio 2, and emulated forced colors; this is explicitly text scaling rather than browser chrome zoom.
