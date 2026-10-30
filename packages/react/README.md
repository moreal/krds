# @unofficial-krds/react

Native React 19 implementation sources for 54 web-applicable KRDS catalog entries, including the six approved pilot components. React owns JSX, context, portals, refs and effect cleanup. Components never render through another framework. T10 full-catalog browser and independent-review gates remain in progress; source availability is not verified coverage or release readiness.

```tsx
import { useState } from 'react';
import { Button, DateInput, KrdsProvider, NativeSelect } from '@unofficial-krds/react';
import '@unofficial-krds/styles/reset.css';
import '@unofficial-krds/styles/all.css';

export function VisitForm() {
  const [date, setDate] = useState<string | null>(null);
  return <KrdsProvider locale="ko-KR" direction="ltr">
    <form onSubmit={event => { event.preventDefault(); }}>
      <NativeSelect label="지역" name="region" defaultValue="seoul"
        options={[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]} />
      <DateInput label="방문일" name="visit" value={date}
        onValueChange={({ value }) => setDate(value)} referenceDate="2024-02-15" />
      <Button type="submit" name="action" value="save">저장</Button>
      <Button type="reset" variant="secondary">초기화</Button>
    </form>
  </KrdsProvider>;
}
```

Each component and its props are also exported through `@unofficial-krds/react/button`, `/native-select`, `/modal`, `/tabs`, `/calendar`, `/date-input`; context through `/providers`. Importing components adds no CSS, font or browser-global side effect. Font CSS is separately optional and subject to its own rights.

`value`/`open` are parent-authoritative. User callbacks request a change; a declined request keeps the parent state. External prop changes and form reset emit no user changes. Uncontrolled defaults establish the reset baseline. NativeSelect uses a real single select, Button defaults to `type="button"`, and native form association is forwarded.

DateInput accepts strict ASCII `YYYY-MM-DD`, keeps raw drafts apart from committed hidden form values, and commits on Enter or group blur. Range mode uses `{start,end}` and `${name}.start`/`${name}.end`; incomplete or reversed committed ranges throw. Enter during IME is ignored. Invalid drafts remain editable and block native submission. Calendar selections stay tentative until Confirm; explicit referenceDate/today avoid dependence on the system clock.

```tsx
import { Calendar, Modal, Tabs } from '@unofficial-krds/react';

<Calendar mode="range" referenceDate="2024-02-15"
  defaultValue={{ start: '2024-02-12', end: '2024-02-18' }} />;
<Tabs label="안내" items={[
  { value: 'overview', label: '개요', panel: <p>개요 내용</p> },
  { value: 'details', label: '상세', panel: <p>상세 내용</p> },
]} />;
<Modal title="확인" trigger={<button type="button">열기</button>}
  actions={close => <button type="button" onClick={close}>취소</button>}>
  변경 내용을 확인하세요.
</Modal>;
```

Tabs preserve all panels and every enabled tab's sequential Tab stop; arrows add focus navigation. Calendar is a six-row native table with every enabled date sequentially reachable. Modal defaults to dialog-container entry focus, traps only the topmost modal, isolates the background, and restores a usable opener before any fallback. `initialFocusId` may target only the dialog or first interactive child. BottomSheet follows the same entry rule; its optional `id` identifies the dialog and its first Close control is `${id}-close`. DateInput supplies its specialized selected/first-date entry policy. `showCloseButton={false}` requires an explicit enabled close action.

The selected toolchain is recorded in `compatibility/toolchain.json`; run commands through `node tools/yarn.mjs`. Native fixture behavior lives separately from pure local Storybook states. Validation and limits are recorded in `.superpowers/sdd/PLAN/task-T07-react-report.md` and `docs/compatibility/react.md`. No publishing, pushing or tagging has been authorized.


## Full native catalog imports and examples

Every component has typed root and component-subpath exports. The examples below are concrete native React Storybook modules with local host effects. They are separate from contract/siheom behavior tests.

