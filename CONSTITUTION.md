# CONSTITUTION.md

本文件是 `SPARK` 的最高治理文件。

它定义项目身份、不变量、架构守卫、质量门禁、风险登记和反模式。
如与其他文档冲突，以本文件为准。

---

## 1. Project Identity

`SPARK` 的长期目标是逐步演化为一个：

**面向华语学习者的、CLI-first、Markdown-first、contract-first、locale-aware 的英语学习 pipeline 平台**

当前主线模块为：

1. `Content Parser`
2. `Dictionary Pro`
3. `TOEFL Coach`

长期主链路为：

- 输入型学习链路：`Content Parser -> Dictionary Pro`
- 输出型纠偏链路：`TOEFL Coach -> Dictionary Pro`

---

## 2. Non-Negotiable Invariants

以下约束默认不可破坏；若要调整，必须同步修改治理文档与验证基线。

### 2.1 Contract-first

- 模块之间优先通过稳定中间对象连接，而不是直接通过 prompt 字符串耦合。
- 优先稳定对象 contract，再扩功能、UI 或工作流。

### 2.2 Stable Intermediate Objects

当前最重要的中间对象为：

- `SourceDigest`
- `ExpressionCandidates`
- `ExpressionCard`
- `WritingDiagnosis`
- `WeakExpressionSet`
- `ExpressionCardSeed`

### 2.3 Markdown-first + JSON Sidecar

- 面向人的核心结果必须能稳定落地为 Markdown。
- 面向程序复用的核心结果必须能稳定落地为 JSON sidecar。
- 不允许能力长期只停留在终端输出而没有本地产物。

### 2.4 Locale Separation

- `locale` 只属于展示层，不属于 schema 层。
- JSON keys、schema 字段名、enum、内部 ID 一律英文。
- 不允许因 `zh-Hans` / `zh-Hant` / `en` 造成业务逻辑、contract 或 connector mapping 分叉。

### 2.5 Shared Runtime Isolation

- provider 解析、认证、模型调用、validated-json 等共享运行时能力应尽量收口在平台层。
- provider runtime 差异不应泄漏进业务 contract。

### 2.6 Conservative Connector Growth

- connector 的存在价值建立在稳定输入对象和稳定输出对象之上。
- connector 是桥接层，不是新的平台核心，也不是杂糅层。

---

## 3. Architecture Guardrails

### 3.1 Module Boundaries

- `Content Parser` 负责素材解析和候选表达抽取，不直接承担词卡生成或作文评分。
- `Dictionary Pro` 负责表达升级与词卡生成，不直接承担整篇材料解析或作文评分。
- `TOEFL Coach` 负责写作诊断与弱表达提取，不直接代替用户重写整篇作文，也不直接负责最终词卡渲染。

### 3.2 Entry Points Stay Thin

- `src/app-cli.ts` 和 `bin/` 应保持薄入口。
- 顶层入口负责分发，不应长期堆积业务逻辑。

### 3.3 Platform Before Duplication

- 跨模块重复优先考虑抽象为共享 contract 或共享 runtime。
- 不鼓励通过复制 CLI / validator / render / prompt 的方式长期演化。

### 3.4 References Are Not Runtime

- `references/` 不属于主项目源码边界。
- 外部参考实现不可被默认视为主项目实现。

### 3.5 Frontend Is An App Layer

- 桌面前端属于 `apps/desktop/`，不是新的平台核心。
- 前端应消费稳定 CLI/API/contract，不复制 `src/` 业务逻辑。
- UI 演进必须晚于 contract、输出和 provider runtime 的收口。

---

## 4. Quality Gates

### 4.1 Docs / Tests / CI / Scripts Must Converge

- 不允许长期处于“README 正确但 CI 不可运行”的状态。
- 不允许 scripts、tests、CI、实际入口长期漂移。
- 结构性改动默认应带最小验证。

### 4.2 Package Configuration Is Authoritative

- `package.json` 是 npm scripts、bin 注册和依赖声明的唯一事实来源。
- 新增入口、新增依赖或脚本变更必须同步 `package.json`。
- workspace 可拥有自己的 `package.json`，但根 `package-lock.json` 是唯一依赖锁定来源。

### 4.3 User Docs Must Reflect Reality

- README 只能描述已实现或明确标注为 WIP 的能力。
- 多语言 README 不应与工程现实发生冲突。

### 4.4 Governance Changes Require Sync

当治理结构、架构边界、命令面、locale 规则、输出规则或 connector contract 发生变化时，必须检查并同步：

- `CONSTITUTION.md`
- `AGENTS.md`
- `MANUAL.md`
- `README.md`
- `README_zh-CN.md`
- `README_zh-TW.md`
- 对应 `docs/`
- 必要的 tests / CI

---

## 5. Governance Stack

文档栈职责固定如下：

1. `CONSTITUTION.md`
   - 最高治理文件
   - 负责项目身份、不变量、守卫、门禁、风险与反模式
2. `AGENTS.md`
   - 共享 cross-agent 运行手册
   - 负责读取顺序、执行流程、验证基线、文档同步纪律
3. `MANUAL.md`
   - 面向维护者的内部维护手册
   - 负责仓库结构、运行方式、维护清单、当前限制
4. `docs/*`
   - 专题细节文档
5. `README*.md`
   - 面向用户和协作者的入口文档

---

## 6. Risk Register

当前必须持续警惕以下风险：

- 治理文件平行漂移，尤其是 `AGENTS.md` 与 `MANUAL.md`
- 模块通过复制粘贴继续膨胀
- provider runtime 细节泄漏到业务层
- locale 规则落不到运行时却继续扩面
- connector 过早膨胀成平台
- 前端绕过 contract 直接复制业务逻辑
- README 愿景持续领先于真实实现
- tests / CI / scripts / docs 同步失效

---

## 7. Anti-Patterns

以下方向默认禁止优先推进：

- 先做 GUI / Web UI，再补 contract
- 为多 locale 复制业务逻辑或 schema
- 把 schema key、本地 ID、enum 做本地化
- 把 connector 吹成平台核心
- 把 README 写成内部维护手册全集
- 把 `AGENTS.md`、`MANUAL.md`、工具 shim 写成三本平行手册
- 把 `references/` 当主项目源码直接改造
- 在 tests / CI / scripts 漂移时继续扩大功能面

---

## 8. Change Standard

一个改动优先被视为正确方向，如果它：

- 让三模块定位更清楚
- 让中间对象更稳定
- 让 Markdown / JSON 产物更统一
- 让 locale 处理更独立
- 让 provider runtime 更少泄漏到业务层
- 让 docs / tests / scripts / CI 更一致

如果一个改动只是“看起来更高级”，却没有让以上几点更清楚，默认不应优先做。
