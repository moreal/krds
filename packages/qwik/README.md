# @unofficial-krds/qwik

Qwik components for the 54 web components of KRDS, the Korean government design system. This is an unofficial, independent project.

## Install

The package is not published to npm yet. Build and pack it in the [repository](https://github.com/moreal/krds), then install the tarballs in your app.

```bash
node tools/yarn.mjs install --immutable && node tools/yarn.mjs nx run krds-qwik:build
mkdir -p /tmp/krds && for name in contracts tokens styles qwik; do node tools/yarn.mjs workspace @unofficial-krds/$name pack --out /tmp/krds/$name.tgz; done
# in your app
npm install /tmp/krds/{contracts,tokens,styles,qwik}.tgz
```

Peer dependency: `@builder.io/qwik@^1.20.3`.

## Use

Import each component from `@unofficial-krds/qwik/<id>` or from the package root. Import its CSS from `@unofficial-krds/styles/<id>.css`, or import `@unofficial-krds/styles/all.css` once.

```tsx
import { component$ } from '@builder.io/qwik';
import { Checkbox } from '@unofficial-krds/qwik/checkbox';
import '@unofficial-krds/styles/checkbox.css';

export const Consent = component$(() => (
	<Checkbox label="I agree" name="consent" onCheckedChange$={({ checked }) => console.log(checked)} />
));
```

- A callback in the props tables takes a `$` suffix: `onCheckedChange` is `onCheckedChange$`. A callback inside a config object keeps its name, such as `loadMore.onLoadMore`, but you wrap the function in `$()`.
- Content goes in the component's children.
- To change the locale, wrap the app in `KrdsProvider` (`locale`, `direction`) from the package root.
- Test production SSR in a built server app. Storybook and static HTML do not show whether the first events work after resume.
- Each component has a guide in the [component guides](https://moreal.github.io/krds/components/) (in Korean).

**License.** Code written for this project is MIT licensed, Copyright (c) 2026 Lee Dogeon. KRDS material and fonts keep their original terms. See [LICENSE.md](LICENSE.md) and [ATTRIBUTION.md](ATTRIBUTION.md). This is not an official KRDS or government distribution.