| Component | Public subpath | Native example |
| --- | --- | --- |
| `Button` / `ButtonProps` | `@unofficial-krds/react/button` | [button.stories.tsx](../../apps/storybook-react/src/stories/button.stories.tsx) |
| `NativeSelect` / `NativeSelectProps` | `@unofficial-krds/react/native-select` | [native-select.stories.tsx](../../apps/storybook-react/src/stories/native-select.stories.tsx) |
| `Modal` / `ModalProps` | `@unofficial-krds/react/modal` | [modal.stories.tsx](../../apps/storybook-react/src/stories/modal.stories.tsx) |
| `Tabs` / `TabsProps` | `@unofficial-krds/react/tabs` | [tabs.stories.tsx](../../apps/storybook-react/src/stories/tabs.stories.tsx) |
| `Calendar` / `CalendarProps` | `@unofficial-krds/react/calendar` | [calendar.stories.tsx](../../apps/storybook-react/src/stories/calendar.stories.tsx) |
| `DateInput` / `DateInputProps` | `@unofficial-krds/react/date-input` | [date-input.stories.tsx](../../apps/storybook-react/src/stories/date-input.stories.tsx) |
| `Masthead` / `MastheadProps` | `@unofficial-krds/react/masthead` | [masthead.stories.tsx](../../apps/storybook-react/src/stories/masthead.stories.tsx) |
| `Identifier` / `IdentifierProps` | `@unofficial-krds/react/identifier` | [identifier.stories.tsx](../../apps/storybook-react/src/stories/identifier.stories.tsx) |
| `Header` / `HeaderProps` | `@unofficial-krds/react/header` | [header.stories.tsx](../../apps/storybook-react/src/stories/header.stories.tsx) |
| `Footer` / `FooterProps` | `@unofficial-krds/react/footer` | [footer.stories.tsx](../../apps/storybook-react/src/stories/footer.stories.tsx) |
| `SkipLink` / `SkipLinkProps` | `@unofficial-krds/react/skip-link` | [skip-link.stories.tsx](../../apps/storybook-react/src/stories/skip-link.stories.tsx) |
| `MainMenu` / `MainMenuProps` | `@unofficial-krds/react/main-menu` | [main-menu.stories.tsx](../../apps/storybook-react/src/stories/main-menu.stories.tsx) |
| `Breadcrumb` / `BreadcrumbProps` | `@unofficial-krds/react/breadcrumb` | [breadcrumb.stories.tsx](../../apps/storybook-react/src/stories/breadcrumb.stories.tsx) |
| `SideNavigation` / `SideNavigationProps` | `@unofficial-krds/react/side-navigation` | [side-navigation.stories.tsx](../../apps/storybook-react/src/stories/side-navigation.stories.tsx) |
| `InPageNavigation` / `InPageNavigationProps` | `@unofficial-krds/react/in-page-navigation` | [in-page-navigation.stories.tsx](../../apps/storybook-react/src/stories/in-page-navigation.stories.tsx) |
| `Pagination` / `PaginationProps` | `@unofficial-krds/react/pagination` | [pagination.stories.tsx](../../apps/storybook-react/src/stories/pagination.stories.tsx) |
| `StructuredList` / `StructuredListProps` | `@unofficial-krds/react/structured-list` | [structured-list.stories.tsx](../../apps/storybook-react/src/stories/structured-list.stories.tsx) |
| `CriticalAlert` / `CriticalAlertProps` | `@unofficial-krds/react/critical-alert` | [critical-alert.stories.tsx](../../apps/storybook-react/src/stories/critical-alert.stories.tsx) |
| `Disclosure` / `DisclosureProps` | `@unofficial-krds/react/disclosure` | [disclosure.stories.tsx](../../apps/storybook-react/src/stories/disclosure.stories.tsx) |
| `Badge` / `BadgeProps` | `@unofficial-krds/react/badge` | [badge.stories.tsx](../../apps/storybook-react/src/stories/badge.stories.tsx) |
| `Accordion` / `AccordionProps` | `@unofficial-krds/react/accordion` | [accordion.stories.tsx](../../apps/storybook-react/src/stories/accordion.stories.tsx) |
| `Image` / `ImageProps` | `@unofficial-krds/react/image` | [image.stories.tsx](../../apps/storybook-react/src/stories/image.stories.tsx) |
| `Carousel` / `CarouselProps` | `@unofficial-krds/react/carousel` | [carousel.stories.tsx](../../apps/storybook-react/src/stories/carousel.stories.tsx) |
| `Table` / `TableProps` | `@unofficial-krds/react/table` | [table.stories.tsx](../../apps/storybook-react/src/stories/table.stories.tsx) |
| `TextList` / `TextListProps` | `@unofficial-krds/react/text-list` | [text-list.stories.tsx](../../apps/storybook-react/src/stories/text-list.stories.tsx) |
| `Favicon` / `FaviconProps` | `@unofficial-krds/react/favicon` | [favicon.stories.tsx](../../apps/storybook-react/src/stories/favicon.stories.tsx) |
| `Link` / `LinkProps` | `@unofficial-krds/react/link` | [link.stories.tsx](../../apps/storybook-react/src/stories/link.stories.tsx) |
| `FAB` / `FABProps` | `@unofficial-krds/react/fab` | [fab.stories.tsx](../../apps/storybook-react/src/stories/fab.stories.tsx) |
| `RadioGroup` / `RadioGroupProps` | `@unofficial-krds/react/radio-group` | [radio-group.stories.tsx](../../apps/storybook-react/src/stories/radio-group.stories.tsx) |
| `Checkbox` / `CheckboxProps` | `@unofficial-krds/react/checkbox` | [checkbox.stories.tsx](../../apps/storybook-react/src/stories/checkbox.stories.tsx) |
| `Tag` / `TagProps` | `@unofficial-krds/react/tag` | [tag.stories.tsx](../../apps/storybook-react/src/stories/tag.stories.tsx) |
| `Switch` / `SwitchProps` | `@unofficial-krds/react/switch` | [switch.stories.tsx](../../apps/storybook-react/src/stories/switch.stories.tsx) |
| `StepIndicator` / `StepIndicatorProps` | `@unofficial-krds/react/step-indicator` | [step-indicator.stories.tsx](../../apps/storybook-react/src/stories/step-indicator.stories.tsx) |
| `Spinner` / `SpinnerProps` | `@unofficial-krds/react/spinner` | [spinner.stories.tsx](../../apps/storybook-react/src/stories/spinner.stories.tsx) |
| `HelpPanel` / `HelpPanelProps` | `@unofficial-krds/react/help-panel` | [help-panel.stories.tsx](../../apps/storybook-react/src/stories/help-panel.stories.tsx) |
| `TutorialPanel` / `TutorialPanelProps` | `@unofficial-krds/react/tutorial-panel` | [tutorial-panel.stories.tsx](../../apps/storybook-react/src/stories/tutorial-panel.stories.tsx) |
| `ContextualHelp` / `ContextualHelpProps` | `@unofficial-krds/react/contextual-help` | [contextual-help.stories.tsx](../../apps/storybook-react/src/stories/contextual-help.stories.tsx) |
| `CoachMark` / `CoachMarkProps` | `@unofficial-krds/react/coach-mark` | [coach-mark.stories.tsx](../../apps/storybook-react/src/stories/coach-mark.stories.tsx) |
| `Tooltip` / `TooltipProps` | `@unofficial-krds/react/tooltip` | [tooltip.stories.tsx](../../apps/storybook-react/src/stories/tooltip.stories.tsx) |
| `TTS` / `TTSProps` | `@unofficial-krds/react/tts` | [tts.stories.tsx](../../apps/storybook-react/src/stories/tts.stories.tsx) |
| `Textarea` / `TextareaProps` | `@unofficial-krds/react/textarea` | [textarea.stories.tsx](../../apps/storybook-react/src/stories/textarea.stories.tsx) |
| `TextInput` / `TextInputProps` | `@unofficial-krds/react/text-input` | [text-input.stories.tsx](../../apps/storybook-react/src/stories/text-input.stories.tsx) |
| `FileUpload` / `FileUploadProps` | `@unofficial-krds/react/file-upload` | [file-upload.stories.tsx](../../apps/storybook-react/src/stories/file-upload.stories.tsx) |
| `LanguageSwitcher` / `LanguageSwitcherProps` | `@unofficial-krds/react/language-switcher` | [language-switcher.stories.tsx](../../apps/storybook-react/src/stories/language-switcher.stories.tsx) |
| `Resize` / `ResizeProps` | `@unofficial-krds/react/resize` | [resize.stories.tsx](../../apps/storybook-react/src/stories/resize.stories.tsx) |
| `AccessibleMedia` / `AccessibleMediaProps` | `@unofficial-krds/react/accessible-media` | [accessible-media.stories.tsx](../../apps/storybook-react/src/stories/accessible-media.stories.tsx) |
| `VisuallyHidden` / `VisuallyHiddenProps` | `@unofficial-krds/react/visually-hidden` | [visually-hidden.stories.tsx](../../apps/storybook-react/src/stories/visually-hidden.stories.tsx) |
| `RangeSlider` / `RangeSliderProps` | `@unofficial-krds/react/range-slider` | [range-slider.stories.tsx](../../apps/storybook-react/src/stories/range-slider.stories.tsx) |
| `BackButton` / `BackButtonProps` | `@unofficial-krds/react/back-button` | [back-button.stories.tsx](../../apps/storybook-react/src/stories/back-button.stories.tsx) |
| `BottomSheet` / `BottomSheetProps` | `@unofficial-krds/react/bottom-sheet` | [bottom-sheet.stories.tsx](../../apps/storybook-react/src/stories/bottom-sheet.stories.tsx) |
| `QuantityToggle` / `QuantityToggleProps` | `@unofficial-krds/react/quantity-toggle` | [quantity-toggle.stories.tsx](../../apps/storybook-react/src/stories/quantity-toggle.stories.tsx) |
| `Toast` / `ToastProps` | `@unofficial-krds/react/toast` | [toast.stories.tsx](../../apps/storybook-react/src/stories/toast.stories.tsx) |
| `Snackbar` / `SnackbarProps` | `@unofficial-krds/react/snackbar` | [snackbar.stories.tsx](../../apps/storybook-react/src/stories/snackbar.stories.tsx) |
| `TabBar` / `TabBarProps` | `@unofficial-krds/react/tab-bar` | [tab-bar.stories.tsx](../../apps/storybook-react/src/stories/tab-bar.stories.tsx) |

