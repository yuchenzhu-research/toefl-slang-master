# Content Parser JSON Contract

Return one JSON object only. Do not wrap it in Markdown, prose, or code fences.

Common rules:

- `kind` must be `content_note`.
- `sourceType` must be one of: `pdf`, `markdown`, `text`.
- `focus` must be one of: `full`, `syntax`, `slang`, `culture`, `conversion`.
- All required strings must be non-empty.
- Section arrays must contain at least 1 string.

```json
{
  "kind": "content_note",
  "title": "The Future of Work",
  "sourceType": "pdf",
  "focus": "full",
  "sourceName": "future-of-work.pdf",
  "extraction": {
    "charCount": 8421,
    "truncated": false,
    "pageCount": 6
  },
  "overview": [
    "文章主张远程办公不会完全替代线下协作，而是推动混合办公常态化。",
    "作者立场偏务实，更多强调制度设计而不是技术乐观主义。"
  ],
  "breakdown": [
    "句子: 'Companies that once treated remote work as a temporary fix are now redesigning management structures around it.' 结构亮点是定语从句 + treat A as B，可直接迁移到政策变迁类写作。",
    "句子: 'What matters is not where employees sit but how accountability is maintained.' 亮点是 what-clause 做主语补足信息，适合托福让步或转折段。"
  ],
  "slang": [
    "'temporary fix' 带有权宜之计的语感，比 simple solution 更像媒体英语。"
  ],
  "culture": [
    "远程办公在美国语境下常和 productivity debate、downtown vacancy、childcare pressure 绑定出现。"
  ],
  "conversion": [
    "'temporary fix' -> 'short-term remedy'，更适合正式写作。",
    "'redesigning ... around it' -> 'restructuring ... in response to it'，逻辑更显性。"
  ],
  "notes": [
    "如果后续要做整篇深度讲解，建议按段落分块继续解析。"
  ]
}
```

