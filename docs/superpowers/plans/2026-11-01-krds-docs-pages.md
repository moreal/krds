# KRDS docs Pages implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement task-by-task. The controller owns delegation and final review. No commits are authorized in this task.

**Goal:** Complete the approved Korean documentation entry experience and deployable GitHub Pages build.

**Architecture:** Preserve VitePress's default navigation, local search, sidebar and runtime chunk workaround. Render the public Vue Link, Badge, Button and Switch in a deterministic, scoped home example. Generate documentation only from explicit checked source inputs.

**Tech Stack:** VitePress 1.6.4, Vue 3.5.44, Node 24.18.0, Yarn 4.14.1, Playwright 1.64.1.

**Spec:** `docs/superpowers/specs/2026-10-31-krds-vitepress-pages-design.md` (recommended approach approved in this session).

## Global constraints

- `/krds/` base; `cleanUrls: false`; native fixture/Storybook links stay local-only.
- Preserve all 54 references and historical compiler/source/legal checkpoints and their hashes.
- Use public native Vue subpaths and direct `workspace:^` dependencies; no global reset, fonts or external assets.
- Preserve independent MIT and separate official KRDS/font terms. No commits, push, tags or npm publication in this task.

## Review focus

- Direct `.html` navigation/reload, search and source/legal links work beneath `/krds/`.
- SSR and hydrated example state and IDs agree, with no browser errors or external requests.
- Keyboard, mobile, doubled text and dark/reduced-motion UI remain usable.
- Optional declaration/Storybook outputs cannot change public generated files or downloads.
- Pages deploy has minimum permissions, exact tools, validation before upload, and no PR deployment.

### Task 1: Korean entry pages and native example

- [x] Update README and authoritative quickstart, register a Vue home component with public subpath imports, and scope shared component CSS/tokens.
- [x] Declare exact tooling/runtime dependencies and Nx prerequisites; include `.vue` in `vue-tsc` checks.
- [x] Validate home SSR output, example keyboard/state changes, shell navigation and accessibility in Chromium/WebKit.

### Task 2: Deterministic public generation and prefix-safe links

- [x] Remove optional local build outputs from public generation, preserve tracked checkpoint/proof inputs, and document local preview commands.
- [x] Set base/URLs, adapt preview server and static/browser link tests to the prefix.
- [x] Regenerate snapshots and explicit rights inventory; verify two builds have identical deployment file hashes.

### Task 3: Verified Pages workflow and handoff

- [x] Add main-push/manual official Pages workflow with immutable selected toolchain, type/docs/browser/legal checks, and deployment concurrency/environment.
- [x] Run focused workspace, docs and legal checks; record results and produce a review diff package for the controller.
- [ ] Controller independent review, signed commit/push authorization, and live Pages verification remain controller-owned final steps.
