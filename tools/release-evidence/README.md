# Release evidence v3

These helpers validate producer-specific facts. Parsing a historical report is diagnostic and awards no current candidate. The final verifier also requires the exact candidate commit/tree, catalog, native matrix, tarballs, installed consumers, rights, ownership and versions.

`producers.mjs` implements patterns, documentation, preview, CI, independent review and manual-session evidence. It consumes current source/output inventories and the lossless selected-Node subprocess format used by T14. There are no signing keys, enrollment or new approval service.

## Capture and assemble

`record.mjs` describes an enumerated command unless `--execute` is supplied. Execution requires a producer-owned build/browser lease; the verifier never launches these jobs. Each output directory must be fresh. The recorder captures actual stdout, stderr, combined log, signal and exit, before/after source inventories, applicable native outputs and current raw result references. It never turns an old log into a new execution.

```sh
node tools/yarn.mjs exec node tools/release-evidence/record.mjs --recipe patterns --framework react
# During the authorized frozen producer window only:
node tools/yarn.mjs exec node tools/release-evidence/record.mjs --recipe patterns --framework react --candidate docs/releases/VERSION/verification.json --manifest artifacts/manifest-stable.json --output test-results/release/react-RUN --execute
# A separately leased immutable Svelte/Angular/Qwik artifact may be retained as input:
node tools/yarn.mjs exec node tools/release-evidence/record.mjs --recipe patterns --framework svelte --candidate docs/releases/VERSION/verification.json --manifest artifacts/manifest-stable.json --output test-results/release/svelte-RUN --artifact /PATH/TO/LEASED/FIXTURE --execute
```

Pattern captures invoke the existing Solid/React/Vue/Lit fixture recipes. Svelte and Angular invoke their actual root scripts with artifact/output arguments; Qwik invokes the actual root test producer through a retained copy with only repository-root/output literals redirected. Original and redirected Qwik source hashes are retained and their exact relationship is checked. Source inventories include the mapped root Svelte/Angular scripts and their imported tests. Every producer keeps its native raw result: booleans for the original four, canonical IDs plus `status: passed` for Svelte/Angular, and an exact enumerated mapping of Qwik's compound names. Stdout is validated in each producer's actual format; no PASS lines or booleans are synthesized.

The recorder derives `result` from a fresh canonical output tree and binds its complete inventory to the original captured process, stdout, source/candidate and environment. `--result` is rejected for patterns. React/Vue/Lit use their supported output settings; the coordinator-authorized one-line Solid overlay adds `PATTERN_OUTPUT` with its original default unchanged. Svelte/Angular/Qwik receive a fresh output directory. Original T11 evidence is never moved or overwritten. `--artifact` copies an owner-leased immutable input into the same capture's `inputs/fixture`; Qwik expects the owner's production root with `server.mjs` and `dist/`, and its server source must be explicitly independently reviewed. Final acceptance additionally compares leased fixture files with current candidate outputs. Historical fixture copies and null-HEAD diagnostic captures do not qualify as a current candidate.

All seven native adapters require exactly one binding for each canonical case, zero execution/request errors, immutable fixture/package/private-contract bytes and actual independent scoped source review. Additional executed native checks remain in the raw report and must pass. Missing, duplicate, skipped, malformed or failed cases block acceptance.

Docs recipes are `docs-tests` and `docs-browser`. The latter wraps the actual T12 browser source, redirecting only its repository-root and evidence-output literals into a retained copy so frozen T12 reports are preserved. The original T12 route policy keeps its local/remote decisions. Each continued browser request is fetched once without retries or followed redirects, compared byte-for-byte with current `apps/docs/dist/`, and fulfilled with that exact HTTP response/body. This includes Chromium prefetches, whose browser-protocol body view can be empty. Active requests drain before browser/context close. Actual response URL/status/headers and delivered body hashes, the original and redirected producer hashes, reports and screenshots are retained; byte mismatches and capture errors still fail. The five-test Node stdout, two browser reports, 54 references, seven full compiler mappings, current input/download hashes and exact served artifacts are validated. Text scaling is never relabeled browser zoom. Pattern and documentation acceptance also compares the original capture’s declared artifact roots and complete before/after inventories with the submitted inventories and current bytes. Those original inventories must agree. The documentation served-response reference must be the one retained by that capture. For a diagnostic documentation run with no final artifact manifest, omit `--manifest`; absent candidate identity still prevents final acceptance.

Preview recipes are `preview-types`, `preview-build` and `preview-contracts`. The raw Playwright reference must be the actual ten-case JSON, with matching inline native-health attachments. It does not replace separate RC19 SSR/browser requirements.

