# PRD: Frontend Evolution

## Introduction

Evolve the SPARK desktop frontend from a visually polished entry screen into a real learning workspace. The first phase should prioritize the Dictionary Pro workflow while keeping the implementation architecture-first: shared API client, state model, UI structure, and integration boundaries should be established before expanding all modules.

This PRD follows the current governance direction: the desktop frontend lives in `apps/desktop`, consumes stable local APIs/contracts, and must not duplicate core business logic from `src/`.

## Goals

- Turn the desktop app into a credible learning workspace rather than a static showcase.
- Establish reusable frontend architecture for API calls, loading/error state, form state, and result rendering.
- Make Dictionary Pro the first workflow with a clear path to real local backend integration.
- Keep future Style, TOEFL Coach, and Content Parser pages easy to integrate without copying logic.
- Preserve the current local-first, no-login product boundary.

## User Stories

### US-001: Create Frontend API Client Boundary
**Description:** As a developer, I want a shared frontend API client so that renderer pages call local SPARK APIs through one maintained boundary.

**Acceptance Criteria:**
- [ ] Add a shared API client module under `apps/desktop/src/renderer/src/`.
- [ ] Client exposes typed functions for `GET /api/health` and `POST /api/dict/lookup`.
- [ ] Client has one configurable API base URL with a local default.
- [ ] Client returns structured success and error objects; pages must not parse raw `fetch` responses directly.
- [ ] Typecheck passes.

### US-002: Add Dictionary Workspace State Model
**Description:** As a developer, I want Dictionary Pro page state to be explicit so that the UI can manage input, request status, results, and errors predictably.

**Acceptance Criteria:**
- [ ] Dictionary page state includes input text, target mode if applicable, loading state, error message, and last result.
- [ ] Empty input cannot trigger a lookup.
- [ ] Starting a lookup clears stale errors.
- [ ] Failed lookup preserves the user's input.
- [ ] Typecheck passes.

### US-003: Wire Dictionary Pro Page to Local API
**Description:** As a learner, I want to enter an informal expression and get Dictionary Pro output in the desktop app so that I can use the app as a real study workspace.

**Acceptance Criteria:**
- [ ] Dictionary page has a primary input for an expression such as `a big deal`.
- [ ] Dictionary page has a visible action button that triggers `POST /api/dict/lookup`.
- [ ] While the request is running, the page shows a non-blocking loading state.
- [ ] Successful response renders at least the original expression, academic alternative, register notes, and examples when available from the API response.
- [ ] Failed response shows a concise error message without clearing the input.
- [ ] Typecheck passes.
- [ ] Verify in browser using dev-browser skill.

### US-004: Add Backend Availability Feedback
**Description:** As a learner, I want the desktop app to show whether the local SPARK backend is reachable so that I know why lookups may fail.

**Acceptance Criteria:**
- [ ] App checks `GET /api/health` when the Dictionary page opens or when the user manually refreshes status.
- [ ] Backend status is shown as reachable, unavailable, or checking.
- [ ] If backend is unavailable, Dictionary lookup controls remain visible but show a clear local-backend error path on submit.
- [ ] Typecheck passes.
- [ ] Verify in browser using dev-browser skill.

### US-005: Extract Shared Workspace UI Primitives
**Description:** As a developer, I want reusable workspace UI primitives so future pages can share consistent input, action, status, and result layout patterns.

**Acceptance Criteria:**
- [ ] Add shared components for at least status message, action button state, and result section layout.
- [ ] Dictionary page uses these shared components.
- [ ] Components do not include Dictionary-specific business wording unless passed as props.
- [ ] No card-inside-card layout is introduced.
- [ ] Typecheck passes.
- [ ] Verify in browser using dev-browser skill.

## Functional Requirements

- FR-1: The desktop frontend must keep all SPARK business logic in backend/API/contract layers, not renderer page code.
- FR-2: The renderer must expose a shared local API client for health and Dictionary lookup.
- FR-3: Dictionary lookup must call `POST /api/dict/lookup` through the shared API client.
- FR-4: The Dictionary page must show explicit loading, success, empty-input, and error states.
- FR-5: The Dictionary page must preserve user input across failed requests.
- FR-6: The frontend must provide backend availability feedback using `GET /api/health`.
- FR-7: Shared workspace UI components must be reusable by future Style, Coach, and Content pages.
- FR-8: Root scripts and CI must continue to pass `npm run desktop:typecheck` and `npm run desktop:build`.

## Non-Goals

- No login, account system, user profiles, or cloud sync.
- No new database or long-term local persistence in this phase.
- No complex offline cache, auto-update flow, or multi-window architecture.
- No full implementation of Economist Style, TOEFL Coach, or Content Parser in this phase.
- No direct provider/API key management beyond what existing local backend contracts expose.
- No duplication of Dictionary Pro prompt, validator, or provider runtime logic inside React.

## Design Considerations

- Keep the desktop app quiet and work-focused; it should feel like a study workspace, not a marketing page.
- Preserve the existing visual identity where useful, but prioritize dense, scannable workflow UI inside module pages.
- Use stable layout constraints for input areas, action bars, result panels, and status indicators so text and states do not shift the layout dramatically.
- Use existing page/component boundaries under `apps/desktop/src/renderer/src/pages` and `apps/desktop/src/renderer/src/components`.
- Dictionary Pro should be the reference implementation for future module pages.

## Technical Considerations

- Local backend entrypoint is currently documented as `spark web --port 4173`.
- The desktop renderer should default to `http://localhost:4173` unless a future preload/config layer provides a safer runtime configuration path.
- Keep API response parsing close to the shared API client so page components consume predictable TypeScript objects.
- A future phase may move local API orchestration into Electron main/preload IPC, but this phase can use renderer-side local HTTP if it respects the shared API boundary.
- Any UI story must be verified visually after implementation, using the browser/dev-browser workflow required by project frontend practice.

## Success Metrics

- A learner can complete a Dictionary lookup from the desktop app without using the terminal.
- A developer can add a second API-backed page by reusing the shared API client and workspace UI primitives.
- Dictionary page has explicit and tested loading/error/success state paths.
- Desktop typecheck and build remain part of CI.
- No new frontend code imports provider runtime, validators, or module business logic directly from `src/`.

## Open Questions

- Should the desktop app start or supervise the local backend automatically, or should users run `spark web --port 4173` separately for now?
- Should API base URL be configured in UI settings, environment variables, or Electron preload?
- What exact response shape should the Dictionary page render first: raw API payload, normalized frontend view model, or Markdown preview?
- Should dry-run mode be the default for desktop Dictionary lookup until provider credentials are configured?
