# Modal

Semantic ID `modal`; export `Modal`; source `component_04_05`: [KRDS Modal](https://www.krds.go.kr/html/site/component/component_04_05.html). Read [common conventions](README.md).

## Official requirements

KRDS requires initial focus on the dialog itself or its first interactive element, confinement of keyboard and screen-reader focus to the active modal, restoration to its opening control, and logical reading order. The icon close button is the final element in modal markup. Tab/Shift+Tab wrap within the modal. Escape closes when a close button is provided.

## Project API and defaults

Options: `open?: boolean`, `defaultOpen?: boolean` (false), `onOpenChange(OpenChangeDetails)`, `closeOnOutsideClick: boolean` (false), `showCloseButton: boolean` (true), `initialFocusId?: string`, `returnFocusId?: string`, required title content/ID, optional description content/ID, body and action content. `showCloseButton=false` requires an enabled explicit close/cancel action in the body/footer. showCloseButton controls only the icon close button, not Escape permission. No modal without a reachable close action is allowed in the pilot, and there is no independent Escape opt-out when a close button is provided.

Render `role=dialog`, `aria-modal=true`, and `aria-labelledby` referencing its visible title. Description is optional and referenced only when present; do not announce an entire structured body as a flat description. Order: title, optional description, body, actions, icon close button last. Give the icon close button the translated default name `닫기` (`Close` for English) or an explicit local label. Close controls are type=button. Dialog content remains scrollable in a small viewport; background scrolling and interaction are blocked while actually open. Closed content is hidden/inert and not in the accessibility or tab tree.

## Dismissal and focus policy

On actual false→true transition, save the opener/active element. If initialFocusId is supplied, it may identify only the dialog container itself or the first enabled, visible, focusable interactive element in the dialog's logical DOM order; any other target (including a later action or the final close button when another interactive element precedes it) is a configuration error. Otherwise focus the dialog container with tabindex=-1. The dialog container uses tabindex=-1 when targeted explicitly as well. The latter is the deliberate default so the title and content context precede actions. Apply inert/background isolation, including screen-reader access, outside the active portal; preserve and restore pre-existing inert/scroll states. Tab and Shift+Tab cycle through enabled visible focusables; if none remain, keep focus on the dialog. Nested modals permit only the topmost modal to trap focus and process dismissal. Parent remains inert until child closes.

Outside pointer interaction is blocked by the backdrop and defaults to no dismissal. When `closeOnOutsideClick=true`, dismiss only a primary pointer gesture that starts and ends on the backdrop; a drag starting inside, secondary click, or click on a descendant never dismisses. Emit one `{open:false}` request. This option is project policy, not an inferred KRDS requirement.

Escape requests close whenever actually open, topmost, with a provided close button (the icon close button or the required explicit close/cancel action), and the event has not already been handled by an inner widget. A configuration cannot disable this dismissal while retaining a close button. Ignore Escape during IME composition (including keyCode 229 fallback). Consume only the Escape that is processed. An inner select/popover gets its own Escape first. Explicit close/cancel, trigger-open, and allowed outside dismissal each emit one request if state differs. An open trigger on an already open dialog emits zero. A controlled rejected close leaves focus trap, background isolation and UI open; do not restore focus before the parent's false prop arrives.

On actual true→false, remove isolation and restore focus to the saved opener whenever it remains mounted, visible, enabled, focusable and not inert; returnFocusId must never override a usable opener. Only when the opener is absent or unusable may a supplied returnFocusId identify an alternate visible, enabled, focusable, non-inert target. If that alternate is absent or unusable, focus the nearest remaining usable focusable ancestor of the opener; if none, focus document body using a temporary tabindex=-1 (restore prior tabindex). Unmounting an open dialog performs the same cleanup and restoration, without a synthetic user-change event. An initially open dialog with no opening action has no opener: use a usable returnFocusId, otherwise body. Prop transitions and mount emit zero open-change callbacks.

## Form, states and acceptance

No value/name or form-reset state. Enter submits a nested form only through its normal submitter; never treat all Enter keys as modal confirmation. Action failure is application content: keep open and announce a visible error, without implicit retry/close. Opening and closing animations must preserve these logical states and honor reduced motion.

Parts: `root`, `trigger`, `backdrop`, `content`, `title`, `description`, `body`, `actions`, `close`. Root/backdrop/content states: `open` or `closed`. Acceptance: title relationship; final close markup; dialog/first-interactive focus entry only, focus trap, mandatory usable-opener return and removed-opener fallback; backdrop default and opt-in drag protection; mandatory close-button Escape with topmost/handled/composing safeguards; controlled rejected dismissal; restoration on unmount; no duplicate open notifications.
