# @unofficial-krds/solid-next

A preview of KRDS, the Korean government design system, for Solid 2.0.0-rc.19. This six-component preview has `Button`, `NativeSelect`, `Modal`, `Tabs`, `Calendar` and `DateInput`. This is an unofficial, independent project.

## Install

The package is not published to npm yet. Build and pack it in the [repository](https://github.com/moreal/krds), then install the tarballs in your app.

```bash
node tools/yarn.mjs install --immutable && node tools/yarn.mjs nx run krds-solid-next:build
mkdir -p /tmp/krds && for name in contracts tokens styles solid-next; do node tools/yarn.mjs workspace @unofficial-krds/$name pack --out /tmp/krds/$name.tgz; done
# in your app
npm install /tmp/krds/{contracts,tokens,styles,solid-next}.tgz
```

Peer dependencies: exactly `solid-js@2.0.0-rc.19` and `@solidjs/web@2.0.0-rc.19`. Other release candidates are not supported.

## Use

Import each component from `@unofficial-krds/solid-next/<id>` or from the package root. Import its CSS from `@unofficial-krds/styles/<id>.css`.

```tsx
import { NativeSelect } from '@unofficial-krds/solid-next/native-select';
import '@unofficial-krds/styles/native-select.css';

export const Region = () => (
	<NativeSelect label="Region" name="region" options={[{ value: 'seoul', label: 'Seoul' }, { value: 'busan', label: 'Busan' }]}
		onValueChange={({ value }) => console.log(value)} />
);
```

- Props and callbacks match `@unofficial-krds/solid`. Content, refs and lifecycle code follow Solid 2.
- To change the locale, wrap the app in `KrdsProvider` (`locale`, `direction`, `getDocument`) from the package root.
- Do not use this package and `@unofficial-krds/solid` in the same app.
- The [Solid 1 to Solid 2 guide](https://moreal.github.io/krds/compatibility/solid-migration.html) (in Korean) lists what changes.

**License.** Code written for this project is MIT licensed, Copyright (c) 2026 Lee Dogeon. KRDS material and fonts keep their original terms. See [LICENSE.md](LICENSE.md) and [ATTRIBUTION.md](ATTRIBUTION.md). This is not an official KRDS or government distribution.
