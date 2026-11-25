# Accordion

An accordion lets a user open and close a titled panel to show or hide its content, by pointer or keyboard, without losing their place.

## Sub-features

- `accordion-pointer` opens a panel when its header is clicked.
- `accordion-keyboard` toggles a panel with Enter and Space while focus stays on the header.
- `accordion-multiple` keeps one panel open while another opens.

## How to get to it (user POV)

- Click a header button such as `신청 자격`.
- Tab to a header button and press Enter or Space.

## Driving it with drive.mjs

Preconditions:

- Case `accordion/outcome-01` seeds two closed panels, `신청 자격` and `제출 서류`, with multiple panels allowed.

- **Pointer open.** Click the first header. Run `node .claude/skills/verify-krds-fixtures/drive.mjs run --framework react --component accordion --case outcome-01 --name accordion-pointer --click button "신청 자격" --expect-text "예제 신청 자격 안내"`. The snapshot after step 01 shows `button "신청 자격" [expanded]` and the paragraph `예제 신청 자격 안내`.
- **Keyboard toggle.** Focus the header, press Enter, then Space. Run `node .claude/skills/verify-krds-fixtures/drive.mjs run --framework react --component accordion --case outcome-01 --name accordion-keyboard --focus button "신청 자격" --press Enter --expect-text "예제 신청 자격 안내" --expect-focus button "신청 자격" --press Space --wait 300`. After Enter the panel text is visible and focus is still on the header. The snapshot after Space shows the button without `[expanded]`.
- **Second panel.** Open both panels. Run `node .claude/skills/verify-krds-fixtures/drive.mjs run --framework react --component accordion --case outcome-01 --name accordion-multiple --click button "신청 자격" --click button "제출 서류" --expect-text "예제 신청 자격 안내" --expect-text "예제 제출 서류 안내"`. Both paragraphs are visible.
- **Proof.** Cite the `[expanded]` state in the `.aria.yml` before and after the action, and the screenshot of the open panel.

## Gotchas

- `--expect-none` takes a role and a name, so it cannot assert that panel text is gone. Read the snapshot after the closing action for the missing `[expanded]`.
- The fixture renders a `본문` region and a `다음 작업` button after the accordion. They belong to the fixture host, not the component.
- Cases `outcome-03` to `outcome-05` seed different panels. Read their `00-open.aria.yml` before reusing these names.
