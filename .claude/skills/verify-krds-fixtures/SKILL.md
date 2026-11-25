---
name: verify-krds-fixtures
description: Drive a KRDS component in the built native fixture apps (apps/fixture-react, solid, svelte, vue, lit, qwik, angular, solid-next) with headless Chromium, the way a user would, and keep ARIA snapshots and screenshots as proof. Use after changing any component in packages/<framework>, packages/styles or packages/tokens, before saying a UI change works, and when a component misbehaves in one framework.
---

# Verify KRDS components in the native fixtures

KRDS Native ships each component once per framework. What a user touches is the component rendered by that framework, so the proof is a real browser on a real production build of `apps/fixture-<framework>`. Every fixture serves one component case at `/fixtures/<componentId>?case=<caseId>`.

Two tools exist. Use both for a component change.

| Tool | Answers | Command |
| --- | --- | --- |
| Catalog scenarios | Did any of the 315 scripted outcomes regress? | `PLAYWRIGHT_BROWSERS_PATH="$HOME/Library/Caches/ms-playwright" node tools/yarn.mjs test:contract --framework <id> --catalog --automated --component <id>` |
| `drive.mjs` | Does this change do what I claim, with evidence a reviewer can open? | `node .claude/skills/verify-krds-fixtures/drive.mjs run ...` |

Run every command from the repo root. Read [features/README.md](features/README.md) before driving, then follow the file for your component.

## Rules that are not negotiable here

- **Headless only.** Never open a visible browser window on this machine. Always pass `--automated` to catalog runs. Without it, `toast/outcome-05` and `snackbar/outcome-12` open a headed Chromium and take the user's focus. `drive.mjs` is always headless.
- **Judge against the official guide.** The standard is the KRDS guide excerpt in `specs/components/<id>.md`. Two frameworks agreeing with each other proves nothing.
- **One framework at a time.** Parallel browser runs on one machine make timing scenarios flake. Rerun a suspect alone before calling it a failure.
- **No downloads without asking.** If a browser binary is missing, tell the user. Do not install it.

## Launch

There is no long-lived server. Each `drive.mjs run` does all of this itself:

1. Builds the fixture with `node tools/yarn.mjs nx run fixture-<framework>:build`. Nx hashes the fixture and every package it depends on, so an unchanged fixture is a cache hit of about two seconds and a changed one is rebuilt. The log goes to `build.log` in the evidence folder.
2. Snapshots the production build into memory and serves it on a free port on `127.0.0.1`.
3. Opens the case in headless Chromium at 1920x1080 with locale `ko-KR`, timezone `Asia/Seoul`, light scheme and reduced motion.
4. Waits until the fixture is usable: `window.__KRDS_FIXTURE__.protocol` is 1, the fixture reports the framework you asked for, the status named `Fixture health` is present, and no note says `Component not implemented`.

Two runs never share a port, a browser or state, so runs of different frameworks are isolated from each other. Do not start two runs of the same framework at once, because both would build the same `dist/`.

The catalog runner serves the build the same way but does not build it. Run `node tools/yarn.mjs nx run fixture-<framework>:build` before it.

## Doctor

```bash
node .claude/skills/verify-krds-fixtures/drive.mjs doctor --framework react
```

Read-only. It reports the Node version in use, whether Playwright's Chromium is installed and where, and whether the fixture has a build. Exit 0 means the fixture is worth driving. Omit `--framework` to check all eight. Run it first whenever a run fails before step `00`.

## Drive

List what can be driven:

```bash
node .claude/skills/verify-krds-fixtures/drive.mjs cases
```

```bash
node .claude/skills/verify-krds-fixtures/drive.mjs cases --component modal
```

Drive one case. Actions run in the order given and the run stops at the first one that fails:

```bash
node .claude/skills/verify-krds-fixtures/drive.mjs run --framework react --component modal --case focus-return --name modal-focus --click button "열기" --expect dialog "확인" --press Escape --expect-none dialog "확인" --expect-focus button "열기"
```

