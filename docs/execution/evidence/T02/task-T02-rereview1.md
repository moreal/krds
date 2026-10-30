# T02 focused rereview 1

Spec compliance: ✅. Code quality: **Approved**. Both original Important findings are addressed; no new Critical, Important or Minor issue was found in the fix diff.

| Original finding | Status | Evidence |
| --- | --- | --- |
| Escape opt-out despite a provided close button | **ADDRESSED** | `specs/components/modal.md:11` removes `closeOnEscape` and states that hiding the icon does not control Escape permission. Line 21 requires dismissal requests when a close button or the required explicit close/cancel action exists, preserving topmost, handled-event and composition safeguards. This aligns with frozen source lines 1187/1231. |
| Arbitrary initial and return focus targets | **ADDRESSED** | `specs/components/modal.md:17` permits only the dialog container or first enabled/visible/focusable interactive element and rejects later targets. Line 23 makes a usable opener mandatory and permits an alternate only when the opener is absent/unusable. Initial-open and removed-opener fallbacks remain explicit. This aligns with frozen source line 1134. |

The acceptance paragraph at `specs/components/modal.md:29` now covers both constraints. Controlled rejected dismissal still retains the open dialog, isolation and focus trap; prop-driven transitions still emit zero callbacks. The revised paragraphs are mutually consistent and introduce no additional independent Escape permission.

Scope: inspected only `task-T02-fix1-review-package.md`, the appended fix-round report, and `t02-logs/modal-fix-round1-alignment.log`. The alignment log includes the unchanged frozen source excerpts and revised paragraphs. The appended report records a successful `verify:catalog` run with 55 records, 54 web-applicable, 378 stable plus 54 preview planned entries and zero verified. No tests were rerun, no broad review or adapter review was performed, and no source, Git or T03 file was changed. The prior review's unaffected code findings and evidence limits remain in force; this approval concerns T02 contracts/specification work rather than adapter completion or release readiness.
