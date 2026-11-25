# @unofficial-krds/vue

Vue 3 components for the 54 web components of KRDS, the Korean government design system. This is an unofficial, independent project.

## Install

The package is not published to npm yet. Build and pack it in the [repository](https://github.com/moreal/krds), then install the tarballs in your app.

```bash
node tools/yarn.mjs install --immutable && node tools/yarn.mjs nx run krds-vue:build
mkdir -p /tmp/krds && for name in contracts tokens styles vue; do node tools/yarn.mjs workspace @unofficial-krds/$name pack --out /tmp/krds/$name.tgz; done
# in your app
npm install /tmp/krds/{contracts,tokens,styles,vue}.tgz
```

Peer dependency: `vue@^3.5.44`.

## Use

Each component subpath, `@unofficial-krds/vue/<id>`, has a default export. The package root has named exports. Import the CSS from `@unofficial-krds/styles/<id>.css`, or import `@unofficial-krds/styles/all.css` once.

```vue
<script setup lang="ts">
import Checkbox from '@unofficial-krds/vue/checkbox';
import '@unofficial-krds/styles/checkbox.css';
</script>

<template>
	<Checkbox label="I agree" name="consent" @checked-change="({ checked }) => console.log(checked)" />
</template>
```

- Content goes in slots. Some slots pass values, such as `<template #actions="{ close }">` in `Modal`.
- A callback in the props tables becomes a kebab-case event without `on`: `onCheckedChange` is `@checked-change`. `Checkbox`, `Switch`, `RadioGroup`, `NativeSelect`, `TextInput`, `Textarea`, `DateInput`, `RangeSlider`, `QuantityToggle`, `Calendar`, `Tabs`, `Disclosure` and `Modal` also support `v-model`.
- To change the locale, wrap the app in `KrdsProvider` (`locale`, `direction`, and `document` as a function) from the package root.
- Each component has a guide in the [component guides](https://moreal.github.io/krds/components/) (in Korean).

**License.** Code written for this project is MIT licensed, Copyright (c) 2026 Lee Dogeon. KRDS material and fonts keep their original terms. See [LICENSE.md](LICENSE.md) and [ATTRIBUTION.md](ATTRIBUTION.md). This is not an official KRDS or government distribution.
