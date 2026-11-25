# @unofficial-krds/fonts

Optional Pretendard GOV Regular (400), Medium (500) and Bold (700) fonts as unmodified WOFF2 files. This is an unofficial, independent project.

## Install

The package is not published to npm yet. Build and pack it in the [repository](https://github.com/moreal/krds), then install the tarball in your app.

```bash
node tools/yarn.mjs nx run krds-fonts:build
node tools/yarn.mjs workspace @unofficial-krds/fonts pack --out /tmp/krds/fonts.tgz
```

## Use

Import `@unofficial-krds/fonts/fonts.css` to load the fonts from the package files. It never requests a CDN. The package root exports `pretendardGovFontUrls` with the file URLs.

`@unofficial-krds/styles/fonts.css` is a different file. It only selects fonts that are already installed.

## License

The fonts are under the SIL Open Font License 1.1, with the Reserved Font Names `Pretendard GOV`, `Source`, `Inter` and `M PLUS 1`. Keep [LICENSES/Pretendard-GOV-OFL-1.1.txt](LICENSES/Pretendard-GOV-OFL-1.1.txt) and the copyright notices with any font file you redistribute. Code written for this project is MIT licensed, Copyright (c) 2026 Lee Dogeon. See [LICENSE.md](LICENSE.md). This is not an official KRDS or government distribution.
