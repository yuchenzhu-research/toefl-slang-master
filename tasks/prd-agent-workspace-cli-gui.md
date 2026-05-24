# PRD: Agent Workspace CLI + GUI

## Introduction

Build SPARK into a Claude Code / OpenClaw-inspired learning agent workspace with both CLI and desktop GUI experiences. The GUI should move beyond the current gallery landing page into a beautiful, horizontal, command-centered workspace inspired by the ALET reference: light surface, small precise type, unusual horizontal layout, photographic/visual rhythm, and interactive motion. The CLI should become a terminal-first companion that exposes the same study actions through a command/session model.

The goal is not to clone Claude Code, OpenClaw, or ALET. The goal is to translate their strongest product patterns into SPARK's English-learning domain: command input, session state, tool/status traces, artifact output, and a calm high-craft workspace.

## Confirmed Direction

- GUI structure: ALET-style horizontal canvas with left command dock, middle lanes, and right artifact rail.
- CLI name: bare `spark` enters the agent workspace. Existing explicit subcommands such as `spark help`, `spark dict`, and `spark studio` remain supported.
- Visual intensity: high. The desktop app should feel visually distinctive and interactive, while remaining usable as a study workspace.
- Ralph distribution: 50 tasks total: 10 architecture, 10 CLI, 30 GUI.
- CSS scope: broad visual rewrite is allowed.
- Ralph failure policy: if a story fails, later iterations may continue repairing the same story.

## Goals

- Create a shared product model for CLI and GUI: sessions, commands, tools, artifacts, and status.
- Turn the desktop app into a visually distinctive learning workspace with command-first interaction.
- Establish a CLI surface that feels like an agent loop, not isolated one-off commands.
- Use local references responsibly: Claude Code source for terminal UI patterns, OpenClaw references for agent/plugin/workspace structure, and ALET/Godly for visual interaction direction.
- Keep implementation incremental through 50 Ralph stories that each fit one iteration.

## User Stories

### US-001: Create Interface Reference Notes
**Description:** As a developer, I want concise reference notes from ALET, Claude Code, and OpenClaw so that implementation agents know the design direction without copying external code.

**Acceptance Criteria:**
- [ ] Add `docs/frontend-interface-reference.md`.
- [ ] Document ALET-inspired visual principles: horizontal layout, small type, light surface, interactive movement, image rhythm.
- [ ] Document Claude Code-inspired CLI principles from `/Users/yuchenzhu/Desktop/claude-code-source-code-main`: command input, session log, tool/status messages, keyboard-first flow.
- [ ] Document OpenClaw-inspired architecture principles from `references/openclaw`: agent workspace, plugin/extension boundaries, not copying runtime code.
- [ ] Include explicit non-copying rule: references inform patterns only.
- [ ] Typecheck passes.

### US-002: Define Shared Interface Domain Model
**Description:** As a developer, I want CLI and GUI to share one small interface domain model so both versions can evolve consistently.

**Acceptance Criteria:**
- [ ] Add a shared TypeScript model for workspace sessions, commands, command results, artifacts, and tool/status events.
- [ ] Model lives under `src/platform/` or another existing platform boundary, not inside a page component.
- [ ] Field names are English and locale-neutral.
- [ ] Add unit tests for at least one session lifecycle and one command result shape.
- [ ] Typecheck passes.
- [ ] Tests pass.

### US-003: Add Agent Workspace CLI Skeleton
**Description:** As a learner, I want a SPARK CLI workspace mode so that I can run study commands in a continuous terminal session.

**Acceptance Criteria:**
- [ ] Add a CLI command such as `spark workspace` or `spark agent` with help text.
- [ ] CLI accepts at least one command-oriented input path for Dictionary Pro dry-run lookup.
- [ ] CLI prints a session header, command echo, status line, and artifact/result summary.
- [ ] Existing `spark studio` behavior remains available.
- [ ] Update README command surface if a new command is added.
- [ ] Typecheck passes.
- [ ] Tests pass.

### US-004: Build Desktop Command Dock Layout
**Description:** As a learner, I want the desktop app to present a command dock and horizontal workspace so that SPARK feels like an agent workspace rather than a static module menu.

**Acceptance Criteria:**
- [ ] Desktop landing/workspace view includes a command dock with input, mode selector, and primary run action.
- [ ] Layout uses horizontal workspace lanes or panels inspired by ALET without becoming a portfolio page.
- [ ] Visual style uses small precise type, light surface, restrained controls, and stable dimensions.
- [ ] Existing navigation to Dictionary, Style, Coach, Content, and Settings remains reachable.
- [ ] Typecheck passes.
- [ ] Verify in browser using dev-browser skill.

### US-005: Add Session Timeline Panel
**Description:** As a learner, I want to see previous commands and status events so that I can understand what the learning agent has done.

