# Content To Dict Connector Contract

> 这个文件只定义一条串联链：
> `Content Parser -> Dictionary Pro`
>
> 它不是 prompt，也不是运行代码。
> 它定义的是两个模块之间传递的标准化中间对象与映射规则。

## 1. 目标

这条 connector 的目标是把 `Content Parser` 从材料中抽取出的表达候选（Expression Candidates），转成一组稳定的 `ExpressionCardSeed`，供 `Dictionary Pro` 批量生成表达卡（ExpressionCard）。

## 2. 边界

### 2.1 `Content Parser` 负责

- 从 PDF / MD / TXT / text 中抽取表达候选
- 为每个候选提供来源句锚点、价值解释与语域提示

### 2.2 `Dictionary Pro` 负责

- 对单个 seed 进行表达升级/对标
- 输出结构化结果，并渲染为可复习 Markdown

### 2.3 Connector 不负责

- 决定最终学习顺序（例如 top-K 策略）
- 重写整篇材料摘要
- 维护长期记忆（SRS / 复习队列）

## 3. 核心对象

### 3.1 `ExpressionCandidateItem`

表达候选的原子对象（来自 `Content Parser`）。建议字段形状如下（示例）：

```json
{
  "expression": "take a toll",
  "sourceSentence": "Rising inflation can take a toll on household budgets.",
  "whyWorthLearning": "High-frequency academic collocation; transferable across essays.",
  "registerHint": "academic",
  "category": "collocation",
  "transferPotential": "high",
  "difficulty": "medium",
  "downstreamTarget": "toefl-writing"
}
```

### 3.2 `ExpressionCandidates`

候选集合对象（来自 `Content Parser`），建议结构：

```json
{
  "candidates": [
    { "expression": "take a toll", "sourceSentence": "...", "whyWorthLearning": "...", "registerHint": "academic", "category": "collocation", "transferPotential": "high", "difficulty": "medium", "downstreamTarget": "toefl-writing" }
  ],
  "sourceReference": "optional"
}
```

### 3.3 `ExpressionCardSeed`

送入 `Dictionary Pro` 的最小稳定输入。建议字段形状如下（示例）：

```json
{
  "query": "take a toll",
  "mode": "upgrade",
  "target": "toefl-writing",
  "context": "Rising inflation can take a toll on household budgets.",
  "problem": "High-frequency academic collocation; transferable across essays.",
  "upgradeGoal": "Master the usage of \"take a toll\" in academic contexts.",
  "source": {
    "module": "content-parser",
    "category": "collocation",
    "severity": "medium"
  }
}
```

## 4. 映射规则

`ExpressionCandidateItem -> ExpressionCardSeed` 的映射规则：

- `expression` -> `query`
- `sourceSentence` -> `context`
- `whyWorthLearning` -> `problem`
- `downstreamTarget` -> `target`
- `registerHint` 参与构造 `upgradeGoal`
- `category` -> `source.category`
- `source.module` 固定为 `content-parser`
- `source.severity` 第一版可以统一为 `medium`（材料挖掘的默认优先级）

当 `downstreamTarget` 缺失或不可识别时，第一版允许保守回退到 `toefl-writing`。

## 5. 第一版成功标准

第一版 connector 不追求复杂，只要求：

1. 任何候选都能稳定映射成 `ExpressionCardSeed`
2. 每个 seed 都能提供原句锚点（`context`）
3. `Dictionary Pro` 能基于 seed 生成可落盘的 `ExpressionCard`
