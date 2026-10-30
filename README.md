# KRDS Native

KRDS Native is an independent, in-progress workspace for native framework components based on the Korean Design System. The selected package namespace is `@unofficial-krds`; current local packages use version `0.0.0`. Framework and component availability follows the recorded compatibility and coverage evidence.

Documentation:

- [Local installation and toolchain](docs/getting-started/installation.md)
- [Component catalog](docs/components/README.md)
- [Framework compatibility](docs/compatibility/README.md)
- [Licenses, attribution and source rights](docs/legal/index.md)

Build and serve the local documentation with the selected Node and Yarn toolchain:

```sh
node tools/yarn.mjs install --immutable
node tools/yarn.mjs nx run krds-docs:build
node apps/docs/scripts/serve.mjs
```

The documentation server listens on `http://127.0.0.1:49100`. Linked native previews require their own built outputs; their availability does not establish component acceptance. The selected namespace and repository metadata express naming and location intent. Public npm availability and authenticated ownership remain unverified; publication, pushing and tagging are unauthorized.

Independent code uses the confirmed MIT grant. Original KRDS and font materials retain their separate rights and attribution; see the legal documentation before reuse.
