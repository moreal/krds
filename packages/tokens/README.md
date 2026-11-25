# @unofficial-krds/tokens

The KRDS kit 1.1.0 design tokens as CSS custom properties and JSON. This is an unofficial, independent project.

## Install

The package is not published to npm yet. Every framework package depends on it, and the [install steps](https://moreal.github.io/krds/getting-started/installation.html) (in Korean) pack it together with them.

## Use

- `@unofficial-krds/tokens/tokens.css`: every token as a `--krds-*` custom property on `:root` and `:host`.
- `@unofficial-krds/tokens/tokens.json`: all 768 tokens with their raw values, aliases, types and resolved values.
- `@unofficial-krds/tokens/source-map.json`: the source token in the KRDS Figma kit for each CSS name.
- The package root exports `tokens` and `tokenNames`.

To change a value, override its `--krds-*` property in your theme scope. KRDS rem values assume a 62.5% root font size. Importing the tokens does not change your root font size.

## License

Code written for this project is MIT licensed, Copyright (c) 2026 Lee Dogeon. The token values come from KRDS and keep the KRDS terms. See [LICENSE.md](LICENSE.md) and [ATTRIBUTION.md](ATTRIBUTION.md). This is not an official KRDS or government distribution.
