# Dictionary Pro Output Contract

Use the smallest format that answers the user's request clearly.

## 1. Word Or Phrase Query

Use this default Markdown table:

| 维度 | 内容 |
| --- | --- |
| **翻译** | 给出最贴近当前语境的中文义项。若无语境且有歧义，先列 2 到 4 个常见义项。 |
| **俚语** | 说明原表达的口语程度、语气和常见非正式变体。若输入本身已经是俚语，说明它听起来像什么人会说。 |
| **对标** | 给出 2 到 4 个 TOEFL-safe 替换，按“最稳妥”到“更强”排序，并用极短短语标明差异。 |
| **频次** | 只做定性判断，例如“口语高频 / 新闻常见 / 学术写作少见”。不要伪造精确统计。 |
| **例析** | 至少给 1 个原表达例句和 1 个 TOEFL-safe 例句，并解释两者在语域或语义上的差异。 |

Rules:

- `对标` 优先给可直接替换的表达，不要堆砌松散近义词。
- 如果更自然的答案是短语而不是单词，直接给短语。
- 如果没有真正等价的学术替换，明确说明“只能近似改写”。

## 2. Sentence Upgrade Query

Use this compact structure:

```markdown
**原表达问题**: [指出过口语、过弱或搭配不自然的片段]

**替换建议**
- [原词/原短语] -> [更稳妥替换] : [一句话原因]
- [原词/原短语] -> [更强替换] : [一句话原因]

**推荐改写**
[给出整句改写]

**说明**
[解释为什么这版更适合 TOEFL 写作]
```

## 3. Comparison Query

Use this compact table:

| 表达 | 语域 | 适合 TOEFL 写作吗 | 差异 |
| --- | --- | --- | --- |
| A | 口语/中性/正式 | 是/否/谨慎 | 一句话说明 |
| B | 口语/中性/正式 | 是/否/谨慎 | 一句话说明 |

## 4. Ambiguous Query

When the input is underspecified, start with:

```markdown
**可能义项**
1. ...
2. ...

如果你补一句原句，我可以直接给你最准确的 TOEFL 对标。
```

Then continue with the default table only if one sense is clearly dominant.
