# Dictionary Pro JSON Contract

Return one JSON object only. Do not wrap it in Markdown, prose, or code fences.

Common rules:

- All required strings must be non-empty.
- `kind` must be one of: `word_phrase`, `sentence_upgrade`, `comparison`, `ambiguous`.
- `mode` should echo the active mode, or `auto-detect`.
- `target` should echo the target scenario.
- `notes` is optional and should be short.

## 1. `word_phrase`

Use for word- or phrase-level meaning / conversion / local upgrade.

```json
{
  "kind": "word_phrase",
  "query": "a big deal",
  "mode": "conversion",
  "target": "toefl-writing",
  "context": "This policy is a big deal for rural schools.",
  "translation": ["很重要的事"],
  "slang": {
    "register": "informal",
    "tone": "common spoken emphasis",
    "variants": ["a huge deal"]
  },
  "alignment": [
    { "expression": "highly significant", "note": "safest academic replacement" },
    { "expression": "of considerable importance", "note": "slightly stronger and more formal" }
  ],
  "frequency": "口语高频，托福写作少见",
  "analysis": {
    "sourceExample": "This policy is a big deal for rural schools.",
    "sourceExplanation": "原句强调重要性，但口语色彩较强。",
    "toeflExample": "This policy is highly significant for rural schools.",
    "toeflExplanation": "改写后更适合正式写作，同时保留原有强调。"
  },
  "notes": ["若上下文强调影响范围，也可改写为 has substantial implications。"]
}
```

## 2. `sentence_upgrade`

Use for sentence-level local rewrite.

```json
{
  "kind": "sentence_upgrade",
  "query": "The policy has good effects.",
  "mode": "upgrade",
  "target": "toefl-writing",
  "problem": "good effects 过于笼统，语域偏弱。",
  "replacements": [
    {
      "source": "good effects",
      "replacement": "beneficial effects",
      "reason": "最稳妥，语义保持最完整。"
    },
    {
      "source": "good effects",
      "replacement": "positive implications",
      "reason": "更抽象，更像学术写作。"
    }
  ],
  "recommendedRewrite": "The policy has beneficial effects.",
  "explanation": "推荐改写保留原义，同时提升正式度和准确性。",
  "notes": ["若强调长期结果，可改为 long-term benefits。"]
}
```

## 3. `comparison`

Use when comparing near-synonyms or register levels.

```json
{
  "kind": "comparison",
  "query": "however vs nevertheless",
  "mode": "comparison",
  "target": "toefl-writing",
  "items": [
    {
      "expression": "however",
      "register": "formal",
      "toeflSuitability": "yes",
      "difference": "最常见、最稳妥，适合大多数托福转折句。"
    },
    {
      "expression": "nevertheless",
      "register": "formal and slightly stronger",
      "toeflSuitability": "caution",
      "difference": "强调“尽管如此”，逻辑力度更强。"
    }
  ],
  "summary": "如果只求稳定和自然，however 通常更安全。"
}
```

## 4. `ambiguous`

Use when the input is underspecified and you cannot safely choose one sense.

```json
{
  "kind": "ambiguous",
  "query": "cap",
  "mode": "meaning",
  "target": "general-academic",
  "possibleSenses": [
    "帽子",
    "上限 / 限制",
    "在俚语里表示 lie"
  ],
  "clarificationPrompt": "如果你给我一整句原句，我可以直接判断应该用哪一个义项。",
  "resolvedCard": null,
  "notes": ["如果是在政策、费用、排放等语境里，通常更接近“上限”。"]
}
```

`resolvedCard` may be `null`, or a full `word_phrase` object when one sense is clearly dominant.
