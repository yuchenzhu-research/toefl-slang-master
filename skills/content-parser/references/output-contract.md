# Content Parser Output Contract

Runtime note:

- The framework may first request `references/json-contract.md`, validate the JSON, and then render the final Markdown using this file.

Use this default Markdown layout:

```markdown
# 素材拆解笔记: [标题]

- 来源类型: pdf / markdown / text
- 聚焦模式: full / syntax / slang / culture / conversion
- 提取字符数: N
- 是否截断: yes / no

| 维度 | 内容 |
| --- | --- |
| **导读** | 2 到 4 条要点，概括主题、立场、修辞、难度。 |
| **拆解** | 1 到 3 条高价值长难句分析，强调结构与可复用句式。 |
| **俚语** | 1 到 3 条地道表达、真实语感、适用场景。 |
| **文化** | 1 到 3 条美国社会 / 历史 / 制度 / 媒体背景。 |
| **转化** | 2 到 4 条从原文表达到 TOEFL-safe 写法的转换建议。 |
```

Rules:

- Each section should contain concrete, copyable study notes instead of generic summary.
- Use concise bullet-style fragments inside each cell.
- If a section is weak because the source does not provide much material, state that explicitly instead of inventing content.

