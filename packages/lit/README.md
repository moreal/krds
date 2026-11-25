# @unofficial-krds/lit

Lit custom elements for the 54 web components of KRDS, the Korean government design system. This is an unofficial, independent project.

## Install

The package is not published to npm yet. Build and pack it in the [repository](https://github.com/moreal/krds), then install the tarballs in your app.

```bash
node tools/yarn.mjs install --immutable && node tools/yarn.mjs nx run krds-lit:build
mkdir -p /tmp/krds && for name in contracts tokens styles lit; do node tools/yarn.mjs workspace @unofficial-krds/$name pack --out /tmp/krds/$name.tgz; done
# in your app
npm install /tmp/krds/{contracts,tokens,styles,lit}.tgz
```

Peer dependency: `lit@^3.3.3`.

## Use

Importing the package defines no elements. Call `registerKrdsElements` once, then use the `krds-<id>` tags. Each element carries its own CSS in its shadow root, so the page only needs the token stylesheet.

```ts
import '@unofficial-krds/tokens/tokens.css';
import { registerKrdsElements } from '@unofficial-krds/lit/register';

registerKrdsElements(customElements);
// Markup: <krds-checkbox label="I agree" name="consent"></krds-checkbox>
document.querySelector('krds-checkbox')!.addEventListener('checked-change', event => {
	console.log((event as CustomEvent<{ checked: boolean }>).detail.checked);
});
```

- A callback in the props tables becomes a DOM event: drop `on` and use kebab-case, so `onCheckedChange` is `checked-change`. Its argument is in `event.detail`. Events bubble out of the shadow root.
- Content goes in slots. Pass objects and arrays as properties, such as `.items=${items}`. `CoachMark` takes `onTargetAction` as a property because it returns a value. Set the locale with the `locale` and `dir` attributes.
- `Button` and the form controls are form-associated, so a `name` puts their value in the surrounding `<form>`.
- Each component has a guide in the [component guides](https://moreal.github.io/krds/components/) (in Korean).

**License.** Code written for this project is MIT licensed, Copyright (c) 2026 Lee Dogeon. KRDS material and fonts keep their original terms. See [LICENSE.md](LICENSE.md) and [ATTRIBUTION.md](ATTRIBUTION.md). This is not an official KRDS or government distribution.