| Action | Meaning |
| --- | --- |
| `--click <role> <name>` | Click the element with that ARIA role and exact accessible name. |
| `--hover <role> <name>`, `--focus <role> <name>` | Hover or focus it. |
| `--fill <role> <name> <value>` | Replace the value of a text field. |
| `--press <key>` | Press a key on the focused element, such as `Tab`, `Enter`, `Escape`, `ArrowRight`, `Shift+Tab`. |
| `--wait <milliseconds>` | Wait. Prefer an `--expect` to a wait. |
| `--expect <role> <name>` | The element is visible. |
| `--expect-none <role> <name>` | No such element is visible. |
| `--expect-focus <role> <name>` | The element holds keyboard focus. |
| `--expect-text <text>` | The text is visible on the page. |

Other options: `--viewport 390x844` for a narrow check, and `--name`, a lowercase label that names the evidence folder.

Find roles and names by running with no actions and reading `00-open.aria.yml`. Fixture text is Korean. Copy names from the snapshot exactly.

Exit code 0 means every action passed and the page threw no uncaught error. Exit 1 means an action failed, and the evidence is still written. Exit 2 means the run could not start: unknown case, failed build, missing browser.

### Frameworks

To cover every framework, repeat the same command with each framework the case lists. `drive.mjs cases --component <id>` prints that list for every case.

| Framework | What it can drive |
| --- | --- |
| `react`, `solid`, `svelte`, `vue`, `lit`, `qwik`, `angular` | Every case: the 315 catalog cases and the pilot cases. |
| `solid-next` | Only the pilot cases for `button`, `native-select`, `modal`, `tabs`, `date-input` and `calendar`. It implements no other component. `drive.mjs` exits 2 if you ask for one. |

The four recipes in the feature map ran unchanged on all eight frameworks at commit `7a3ef4a`, apart from accordion on `solid-next`, which does not exist. Lit renders into shadow DOM. Role and name lookups and `--expect-focus` see through it, so the same commands work.

When a name is not found in one framework, read that framework's `00-open.aria.yml` and decide from `specs/components/<id>.md` which one is wrong.

## Evidence

Each run writes `test-results/verify/<name>-<framework>-<timestamp>/`:

| File | Content |
| --- | --- |
| `run.json` | Framework, case, URL, the SHA-256 of the served build, every action with pass or fail, the focused element after each action, the component events the fixture recorded, console errors and uncaught page errors. |
| `NN-<action>.aria.yml` | The accessibility tree after action NN. `00-open` is the starting state. |
| `NN-<action>.png` | A screenshot after action NN. |
| `build.log` | Output of the fixture build. |

A proof meets these standards:

- It exercises the user path: clicks, keys and typing on the rendered component. Do not call `window.__KRDS_FIXTURE__.setState` to put the component in the end state.
- It shows the action and the result. Cite the snapshot before and after, not only the last one.
- It checks side effects. For a callback, cite `events` in `run.json`. For focus, use `--expect-focus`. For form values, use a catalog scenario that reads `FormData`.
- It looks at the screenshot for anything visual. An ARIA snapshot cannot see a wrong color, overlap or clipped text. Check 1920x1080 and one narrow viewport.
- It names the frameworks it ran. A change to `packages/styles` or `packages/tokens` reaches all eight. A change to `packages/react` reaches one.

The catalog runner writes `test-results/t05/contract-<id>/report.json` and prints that path. With `--automated` it reports 13 scenarios per framework as needing manual review and lists the two that need a visible window. Say so in your report. They are not passes.

## Cleanup

Nothing outlives a run. `drive.mjs` closes its own browser and its own server before it exits, including after a failure. If you interrupt it, it leaves no data behind, and you may kill only the process ID you started.

`test-results/` is ignored by git and holds the evidence. Do not delete it during cleanup. Remove a scratch change with `git checkout -- <file>`, and the next run rebuilds the fixture from the restored source.

## Limits

- Chromium only. The catalog runner accepts `--browser firefox` and `--browser webkit` when those binaries are installed.
- `drive.mjs` has no drag, touch, file upload or fake clock. Slider drags, tooltips on touch, uploads, and toast or snackbar timing belong to the catalog scenarios in `tools/testing/`.
- The fixtures prove components. The docs site in `apps/docs` and the Storybooks are separate surfaces. Storybook has `node tools/yarn.mjs test:stories --framework <id>`.
- Date arithmetic in `packages/contracts` has its own exhaustive check in the `verify-calendar-date` skill.
