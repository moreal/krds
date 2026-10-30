# Input form with error summary

Route `/examples/form-errors`; case IDs `error-summary-focus`, `retry-success`, `reset-cancels-pending`. This is an independent practice form, titled `예제 입력폼`. Display the independent identity/data notices from `demoIdentity` before the fields. It does not submit a government application.

Compose native `TextInput`, `NativeSelect`, `Textarea`, `Button` and `Spinner` with a real `<form>`. A native host error-summary section is appropriate; there is no invented ErrorSummary adapter export. Keep the form in one visible section with a heading, labels and nearby help. Do not hide required fields in Tabs or Accordion.

| Field / real control ID | Visible label | Initial value and validation |
| --- | --- | --- |
| `title` / `example-form-title` | 예제 제목 (필수) | Empty. Trim for validation/payload only; 4–60 Unicode code points. Preserve the raw view draft. |
| `category` / `example-form-category` | 연습 유형 (필수) | Empty prompt; choose `practice` or `feedback` from `formCategories`. |
| `detail` / `example-form-detail` | 추가 설명 (선택) | Empty; at most 120 Unicode code points, no trimming/rewrite. |

Use `name=title/category/detail` on actual form controls. Actual labels focus their controls. Enter submits through normal form semantics after IME composition finishes. An app handler may prevent a real navigation and dispatch `submit`; it must not bypass validation by calling a button-only handler. Use `novalidate` if needed to show the unified host summary; retain `required`, native validity and accessible relationships on real inputs. Preventing native tooltip UI does not remove field semantics. These sample length rules count Unicode code points: do not truncate with a UTF-16 `maxlength` before host validation; retain editable drafts and expose the host error through native validity as appropriate.

The summary has ID `example-form-errors`, visible heading `입력 내용을 확인하세요`, and an ordered list of links to `#example-form-title`, `#example-form-category`, `#example-form-detail` for existing errors only. Use each error's `errorId` for its inline message, referenced from the real control; expose `aria-invalid=true`. Clicking a summary link dispatches `error-link`, then the native owner focuses that actual field with the supplied focus effect. In Shadow DOM, ID strings on the outer host alone are insufficient: resolve the adapter's actual focus/control API and verify the accessible field receives focus.

| Event | State transition and observable success condition |
| --- | --- |
| `field` | Commit a raw draft. If errors were exposed, revalidate them without moving focus or erasing values. |
| `submit` with invalid data | `invalid`, no request. Summary and inline errors appear in field order. First invalid **real field** receives focus. Summary is announced without stealing that focus. |
| `submit` with valid data | `loading`, one `submit-form` local request. Set form `aria-busy`; disable repeat submit and editing consistently while pending. |
| Duplicate submit while loading | No second request. |
| Local failure | `error`, raw values retained, visible explanation and `다시 시도`. No receipt. |
| `retry` | Same entered values are revalidated; exactly one next local request. |
| Local success | `success`; visible `DEMO-FORM-001` and normalized title. Announce a local example completion, without claiming delivery. |
| Native noncanceled reset | Blank baselines, no field-change notifications. Reset invalidates outstanding completion and clears summary/receipt. |

Actions: `example-form-submit` (`예제 저장`, submit), `example-form-reset` (`초기화`, reset), `example-form-retry` (`다시 시도`, button). Keep reset visually/spatially distinct from submit. On successful completion keep the form controls consistent with the model; changing an enabled value starts editing again and clears the old receipt. Do not accidentally treat `success` as another submit.

`retry-success` starts with title `예제 입력폼 연습`, category `practice`, and seed `error-once`. `reset-cancels-pending` starts with those same values and seed `loading`; native reset must happen through the real form. A prevented reset is a no-op and must not dispatch `reset`.

Story snapshots: `krds-pattern-form-errors--editing/invalid/loading/error/success`. Import pure presentation data and pass local state to a native presentation component; never start the local driver from a story. Requests/retry/reset/focus are separate fixture behavior tests.

Guidance basis: [KRDS input form](https://www.krds.go.kr/html/site/global/global_08.html), [errors](https://www.krds.go.kr/html/site/global/global_07.html), and [application form](https://www.krds.go.kr/html/site/service/service_04_05.html); frozen references and independent-policy distinctions are in [sources](../../docs/patterns/sources.md). The linked summary and this precise validation schema are project choices. No production backend or server validation is implemented here.
