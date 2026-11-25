# Modal

A modal shows a dialog above the page, keeps the user inside it until they close it, and returns them to the control that opened it.

## Sub-features

- `modal-open` opens the dialog from its trigger.
- `modal-escape` closes the dialog with Escape.
- `modal-close-button` closes the dialog with its close button.
- `modal-focus-return` puts focus back on the trigger after either close.

## How to get to it (user POV)

- Click the `열기` button.
- Tab to the `열기` button and press Enter.

## Driving it with drive.mjs

Preconditions:

- Case `modal/focus-return` seeds a closed dialog titled `확인` with a trigger button `열기`.

- **Open.** Click the trigger. Run `node .claude/skills/verify-krds-fixtures/drive.mjs run --framework react --component modal --case focus-return --name modal-open --click button "열기" --expect dialog "확인"`. The snapshot shows `dialog "확인"` with the heading `확인` and a `닫기` button.
- **Escape and focus return.** Open, press Escape. Run `node .claude/skills/verify-krds-fixtures/drive.mjs run --framework react --component modal --case focus-return --name modal-escape --click button "열기" --expect dialog "확인" --press Escape --expect-none dialog "확인" --expect-focus button "열기"`. The dialog is gone and focus is on `열기`.
- **Close button and focus return.** Open, click `닫기`. Run `node .claude/skills/verify-krds-fixtures/drive.mjs run --framework react --component modal --case focus-return --name modal-close-button --click button "열기" --click button "닫기" --expect-none dialog "확인" --expect-focus button "열기"`. The dialog is gone and focus is on `열기`.
- **Proof.** Cite the `--expect-focus` step, and `events` in `run.json`, which lists `openChange` with `open: true` then `open: false`.

## Gotchas

- Focus return is the point of this case. A run that only checks the dialog disappeared proves half of it.
- `modal/trigger-removed` covers a trigger that is gone when the dialog closes. Its end state differs, so do not reuse the focus expectation there.
- The fixture's `다음 작업` button sits outside the dialog and is not part of the component.
