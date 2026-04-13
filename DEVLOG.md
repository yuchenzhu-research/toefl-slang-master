# DEVLOG

---

## 2026-04-13 / Governance Normalization: Constitution Layer + README Sync

### Related commits
- `3370ac0` docs(governance): normalize constitution, agent handbook, and maintainer manual
- `665c6ce` docs(readme): sync governance doc entry across all README variants

### Problem
- `AGENTS.md` and `MANUAL.md` had grown into partially parallel documents.
- The repository lacked a true top-level governance file, so `AGENTS.md` was carrying both constitutional rules and agent workflow rules.
- User-facing README files did not yet reflect the normalized governance stack.

### Changes
- **Created `CONSTITUTION.md`:** Introduced a highest-governance file for project identity, invariants, architecture guardrails, quality gates, risk register, and anti-patterns.
- **Refactored `AGENTS.md`:** Reduced it to a shared cross-agent playbook focused on read order, execution workflow, verification baseline, documentation sync discipline, and reporting expectations.
- **Refactored `MANUAL.md`:** Repositioned it as a maintainer handbook focused on repo structure, authoritative sources, maintenance checklists, debugging entry points, and known limitations.
- **Synced all `README*.md`:** Added a lightweight governance-doc entry block so external readers can discover `CONSTITUTION.md`, `AGENTS.md`, and `MANUAL.md` without turning the README files into internal handbooks.

### Resulting Document Stack
- `CONSTITUTION.md` -> highest governance file
- `AGENTS.md` -> shared cross-agent runtime handbook
- `MANUAL.md` -> maintainer handbook
- `docs/*` -> topical design and contract details
- `README*.md` -> user-facing entry points

### Verification
- Verified the three-layer document split directly in the repository.
- Confirmed the README governance block was added across all README variants.

### Impact Range
- `CONSTITUTION.md` (New)
- `AGENTS.md`
- `MANUAL.md`
- `README.md`
- `README_zh-CN.md`
- `README_zh-TW.md`
- `README_de.md`
- `README_es.md`
- `README_fr.md`
- `README_ja.md`
- `README_ko.md`

---

## 2026-04-13 / Fix CI: Lazy-Import ESM-Only pi-tui Dependency

### Related commits
- `5c04a39` fix(ci): lazy-import pi-tui to fix ERR_REQUIRE_ESM in CJS test runner; drop Node 18 from matrix

### Root Cause
- `cli.test.ts` imports `app-cli.ts` → `studio/runner.ts` → `SPARKTui.ts` → `@mariozechner/pi-tui` (ESM-only).
- Under CJS mode on Node 18, this triggers `ERR_REQUIRE_ESM` because `require()` cannot load an ES Module.
- All CI runs on `main` were failing with 1 test failure (`cli.test.js`).

### Fixes
- **`src/studio/runner.ts`:** Changed static `import { runTui }` to dynamic `await import("./tui/SPARKTui")`, so `pi-tui` is only resolved at runtime when Studio is actually launched — not at module load time during tests.
- **`.github/workflows/ci.yml`:** Dropped EOL Node 18.x from the matrix. Now testing `[20.x, 22.x]`.

### Verification
- Local: `npm test` — 24/24 pass.
- CI: GitHub Actions run `24311413054` — green on both Node 20.x and 22.x.

### Impact Range
- `src/studio/runner.ts`
- `.github/workflows/ci.yml`

---

## 2026-04-13 / Engineering Audit: P0 & P1 Fix Sprint

### Related commits
- `335e380` refactor: replace all tsm remnants with spark across CLI and docs
- `a1323f7` fix(p0-4): complete connectors barrel with content-to-dict and dict-to-card exports
- `d2318cc` fix(p0-3): remove deceptive chunker block that split but never used chunks
- `225e7eb` fix(p0-2): remove dead imports from studio/runner.ts replaced by TUI path
- `5467800` fix(p0-1): sync Studio section in README to reflect actual TUI state (WIP note)
- `f35c286` chore(p1): rename temp dir prefixes in tests from tsm to spark
- `7230def` fix(p1): make spark studio --dry-run truly no-op and sync CLI help with TUI state
- `bfbef09` docs(p1): update CHANGELOG CLI examples from tsm to spark
- `14d55fa` chore(p1): finish rebranding strings (TOEFL Slang Master → SPARK) in docs and experimental outputs
- `e72ff0f` docs(p1): add missing connector contracts for content-to-dict and dict-to-card
- `273beee` chore(p1): archive minimax_mvp.ts under references/
- `f4db7b5` feat(p1): add --locale flag and inject locale hints into prompts

