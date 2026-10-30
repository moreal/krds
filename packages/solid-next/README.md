# @unofficial-krds/solid-next

The exact RC.19 dependency chain was audited after integrator-owned transitive pinning. Native build/type, ten canonical contracts, 28 Chromium/WebKit behavior/SSR cases, and 32 visual/axe renders passed on that coherent set. Earlier mixed-version evidence is archived separately; see `.superpowers/sdd/PLAN/task-T09-solid-next-report.md`.

Native six-component preview for the exact Solid 2.0.0-rc.19 runtime and `@solidjs/web` renderer. The isolated compiler and Babel plugin are 2.0.0-rc.19; the Vite plugin is 3.0.0-next.53. Future RCs and Solid 1 are separate compatibility targets.

```tsx
import { createSignal } from 'solid-js';
import { DateInput, Tabs, Button } from '@unofficial-krds/solid-next';
import '@unofficial-krds/styles/reset.css';
import '@unofficial-krds/styles/fonts.css';
import '@unofficial-krds/styles/all.css';

function VisitDate() {
  const [date, setDate] = createSignal<string | null>(null);
  return <DateInput label="방문일" name="visitDate" value={date()}
    referenceDate="2024-02-01" onValueChange={({ value }) => setDate(value)} />;
}
```

The root exports `Button`, `NativeSelect`, `Modal`, `Tabs`, `Calendar`, `DateInput`, their prop/translation types, and `KrdsProvider`. Component subpaths (`/button`, `/native-select`, `/modal`, `/tabs`, `/calendar`, `/date-input`) export the same native APIs. Types use `JSX` from `@solidjs/web`. `node` exports select server-compiled modules; browser imports select hydratable DOM modules. Client and server must use the same exact runtime/compiler set.

Controlled callbacks request changes; the parent prop remains authoritative. Prop changes and form reset emit no value events. DateInput keeps raw text separate from canonical date-only hidden form values. Tabs and enabled Calendar buttons remain sequential Tab stops. Calendar is a six-week native table; confirmation commits its tentative value. Supply explicit reference/today dates; no component reads the clock.

`Modal` renders a native `<dialog>` through the RC Portal. The browser owns top-layer background isolation; the adapter owns focus policy, scroll restoration, topmost dismissal, controlled rejection and unmount cleanup. Native `::backdrop` provides the backdrop surface. DateInput provides its own named native dialog and commits only on Confirm. Server-rendered portals follow Solid's client-mounted Portal policy; initially open modal content is not pre-rendered as page content.

Run from the repository root, after building the shared packages:

```sh
node tools/yarn.mjs workspace @unofficial-krds/solid-next build:local
node tools/yarn.mjs workspace @unofficial-krds/fixture-solid-next build:local
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs workspace @unofficial-krds/solid-next test
node tools/yarn.mjs test:contract --framework solid-next
```

The test command builds a separate SSR consumer from the built package entries and checks real Chromium/WebKit hydration and first interactions. Native browser tests are the current behavior harness. Storybook and siheom support are not claimed for this RC. Full-catalog support, independent installation and release approval remain separate gates; see `docs/compatibility/solid-2.md`.

Independent project code is copyright (c) 2026 Lee Dogeon <dev.moreal@gmail.com> under the MIT grant in LICENSES/MIT.txt. KRDS and third-party materials retain their separate recorded terms. Publication is not authorized.
