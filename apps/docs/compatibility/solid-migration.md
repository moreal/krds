# Solid 1 → Solid 2

Solid 2 is an isolated preview on exact `2.0.0-rc.19` runtime, renderer and compiler pins, not a peer-range widening of the stable Solid 1 adapter. Use `@unofficial-krds/solid-next` only with its own manifest toolchain and preview fixture. Do not mix `solid-js` generations, import `solid-js/web` for the Solid 2 renderer, or resolve all runtimes at the repository root.

Start by moving semantic data, controlled values, callback payloads and CSS tokens. Then port native content/ref/lifecycle usage against the selected Solid 2 declarations and compiler. A Solid 1 JSX example is not automatically a Solid 2 example.

The preview does not have a supported upstream siheom or stable native Storybook integration. Native preview build, SSR and browser evidence are recorded separately. [Exact versions and states](./) · [Native source examples](./examples#solid-next).