### P0 Fixes (Critical)
- **Incomplete connectors barrel:** `src/connectors/index.ts` only exported `coach-to-dict`. Added namespace exports for `content-to-dict` and `dict-to-card` to avoid naming conflicts.
- **Deceptive chunker block:** `src/pipelines/input-learning.ts` contained a chunking block that split documents but silently discarded the chunks. Removed the dead code along with unused `fs` / `TextChunker` imports.
- **Dead imports in runner:** `src/studio/runner.ts` retained 10+ unused imports (path, resolveContentParserSource, prompts, etc.) left over from the TUI migration. Cleaned up entirely.
- **README out of sync:** Studio sections in `README.md` and `README_zh-CN.md` described a six-step guided flow that was never implemented. Rewritten to reflect the current TUI-based Dictionary Pro lookup with a WIP note for the full pipeline.

### P1 Fixes (Important)
- **Legacy branding cleanup:** Replaced all remaining `TOEFL Slang Master` / `TOEFL SLANG MASTER` strings across `src/` and `docs/` (DEVLOG historical entries preserved). Affected: `contracts.ts`, `exporters.ts`, `dashboard.ts`, `daily.ts`, `journal.ts`, `quiz.ts`, `plan.md`, `docs/outputs.md`.
- **`tsm` remnants:** Renamed test temp-dir prefixes from `tsm-*` to `spark-*`; updated CHANGELOG CLI examples from `tsm dict` to `spark dict`.
- **Studio `--dry-run` made truly no-op:** TUI now intercepts lookup requests and returns a dry-run message instead of calling the API. Synced `spark studio --help` and `spark --help` descriptions accordingly.
- **Connector docs completed:** Added `docs/connectors/content-to-dict.md` and `docs/connectors/dict-to-card.md`, completing the full trio alongside existing `coach-to-dict.md`.
- **`minimax_mvp.ts` archived:** Moved from project root to `references/`.
- **Locale support landed:** Added `--locale` flag to all three module CLIs; injected `LocaleManager.injectPrompt()` into prompt builders for Dictionary Pro, TOEFL Coach, and Content Parser per `docs/i18n.md` spec.
- **`docs/outputs.md` link fix:** Replaced absolute local path with repo-relative path.

### Verification
- `npm test` — all 24 tests passing, no regressions.

### Impact Range
- `src/connectors/index.ts`, `src/connectors/README.md`
- `src/pipelines/input-learning.ts`
- `src/studio/runner.ts`, `src/studio/index.ts`, `src/studio/tui/SPARKTui.ts`
- `src/app-cli.ts`
- `src/platform/contracts.ts`
- `src/dictionary-pro/{cli,prompt}.ts`
- `src/toefl-writing/{cli,prompt}.ts`
- `src/content-parser/{cli,prompt}.ts`
- `src/pipelines/exporters.ts`
- `src/experimental/{dashboard,knowledge-base/*}.ts`
- `README.md`, `README_zh-CN.md`, `CHANGELOG.md`, `plan.md`
- `docs/outputs.md`, `docs/connectors/{content-to-dict,dict-to-card}.md` (New)
- `tests/outputs.test.ts`
- `references/minimax_mvp.ts` (Moved)

---

## 2026-04-12 / SPARK TUI Studio: OpenClaw-Style Interactive Interface

### Related commits
- `54b6b35` feat(studio): implement advanced OpenClaw-style TUI interface

### Modifications
- **Advanced TUI Integration:** Ported core TUI components from the OpenClaw reference, replacing the legacy `readline` sequential wizard with a persistent, full-screen grid interface.
- **Component Architecture (`src/studio/tui/`):** 
  - Implemented `ChatLog.ts` for handling scrollable conversation streams and inline assistant updates.
  - Implemented `CustomEditor.ts` for multi-line input with custom keybindings (Ctrl+C, Alt+Enter).
  - Adopted the `@mariozechner/pi-tui` library for low-level terminal rendering.
- **Visual Rebranding & Theme:** Applied a high-contrast dark palette to match OpenClaw's aesthetics, including ANSI-based syntax highlighting and glassmorphism-inspired layout cues.
- **Engine Wiring:** Connected the TUI interface to the `Dictionary Pro` core, allowing real-time word lookups and academic upgrades within the persistent session.

### Issues Resolved
- Transformed the "step-by-step" CLI bottleneck into a fluid, "Always-on" chat interface.
- Standardized the visual language of SPARK to align with professional-grade agentic terminal tools.

