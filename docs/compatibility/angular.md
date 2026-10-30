# Angular native pilot compatibility

The six pilots render through Angular standalone components, templates, host bindings, signals and lifecycle callbacks. The tested environment is Angular runtime/compiler/forms **22.2.4**, CLI/build/ng-packagr **22.2.5**, TypeScript **6.0.2**, Node **24.18.0** and Yarn **4.14.1**. These results cover those exact versions; the peer range is not evidence for every Angular 22 minor.

Import `Button`, `NativeSelect`, `Modal`, `Tabs`, `Calendar` and `DateInput` from `@unofficial-krds/angular` or their kebab-case secondary entrypoints. `@unofficial-krds/angular/forms` exports the two CVA controls. `Button` uses the native `button[krdsButton]` selector, preserving native submitters, form association, Enter/Space activation and cancelable reset. The other selectors are `krds-native-select`, `krds-modal`, `krds-tabs`, `krds-calendar` and `krds-date-input`. Every instance requires a unique `id`; field components require a task-specific `label` or the select's explicit `ariaLabel`/`ariaLabelledby` alternative.

Opt in to CSS from an application stylesheet:

```css
@import '@unofficial-krds/styles/base.css';
@import '@unofficial-krds/styles/all.css';
```

Reset and font CSS remain separate opt-ins. No external fonts, image URLs or APIs are needed. Public `data-krds-component`, `data-krds-part` and token-backed state attributes match the component specs. Calendar retains its private table-only scroll wrapper at narrow widths.

## Angular inputs and outputs

Use `value`/`valueChange` and `open`/`openChange` for controlled state. Outputs carry `{ value }` or `{ open }`, never a DOM event. Omit `value`/`open` for uncontrolled state and supply the matching `defaultValue`/`defaultOpen` once. Combining a controlled input with its default or changing controlled mode after initialization throws. Input updates, initial values, CVA writes and reset emit no user value notifications. Date values are strict date-only ISO strings or `{ start, end }` ranges; locale never changes their format.

Tabs accept `TabItem[]`; `panel` is local text or an Angular `TemplateRef`, rendered with `NgTemplateOutlet`. All panels remain mounted. Enabled tabs and enabled calendar days are sequential Tab stops. Arrow navigation supplements that sequence. Calendar's `confirmed` and `canceled` outputs are action notifications, separate from changed-value `valueChange`.

`provideKrds({ locale, direction, document })` supplies an optional native DI environment. It defaults to Korean, LTR and Angular's injected `DOCUMENT`. Document access occurs during lifecycle or event handling. No browser global is read at module import.

For a controlled modal, retain the actual opener explicitly. This works when WebKit does not focus pointer-activated buttons:

```html
<button krdsButton #opener (click)="dialog.openFrom(opener)">Open confirmation</button>
<krds-modal #dialog id="confirmation" title="Confirmation"
  [open]="open()" (openChange)="open.set($event.open)">
  <p>Confirm your choice.</p>
</krds-modal>
```

This pattern is compiled by the outside consumer test. A template reference on `button[krdsButton]` is the Button handle; `openFrom` accepts that handle or an actual HTMLElement. `openFrom` requests opening once and captures the opening element. On close a usable opener takes precedence over `returnFocusId`. For a programmatic initially open modal there is no opener; the alternate or body fallback applies. `initialFocusId` may identify only the dialog or its first enabled focusable element. DateInput exposes `aria-controls` while its popup exists, avoiding a dangling reference while that popup is unmounted. DateInput owns its popup calendar focus target and reuses Modal's trap/isolation/return lifecycle. `showCloseButton=false` requires a consumer-provided enabled close action in body/actions; consumers must wire it to `dialog.request(false)`. Modal Escape remains available, including that configuration.

## Reactive Forms and native submission

Import `ReactiveFormsModule` and bind `formControl` or `formControlName` to NativeSelect and DateInput. Omit `value` and `defaultValue` in that form-owned usage. Both controls register `NG_VALUE_ACCESSOR` and `NG_VALIDATORS`; programmatic `setValue`, initialization, disabled writes and reset do not replay `valueChange` or CVA user callbacks. User commits update the form control once. Select blur and date-group blur mark touched. Reset restores the FormControl's own baseline, including a nullable DateInput becoming empty.

Angular normally disables browser form validation; use `ngNativeValidate` when relying on the browser's native form-validation algorithm, or handle `form.valid` in the submit owner. NativeSelect's `required` input supplies its required validator; other business validators belong to the FormControl. DateInput's validator exposes `{ krdsDate: { message } }` for draft format, bounds, incomplete/reversed range and required failures. CVA alone does not install application validators. Bind external `invalid` and `error` when displaying application-level select errors; DateInput renders its own local draft errors and supports external errors separately.

