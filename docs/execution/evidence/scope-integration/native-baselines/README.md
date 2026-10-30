# Preserved pre-native baseline pointers

These are historical bytes, not a read of the moving current native implementations. No source tree was reconstructed for this archive.

- `task-T01-review-package.md` contains the full added library probe sources/configs for all seven new native frameworks. `task-T01-snapshot.json` supplies their reviewed hashes; heading paths/line numbers are in `native-baseline-map.json`.
- `task-T05-base/apps/fixture-<framework>/` and `apps/storybook-<framework>/` preserve real T01 app/config before bytes.
- `task-T05-<framework>-review-package.md` preserves the exact reviewed T05 source/config delta, including full additions; `task-T05-<framework>-snapshot.json` records before/after hashes. Apply those historical deltas to the saved base if a complete T05 after tree is required; this archive does not pretend a complete raw after tree was captured.
- The scope integration v2 after snapshots hold the latest reviewed new-scope raw bytes for paths containing namespace references. Many pure compiler/renderer config and probe files had no namespace token and were not in that 135-path scope set; use the T01 full-addition and T05 base/delta context for them.

Old scope/metadata values in historical records stay original. New-scope names/repository/APF metadata are represented by the immutable scope snapshots, not retroactive rewrites of old evidence. None of these compiler probes awards native catalog coverage.