### Impact Range
- `src/studio/tui/*` (New)
- `src/studio/runner.ts`
- `package.json`

---

## 2026-04-12 / Intelligent Provider Detection & Auto-Resolution

### Related commits
- `01bc421` feat(auth): implement intelligent provider selection and expand global provider catalog

### Modifications
- **Auto-Detection Engine (`src/platform/auth/manager.ts`):** Implemented logic to scan `.env` for known provider keys. It now intelligently filters out irrelevant providers based on primary environment variables to avoid cross-matching.
- **Interactive Selector (`src/platform/auth/selector.ts`):** Created a native `readline`-based TUI menu that triggers only when multiple providers are detected without a persistent default.
- **Expanded Provider Catalog (`src/platform/providers/catalog.ts`):** Added a comprehensive list of high-performance global providers, including DeepSeek, Groq, Perplexity, Fireworks AI, Cerebras, and Novita.
- **Persistent Configuration:** Added support for `defaultProvider` in `~/.toefl-slang/config.json`, allowing the system to remember user preferences across sessions.
- **CLI Reset Hook:** Added `--reset-provider` to `spark init` to allow users to force re-run the auto-detection and selection menu.

### Issues Resolved
- Eliminated hardcoded `openai` defaults that caused crashes when users only configured alternative providers (e.g., MiniMax).
- Reduced onboarding friction by automatically resolving the model client if only one key is present.

### Impact Range
- `src/platform/auth/*`
- `src/platform/providers/catalog.ts`
- `src/platform/init.ts`
- `src/platform/client.ts`

---

## 2026-04-12 / SPARK Studio: Guided Terminal Workflow

### Related commits
- `2cbb6de` feat(studio): add StudioSession types and learning target mapping layer
- `a2fce07` feat(studio): add interactive terminal prompts with readline
- `e4eb410` feat(studio): add studio orchestration runner with step-by-step guided flow
- `185f82c` feat(studio): add studio module CLI entry with --help, --file, --dry-run flags
- `228612b` feat(cli): wire spark studio command into top-level CLI dispatcher
- `e80463d` chore(scripts): add studio npm script to package.json
- `c23efa8` test(studio): add target mapping, candidate selection, and session object tests
- `d737b2` docs: add Studio Mode documentation to README and MANUAL

### Modifications
- **Guided Studio Mode:** Introduced `spark studio` as the primary interactive workflow, orchestrating existing modules (Content Parser → Dictionary Pro) into a cohesive session.
- **Session Types & Mapping (`src/studio/session.ts`, `src/studio/target-map.ts`):** Added in-memory session state management and a conservative style mapping layer (`economist-style` -> `general-academic`, `american-spoken` -> `daily-english`), ensuring no premature decoupling of internal contracts.
- **Interactive Prompts (`src/studio/prompts.ts`):** Built robust terminal I/O using only Node.js `readline`, eliminating external dependencies for file selection, candidate filtering, and target selection.
- **Studio Orchestrator (`src/studio/runner.ts`):** Bridged existing modular runners and the OutputManager without altering core engine boundaries or logic.
- **Testing & Documentation:** Added dedicated `tests/studio.test.ts` for mapping and filtering logic, updated CLI tests, and synchronized `README.md`, `README_zh-CN.md`, and `MANUAL.md` with the new capability.

### Issues Resolved
- Solved the fragmented UX of standalone CLI commands by consolidating the input learning sequence (Parse → Pick → Generate) into one guided flow.
- Reduced the learning curve for new users while maintaining existing output discipline.

### Impact Range
- `src/studio/*` (New)
- `src/app-cli.ts`
- `package.json`
- `tests/studio.test.ts` (New), `tests/cli.test.ts`
- `README.md`, `README_zh-CN.md`, `MANUAL.md`

---

## 2026-04-12 / Full Project Rebranding: TOEFL Slang Master to SPARK

### Related commits
- `e576845` chore(rebrand): rebrand project to SPARK and update CLI entry to spark

### Modifications
- **Project Rebranding**: Officially rebranded the project from `TOEFL Slang Master` to **SPARK** (Speech, Phrase, and Artful Resonance Kinship).
- **CLI Migration**: Changed the primary CLI command from `tsm` to `spark`.
- **Entry Point Refactoring**: Renamed `bin/tsm.cjs` to `bin/spark.cjs` and synchronized internal error handling logic.
- **Multilingual Documentation Sync**:
  - Updated README files across all 8 supported languages.
  - Synchronized `AGENTS.md`, `MANUAL.md`, and all architectural documentation under `docs/`.
