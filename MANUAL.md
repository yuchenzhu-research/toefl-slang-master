# TOEFL Slang Master - Developer & Maintainer Manual

该手册旨在指导贡献者与维护人员遵循全局的工程规范与架构方向。

## 1. 模块边界与相互约束

项目被划分为三大**强隔离**的主业务模块，彼此不直接互相调用 Prompt，所有的交互未来必须通过 Connector Layer 流转标准化的数据对象：
- **Content Parser**（提取/消化）
- **Dictionary Pro**（转换/升维）
- **TOEFL Coach**（诊断/反馈）

## 2. 核心数据契约 (Contract)

在本项目中，“契约优先” (Contract-First) 高于一切。新功能的引入必须首先明确它输出的 JSON 结构。

平台关心的契约对象有：
- `SourceDigest`：材料级摘要
- `ExpressionCandidates`：表达候选列表
- `ExpressionCard`：词卡/表达卡标准定义
- `WritingDiagnosis`：写作诊断总览
- `WeakExpressionSet`：弱表达/病句词汇集合
- `ExpressionCardSeed`：词卡生成的种子属性

模块在拿到底层 LLM 原生输出后，必须经过 `validated-json` 运行时将数据标准化为业务 Contract 后，方可渲染为 Markdown 文件进行消费。

## 3. 多厂商运行时 (Provider Runtime)

不得为每个模块单独实现 API 客户端。
- 通过引入 OpenClaw-style 的 provider runtime 构建底层共享接口，负责 Provider / Model / baseUrl / apiKey 解析。
- `Platform Layer` 掌管一切基础能力：环境变量读取、验证器执行管理与错误重试回退等。
- Provider 差异不可污染上级业务的契约。

## 4. Markdown 产物一致性

本地的落地文件，必须拥有统一的风格和固定的骨架。比如一个表达卡的导出，应该有相伴随的 JSON Sidecar 和便于人读的 `index.md`，它构成了未来的存储原子。

## 5. 语言环境要求 (i18n)
参考 [i18n.md](./docs/i18n.md)
严格规定：展示层本地化，Schema 层国际化（英文统一）。

## 6. 不妥协的工程纪律
- 测试、文档和 CI 的推进优先于对花哨 GUI 的构建。
- 我们不需要为 "看起来像产品" 而写面条代码；需要因为 "边界清晰" 而积累可靠的管道代码。
