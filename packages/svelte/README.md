# @unofficial-krds/svelte

Svelte 5 components for the 54 web components of KRDS, the Korean government design system. This is an unofficial, independent project.

## Install

The package is not published to npm yet. Build and pack it in the [repository](https://github.com/moreal/krds), then install the tarballs in your app.

```bash
node tools/yarn.mjs install --immutable && node tools/yarn.mjs nx run krds-svelte:build
mkdir -p /tmp/krds && for name in contracts tokens styles svelte; do node tools/yarn.mjs workspace @unofficial-krds/$name pack --out /tmp/krds/$name.tgz; done
# in your app
npm install /tmp/krds/{contracts,tokens,styles,svelte}.tgz
```

Peer dependency: `svelte@^5.57.3`. The package ships `.svelte` source, so your app's Svelte compiler compiles it.

## Use

Each component subpath, `@unofficial-krds/svelte/<id>`, has a default export. The package root has named exports. Import the CSS from `@unofficial-krds/styles/<id>.css`, or import `@unofficial-krds/styles/all.css` once.

```svelte
<script lang="ts">
	import Checkbox from '@unofficial-krds/svelte/checkbox';
	import '@unofficial-krds/styles/checkbox.css';
</script>

<Checkbox label="I agree" name="consent" onCheckedChange={({ checked }) => console.log(checked)} />
```

- Content goes in snippets. `Modal` passes `{ close }` to its `children` and `actions` snippets, and `{ open, expanded, controls }` to its `trigger` snippet.
- Callbacks are props with the names in the props tables, such as `onCheckedChange`. `Button` takes the native `onclick` and supports `bind:element`.
- To change the locale, wrap the app in `KrdsProvider` (`locale`, `direction`, `document`) from the package root.
- Each component has a guide in the [component guides](https://moreal.github.io/krds/components/) (in Korean).

**License.** Code written for this project is MIT licensed, Copyright (c) 2026 Lee Dogeon. KRDS material and fonts keep their original terms. See [LICENSE.md](LICENSE.md) and [ATTRIBUTION.md](ATTRIBUTION.md). This is not an official KRDS or government distribution.