- **Source Code & Test Alignment**:
  - Updated `src/app-cli.ts` with the new SPARK title and usage information.
  - Adjusted diagnostic text in `src/platform/init.ts` and `src/platform/doctor.ts`.
  - Updated `tests/cli.test.ts` assertions to match the new `spark` command namespace.

### Issues Resolved
- Resolved the memorability and branding issues with the legacy `TSM` acronym.
- Aligned the command-line identity with a "research paper style" catchy name (SPARK).

### Impact Range
- `bin/spark.cjs`
- `package.json`
- `src/app-cli.ts`
- `src/platform/init.ts`, `src/platform/doctor.ts`
- `AGENTS.md`, `MANUAL.md`, `README*.md`
- `docs/*.md`
- `tests/cli.test.ts`

### Next Steps
- Recommend users to run `npm link` to register the new `spark` command.

---

## 2026-04-11 / Phase 12: Guardrail Lock-In For Ongoing Slimming

### Modifications
- **CLI Boundary Guard**: Extended the CLI test suite so it no longer checks only visible help text. The new structural assertion also verifies that `src/app-cli.ts` routes through `src/experimental/cli.ts` instead of directly importing pipeline or experimental implementation files again.
- **Output Contract Guard**: Kept the output-layer regression checks introduced in Phase 10 as part of the new baseline, ensuring canonical content artifact names remain `digest.json`, `index.md`, and `candidates.json`.
- **Refactor Safety Baseline**: With CLI surface tests, app-cli structural tests, and output contract tests all living in `test:ci`, the next round of slimming work has a concrete regression floor instead of relying on DEVLOG memory.

### Architectural Impact
- Phase 9-11 changes are now protected by executable guardrails rather than just code review discipline.
- The repository is in a better position to continue slimming without accidentally reintroducing top-level CLI bloat or output naming drift.

---

## 2026-04-11 / Phase 11: Documentation Realignment With Current Runtime

### Modifications
- **README Command Sync**: Updated `README.md` and `README_zh-CN.md` so pipeline examples now match the actual CLI surface (`tsm x pipeline:input` / `tsm x pipeline:output`) instead of the pre-namespace form.
- **Maintainer Docs Sync**: Corrected `AGENTS.md` and `MANUAL.md` to reflect the current repository layout:
  - root `README.md` as the English entry
  - `README_zh-CN.md` and `README_zh-TW.md` as the Chinese localized entries
  - `src/platform/*` as the real home of auth/provider/runtime code after the platform consolidation work
- **Stale File Reference Removal**: Removed active-process references that still treated `README_EN.md`, `README_ZH_HANT.md`, `src/api/`, `src/auth/`, and `src/providers/` as current source-of-truth locations.

### Architectural Impact
- The repo instructions for humans and agents now point at the files and commands that actually exist.
- Future refactors can rely on the maintenance docs without having to first translate old path names into the post-consolidation layout.

---

## 2026-04-11 / Phase 10: Output Contract Tightening

### Modifications
- **Canonical Content Filenames**: Standardized Content Parser artifacts on `digest.json`, `index.md`, and `candidates.json` through `src/platform/output-manager.ts`, replacing the previous `source.json` / `source.md` future-write behavior.
- **Single Output Entry Point**: Extended `OutputManager` so content candidates, coach batch results, and manual dictionary additions all flow through the same saver layer instead of scattering file names across pipelines and connectors.
- **Runtime Path Stability**: Removed the module-load-time output root constant and resolved the output root from `process.cwd()` dynamically, making the output layer safer under tests and any future workspace switching.
- **Safer Output Tests**: Reworked `tests/outputs.test.ts` to use temporary directories rather than the repository root, then added a regression check that asserts the canonical content filenames are written and the old `source.json` / `source.md` names are no longer treated as the standard.
- **Docs Sync (Output Layer Only)**: Updated `docs/outputs.md` so the documented file layout matches the actual writer implementation and explicitly points future changes back to `OutputManager` as the source of truth.

### Architectural Impact
- The output contract is now materially closer to "Markdown-first + JSON sidecar" discipline instead of being partly encoded in docs and partly encoded in ad hoc writers.
- Future pipeline changes have a narrower place to edit and a smaller chance of silently drifting from the documented layout.

---

## 2026-04-11 / Phase 9: CLI Tree Extraction & Guardrails

