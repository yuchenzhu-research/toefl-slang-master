# DEVLOG

---

## 2026-04-10 / 三段式 Pipeline 架构降落与真实测试体系并网

### 相关 commits
- `48d6349` feat(pipelines): upgrade pipelines 1-3 with traceability and tests
- `a91c46f` feat(cli): integrate MVP pipeline entries into command line
- `edd9b78` feat(pipeline-3): implement comprehensive knowledge base indexer
- `2e599ed` feat(pipeline-2): implement Output Correction pipeline workflows
- `d76c3f3` feat(pipeline-1): implement Input Learning pipeline and content parsing connectors

### 本次修改
- **重构并衔接了三大专属流水线**：
  - **Pipeline 1 (输入型学习管线)**：梳理出 `ContentParser` -> 挖掘 `ExpressionCandidates` -> 批量传输给 `Dictionary Pro` 制卡的完整回路。
  - **Pipeline 2 (输出型纠偏管线)**：通过 `mapCoachToDictSeeds` 将 `TOEFL Coach` 诊断出的 `WeakExpressionSet` 转化为种子送入制卡回路。针对单个句子或全篇作文（Sentence vs Essay），还能动态下发对应的底线英语语域（general-academic 或 toefl-writing）。
  - **Pipeline 3 (知识沉淀管线)**：建立全局调度器 `OutputManager` 把各个管线产生的中间件及 Markdown 标准化地放置入 `data/` 下，并增加了轻量级 `indexer.ts` 统计产出。
- **命令行总闸集成**：在 CLI 中加入了 `tsm pipeline:input`、`tsm pipeline:output` 和 `tsm kb:status` 三大快捷测试入口。
- **加入身份源映射追踪 (Traceability)**：针对自动制卡没有语境源头的问题，我们在每一张词卡元信息中植入了 `relatedSourceSlug` / `relatedDiagnosisSlug`。
- **引入了工业级测试引擎**：废除了原先仅用 `tsc --noEmit` 滥竽充数的 CI，直接在 `package.json` 内嵌 Node 原生 `--test` runner 并结合 Github Action 实现自动化防退化发版。

### 解决的问题
- 解决了此前 `Content Parser` 和 `Dictionary Pro` 等模块各回各家、相互“互不认识”的离散体系状态。
- 解决了由于没有规范落盘格式，生成的知识和诊断结果如漫天飞雪无法持续沉淀索引的历史黑洞。
- 解决并修补了缺少真正单元保护机制引发新旧属性重命名时极易出现 undefined 的危险雷区。

### 影响范围
- `src/connectors/*` (架构新增心智)
- `src/platform/contracts.ts`
- `src/platform/output-manager.ts`
- `src/knowledge-base/indexer.ts`
- `src/toefl-writing/schema.ts`
- `src/app-cli.ts`
- `package.json`
- `tsconfig.json`
- `.github/workflows/ci.yml`

### 下一步
- 扩展测试用例以囊括 Provider 的 Fallback 模型。
- 优化长文档（如几十页长篇 PDF 阅读器外刊）进入 Pipeline 1 时的分发策略（Chunking）。

---

## 2026-04-09 / 历史基线：项目启动至原子模块确立

### 相关 commits
- 初始提交至多 Provider 架构定型。

### 本次修改
- 确立了 TOEFL Slang Master 不做“套壳GUI”，坚守 “CLI-first，Markdown-first” 原则。
- 完成了 **Dictionary Pro** 的核心开发，实现了中式俚语转学术表达，或者平切雅思托福。
- 完成了 **Content Parser** 和 **TOEFL Coach** 的底层对接与 Schema 设计认证。
- 接入了多个模型 API 引擎（OpenAI、Anthropic）以避免强依赖单个厂商。

### 解决的问题
- 解决了华语学习者没有针对性极强的降维化托福俚语解释字典痛点。
- 统筹搭建了一套可以基于 Prompt 严格进行 TypeScript 契约反序列化强校验输出的 `runValidatedJsonGeneration`。

### 影响范围
- `src/dictionary-pro/*`
- `src/content-parser/*`
- `src/toefl-writing/*`
- `src/platform/runtime/*`
- `src/app-cli.ts`

### 风险 / 未完成事项
- 到此节点，工具组还是“散件”。需要依靠使用者手动把前面工具跑出来的心得丢进后置工具中。

### 下一步
- 把几个孤岛原子能力连成闭环的 Pipeline 流程。
