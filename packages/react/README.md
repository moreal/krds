# @unofficial-krds/react

React 19 components for the 54 web components of KRDS, the Korean government design system. This is an unofficial, independent project.

## Install

The package is not published to npm yet. Build and pack it in the [repository](https://github.com/moreal/krds), then install the tarballs in your app.

```bash
node tools/yarn.mjs install --immutable && node tools/yarn.mjs nx run krds-react:build
mkdir -p /tmp/krds && for name in contracts tokens styles react; do node tools/yarn.mjs workspace @unofficial-krds/$name pack --out /tmp/krds/$name.tgz; done
# in your app
npm install /tmp/krds/{contracts,tokens,styles,react}.tgz
```

Peer dependencies: `react@^19.3.1` and `react-dom@^19.3.1`.

## Use

Import each component from `@unofficial-krds/react/<id>` or from the package root. Import its CSS from `@unofficial-krds/styles/<id>.css`, or import `@unofficial-krds/styles/all.css` once.

```tsx
import { Checkbox } from '@unofficial-krds/react/checkbox';
import '@unofficial-krds/styles/checkbox.css';

export const Consent = () => (
	<Checkbox label="I agree" name="consent" onCheckedChange={({ checked }) => console.log(checked)} />
);
```

- Content goes in `children` and JSX props. `Modal` also takes a `trigger`, and its `actions` can be a function of `close`.
- Callbacks use the names in the props tables of the [component guides](https://moreal.github.io/krds/components/) (in Korean).
- To change the locale, wrap the app in `KrdsProvider` (`locale`, `direction`, `ownerDocument`). Import it from the root or `@unofficial-krds/react/providers`.

**License.** Code written for this project is MIT licensed, Copyright (c) 2026 Lee Dogeon. KRDS material and fonts keep their original terms. See [LICENSE.md](LICENSE.md) and [ATTRIBUTION.md](ATTRIBUTION.md). This is not an official KRDS or government distribution.