DateInput text edits remain raw until non-composing Enter or leaving the group. Hidden canonical inputs alone carry `name`, or `${name}.start`/`${name}.end`. Invalid drafts preserve the previous canonical value and block submission. Native `setCustomValidity` mirrors draft validity; an additional submit capture guard protects Angular forms that disable native validation. Controlled rejected commits block the next submission rather than silently sending stale data. Composition is retained without filtering, formatting, validator updates or Enter commits. Compositionend updates the draft only; Enter, group blur or submission performs the later validation. Range errors mark and focus the affected endpoint. Non-canceled reset clears errors/popup state and adds no value event. Canceled reset changes nothing.

## Evidence and limits

The owner report and exact command logs are in `.superpowers/sdd/PLAN/task-T07A-angular-report.md` and `t07a-angular-logs/`. The isolated consumer under `tests/ssr/angular/consumer/` compiles all secondary entrypoints from a locally packed tarball, with no raw source aliases and no raw implementation source entrypoint in that tarball. It uses the official Angular CLI linker and SSR prerenderer, `provideClientHydration`, `provideZonelessChangeDetection` and OnPush. The browser suite checks reused SSR DOM and the first interaction in Chromium and WebKit. DOM-free import is checked before a DOM exists.

Native Storybook and `@siheom/angular` are test integrations, separate from the Angular UI API. Stories use local args only, and behavior files are separate. Raw axe output and network reports must be inspected; runner exit code alone does not mean zero findings. Firefox launch remains an inherited environment blocker. No generalized Zone.js, older Angular major, event-calendar, segmented-date or full-catalog support is claimed. No package publication, push or tag is authorized by this work.

## T10 full catalog candidate

The native source now contains all54 standalone OnPush components and directives, root and secondary partial APF exports, and nine form controls through the forms entrypoint. Independent source review accepted the frozen569-file input plus the exact RR2 residual fixes. Subsequent observed runtime repairs remain separately recorded; full-catalog runtime acceptance is pending. The six reviewed pilots retain their historical evidence; the shared modal-stack and later focus/portal repairs have separate targeted regressions.

Current compiler evidence is `.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json`: an explicit strict all54 public template consumer compiled by the official CLI against built public APF exports, without source aliases. The separate `apf-source-fix1/` evidence records packed-APF official AOT/SSR and Chromium hydration, reused SSR DOM, all54 root/secondary identities, first text/checkbox CVA notifications, native FormData/reset/disabled omission, zoneless first click and modal cleanup. These checks do not accept every component outcome or browser combination.

Focused source-fix1 native checks have a wide and an explicit narrow viewport profile. Required manual assistive-technology, real speech/sign content, actual browser zoom/forced-colors and visual review remain separate. TTS local examples use an abortable local mock and never claim actual speech-engine support. No full-catalog acceptance, release or publication is granted by compiler success.

The later runtime1 checkpoint retains strict54 public-APF compilation and an isolated official packed AOT/SSR consumer with Chromium Asia/Seoul hydration, source/export identities and actual forms/reset/focus checks. Exact compiler JSON: `.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-runtime-final.json`; sealed APF SHA256 `0d227083bf73c76232b75c20d071bf71d7be708ee0a9d4316b3d1c642fd3c625`. Supported native suite135/135 and explicit narrow affected suite11/11 passed. Full315/344 final acceptance and13 required manual outcomes remain separate gates; prior completed candidates are retained RED evidence.

The final repaired source scopes are independently accepted through the exact runtime3/4 and owned hydration-observer overlays. Current strict54 compiler proof is `.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-final-repaired.json`, with public APF SHA256 `1fc21e6173867f58c0878ae1078bf585f71621ffa45bdb3dd8efdb6d1998ce79`; current official packed all54 SSR and Chromium Asia/Seoul hydration pass with actual SSR node reuse, forms/reset/disabled behavior and zero browser errors. The supported native runner passes149/149, required canonical contract10 and stories6 pass, and the current native344 story run passes344/344 with zero raw axe, browser and request-policy findings. The actual immutable full315 report retains299 passed, one Coach resize-readiness failure,13 manual-required outcomes and2 genuine browser visibility capability blocks. The exact Coach06 follow-up passes1/1 on the34-file observer fingerprint; the full report is not relabelled. Versioned candidate CI and the manual/capability gates remain separate; no full315 or release acceptance is claimed.