CI recipes are `ci:install`, `ci:workspace`, `ci:catalog`, `ci:coverage`, `ci:selection`, `ci:targets`, `ci:affected`, `ci:cache`, plus `ci:contracts:FRAMEWORK:pilot|catalog`, `ci:stories:FRAMEWORK:pilot|catalog` and supported `ci:siheom:FRAMEWORK`. All required receipts are unique. Actual hosted run/source/attempt metadata is captured from the runner; static workflow checks or configuration-only tests cannot pass as CI execution. Source-before/output-after binding allows installation/builds before final tarball hashes exist: the original commit, lock and complete unchanged source input inventory must match, and the actual target job's complete output inventory must still equal the final candidate outputs. No uncommitted version transformation is inferred. Each enumerated CI capture retains the newly emitted canonical producer outputs in its own directory and binds them to its original process receipt, workflow run and source. Existing fixed outputs are preserved separately and removed before execution. Native summaries must agree with retained raw Playwright/health records, story requests and siheom results. The assembler derives these references from captures; independently supplied historical result references cannot replace them.

`assemble.mjs` combines current actual `record.json` files and explicitly authored metadata/review/session records. It refuses cross-candidate captures. It writes a kind report, validates it, and writes a kind index only after substantive validation. It cannot manufacture missing rows or human performance:

```sh
node tools/yarn.mjs exec node tools/release-evidence/assemble.mjs --kind patterns --candidate docs/releases/VERSION/verification.json --manifest artifacts/manifest.json --record PATH_TO_EACH_ACTUAL_RECORD --extras PATH_TO_EXPLICIT_REVIEWS --output docs/releases/VERSION/evidence/patterns-RUN
```

The final `acceptance-evidence.json` has `schemaVersion: 3` and `reports` mapping `patterns`, `preview`, `documentation`, `ci`, `independentReview`, and `manualAccessibility` to `{path,bytes,sha256}` references to the corresponding v3 reports. Kind index fragments can be merged without changing the referenced report bytes. No such complete candidate index has been generated by this implementation session.

## Review and human records

`sourceBefore` and `sourceAfter` use the exact complete `inventory(root, sourceRoots(kind))` format. Use `snapshot.mjs --kind KIND [--framework FRAMEWORK] --output test-results/SUBJECT.json` to capture an unreviewed source/host-artifact subject. This read-only command explicitly records that no review or manual session was performed.

Independent review records require the original scoped Markdown report, explicit person and role, a different implementer, performed date, subject, complete current source inventory, exact candidate/artifact hashes, observations and material-finding dispositions. A current request-changes review cannot be converted to acceptance by quoting historical accepted text. The full release review separately covers native boundaries, catalog completeness, actual tarballs, licenses, SSR and user flows with bound supporting references. Existing bounded T11/T12 reviews are not automatically full-release approval. Actual acceptance requires exactly one `## Current decision` section containing only a `krds-review-decision` JSON fence. Its schema is illustrated below; the decision must agree exactly with the separately identified review metadata and its finding dispositions. Source hashes must equal the submitted current review subject. Historical Markdown without this section remains diagnostic only.

````md
## Current decision

```krds-review-decision
{"schemaVersion":1,"scope":"release","subject":"reviewed candidate","current":true,"spec":"accepted","quality":"accepted","sourceInventorySha256":"ACTUAL_INVENTORY_HASH","sourceFingerprint":"ACTUAL_CANDIDATE_SOURCE_HASH","findings":[{"id":"finding-1","severity":"important","resolved":true,"disposition":"Describe the verified correction and its supporting evidence."}]}
```
````

A rejected current decision or unresolved critical/important finding blocks approval even when the report quotes historical acceptance. An empty findings list is valid only when the reviewer actually found no issues; the recorder does not create a verdict or dispositions.

Manual records are inherently attested by the named person. Each of seven native sessions requires start/end, actual OS/browser/assistive technology, performed actions, expected and actual observations, limitations, current complete source and served-host artifact inventories, and original structured session transcripts bound to that person, environment and candidate. Each required observation must be in the transcript. Real browser 200/400 percent zoom, OS high contrast and focus visibility require bound screenshots and actual methods, not CSS/emulation substitutions. Original video/audio/captions/transcript/audio-description/sign-language bytes and their source URL/retrieval/hash provenance are required for media equivalence. Synthetic signals, empty status rows, merely installed VoiceOver, placeholder logs, missing sessions and absent original media remain blocked.

Manual/review import does not create `performed`, identity, observations or approvals. Those facts must be supplied by the people who did the work, with the supporting original records. Unit fixtures exercise the schema only and never supply release acceptance.
