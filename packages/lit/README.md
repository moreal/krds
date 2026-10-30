# Native Lit Web Components

`@unofficial-krds/lit` provides 54 explicit native LitElement classes with open Shadow DOM. Registration is explicit and preflights the complete registry before defining any element. Imports perform no global registration or document mutation.

```ts
import '@unofficial-krds/tokens/tokens.css';
import { registerKrdsElements } from '@unofficial-krds/lit/register';
import type { TextInput } from '@unofficial-krds/lit/text-input';

registerKrdsElements(customElements);
const input: TextInput = document.createElement('krds-text-input');
input.label = '신청인 이름';
input.name = 'applicant';
input.defaultValue = '';
input.addEventListener('value-change', event => {
  console.log((event as CustomEvent<{ value: string }>).detail.value);
});
document.querySelector('form')!.append(input);
```

All component subpaths have independent JavaScript and declaration entries. The root export also provides the complete `HTMLElementTagNameMap` augmentation. Compiler-checked examples for all 54 public classes are in `apps/fixture-lit/src/examples/catalog.ts`.

## Styling and names

Install the global token stylesheet once on a document ancestor. Each native shadow root installs the inheritance-safe raw `shadowStyles.all` mapping from `@unofficial-krds/styles/lit`. It does not redeclare token defaults on the host, import reset/fonts, or request remote assets. Consumer token overrides therefore reach native shadow controls, including top-layer dialogs. Parts use `data-krds-component`, one `data-krds-part` token, `data-krds-state` tokens and matching `part` names.

Fields have visible `label`, optional `hint`/`error`, and same-root internal associations. `aria-label`/`aria-labelledby` on the host override semantic naming. For standalone SSR with external naming references, pass `labelReferences` containing the same plain text. Browser naming references are resolved against the host's actual root and updated when referenced text changes. Native content uses slots and component-specific TemplateResult properties; no foreign renderer is involved.

## State, events and forms

A defined `value`, `checked`, `open` or other controlled selection chooses controlled mode. Its default counterpart is read once for uncontrolled state. Supplying both or changing mode throws. Events request changes; a controlled host may decline them. Mount, prop changes, hydration and reset do not fabricate change events. The principal events are `value-change`, `checked-change`, `open-change`, `expanded-change`, `selection-change`, `page-change`, `index-change`, `playing-change`, `topic-change`, `step-change`, `sort-change`, `files-change`, `files-rejected`, `start`, `stop`, `request`, `action` and `dismiss`; `detail` contains plain semantic data. Use ordinary Lit `@event` bindings.

NativeSelect, DateInput, RadioGroup, Checkbox, Switch, TextInput, Textarea, RangeSlider, QuantityToggle and FileUpload are form-associated custom elements. ElementInternals is their sole persistent successful form contribution; internal controls never create duplicate hidden contributions. Set `name` and optionally the host's standard `form` attribute. Disabled fieldsets, native form reset, canceled reset, required validity and actual external FormData are supported. Button preserves native submitter/reset behavior. QuantityToggle has no hidden input.

FileUpload is controlled: supply actual native File records through `files`, accept `files-change.detail.value` to commit, and submit the outer form explicitly. Picker cancel, clearing the chooser, rejected changes and ordinary reset retain the committed store. No transfer occurs before host submission. The chooser is cleared after selection to permit reselection. Validation feedback is separate from final-set requests.

## Local integrations and lifecycle

Real anchors preserve href and modified navigation. Favicon provides `faviconLinks(config)` for the actual standalone SSR head and an explicit lifecycle element for client-owned head links. Resize changes a scoped slotted content region or `scaleTargetId`, restoring previous styles on detach. TTS emits driver requests; the application owns actual speech and disposal. BackButton delegates guarded history to the host. AccessibleMedia uses native controls and actual media/track sources; the host owns correct synchronized alternatives and their rights.

Toast and Snackbar accept a host-owned current message, never an internal queue. Dismissal events are requests. Generations prevent stale expiry; hidden documents pause remaining exposure, and Snackbar also pauses on hover, focus and pending action. Toast requires an actual persistent result target containing the complete result text.

CoachMark inserts native Lit content only into the registered boundary immediately after the real target, preserving its label, value, selection and IME. Action-gated steps require `onTargetAction` to verify committed local application state after the real native action. Rejected, stale or failed verification cannot advance. Set native `linked=true` when a TutorialPanel coordinator owns the joint Stop transaction; linked Stop emits `stop` once, while standalone Stop requests `open-change` once. The coordinator must expose its accepted preferred start action before modal-aware focus return. Native dialogs provide actual modality, focus trapping and scroll cleanup.

## Standalone SSR and evidence

Selected `@lit-labs/ssr` and `@lit-labs/ssr-client` support declarative Shadow DOM and hydration. Load `lit-element-hydrate-support.js` before importing/upgrading the elements, supply matching initial properties, explicitly register, then remove `defer-hydration`. Textarea retains its escaped initial static text so SSR value and browser hydration agree without replacing the control. Native client effects such as head mutation, intersection observation and adjacent coach insertion begin only after connection.

The six accepted pilot components have immutable evidence in `docs/execution/evidence/T08-lit/`. The full catalog is a T10 implementation candidate with separate component, SSR/hydration, story and browser evidence. A passing build or story audit does not award catalog coverage. Manual AT, authentic sign-language content and asset equivalence remain separate gates. There is no supported upstream Lit siheom adapter; native Chromium/WebKit Playwright tests are used.

Independent implementation code and original KRDS/font materials retain their separate rights; see the package notices. Publication is unauthorized.

## Public catalog entries