### Modifications
- **Experimental CLI Extraction**: Moved the `tsm x` command catalog and dispatch logic out of `src/app-cli.ts` into `src/experimental/cli.ts`, so the top-level CLI entry returns to being a thin router around the core command surface.
- **Dependency Thinning**: Replaced eager imports of pipeline and backup/manual helpers inside the experimental command handler with command-local `require` calls. This keeps the top-level CLI from loading more orchestration code than it needs on every invocation.
- **CLI Surface Tests**: Added `tests/cli.test.ts` to lock two key guardrails in place:
  - root help stays focused on the main narrative (`dict`, `coach`, `content`, setup utilities, and `tsm x`)
  - experimental commands remain discoverable only through the `tsm x` namespace

### Architectural Impact
- `src/app-cli.ts` is now materially thinner and easier to keep stable during later refactors.
- The command tree is clearer: core entry at the top, experimental surface in its own namespace module.
- CLI slimming is no longer just a help-text cleanup; the dispatch structure now matches the intended architecture.

---

## 2026-04-11 / Phase 8: Baseline Realignment Before Further Refactoring

### Related Baseline Commits
- `99747cc` Stabilize stage 1 contracts and connector baseline
- `f89ee4f` chore(cli): slim main entry, unify experimental namespace, and sync manual
- `60fa7d8` chore(arch): slim CLI main entry and refactor connectors into pure mappers
- `9d818ae` chore: implement Phase 4 (Output Consolidation) and Phase 6 (Experimental Isolation)
- `b26fdf5` chore(platform): consolidate core implementations and remove empty facades
- `ba1ea7a` docs: synchronize documentation and fix test guardrails for Phase 7
- `c969112` docs: simplify READMEs and finalize multilingual support
- `72853d7` docs: optimize multilingual READMEs using standard generator skill

### Modifications
- **Phase Baseline Audit**: Re-read `DEVLOG.md`, compared it against the actual git history, and confirmed that antigravity already landed the structural work for Phase 1 through Phase 7. New refactors must continue from that baseline rather than restarting the earlier slimming passes.
- **Commit-to-Phase Alignment**: Mapped the current repository state back to the commits that materially implemented each phase, so later reports can distinguish "already landed yesterday" from "new work added on 2026-04-11".
- **Documentation Drift Identified**: Confirmed that `README_EN.md` was deleted in `c969112`, while `AGENTS.md` and `MANUAL.md` still reference it as an active file. The root `README.md` currently acts as the English entry, and this mismatch must be resolved in the next documentation sync phase.
- **Refactor Continuation Boundary**: Marked the current local CLI extraction draft as a continuation of the earlier CLI slimming work, not a parallel redesign. Subsequent phases will build on the antigravity layout (`tsm` core surface + `tsm x` namespace + `src/pipelines/` + `src/experimental/`).

### Architectural Impact
- Prevents duplicated work and incorrect phase numbering before deeper refactors continue.
- Establishes a clean 2026-04-11 baseline for the next steps: CLI tree extraction, output contract tightening, and docs/runtime realignment.

---

## 2026-04-11 / Phase 7: Multilingual Documentation Standardization

### Related Commits
- `72853d7` docs: optimize multilingual READMEs using standard generator skill
- `c969112` docs: simplify READMEs and finalize multilingual support

### Modifications
- **README Multi-language Expansion**: Implemented standardized README documentation across 8 languages: English, Simplified Chinese, Traditional Chinese, Japanese, Korean, Spanish, French, and German.
- **Content Standardization**: Eliminated legacy "Work-in-Progress" tags, broken badges, and redundant disclaimers to project a professional, release-ready image.
- **Skill-Based Documentation**: Utilized the `readme-generator` skill to ensure consistency in structure, call-to-actions, and technical descriptions across all localized versions.
- **Unified Narrative**: Synchronized the project vision and module descriptions (Dict, Coach, Content) to ensure a cohesive message regardless of the reader's locale.

### Architectural Impact
- Improved global discoverability and accessibility for the project.
- Established a documentation baseline that scales with future module enhancements.

---

## 2026-04-11 / Phase 6: Experimental Isolation

### Modifications
- **Physical Isolation**: Moved secondary features (`knowledge-base`, `srs`, `streak`, `audio`, `telemetry`, `dashboard`, `repl`) to a dedicated `src/experimental/` directory to prevent architectural leakage.
- **CLI Marking**: Updated `tsm x` namespace in `app-cli.ts` to point to the new experimental paths and added `[EXPERIMENTAL]` labels to help text.
- **Pipeline Decoupling**: Replaced static imports of the knowledge-base indexer in core pipelines (`src/pipelines/`) with guarded, dynamic `require` calls. This ensures main workflows remain functional even if experimental features are disabled or removed.

