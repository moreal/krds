# Consent with confirmation modal

Route `/examples/consent-confirmation`; case IDs `required-refusal`, `optional-refusal-success`, `modal-focus-return`, `retry-in-dialog`. Title `예제 이용 안내 확인`. This is a reversible in-memory learning interaction, with no legal consent collection, marketing enrollment, institutional submission or authentication.

Compose two native `RadioGroup`s, `Button`, `Modal` and `Spinner`. Use `consentContent` for headings and short structured paragraphs. Each group has explicit options `동의함` (`true`) and `동의하지 않음` (`false`); use native same-name radios, actual legends, right-side labels and description associations. The required group has no initial selection; optional starts with explicit refusal. Required and optional are visibly distinguished in their titles. No all-agree shortcut is needed for these two groups, and declining optional never blocks completion.

| Group | Actual radio IDs | Initial/model policy |
| --- | --- | --- |
| `requiredChoice` | `example-consent-required-agree`, `example-consent-required-decline` | `null`; only true permits review. |
| `optionalChoice` | `example-consent-optional-agree`, `example-consent-optional-decline` | `false`; both choices permit review. |

Native RadioGroup accepts string/null values; native hosts map the strings `agree`/`decline` to model booleans without serializing machine objects. Give groups distinct names and keep both options sequentially reachable per the accepted RadioGroup contract. A change request updates the committed host value once. Do not mutate radio state only through CSS or ARIA.

Opener `example-consent-review` has text `확인하기` and type=button. With missing/refused required choice, `review` leaves the modal closed, explains the required choice, and focuses actual radio `example-consent-required-agree`. With required agreement, it sets `modalOpen=true`, phase `confirming`. The modal title `예제 선택 확인` has ID `example-consent-dialog-title`; its container is `example-consent-dialog`. Its compact content summarizes both choices and visibly says `선택 결과는 이 화면에서만 확인되며 실제 신청이나 전송은 이루어지지 않습니다.`

Modal order: title, short description, choice summary, actions `돌아가기` and `예제 완료`, final icon close `닫기`. Cancel ID `example-consent-cancel`; confirm ID `example-consent-confirm`. Initial focus goes to the dialog container (`tabindex=-1`). Use the actual native Modal portal/trap/isolation/close behavior. Tab and Shift+Tab remain inside; background access/scroll are isolated; Escape closes according to the accepted Modal rules, with composing/handled events respected. Background click does not close by default.

| Event | Transition and success condition |
| --- | --- |
| `consent` before review | Change only the chosen group, clear an obsolete receipt/error. |
| `review` | Check required agreement and open the actual named modal when valid. |
| `confirm` | Start one local `confirm-consent` request; modal stays open/busy. Duplicate confirmation while loading is ignored. |
| Local failure | Keep modal open, retain choices, show visible error and `다시 시도`. Keep focus in the dialog; no premature restoration. |
| `retry` | Start one new local request. |
| Local success | Close modal; show `DEMO-CONSENT-001` with both choices as an explicitly local result. |
| `close` from cancel/icon/Escape | Close without completion, preserve choices; invalidate pending completion. |

Capture the actual opener and page scroll position immediately before opening. On an actual open→closed transition, native Modal restores the usable saved opener. The host restores the saved scroll position if scroll locking/focus restoration moved it, after the DOM has settled, using a nonanimated scroll. Do not replace a usable opener with a fallback target or dispatch fake focus success. Closing must leave the user at the same relevant page location; test scroll within a small browser-layout tolerance. A late completion after cancel cannot show a receipt or reopen the dialog. The close/cancel controls stay usable during pending work.

`modal-focus-return` requires enough local page content to scroll to the opener, then tests focus and page position after Escape and after explicit cancel. Also test actual success closure and failure remaining open. Removed opener cleanup follows the existing native Modal contract; do not invent an impossible focus target. The driver does not implement focus or scrolling.

Story snapshots: `krds-pattern-consent-confirmation--editing/invalid/confirming/loading/error/success`. An initially open story uses the accepted Modal fallback policy; it does not prove opener restoration. Integration behavior is in separate native fixture tests.

Guidance basis: [KRDS consent](https://www.krds.go.kr/html/site/global/global_03.html), [confirmation/finalization](https://www.krds.go.kr/html/site/service/service_04_06.html), and accepted [Modal](../../specs/components/modal.md)/[RadioGroup](../../specs/components/radio-group.md) contracts. The official confirmation guidance distinguishes compact modal information from larger full pages; this example deliberately uses a short summary. Its mock receipt, reversible effect and explicit scroll restoration are independent policy. See [sources](../../docs/patterns/sources.md).
