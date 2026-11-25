# @unofficial-krds/solid

Solid 1 components for the 54 web components of KRDS, the Korean government design system. This is an unofficial, independent project. For Solid 2, see `@unofficial-krds/solid-next`.

## Install

The package is not published to npm yet. Build and pack it in the [repository](https://github.com/moreal/krds), then install the tarballs in your app.

```bash
node tools/yarn.mjs install --immutable && node tools/yarn.mjs nx run krds-solid:build
mkdir -p /tmp/krds && for name in contracts tokens styles solid; do node tools/yarn.mjs workspace @unofficial-krds/$name pack --out /tmp/krds/$name.tgz; done
# in your app
npm install /tmp/krds/{contracts,tokens,styles,solid}.tgz
```

Peer dependency: `solid-js@^1.9.18`.

## Use

Import each component from `@unofficial-krds/solid/<id>` or from the package root. Import its CSS from `@unofficial-krds/styles/<id>.css`, or import `@unofficial-krds/styles/all.css` once.

```tsx
import { Checkbox } from '@unofficial-krds/solid/checkbox';
import '@unofficial-krds/styles/checkbox.css';

export const Consent = () => (
	<Checkbox label="I agree" name="consent" onCheckedChange={({ checked }) => console.log(checked)} />
);
```

- Content goes in `children` and JSX props. Callbacks use the names in the props tables, such as `onCheckedChange`.
- `Switch` has the same name as the `solid-js` control-flow component. Import one of them under another name if you use both.
- To change the locale, wrap the app in `KrdsProvider` (`locale`, `direction`, `ownerDocument`). Import it from the root or `@unofficial-krds/solid/provider`.
- Do not use this package and `@unofficial-krds/solid-next` in the same app.
- Each component has a guide in the [component guides](https://moreal.github.io/krds/components/) (in Korean).

**License.** Code written for this project is MIT licensed, Copyright (c) 2026 Lee Dogeon. KRDS material and fonts keep their original terms. See [LICENSE.md](LICENSE.md) and [ATTRIBUTION.md](ATTRIBUTION.md). This is not an official KRDS or government distribution.
