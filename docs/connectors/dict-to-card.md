# Dict To Card Connector Contract

> 这个文件只定义一条串联链：
> `Dictionary Pro -> ExpressionCard`
>
> 它不是 prompt，也不是运行代码。
> 它定义的是把 Dictionary Pro 的多种结构化输出，收口成稳定持久化对象的规则。

## 1. 目标

`Dictionary Pro` 的结构化输出可能存在多种 kind（例如 `word_phrase`、`sentence_upgrade` 等）。

本 connector 的目标是把这些输出展平为统一的 `ExpressionCard`，以便：

- 统一落盘（Markdown + JSON sidecar）
- 统一被 review / export / knowledge-base 等能力消费

## 2. 边界

### 2.1 `Dictionary Pro` 负责

- 生成结构化响应（`DictionaryProStructuredResponse`）
- 输出 Markdown 视图（渲染层）

### 2.2 Connector 负责

- 把不同 kind 的响应映射成稳定对象 `ExpressionCard`
- 注入可追溯元信息（例如 `relatedSourceSlug` / `relatedDiagnosisSlug`）

### 2.3 Connector 不负责

- 改写或补全 Dictionary Pro 的业务判断
- 进行二次推理或额外调用模型

## 3. 核心对象

### 3.1 `DictionaryProStructuredResponse`

Dictionary Pro 的结构化输出联合类型（参考 `src/dictionary-pro/schema.ts`）：

- `word_phrase`
- `sentence_upgrade`
- `comparison`
- `ambiguous`

### 3.2 `ExpressionCard`

系统的稳定持久化对象（参考 `src/platform/contracts.ts`）。

它应尽量保持长期稳定，避免随着 prompt 变化而频繁改 shape。

## 4. 映射规则

### 4.1 `word_phrase` -> `ExpressionCard`

- `headword`: `response.query`
- `context`: `response.context ?? ""`
- `translation`: `response.translation.join(", ")`
- `slangOrInformal`: `response.slang.variants`
- `academicAlignment`: `response.alignment.map(x => x.expression)`
- `frequency`: `response.frequency`
- `analysis`: 组合 `sourceExplanation` + `toeflExplanation`
- `tags`: `response.notes ?? []`

### 4.2 `sentence_upgrade` -> `ExpressionCard`

- `headword`: `response.query`
- `translation`: 固定为 `"Sentence Refinement"`
- `slangOrInformal`: `response.replacements.map(x => x.source)`
- `academicAlignment`: `[response.recommendedRewrite]`
- `analysis`: `response.explanation`
- `tags`: `"sentence-upgrade"` + `response.notes`

### 4.3 `comparison` / `ambiguous` -> fallback `ExpressionCard`

当输出是对比或未消歧结果时，第一版允许生成一个保守的 fallback card：

- `headword`: `response.query`
- `translation`: 固定为 `"Compound Comparison"`
- `analysis`: 固定为 `"See original comparison report for details."`
- `tags`: `"aggregated"` + `response.notes`

后续若要提升这两类输出的可复习性，应优先在 Dictionary Pro 层定义更明确的 card-ready contract，再扩展 connector 的映射策略。

## 5. 元信息注入

当 connector 被 pipeline / studio 调用时，允许额外注入：

- `relatedSourceSlug`
- `relatedDiagnosisSlug`

用于在落盘产物中追溯该卡片来自哪份材料或诊断。
