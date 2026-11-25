# KRDS fixtures verification map

This directory is the maintained source for verifying what a user can do with KRDS components. Read this index before driving a fixture, then use the matching feature file as the recipe.

## Baseline preconditions

- Work from the repo root.
- `node .claude/skills/verify-krds-fixtures/drive.mjs doctor --framework <id>` exits 0.
- Every recipe starts from a fresh `drive.mjs run`, which opens the case in its seeded state. Nothing carries over between runs.
- Recipes are written against `--framework react`. Run the same recipe on each framework the change reaches.

## Driving conventions

- Use ARIA roles and exact accessible names. Copy Korean names from the snapshot, never retype them from memory.
- Treat every command as literal. Keep quoted names and flags unchanged.
- Put one user journey in one run. Give each run a `--name` that says what it proves.
- Use `--expect`, `--expect-none` and `--expect-focus` to state the end state. A run with no expectation proves only that nothing crashed.

## Proof and skip reporting

- Cite the evidence folder that `drive.mjs` prints, and the step numbers that show the action and the result.
- Report the frameworks you ran and the ones you did not.
- Report an entry point you could not drive with the command you tried and what it printed.
- Do not report a skipped entry point as verified through a different one.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point.
3. `Driving it with drive.mjs` starts with `Preconditions:` and uses labeled bullets that pair each user action with an exact command and observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

Keep implementation details out of the map. Name only user paths, stable handles, required state, commands, and observable proof.

## Features

- [Accordion](./accordion.md) covers expanding and collapsing a panel by pointer and keyboard.
- [Modal](./modal.md) covers opening, closing by Escape and by the close button, and focus return.
- [Tabs](./tabs.md) covers arrow-key movement and manual activation.
- [Calendar](./calendar.md) covers choosing a day, confirming it, and moving between months.

The other components have no feature file yet. List their cases with `drive.mjs cases`, read the expected outcome of each, and add a file here when you first verify one.
