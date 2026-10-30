# @unofficial-krds/lit

Native Lit 3 pilots: Button, NativeSelect, Modal, Tabs, Calendar and DateInput. Each class extends LitElement and uses an open Shadow DOM. Importing the public entries does not define custom elements or access a browser document.

```ts
import '@unofficial-krds/tokens/tokens.css';
import { registerKrdsElements } from '@unofficial-krds/lit/register';
registerKrdsElements(customElements);
```

Registration uses `krds-button`, `krds-native-select`, `krds-modal`, `krds-tabs`, `krds-calendar` and `krds-date-input`. Re-registering the same classes is idempotent; a conflicting definition throws before any new registration. Import shared global reset/fonts separately if wanted. Component CSS is installed in each shadow root and inherits tokens from its host, including native top-layer dialogs. Use CSS `::part(...)` for local customization.

Pass object and array data as properties in native Lit templates. Labels, hints and errors are plain text; Tabs item `content` and Modal `body`/`actions` can contain native Lit templates or DOM nodes. Slot Button content normally; Modal supports default body content and an `actions` slot. `locale` supports `ko-KR` and `en-US`; `direction`/the native `dir` attribute supplies direction. DOM queries and focus use each instance's owner document and shadow root.

```ts
import { html } from 'lit';
const view = html`<krds-native-select label="지역" name="region"
  .options=${[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]}
  .defaultValue=${'seoul'}
  @value-change=${(event: CustomEvent<{value: string}>) => console.log(event.detail.value)}
></krds-native-select>`;
```

A defined `.value` or `.open` selects controlled mode; `.defaultValue`/`.defaultOpen` selects an uncontrolled initial baseline. Do not combine them or switch modes. Parents accept a request by updating the property. Controlled rejection restores the displayed parent value. Semantic `value-change`, `open-change` and Calendar `confirm`/`cancel` events bubble and are composed; details contain plain values. Native Button `click` remains the action event. Mount, parent updates and reset produce no value events.

NativeSelect renders an actual single `<select>`. SSR serializes `selected` for any committed value that matches an option, including a non-first controlled value or uncontrolled default. Static single-select HTML cannot express `selectedIndex = -1` while enabled options exist: an unmatched empty semantic value therefore requires client hydration to establish no selection. No extra placeholder option is inserted; pre-hydration state equivalence is not claimed for that specific case. NativeSelect and DateInput are form-associated custom elements using ElementInternals, without hidden duplicate controls. `name`, `form`, required validity, disabled fieldsets, reset and state restoration are supported. DateInput editable drafts stay unnamed; its canonical value is the sole successful entry. Range entries use `name.start` and `name.end`. Invalid drafts block submission; valid pending drafts commit before FormData is constructed. A controlled rejected commit prevents that submission.

Button renders a native shadow button. Since its native form owner cannot cross a shadow root, submit activation calls the external host form's `requestSubmit` with a temporary native named submitter; the submit event and `FormData(form, event.submitter)` expose its name/value. Reset invokes the cancelable native reset algorithm once. Neither operation adds a persistent hidden input. A prevented `click` prevents form activation.

Modal uses native `<dialog>.showModal()` and its top layer for background interaction/accessibility isolation. The visible title and description share the dialog's root. Its default focus is the dialog; only an explicit dialog/first-interactive `initialFocusId` is accepted. All enabled tabs and calendar dates stay sequential Tab stops; arrows supplement that access. The close icon is last. Disabling `showCloseButton` requires an enabled action marked `data-krds-close`. `returnFocusId` is a fallback after an unusable saved opener. Button-trigger applications should focus the trigger before changing `.open`, including Safari pointer activation. DateInput does this internally.

Tabs and Calendar accept a visible `label` or host `aria-label` / `aria-labelledby`. Browser references resolve in the host's actual document or enclosing shadow root; the internal semantic element uses native `ariaLabelledByElements` when available. A plain-text fallback and reference observers keep label updates available without forwarding an external IDREF into a different shadow root. This fallback is not an implementation of the full accessible-name algorithm.

Standalone SSR has no external document tree. For `aria-labelledby`, supply a plain `labelReferences` property mapping each referenced ID to its label text, for example `.labelReferences=${{ 'trip-label': '방문 일정' }}` alongside `aria-labelledby="trip-label"`. This is application-provided plain label context, not automatic DOM/accessible-name computation or assistive-technology proof. Empty/missing reference text is a configuration error. Browser rendering uses actual referenced elements; the SSR mapping does not mask a broken live IDREF.

Standalone Lit Labs SSR and hydration are tested with the selected `@lit-labs/ssr` 4.1.0 and `@lit-labs/ssr-client` 1.1.8. Install the official hydration support before evaluating element classes. Persist application-owned property data before registration/upgrade; the library does not serialize arbitrary arrays/templates automatically. See `tests/ssr/lit/README.md` and the production fixture's `hydrate` entry. This is standalone Lit Labs evidence, not a blanket host-framework SSR claim.

There is no supported upstream siheom Lit adapter in the selected toolchain. Native Chromium/WebKit contract, form, lifecycle, hydration and Playwright Storybook/axe checks run directly; no foreign renderer or widened peer substitutes for Lit. Full catalog verification and release checks remain separate from the six-pilot task. Independent code and KRDS-derived materials retain the separate licenses and attribution shipped with this package.
