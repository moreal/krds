# Calendar

A calendar lets a user pick a day from a month grid, confirm the choice, and move between months without losing it.

## Sub-features

- `calendar-select` marks the clicked day as selected.
- `calendar-confirm` reports the chosen date when the user confirms.
- `calendar-months` moves to the previous and next month.
- `calendar-selection-persists` keeps the chosen day marked when it appears as an adjacent-month day.

## How to get to it (user POV)

- Click a day button such as `2024년 2월 29일 목요일`.
- Click `이전 달` or `다음 달` beside the month heading.
- Click `확인`, `취소` or `지우기` below the grid.

## Driving it with drive.mjs

Preconditions:

- Case `calendar/selection-confirm` seeds February 2024 with no day selected.

- **Select a day.** Click the leap day. Run `node .claude/skills/verify-krds-fixtures/drive.mjs run --framework react --component calendar --case selection-confirm --name calendar-select --click button "2024년 2월 29일 목요일" --expect button "2024년 2월 29일 목요일, 선택됨"`. The day button is renamed with `선택됨` and shows `[pressed]` in the snapshot.
- **Confirm.** Select, then confirm. Run `node .claude/skills/verify-krds-fixtures/drive.mjs run --framework react --component calendar --case selection-confirm --name calendar-confirm --click button "2024년 2월 29일 목요일" --click button "확인"`. `events` in `run.json` lists `valueChange` with value `2024-02-29`.
- **Move between months.** Go back one month and forward two. Run `node .claude/skills/verify-krds-fixtures/drive.mjs run --framework react --component calendar --case selection-confirm --name calendar-months --click button "이전 달" --expect heading "2024년 1월" --click button "다음 달" --click button "다음 달" --expect heading "2024년 3월"`. The heading follows each click.
- **Selection persists.** Select, move to March. Run `node .claude/skills/verify-krds-fixtures/drive.mjs run --framework react --component calendar --case selection-confirm --name calendar-selection-persists --click button "2024년 2월 29일 목요일" --click button "확인" --click button "다음 달" --expect heading "2024년 3월" --expect button "2024년 2월 29일 목요일, 선택됨, 다른 달"`. The leap day in March's first row is still marked selected.
- **Proof.** Cite the grid in the `.aria.yml`: six rows, Sunday first, with adjacent-month days named `다른 달`. Cite the `valueChange` event for the confirmed date.

## Gotchas

- A day's accessible name changes when it is selected and when it belongs to an adjacent month. Read the snapshot for the exact name before you click or expect it.
- The grid dates come from `packages/contracts/src/calendar-date.ts`. A wrong weekday or missing day is probably there. Run the `verify-calendar-date` skill before debugging the component.
- `date-input` opens this calendar in a dialog named `날짜 선택` from the `달력 열기` button. It is a separate component with its own cases and has no feature file yet.
