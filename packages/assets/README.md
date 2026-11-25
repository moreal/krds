# @unofficial-krds/assets

Eight unmodified generic KRDS SVG icons as local files. This is an unofficial, independent project.

## Install

The package is not published to npm yet. Build and pack it in the [repository](https://github.com/moreal/krds), then install the tarball in your app.

```bash
node tools/yarn.mjs nx run krds-assets:build
node tools/yarn.mjs workspace @unofficial-krds/assets pack --out /tmp/krds/assets.tgz
```

## Use

Import an icon file from `@unofficial-krds/assets/icons/<name>.svg`, or use the URLs in `krdsIconUrls` from the package root. Give the icon an accessible label in the control that uses it. A decorative icon gets empty alternative text.

Institution logos, service names, government banners and other brand marks are not included. Supply your own and check that you may use them.

## License

The icons keep the KRDS KOGL Type 1 conditions. Keep [LICENSE.md](LICENSE.md), [ATTRIBUTION.md](ATTRIBUTION.md) and `LICENSES/` with any icon you redistribute. Code written for this project is MIT licensed, Copyright (c) 2026 Lee Dogeon. This is not an official KRDS or government distribution.
