---
name: dictionary-pro
description: Convert informal English words, phrases, collocations, and sentence fragments into precise TOEFL-appropriate alternatives while preserving meaning and register. Use when a user asks what an expression means, whether it is too informal, how to say it more academically, how to replace low-level vocabulary in TOEFL writing, or how slang/plain English compares with academic alternatives.
version: 3.0.0
allowed-tools: Read, Write, Grep, Glob
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

- For word or phrase queries, use the default 5-dimension table below.
- For sentence-level upgrades, mark the weak span, offer 2 to 3 replacements, and provide one recommended rewrite.
- For ambiguous inputs, show candidate senses first, then align replacements to each sense.

## Default 5-Dimension Table

| 维度 | 内容说明 |
| --- | --- |
| **翻译** | 给出最贴近当前语境的中文义项。若无语境且有歧义，先列 2 到 4 个常见义项。 |
| **俚语** | 说明原表达的口语程度、语气和常见非正式变体。若输入本身已经是俚语，说明它听起来像什么人会说。 |
| **对标** | 给出 2 到 4 个 TOEFL-safe 替换，按“最稳妥”到“更强”排序，并用极短短语标明差异。 |
| **频次** | 只做定性判断，例如“口语高频 / 新闻常见 / 学术写作少见”。不要伪造精确统计。 |
| **例析** | 至少给 1 个原表达例句和 1 个 TOEFL-safe 例句，并解释两者在语域或语义上的差异。 |

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

## Failure Modes To Avoid

- Do not dump loose synonym lists without explaining register differences.
- Do not confuse literal meaning with pragmatic tone.
- Do not over-upgrade simple verbs into unnatural academicese.
- Do not claim an expression is "common" or "rare" without framing it as a qualitative judgment.

## Boundaries

- Handle lexical choice, local rewrites, and register conversion.
- Hand off full essay diagnosis to `toefl-writing`.
- Hand off full article or PDF breakdown to `content-parser`.
