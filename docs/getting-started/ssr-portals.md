# Portals and server rendering

SSR policy belongs to each native adapter and its actual consumer evidence. A successful browser-only build is not a server import, hydration or resume result. Read the [native compatibility and example links](../compatibility/examples) for the selected framework before deploying.

## Resolve the document when it exists

Do not read `window`, `document`, layout or focus at module import time. Use the adapter's native provider/lifecycle and explicit owner document. Server rendering must retain deterministic IDs, locale and explicit date references so the first client render does not disagree with the server.

## A dialog is more than an overlay

An open [Modal](../components/modal) needs an accessible name, correct initial focus, topmost Escape handling, focus containment, background isolation and preserved scroll state. Closing or unmounting restores a usable opener before the documented fallback. Nested removal must release all owned inert/scroll effects. A removed opener, a rejected controlled close and a pointer gesture beginning inside then ending outside are distinct cases.

Apply the active token theme to the actual portal container. A portal can leave the opener's DOM theme scope even when its native framework context is inherited. Test theme changes on the open overlay, owner-document changes and cleanup after repeated mounts.

## Framework boundaries

Angular uses official CLI/ng-packagr partial APF, with an outside consumer that compiles packaged exports and verifies its SSR policy. Lit Shadow DOM relationships and hydration require their own evidence; cross-root IDs cannot be assumed to label an internal control. Solid 1 and the exact Solid 2 RC renderer/compiler remain separate. Svelte's packaged source must compile in its actual selected native consumer.

Qwik production SSR serializes state and event references for resume. Test the first lazy click, input and key event in that built server application. Storybook client rendering and static HTML screenshots cannot establish resume. No eager task on every widget should silently replace that required first-event check.