### Architectural Impact
- Core pillars (Dict, Coach, Content) are now clearly separated from experimental assets.
- Reduced strict dependency graph size for core pipelines.

---

## 2026-04-10 / Phase 5: Slimming Platform & Core Consolidation

### Modifications
- **Relocated Core Implementations**: Moved implementation files from root `src/` directly into `src/platform/`, fulfilling the mandate to consolidate shared infrastructure in the platform layer.
  - `src/api/client.ts` -> [src/platform/client.ts](file:///Users/yuchenzhu/Desktop/github/toefl%20slang%20master/src/platform/client.ts)
  - `src/auth/manager.ts` -> [src/platform/auth/manager.ts](file:///Users/yuchenzhu/Desktop/github/toefl%20slang%20master/src/platform/auth/manager.ts)
  - `src/providers/` -> [src/platform/providers/](file:///Users/yuchenzhu/Desktop/github/toefl%20slang%20master/src/platform/providers/)
  - `src/doctor.ts` & `src/init.ts` -> `src/platform/doctor.ts` & `src/platform/init.ts`
- **Removed Empty Facades**: Deleted all "forwarder" files in `src/platform/` and root `src/` modules that were mere redirections.
- **Dependency Guarding**: Updated `package.json` and all cross-module imports to ensure system-wide integrity after relocation.

### Resolved Issues
- Eliminated redundant architectural layers and improved code discoverability.
- Consolidated the "Shared Floor" (Platform) into a implementation-heavy source of truth.

---

## 2026-04-10 / Phase 4: Output Layer Consolidation

### Modifications
- **Canonical Output Standardization**: Enforced `outputs/` as the single source of truth for all persistent data. Relocated variables and updated references to eliminate ambiguity with `data/`.
- **Sidecar Saving Logic**: Enhanced `OutputManager` with centralized methods (`saveDictionaryCard`, `saveCoachDiagnosis`, `saveContentDigest`) that handle both JSON artifacts and Markdown sidecars in a single transaction.
- **Stable Schema Mapping**: Introduced a formal `dict-to-card` mapper to transform `Dictionary Pro` responses into standardized `ExpressionCard` objects before persistence. This ensures the knowledge base and SRS engine consume a stable contract rather than raw API reflections.

### Architectural Impact
- Persistence side-effects are now concentrated in `OutputManager`.
- The `Dictionary Pro` internal schema is decoupled from the long-term knowledge base persistence format.

---

## 2026-04-10 / Phase 3: Connector Refactoring & Side-Effect Decoupling

### Modifications
- **Established `src/pipelines/` Layer**: Moved all orchestration and side-effect logic (Disk I/O, Knowledge Base Indexing, Slug Generation) out of the connector layer.
  - `input-learning.ts`: Orchestrates Link 1 (Content Parser -> Dict).
  - `output-correction.ts`: Orchestrates Link 2 (TOEFL Coach -> Dict).
  - `batch-coach.ts` & `exporters.ts`: Centralized batch processing and Anki/Print export routines.
- **Thin Connector Pattern**: Standardized `src/connectors/` as pure bridging layers (object-to-object mapping only).
  - Introduced `src/connectors/content-to-dict/` mapping layer.
  - Refactored `src/connectors/coach-to-dict/` to remove active bridging logic.
- **System-wide Integration**: Updated `app-cli.ts` and `src/cli/repl.ts` to consume the new pipeline orchestrators.

### Resolved Issues
- Stopped "connector leakage" where file saving and indexing logic were scattered in bridging files.
- Clarified the functional contract of Link 1 (Content Candidates) and Link 2 (Weak Expressions) targeting `Dictionary Pro` seeds.

---

## 2026-04-10 / Phase 2: CLI Slimming & Experimental Namespace

### Modifications
- **Main CLI Entry Refactoring**: Slimmed the primary `tsm` help menu to focus exclusively on the core narrative: `dict`, `coach`, `content`, `init`, `doctor`, and `providers`.
- **Experimental Namespace (`tsm x`)**: Introduced a dedicated namespace for auxiliary and experimental features, moving 15+ secondary commands (SRS, telemetry, pipelines, etc.) out of the main logic path.
- **Improved Discoverability**: Added `tsm x --help` to provide a clear catalog for power-user features without cluttering the onboarding experience.

### Resolved Issues
- Fixed visual overwhelm in the CLI main entry-point.
- Standardized the dispatching logic for experimental sub-commands in `app-cli.ts`.

---

## 2026-04-10 / Phase 1: Engineering Baseline Stabilization

### Related Commits
- `99747cc` Stabilize stage 1 contracts and connector baseline

### Modifications
- **Unified Domain Contracts**: Consolidated `WeakExpressionSet`, `ExpressionCardSeed`, and `WritingDiagnosis` into `src/platform/contracts.ts`.
- **Connector Refactoring**: Removed duplicate `src/connectors/coach-to-dict.ts` in favor of the standardized directory-based connector.
- **Strict Typing & Build Safety**: Fixed all TypeScript compilation errors across TOEFL Coach and Content Parser.
- **CI/CD Alignment**: Verified `npm run test:ci` and all CLI help screens (`--help`) are fully functional.

---

## 2026-04-10 / Functional Exploration Phase: Feature Explosion Sprint (p6-p25)

### Related Commits
- `34beb9e` fix(cli): correct typescript type mismatches for pipeline connectors and missing provider payload
- `80a9b79` feat(p23-p25): unleash semantic cluster traverser, llm telemetry radar, and printable book exporter
- `2fc58e3` feat(p21-p22): implement cross-reference tracer and mcq terminal vocabulary arena
- `e4129de` fix(src): resolve fs undefined variable issue and correctly hoist TS test imports
- `698360a` feat(p19-p20): introduce i18n runtime locale manager and assert its behavior
- `21e7692` feat(p17-p18): implement mastered vocabulary archiver and manual CLI drop-in tool
- `500b1fe` feat(p15-p16): feature global swift search and streak-based gamification dashboard
- `88d947a` feat(p13-p14): expand target registers to gre-verbal and introduce weekly markdown journal digest
- `ce01cab` feat(p11-p12): introduce REPL loops and native macOS TTS audio linker
- `9b467a3` test(p10): cover text chunker boundary safety
- `5ea32d3` feat(p9): introduce robust silent auto-backup snapshot capability
- `4ab08a7` feat(p8): implement cross-card synonyms graphing engine
- `89b2644` feat(p7): implement robust text chunker for pipeline 1 large document intake
- `6beb786` feat(p6): implement daily challenge quiz mode

### Modifications
- **SRS & Memory Engine Integration**:
  - Implemented SM-2 (SuperMemo) algorithm for spaced repetition tracking.
  - Linked `tsm review` to active dictionary cards with interval calculation.
  - Added Anki CSV exporter for external ecosystem compatibility.
- **Interactive & Gamified Terminal**:
  - **REPL Mode**: Added `tsm repl` for continuous, low-friction sentence processing.
  - **Daily Challenge & MCQ**: Introduced interactive quiz modes (`tsm daily`, `tsm quiz`) with randomized distractors.
  - **Streak System**: Implemented day-counting logic and dashboard "🔥" icons to encourage consistency.
- **Corpus & Register Broadening**:
  - Expanded foundational contracts to support **IELTS Academic** and **GRE Verbal** registers.
  - Added "Manual Drop-in" mode to bypass AI for custom card creation.
- **Advanced Knowledge Insights**:
  - **Semantic Clusters**: Developed BFS-based graph traversal to group synonym families.
  - **Cross-Reference Tracer**: Implemented global scanning to track word usage across historical TOEFL Coach reports.
  - **Weekly Journal**: Automated Markdown generation for weekly vocabulary digests.
- **Utility & Engineering Polish**:
  - **Audio TTS**: Connected native macOS `say` API for auditory reinforcement.
  - **Global Search**: High-speed keyword scanning across full card JSON metadata.
  - **Telemetry**: Instrumented API calls to track token usage and cost analysis.
  - **Text Chunking**: Added `TextChunker` to handle large document overflow and boundary splitting.
  - **Auto-Backup**: Integrated snapshotting to prevent data loss during aggressive iterations.

### Resolved Issues
- Fixed critical `fs` dependency leakage causing runtime crashes in `daily.ts`.
- Resolved Type contract mismatches in `app-cli.ts` where provider options were missing.
- Centralized `connectors.test.ts` imports for cleaner CI pass rates.

### Next Steps
- Implement "Vanguard" pass (Codex consolidation) to refactor `app-cli.ts` into a command-tree structure.
- Optimize the `telemetry` dashboard with cost estimation for different model pricing tiers.

---


## 2026-04-10 / Three-stage Pipeline Architecture Landing & Real Test System Integration

### Related Commits
- `48d6349` feat(pipelines): upgrade pipelines 1-3 with traceability and tests
- `a91c46f` feat(cli): integrate MVP pipeline entries into command line
- `edd9b78` feat(pipeline-3): implement comprehensive knowledge base indexer
- `2e599ed` feat(pipeline-2): implement Output Correction pipeline workflows
- `d76c3f3` feat(pipeline-1): implement Input Learning pipeline and content parsing connectors

### Modifications
- **Refactored and connected three dedicated pipelines**:
  - **Pipeline 1 (Input Learning Pipeline)**: Established a complete loop from `ContentParser` -> mining `ExpressionCandidates` -> batch passing to `Dictionary Pro` for card creation.
  - **Pipeline 2 (Output Correction Pipeline)**: Translated `WeakExpressionSet` diagnosed by `TOEFL Coach` into seeds via `mapCoachToDictSeeds` and mapped them to the card creation loop. For single sentences as opposed to full essays, dynamic allocations seamlessly determine baseline English registers (e.g. `general-academic` vs `toefl-writing`).
  - **Pipeline 3 (Knowledge Base Pipeline)**: Set up a global dispatcher `OutputManager` to standardize middlewares and Markdowns generated by each pipeline seamlessly into `data/`, and added a lightweight `indexer.ts` tracking statistics across environments.
- **CLI Global Integration**: Introduced three quick testing entries in the CLI: `tsm pipeline:input`, `tsm pipeline:output`, and `tsm kb:status`.
- **Identity Source Tracing Added**: Embedded `relatedSourceSlug` / `relatedDiagnosisSlug` into the metadata of each card to resolve the issue of contextless automated card generation.
- **Industrial-grade Testing Engine Introduced**: Discarded the previous placeholder CI utilizing `tsc --noEmit`. Integrated Node native `--test` runner directly into `package.json` in tandem with GitHub Actions for stringent, genuine automated regression protection.

### Resolved Issues
- Solved the completely decentralized state where modules like `Content Parser` and `Dictionary Pro` existed without architectural interconnectivity.
- Solved the data persistence blackhole where generated knowledge and diagnoses scattered unpredictably without a standardized writing protocol or path aggregation.
- Mitigated hazardous areas prone to `undefined` errors during interface redesigns by establishing genuine unit test protections.

### Impact Range
- `src/connectors/*` 
- `src/platform/contracts.ts`
- `src/platform/output-manager.ts`
- `src/knowledge-base/indexer.ts`
- `src/toefl-writing/schema.ts`
- `src/app-cli.ts`
- `package.json`
- `tsconfig.json`
- `.github/workflows/ci.yml`

### Next Steps
- Expand test cases to encompass fallback models of API Providers.
- Optimize distribution strategies (Chunking) when integrating into Pipeline 1 to cater for lengthy PDF document extractions.

---

## 2026-04-09 / Historical Baseline: From Project Inception to Atomic Modules Establishment

### Related Commits
- Initial commits mapping back up to the establishment of the multi-provider architecture.

### Modifications
- Confirmed that TOEFL Slang Master will not employ a "wrapped GUI" and instead upholds pure "CLI-first, Markdown-first" guidelines.
- Completed the core development of **Dictionary Pro**, realizing conversions from Chinglish/slang text inputs to polished academic vocabulary.
- Completed foundational integration and schema certification for **Content Parser** and **TOEFL Coach** components.
- Integrated multiple LLM API engines (OpenAI, Anthropic) gracefully avoiding strict dependency bottlenecks linked explicitly inside any single vendor workflow.

### Resolved Issues
- Alleviated the lack of targeted, dimensionally-reduced TOEFL English parsing methodologies for Chinese-speaking learners natively available on a systemic scale.
- Consolidated an orchestration framework (`runValidatedJsonGeneration`) capable of enforcing strict TypeScript contract validation routines for standardizing outputs cleanly.

### Impact Range
- `src/dictionary-pro/*`
- `src/content-parser/*`
- `src/toefl-writing/*`
- `src/platform/runtime/*`
- `src/app-cli.ts`

### Risks / Pending Items
- At this stage, the toolkit pieces remain "scattered". Users must manually link the outputs of upstream tools seamlessly into downstream tools.

### Next Steps
- Connect the isolated atomic capabilities directly into closed-loop pipeline architectures.
