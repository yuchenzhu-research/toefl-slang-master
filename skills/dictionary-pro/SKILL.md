---
name: dictionary-pro
description: Convert informal English words, phrases, collocations, and sentence fragments into precise TOEFL-appropriate alternatives while preserving meaning and register. Use when a user asks what an expression means, whether it is too informal, how to say it more academically, how to replace low-level vocabulary in TOEFL writing, or how slang/plain English compares with academic alternatives.
---

# Dictionary Pro

Use this skill as a register-conversion lexicon, not a generic dictionary. Optimize for semantic precision, natural collocation, and exam-safe phrasing.

## Core Workflow

### 1. Classify the request

Route the request into one primary mode:

- `meaning`: explain what a word or phrase means in context
- `conversion`: convert slang or casual English into TOEFL-safe wording
- `upgrade`: replace a weak word, phrase, or sentence span with a stronger alternative
- `comparison`: distinguish between near-synonyms or levels of formality

### 2. Resolve context before suggesting replacements

- Use the user's sentence, nearby clause, and target scenario first.
- If the expression is ambiguous and no context is provided, list 2 to 4 likely senses instead of guessing.
- Preserve polarity, strength, and connotation. Do not replace a mild phrase with an extreme one.
- Prefer phrase-level replacements when naturalness depends on collocation.

### 3. Choose the output shape

- For word or phrase queries, use the default 5-dimension table in `references/output-contract.md`.
- For sentence-level upgrades, mark the weak span, offer 2 to 3 replacements, and provide one recommended rewrite.
- For ambiguous inputs, show candidate senses first, then align replacements to each sense.

## Quality Bar

Every recommendation must satisfy all of the following:

- `meaning-safe`: the replacement matches the intended sense in context
- `collocation-safe`: the phrase sounds natural with surrounding words
- `register-safe`: the recommendation fits the requested setting, especially TOEFL writing
- `not fake-advanced`: avoid words that look sophisticated but distort the original meaning

## Response Rules

- Default to Chinese explanation when the user writes in Chinese. Keep English examples in English.
- Keep the answer decision-oriented. Explain why one option is safer or stronger than another.
- Rank TOEFL alternatives from safest to strongest when nuance matters.
- Treat frequency as qualitative only unless the user provides evidence or asks for a corpus-backed answer.
- Avoid recommending contractions or slang for TOEFL writing.
- If the user asks for spoken English, show the casual form and the TOEFL-safe form side by side.
- If the runtime explicitly asks for structured JSON, return valid JSON only and follow `references/json-contract.md`.

## Failure Modes To Avoid

- Do not dump loose synonym lists without explaining register differences.
- Do not confuse literal meaning with pragmatic tone.
- Do not over-upgrade simple verbs into unnatural academicese.
- Do not claim an expression is "common" or "rare" without framing it as a qualitative judgment.

## Boundaries

- Handle lexical choice, local rewrites, and register conversion.
- Hand off full essay diagnosis to `toefl-writing`.
- Hand off full article or PDF breakdown to `content-parser`.

## Resource

- Read `references/output-contract.md` when formatting a response or when the input type is ambiguous.
- Read `references/json-contract.md` when the runtime asks for structured output or validation-safe JSON.
- Read `references/evaluation-cases.md` when running prompt regression checks after updates.
