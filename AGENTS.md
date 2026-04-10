# AGENTS.md - Agent Instructions and Guidelines

Hello Agent. When you are summoned to work on the "TOEFL Slang Master" repository, you **MUST** strictly follow the guidelines detailed below.

## 1. Required Reading List
Before executing code modifications or deep-diving into execution, ensure you have reviewed:
- `README.md`
- `README_EN.md`
- `docs/vision.md`
- `docs/pipeline.md`
- `docs/i18n.md`
- `MANUAL.md`

## 2. Strict Project Boundaries
- **No Premature GUI**: Do not spend time developing a Web UI, React frontend, User Authentication, or cloud database storage systems. This system is **CLI-first** and **Markdown-first**.
- **No Prompt-Spaghetti**: Avoid having modules directly invoke each other using raw prompts. Instead, use standardized intermediate objects (`SourceDigest`, `ExpressionCard`, etc.) to interface safely.
- **Provider Integrity**: The platform handles API providers (OpenAI, Anthropic). **Do not** write custom fetch logic inside `Dictionary Pro`, `Content Parser`, or `TOEFL Coach`. Always use the platform's multi-provider runtime layer.

## 3. Code Modification Rules
1. Never assume the project is fully mature. Look at existing implementations for style, but remain critical of boundaries.
2. If changing a core flow, define the standard schema/contract first, workflow second.
3. Don't add custom "legacy fallbacks" and do not re-invent the unified validation system.
4. If an interface's locale is requested to change, DO NOT change the JSON Keys or Schema names. They must remain in pure English.
5. All deliverables (especially for cards and diagnosis) should ideally fall into a two-file drop: `something.json` and `something.md`.

## 4. Assessment Benchmark
A change is **GOOD** if it:
- Hardens the boundary around a module.
- Standardizes a JSON contract.
- Unifies output format across tools.
- Pushes forward the automated CI and tests pipeline.

A change is **BAD** if it:
- Makes a prompt more complex without stabilizing its accompanying schema contract.
- Duplicates logic between a Traditional Chinese vs Simplified Chinese codepath.
- Mentions cloud architecture where simple local Markdown persistence would suffice.

## 5. Synchronization Constraints
When you modify parameters, add dimensions to skill files under `.claude/skills/`, or shift module positioning, you MUST automatically:
- Update `README.md`
- Synchronize `README_EN.md`
- Align documentation. 
Never leave the EN and ZH variants out of sync.
