# CHANGELOG

> Records human-readable changes for project releases.
> Does not mechanically list all commits; summarizes only the changes truly important to users, collaborators, and maintainers.

---

## [Unreleased]

### Added
- Kept as a placeholder node. Starting from 2026-04-11, new versions and ongoing work will accumulate in this section.

### Changed
- None

### Fixed
- None

### Removed
- None

### Migration Notes
- None

---

## [2026-04-10: Three-stage Pipeline Architecture & Knowledge Base Integration] - 2026-04-10

### Added
- Added **Pipeline 1 (Input Learning Pipeline)**: Intelligently parses raw reading materials to automatically extract high-potential knowledge candidates, which are then fed into Dictionary Pro for card creation.
- Added **Pipeline 2 (Output Correction Pipeline)**: Enables TOEFL Coach to diagnose user essays, extracting low-level expressions directly into Dictionary Pro to be upgraded into high-score revision cards.
- Added **Pipeline 3 (Knowledge Base Pipeline)**: Introduced the `OutputManager` unit to manage the `data/` directory, along with a lightweight `indexer.ts` statistical indexing engine.
- Added safety testing layer `tests/connectors.test.ts`, fully establishing local Node `--test` integration and automated unit tests within `.github/workflows/ci.yml`.
- Added CLI exposure layer: Enabled direct integration for `spark x pipeline:input`, `spark x pipeline:output`, and `spark x kb:status` dashboard commands.

### Changed
- Comprehensively reinforced the underlying `contracts.ts` system, introducing `relatedSourceSlug` and `relatedDiagnosisSlug` attributes for parent document/text traceability.
- TOEFL Coach generation now automatically appends a dedicated `WeakExpressionSet` summary table block inside its output report.

### Fixed
- Fixed the previous structural vulnerability in `ci.yml` which merely checked TS compilation without executing active protection testing.
- Fixed the issue where generated cards lacked contextual anchorage (unable to reveal which practice run or critique generated the card) due to the isolated nature of the previous architecture.

### Compatibility Effects
- The `data/` directory has been automatically protected via `.gitignore`. If any pre-existing local data was scattered arbitrarily at the root, it must be manually transitioned to the new directory hierarchy.

### Migration Notes
- Users are advised to gradually transition all terminal interactions from primitive standalone commands (e.g., `spark dict`) toward scenario-driven syntax (e.g. `spark x pipeline:input`).

---

## [Historical Baseline: Inception to Atomic Modules] - 2026-04-09

### Added
- Established three main model deduction units: Dictionary Pro, Content Parser, and TOEFL Writing Coach.
- Created the core component `runValidatedJsonGeneration` to implement a robust "Generation + Strict Schema Validation" dual-safety mechanism.
- Built explicit execution layers via terminal basic commands: `spark dict` / `spark content` / `spark coach`.
- Completed multi-provider interfaces with capabilities driven dynamically securely by environment variables.

### Changed
- Finalized main project ethos as "CLI-first, Markdown-first", discarding potential overhead from heavy Web GUIs and centralized database management.

### Deficiencies
- Data assets fail to persist cleanly. Disconnected tools demand intense manual interaction overhead, leaving capabilities as scattered functional 'nodes' rather than holistic 'lines'.

### Migration Notes
- Iterative goals going forward will pivot towards connecting these distinct tools into heavily automated pipeline environments.
