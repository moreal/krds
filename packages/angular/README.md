# @unofficial-krds/angular

Angular standalone components for the 54 web components of KRDS, the Korean government design system. This is an unofficial, independent project.

## Install

The package is not published to npm yet. Build and pack it in the [repository](https://github.com/moreal/krds), then install the tarballs in your app.

```bash
node tools/yarn.mjs install --immutable && node tools/yarn.mjs nx run krds-angular:build
mkdir -p /tmp/krds && for name in contracts tokens styles angular; do node tools/yarn.mjs workspace @unofficial-krds/$name pack --out /tmp/krds/$name.tgz; done
# in your app
npm install /tmp/krds/{contracts,tokens,styles,angular}.tgz
```

Peer dependencies: `@angular/core`, `@angular/common` and `@angular/forms` at `^22.2.4`.

## Use

Import each component from `@unofficial-krds/angular/<id>` or from the package root. Add its CSS to your global stylesheet with `@import '@unofficial-krds/styles/<id>.css';`, or import `@unofficial-krds/styles/all.css` once.

```ts
import { Component } from '@angular/core';
import { Checkbox } from '@unofficial-krds/angular/checkbox';
@Component({
	selector: 'app-consent',
	imports: [Checkbox],
	template: `<krds-checkbox label="I agree" name="consent" (checkedChange)="agreed = $event.checked" />`,
})
export class Consent { agreed = false; }
```

- Selectors are `krds-<id>`. `Button` is an attribute on a native button: `<button krdsButton type="submit">`. Content is projected, and `Modal` takes its actions from an element with the `krdsModalActions` attribute.
- A callback in the props tables becomes an output without `on`: `onCheckedChange` is `(checkedChange)`. `Calendar` confirms and cancels with `(confirmed)` and `(canceled)`.
- `NativeSelect`, `DateInput`, `TextInput`, `Textarea`, `Checkbox`, `Switch`, `RadioGroup`, `RangeSlider` and `QuantityToggle` implement `ControlValueAccessor`, so `formControl` and `ngModel` work. All nine are also exported from `@unofficial-krds/angular/forms`.
- To change the locale, add `provideKrds({ locale, direction, document })` to your providers.
- Each component has a guide in the [component guides](https://moreal.github.io/krds/components/) (in Korean).

**License.** Code written for this project is MIT licensed, Copyright (c) 2026 Lee Dogeon. KRDS material and fonts keep their original terms. See [LICENSE.md](LICENSE.md) and [ATTRIBUTION.md](ATTRIBUTION.md). This is not an official KRDS or government distribution.
