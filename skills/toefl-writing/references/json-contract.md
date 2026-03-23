# TOEFL Coach JSON Contract

Return one JSON object only. Do not wrap it in Markdown, prose, or code fences.

Common rules:

- `kind` must be `writing_diagnosis`.
- `scope` must be one of: `sentence`, `paragraph`, `essay`.
- `sourceType` must be one of: `text`, `file`.
- All required strings must be non-empty.
- Array fields must contain at least 1 string unless marked optional.
- `weakExpressionSet`, `revisionFocus`, and `upgradePrioritySummary` are optional connector fields for `TOEFL Coach -> Dictionary Pro`.

```json
{
  "kind": "writing_diagnosis",
  "title": "Technology paragraph",
  "scope": "paragraph",
  "sourceType": "text",
  "charCount": 127,
  "score": {
    "band": "16-19/30",
    "reason": "词汇基础、连接词单一、句式偏简单，能够表达核心意思但学术感不足。"
  },
  "logic": [
    "because / but / so 的衔接层级偏低，论证推进较平。",
    "转折和结论虽然存在，但逻辑关系没有被更明确地标示出来。"
  ],
  "vocabulary": [
    "\"good\" 可升级为 \"beneficial\"，更符合托福写作语域。",
    "\"bad effects\" 可改为 \"adverse effects\"，表达更精确。"
  ],
  "structure": [
    "简单句比例较高，缺少定语从句或让步结构。",
    "可将两句合并，通过分号或从句增强句法层次。"
  ],
  "optimization": {
    "rewrite": "Technology, which has substantially transformed modern communication, offers clear benefits; however, its adverse effects also require careful consideration.",
    "explanations": [
      "使用定语从句提升句式复杂度。",
      "使用 however 强化转折逻辑。",
      "benefits / adverse effects 的词汇等级更适合学术写作。"
    ]
  },
  "weakExpressionSet": {
    "kind": "weak_expression_set",
    "title": "Technology paragraph",
    "scope": "paragraph",
    "targetRegister": "toefl-writing",
    "sourceText": "Technology has many good effects on society. I think it helps people a lot.",
    "summary": "The passage relies on vague adjectives and spoken-style framing.",
    "items": [
      {
        "text": "good",
        "category": "low_precision_word",
        "severity": "high",
        "reason": "Meaning is too vague for TOEFL writing.",
        "targetRegister": "toefl-writing",
        "sourceSentence": "Technology has many good effects on society.",
        "sourceFragment": "good effects",
        "rewriteGoal": "Replace the vague phrase with a more precise academic alternative.",
        "coachNote": "Prefer a noun-adjective pair that sounds analytical rather than conversational."
      }
    ]
  },
  "revisionFocus": [
    "good effects",
    "I think"
  ],
  "upgradePrioritySummary": "Vague vocabulary and spoken-style framing should be upgraded first.",
  "notes": [
    "如果继续扩展成完整托福段落，需要加入更具体的例证。"
  ]
}
```
