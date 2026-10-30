# @unofficial-krds/angular

Native Angular standalone pilots for Button, NativeSelect, Modal, Tabs, Calendar and DateInput. This is an independent, unpublished KRDS adaptation. The pilots do not establish full KRDS catalog coverage or a release-ready package.

The tested toolchain is Angular runtime/compiler/forms 22.2.4, CLI/build/ng-packagr 22.2.5 and TypeScript 6.0.2. Root and kebab-case secondary entrypoints export the native components. `@unofficial-krds/angular/forms` exports NativeSelect and DateInput with Reactive Forms CVAs and validators.

```ts
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Button, DateInput, NativeSelect } from '@unofficial-krds/angular';

@Component({
  selector: 'visit-form',
  standalone: true,
  imports: [Button, NativeSelect, DateInput, ReactiveFormsModule],
  template: `
    <form>
      <krds-native-select id="region" label="지역" name="region"
        [options]="regions" [formControl]="region" />
      <krds-date-input id="visit" label="방문일" name="visit"
        [formControl]="visit" referenceDate="2024-02-15" />
      <button krdsButton type="submit">저장</button>
    </form>
  `,
})
export class VisitForm {
  readonly regions = [{ value: 'seoul', label: '서울' }];
  readonly region = new FormControl('seoul', { nonNullable: true });
  readonly visit = new FormControl<string | null>('2024-02-29');
}
```

Give every instance a unique `id`. `Button` is the native `button[krdsButton]` component, so native form, submitter and keyboard semantics remain available. The other selectors use `krds-` plus the kebab-case component name. Semantic outputs are `valueChange`/`openChange` carrying plain `{ value }`/`{ open }` details. Calendar also exposes `confirmed` and `canceled`. Tabs accept local text or Angular `TemplateRef` panel content.

For controlled use, supply `value` or `open` and accept/reject requests through outputs. For uncontrolled use, omit that input and optionally supply the initial `defaultValue`/`defaultOpen`. Form-owned controls omit both inputs; the FormControl owns initialization and reset. Programmatic writes emit zero user callbacks. DateInput keeps raw drafts separate from canonical submitted dates and blocks invalid-draft submission.

Import the shared opt-in CSS in the application's stylesheet:

```css
@import '@unofficial-krds/styles/base.css';
@import '@unofficial-krds/styles/all.css';
```

Reset and fonts remain separate opt-ins. `provideKrds` configures locale, direction and an injected document. Modal's `openFrom(opener)` records the actual opening native element or Button handle, including browsers that do not focus pointer-activated buttons. See [Angular compatibility](../../docs/compatibility/angular.md) for modal, form, SSR and testing details.

From the workspace root, use the selected Node/Yarn launcher:

```sh
node tools/yarn.mjs workspace @unofficial-krds/angular build:local
node tools/yarn.mjs workspace @unofficial-krds/angular typecheck
node tools/yarn.mjs workspace @unofficial-krds/angular test
node tools/yarn.mjs test:siheom --framework angular
node tools/yarn.mjs test:contract --framework angular
node tools/yarn.mjs test:stories --framework angular
```

The library build uses official ng-packagr partial APF. Its test locally packs the built library and compiles all entrypoints in an isolated Angular SSR consumer with no source aliases. Separate native browser tests cover hydration, forms, focus, event counts and cleanup. Native Storybook uses explicit Angular templates and local args; behavior remains in separate siheom/browser files.

Independent source code is under the completed MIT grant in [LICENSE.md](LICENSE.md), copyright Lee Dogeon. KRDS and font rights remain separate; see [ATTRIBUTION.md](ATTRIBUTION.md), [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md) and [provenance.json](provenance.json). Npm scope/account and repository ownership are unverified. No publication, push or tag is authorized.
