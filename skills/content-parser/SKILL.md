---
name: content-parser
description: Parse PDF, Markdown, or plain text reading materials into structured TOEFL-oriented study notes. Use when a user asks to read a PDF, break down an article, extract difficult sentences, explain slang or cultural context, or convert source expressions into academic alternatives.
---

# Content Parser

Use this skill as a reading-note parser, not as a PDF editor or OCR cleanup tool.

## Core Workflow

1. Ingest the source first.
   - Use `scripts/extract_pdf_text.py` for `.pdf`.
   - Read `.md` / `.txt` files directly.
   - Accept inline text when the user pastes article content.
2. Normalize the extracted text before sending it to a model.
   - Keep title, source type, file name, and truncation metadata.
   - If the document is too long, trim it and say so in `notes`.
3. Produce one structured note with five sections.
   - `overview`
   - `breakdown`
   - `slang`
   - `culture`
   - `conversion`
4. If extraction quality is poor, say so explicitly instead of hallucinating details.

## Output Rules

- Default to Chinese explanation when the user writes in Chinese.
- Keep quoted source sentences in English when the source is English.
- Prefer the most study-worthy details over broad paraphrase.
- When the runtime requests JSON, follow `references/json-contract.md` exactly.
- When rendering Markdown, follow `references/output-contract.md`.

## Source Handling Rules

- PDF extraction is text-first. Do not claim layout fidelity.
- If a PDF page extracts poorly, record that as a limitation in `notes`.
- Keep sentence-level breakdowns short enough to remain skimmable.
- Favor reusable TOEFL writing patterns over exhaustive grammar commentary.

## When To Load References

- Read `references/output-contract.md` when formatting the final Markdown note.
- Read `references/json-contract.md` when the runtime asks for structured JSON.