### Controlled fields and explicit integration effects

```tsx
import { useState } from 'react';
import { TextInput, RangeSlider, QuantityToggle, Checkbox } from '@unofficial-krds/react';

export function ApplicationFields() {
  const [name, setName] = useState('');
  return <form onSubmit={event => event.preventDefault()}>
    <TextInput label="신청인 이름" name="applicant" autocomplete="name"
      value={name} onValueChange={({ value }) => setName(value)} />
    <RangeSlider label="비율" name="ratio" min={0} max={100} step={10} defaultValue={50} />
    <QuantityToggle label="수량" name="quantity" min={0} max={10} step={1} defaultValue={2} />
    <Checkbox label="약관 동의" name="consent" value="agreed" />
    <button type="reset">초기화</button>
  </form>;
}
```

FileUpload retains browser File objects but its chooser is ephemeral. At explicit Submit call `appendFileUploadFormData(formData, name, committedFiles, disabled)` to replace chooser entries with exactly the committed enabled records. The fixture uses the same driver for actual native `formdata` events and a Submit-gated local transfer mock. Selection never transfers files.

Toast visibility and queue remain host owned. Render the same result text at the discoverable persistentResultId outside the transient notification. Accepting onDismiss removes the current message; rejecting it leaves the notification visible after one consumed timeout. Snackbar actions remain native buttons or anchors.

Favicon emits actual React 19 document metadata. Host identity assets, translations, routing/history, speech output, media equivalence and authentic sign-language content remain explicit host responsibilities. Local media uses an arithmetic tone and geometric video; no synthesized speech or fabricated sign-language equivalent is supplied.

An independent service passes `governmentService={false}` and renders no official Masthead sentence. A labeled banner UI simulation may explicitly pass `governmentService={true}` only beside the visible nonofficial simulation notice; the example does not establish government affiliation.

Numeric controls reject endpoints or values that do not fit the declared decimal step lattice. FileUpload chooser controls are ephemeral and unnamed: append each enabled committed store once with `appendFileUploadFormData`, either in a formdata listener or in the explicit Submit driver. This preserves unrelated same-name fields and other uploaders.
