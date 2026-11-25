# Tabs

Tabs let a user switch between panels of related content. With manual activation, arrow keys move focus between tabs and the panel changes only when the user confirms.

## Sub-features

- `tabs-pointer` selects a tab by click and shows its panel.
- `tabs-arrow-focus` moves focus with the arrow keys without changing the panel.
- `tabs-manual-activate` selects the focused tab with Enter.

## How to get to it (user POV)

- Click a tab such as `두 번째`.
- Tab into the tab list, press ArrowRight or ArrowLeft, then Enter.

## Driving it with drive.mjs

Preconditions:

- Case `tabs/manual-activation` seeds a tab list named `정보` with tabs `첫 번째` (selected) and `두 번째`.

- **Pointer select.** Click the second tab. Run `node .claude/skills/verify-krds-fixtures/drive.mjs run --framework react --component tabs --case manual-activation --name tabs-pointer --click tab "두 번째" --expect tabpanel "두 번째"`. The snapshot shows `tab "두 번째" [selected]` and `tabpanel "두 번째"`.
- **Arrow moves focus only.** Focus the first tab and press ArrowRight. Run `node .claude/skills/verify-krds-fixtures/drive.mjs run --framework react --component tabs --case manual-activation --name tabs-arrow-focus --focus tab "첫 번째" --press ArrowRight --expect-focus tab "두 번째" --expect tabpanel "첫 번째"`. Focus is on `두 번째` while the panel is still `첫 번째`.
- **Enter activates.** Continue with Enter. Run `node .claude/skills/verify-krds-fixtures/drive.mjs run --framework react --component tabs --case manual-activation --name tabs-manual-activate --focus tab "첫 번째" --press ArrowRight --press Enter --expect tabpanel "두 번째"`. The panel is now `두 번째`, and `events` in `run.json` lists one `valueChange`.
- **Proof.** Cite the snapshot after ArrowRight, where the selected tab has not changed, next to the snapshot after Enter.

## Gotchas

- This case is manual activation. A panel that changes on ArrowRight is a failure here, even though automatic activation is valid elsewhere.
- The component is `tabs`. `tab-bar` is a different component with its own catalog cases.