**Acceptance Criteria:**
- [ ] Desktop workspace includes a session timeline panel.
- [ ] Timeline can display command submitted, backend checking, lookup completed, and error event states.
- [ ] Timeline state is local in this phase and does not require persistence.
- [ ] Timeline uses the shared interface domain model from US-002 if available.
- [ ] Typecheck passes.
- [ ] Verify in browser using dev-browser skill.

### US-006: Add Artifact Preview Rail
**Description:** As a learner, I want a preview rail for Markdown/JSON-style outputs so that SPARK's artifact-first model is visible in the GUI.

**Acceptance Criteria:**
- [ ] Desktop workspace includes an artifact preview rail or panel.
- [ ] Rail can show at least Dictionary markdown output and structured metadata summary.
- [ ] Empty state explains no artifact has been generated yet without long tutorial copy.
- [ ] Layout remains readable on laptop-sized desktop windows.
- [ ] Typecheck passes.
- [ ] Verify in browser using dev-browser skill.

### US-007: Align Dictionary Page With Agent Workspace Shell
**Description:** As a learner, I want Dictionary Pro to run inside the new workspace shell so that the first real workflow demonstrates the future CLI/GUI model.

**Acceptance Criteria:**
- [ ] Dictionary lookup can be triggered from the command dock or Dictionary page using the same API client.
- [ ] Lookup result updates the session timeline and artifact preview rail.
- [ ] Backend unavailable and lookup error states appear in the workspace shell.
- [ ] Existing Dictionary page behavior does not regress.
- [ ] Typecheck passes.
- [ ] Verify in browser using dev-browser skill.

## Functional Requirements

- FR-1: The project must maintain both CLI and GUI paths for the agent workspace concept.
- FR-2: CLI and GUI must share stable interface concepts: session, command, event, artifact, and result.
- FR-3: GUI must use a horizontal, high-craft workspace layout inspired by ALET but tailored for study operations.
- FR-4: CLI must preserve terminal-first ergonomics inspired by Claude Code: concise command echo, status trace, and result summary.
- FR-5: References must be used as design and architecture input only; do not copy third-party UI/runtime code into SPARK.
- FR-6: Desktop implementation must continue to consume stable local API/client boundaries.
- FR-7: Every UI story must pass desktop typecheck/build and visual verification.

## Non-Goals

- No login, account system, cloud sync, billing, or hosted service.
- No full terminal emulator inside the desktop app in this phase.
- No copying or vendoring the full Claude Code source tree.
- No copying ALET layout assets, brand, or code.
- No rewriting OpenClaw runtime into SPARK.
- No persistence database for sessions in this phase.

## Design Considerations

- Use ALET as inspiration for rhythm: horizontal motion, unusual composition, small typography, light surfaces, image-like panels, and tactile movement.
- Use Claude Code as inspiration for interaction: command input, compact status traces, keyboard-first flow, visible tool activity, and session continuity.
- Use OpenClaw as inspiration for architecture: agent/plugin/workspace separation, extension boundaries, and conservative connector growth.
- SPARK should still feel like an English-learning product: vocabulary, writing, reading, and artifacts must be first-class.
- Avoid marketing hero layout. The first screen should be a usable workspace.

## Technical Considerations

- Existing desktop app lives under `apps/desktop`.
- Existing local API client lives under `apps/desktop/src/renderer/src/api/client.ts`.
- Existing backend API command is `spark web --port 4173`.
- Claude Code local reference path is `/Users/yuchenzhu/Desktop/claude-code-source-code-main`.
- OpenClaw reference is already present under `references/openclaw`.
- Future Ralph iterations should avoid large cross-cutting UI rewrites. Prefer one shell/panel/model at a time.

## Success Metrics

- A user can understand SPARK as a command-driven study workspace within the first screen.
- A learner can perform a Dictionary lookup from the GUI and see command, status, and artifact outputs in one workspace.
- A learner can run the same conceptual flow from CLI.
- Future module integrations can reuse the same session/event/artifact model.
- CI remains green across root tests and desktop typecheck/build.

## Ralph Execution Plan

The executable Ralph queue lives in `scripts/ralph/prd.json` and contains 50 stories:

- US-001 through US-010: reference notes, shared workspace model, event/artifact helpers, parser, fixtures, API normalization, renderer state adapter, governance, and guard tests.
- US-011 through US-020: bare `spark` workspace CLI, help, Dictionary/Style/Coach/Content commands, session timeline output, artifact summary, error wording, and README updates.
- US-021 through US-050: high-intensity ALET-inspired GUI: visual tokens, horizontal canvas, command dock, mode selector, keyboard interactions, lanes, timeline, status chips, artifact rail, Dictionary integration, page alignment, settings, visual system adaptation, motion, responsive behavior, accessibility, CSS cleanup, QA, and final docs.

The intended long run command is:

```bash
./scripts/ralph/ralph.sh --tool claude 50
```

## Open Questions

- Should the desktop command dock default to Dictionary Pro or offer an explicit mode selector first?
- Should visual assets remain the current generated SPARK gallery images or be replaced with interface-native panels?
- Should session timeline persistence be added after the local-only phase?