| Class | Native tag | Typed subpath |
| --- | --- | --- |
| `AccessibleMedia` | `krds-accessible-media` | `@unofficial-krds/lit/accessible-media` |
| `Accordion` | `krds-accordion` | `@unofficial-krds/lit/accordion` |
| `BackButton` | `krds-back-button` | `@unofficial-krds/lit/back-button` |
| `Badge` | `krds-badge` | `@unofficial-krds/lit/badge` |
| `BottomSheet` | `krds-bottom-sheet` | `@unofficial-krds/lit/bottom-sheet` |
| `Breadcrumb` | `krds-breadcrumb` | `@unofficial-krds/lit/breadcrumb` |
| `Button` | `krds-button` | `@unofficial-krds/lit/button` |
| `Calendar` | `krds-calendar` | `@unofficial-krds/lit/calendar` |
| `Carousel` | `krds-carousel` | `@unofficial-krds/lit/carousel` |
| `Checkbox` | `krds-checkbox` | `@unofficial-krds/lit/checkbox` |
| `CoachMark` | `krds-coach-mark` | `@unofficial-krds/lit/coach-mark` |
| `ContextualHelp` | `krds-contextual-help` | `@unofficial-krds/lit/contextual-help` |
| `CriticalAlert` | `krds-critical-alert` | `@unofficial-krds/lit/critical-alert` |
| `DateInput` | `krds-date-input` | `@unofficial-krds/lit/date-input` |
| `Disclosure` | `krds-disclosure` | `@unofficial-krds/lit/disclosure` |
| `FAB` | `krds-fab` | `@unofficial-krds/lit/fab` |
| `Favicon` | `krds-favicon` | `@unofficial-krds/lit/favicon` |
| `FileUpload` | `krds-file-upload` | `@unofficial-krds/lit/file-upload` |
| `Footer` | `krds-footer` | `@unofficial-krds/lit/footer` |
| `Header` | `krds-header` | `@unofficial-krds/lit/header` |
| `HelpPanel` | `krds-help-panel` | `@unofficial-krds/lit/help-panel` |
| `Identifier` | `krds-identifier` | `@unofficial-krds/lit/identifier` |
| `Image` | `krds-image` | `@unofficial-krds/lit/image` |
| `InPageNavigation` | `krds-in-page-navigation` | `@unofficial-krds/lit/in-page-navigation` |
| `LanguageSwitcher` | `krds-language-switcher` | `@unofficial-krds/lit/language-switcher` |
| `Link` | `krds-link` | `@unofficial-krds/lit/link` |
| `MainMenu` | `krds-main-menu` | `@unofficial-krds/lit/main-menu` |
| `Masthead` | `krds-masthead` | `@unofficial-krds/lit/masthead` |
| `Modal` | `krds-modal` | `@unofficial-krds/lit/modal` |
| `NativeSelect` | `krds-native-select` | `@unofficial-krds/lit/native-select` |
| `Pagination` | `krds-pagination` | `@unofficial-krds/lit/pagination` |
| `QuantityToggle` | `krds-quantity-toggle` | `@unofficial-krds/lit/quantity-toggle` |
| `RadioGroup` | `krds-radio-group` | `@unofficial-krds/lit/radio-group` |
| `RangeSlider` | `krds-range-slider` | `@unofficial-krds/lit/range-slider` |
| `Resize` | `krds-resize` | `@unofficial-krds/lit/resize` |
| `SideNavigation` | `krds-side-navigation` | `@unofficial-krds/lit/side-navigation` |
| `SkipLink` | `krds-skip-link` | `@unofficial-krds/lit/skip-link` |
| `Snackbar` | `krds-snackbar` | `@unofficial-krds/lit/snackbar` |
| `Spinner` | `krds-spinner` | `@unofficial-krds/lit/spinner` |
| `StepIndicator` | `krds-step-indicator` | `@unofficial-krds/lit/step-indicator` |
| `StructuredList` | `krds-structured-list` | `@unofficial-krds/lit/structured-list` |
| `Switch` | `krds-switch` | `@unofficial-krds/lit/switch` |
| `TabBar` | `krds-tab-bar` | `@unofficial-krds/lit/tab-bar` |
| `Table` | `krds-table` | `@unofficial-krds/lit/table` |
| `Tabs` | `krds-tabs` | `@unofficial-krds/lit/tabs` |
| `Tag` | `krds-tag` | `@unofficial-krds/lit/tag` |
| `TextInput` | `krds-text-input` | `@unofficial-krds/lit/text-input` |
| `TextList` | `krds-text-list` | `@unofficial-krds/lit/text-list` |
| `Textarea` | `krds-textarea` | `@unofficial-krds/lit/textarea` |
| `Toast` | `krds-toast` | `@unofficial-krds/lit/toast` |
| `Tooltip` | `krds-tooltip` | `@unofficial-krds/lit/tooltip` |
| `TTS` | `krds-tts` | `@unofficial-krds/lit/tts` |
| `TutorialPanel` | `krds-tutorial-panel` | `@unofficial-krds/lit/tutorial-panel` |
| `VisuallyHidden` | `krds-visually-hidden` | `@unofficial-krds/lit/visually-hidden` |

Table sorting is opt-in through an explicit controlled `sort`. Omit `sort` for an unsorted table with no sort buttons or local reordering, even when columns advertise `sortable`. To start with the first column sorted, initialize the host's `sort` to that column; an explicit later-column sort remains authoritative.

TextInput contributes its value through ElementInternals. Its shadow input does not own the outer form, so implicit Enter submission remains an explicit host/browser composition responsibility. T11 demonstrates forwarding an uncanceled, noncomposing Enter to the actual default submit button; this is host integration, not an intrinsic TextInput keyboard API.
