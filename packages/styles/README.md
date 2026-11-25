# @unofficial-krds/styles

The shared CSS for every `@unofficial-krds` framework package. It styles the 54 KRDS web components through `data-krds-*` attributes. This is an unofficial, independent project.

## Install

The package is not published to npm yet. Every framework package depends on it, and the [install steps](https://moreal.github.io/krds/getting-started/installation.html) (in Korean) pack it together with them.

## Use

Import one of these entries:

- `@unofficial-krds/styles/<id>.css`: one component, with the tokens and base styles it needs.
- `@unofficial-krds/styles/all.css`: every component. Do not combine it with single-component files.
- `@unofficial-krds/styles/reset.css`: an optional global reset. It sets the 62.5% root font size that KRDS rem values assume.
- `@unofficial-krds/styles/fonts.css`: selects a locally installed Pretendard GOV and system fallbacks. It downloads no font files.
- `@unofficial-krds/styles/lit`: the same CSS as strings in `styles`. `shadowStyles` leaves out token defaults, so shadow roots inherit the page's token values.

Importing the JavaScript root adds no styles.

The selectors are `data-krds-component`, `data-krds-part` and the space-separated `data-krds-state`. `@unofficial-krds/styles/parts.json` lists the parts and states of each component. Behavior comes from native HTML and ARIA, not from CSS.

The [styling guide](https://moreal.github.io/krds/getting-started/styling.html) (in Korean) explains how to change token values.

## License

Code written for this project is MIT licensed, Copyright (c) 2026 Lee Dogeon. Styles derived from KRDS keep the KRDS terms. See [LICENSE.md](LICENSE.md) and [ATTRIBUTION.md](ATTRIBUTION.md). This is not an official KRDS or government distribution.
