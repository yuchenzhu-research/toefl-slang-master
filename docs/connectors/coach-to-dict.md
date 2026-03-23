# Coach To Dict Connector Contract

> 这个文件只定义第一条串联链：
> `TOEFL Coach -> Dictionary Pro`
>
> 它不是 prompt，也不是运行代码。
> 它定义的是两个模块之间传递的标准化中间对象。

## 1. 目标

这条 connector 的目标不是让 `TOEFL Coach` 直接“调用” `Dictionary Pro`，而是让它把写作诊断中最有价值、最可训练的表达问题，转成一组稳定的输入对象，再交给 `Dictionary Pro` 生成表达升级卡。

最终体验应该是：

1. 用户提交一段或一篇作文
2. `TOEFL Coach` 输出整体诊断
3. 系统额外抽出弱表达集合
4. 系统把这些弱表达送给 `Dictionary Pro`
5. `Dictionary Pro` 产出一组可复习、可替换、可迁移的表达卡

## 2. 边界

### 2.1 `TOEFL Coach` 负责

- 识别表达问题
- 判断为什么弱
- 判断应该升级到什么语域
- 提供原句上下文
- 给出优先级

### 2.2 `Dictionary Pro` 负责

- 对单个弱表达做表达级升级
- 给出正式对标
- 给出替换理由
- 给出最推荐改写
- 生成可复习的表达卡

### 2.3 Connector 不负责

- 重新评分整篇作文
- 直接生成完整新作文
- 处理与表达无关的结构问题
- 保存长期用户记忆

## 3. 核心对象

### 3.1 `WritingDiagnosis`

这是 `TOEFL Coach` 当前已有对象的扩展目标。

在现有字段基础上，未来需要额外支持：

- `weakExpressionSet`
- `revisionFocus`
- `upgradePrioritySummary`

它仍然代表“整篇写作的整体诊断”，不是 connector 专属对象。

### 3.2 `WeakExpression`

这是第一条 connector 最核心的原子对象。

它代表：

- 一段具体原文中的一个低质量表达
- 为什么它弱
- 在什么语境下弱
- 应该往什么方向升级

建议字段：

```json
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
```

### 3.3 `WeakExpressionSet`

这是从 `WritingDiagnosis` 中提炼出来、可直接交给 `Dictionary Pro` 的集合对象。

建议字段：

```json
{
  "kind": "weak_expression_set",
  "title": "Essay weak expression extraction",
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
    },
    {
      "text": "I think",
      "category": "spoken_opinion_marker",
      "severity": "medium",
      "reason": "The phrase sounds speech-like and weakens academic tone.",
      "targetRegister": "toefl-writing",
      "sourceSentence": "I think it helps people a lot.",
      "sourceFragment": "I think",
      "rewriteGoal": "Use a stronger claim frame or remove the filler phrase.",
      "coachNote": "Only keep explicit stance markers when the argument truly requires them."
    }
  ],
  "notes": [
    "Focus on expressions that are both frequent and replaceable.",
    "Do not include purely grammatical mistakes unless they create an expression-level issue."
  ]
}
```

### 3.4 `ExpressionCardSeed`

这是 `WeakExpression` 传给 `Dictionary Pro` 时的最小稳定输入。

它不是最终词卡，只是词卡生成种子。

建议字段：

```json
{
  "query": "good effects",
  "mode": "upgrade",
  "target": "toefl-writing",
  "context": "Technology has many good effects on society.",
  "problem": "The phrase is vague and too weak for formal academic writing.",
  "upgradeGoal": "Generate more precise TOEFL-appropriate alternatives.",
  "source": {
    "module": "toefl-writing",
    "category": "low_precision_word",
    "severity": "high"
  }
}
```

## 4. 字段标准

### 4.1 `category`

第一版先限制为以下枚举，避免分类失控：

- `low_precision_word`
- `spoken_opinion_marker`
- `informal_phrase`
- `weak_collocation`
- `flat_transition`
- `overgeneral_claim`

### 4.2 `severity`

第一版统一三档：

- `high`
- `medium`
- `low`

### 4.3 `targetRegister`

第一版只允许复用现有目标场景：

- `toefl-writing`
- `toefl-speaking`
- `general-academic`
- `daily-english`

## 5. 提取规则

`TOEFL Coach` 不是要把所有问题都传给 `Dictionary Pro`。

第一版只传这三类问题：

1. 可以被单词、短语或局部改写显著改善的问题
2. 在原文中有明确锚点的问题
3. 与语域、精确度、自然度直接相关的问题

第一版不传：

- 纯语法错误
- 纯结构组织问题
- 证据不足但没有明确表达锚点的问题
- 只能通过整段重写才能修复的问题

## 6. 排序规则

`WeakExpressionSet.items` 必须按以下顺序排序：

1. `severity` 更高的优先
2. 更容易泛化复用的表达优先
3. 在原文中重复出现的表达优先
4. 能直接生成高价值词卡的表达优先

目标不是抽最多，而是抽最值得学的。

## 7. 传递规则

`WeakExpression -> ExpressionCardSeed` 的映射规则：

- `text` 或 `sourceFragment` 进入 `query`
- `sourceSentence` 进入 `context`
- `targetRegister` 映射到 `target`
- `category + reason` 合并为 `problem`
- `rewriteGoal` 映射到 `upgradeGoal`
- `severity` 保留在 `source`

如果 `sourceFragment` 比 `text` 更具体，优先使用 `sourceFragment` 作为 `query`。

例如：

- `text = good`
- `sourceFragment = good effects`

应优先查询 `good effects`，因为它更适合生成高价值升级卡。

## 8. 第一版成功标准

第一版 connector 不追求复杂，只要求达成这 4 点：

1. `TOEFL Coach` 能稳定额外产出 `WeakExpressionSet`
2. 每个 `WeakExpression` 都有原句锚点
3. `WeakExpression` 能稳定映射成 `ExpressionCardSeed`
4. `Dictionary Pro` 能基于 `ExpressionCardSeed` 生成可用词卡

## 9. 后续扩展

这条 connector 稳定后，再考虑：

- 同一个 `WeakExpressionSet` 合并重复表达
- 自动形成个人弱表达画像
- 生成复习清单
- 回写到 `Memory Layer`
- 与 `Content Parser` 共享 `ExpressionCardSeed`
