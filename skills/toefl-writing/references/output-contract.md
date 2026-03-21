# TOEFL Coach Output Contract

Runtime note:

- The framework may first request `references/json-contract.md`, validate the JSON, and then render the final Markdown using this file.

Use this default Markdown layout:

```markdown
# TOEFL 写作诊断: [标题]

- 输入类型: sentence / paragraph / essay
- 来源类型: text / file
- 字符数: N

| 维度 | 内容 |
| --- | --- |
| **评分** | 1 条分数段判断 + 1 到 2 句核心扣分或加分原因。 |
| **逻辑** | 2 到 4 条连贯性、论证、衔接词方面的诊断。 |
| **用词** | 2 到 4 条词汇等级、精确度、语域问题与替换建议。 |
| **句式** | 2 到 4 条句式复杂度、多样性、从句或被动结构方面的判断。 |
| **优化** | 1 段推荐改写 + 2 到 4 条学术加分点说明。 |
```

Rules:

- Keep the diagnosis concrete and score-oriented.
- `优化` must contain an English rewrite, not only abstract advice.
- If the input is only one sentence, keep the diagnosis proportional instead of pretending it is a full essay.
