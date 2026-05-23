# MANUAL.md

本文件是 `SPARK` 的内部维护说明书，面向维护者、未来协作者和后续重构任务。  
它不替代 `CONSTITUTION.md`、`AGENTS.md` 或 `README.md`，而是负责记录仓库结构、权威来源、运行方式、维护检查点、已知风险和演进建议。

---

## 1. 本文件的职责

本文件只回答维护者真正需要反复确认的问题：

- 仓库里什么是权威来源
- 目录和模块分别承担什么职责
- 改动某类内容时应检查哪些地方
- 当前工程有哪些已知限制与风险
- 后续演进建议应按什么顺序推进

顶层原则请读：

- `CONSTITUTION.md`：项目身份、不变量、架构守卫、质量门禁、反模式
- `AGENTS.md`：默认读取顺序、执行流程、验证基线、文档同步纪律

---

## 2. 文档栈与权威来源

- `CONSTITUTION.md`
  最高治理文件；定义项目身份、不变量、架构守卫、质量门禁与反模式。
- `AGENTS.md`
  面向代码代理的共享运行手册；定义读取顺序、执行流程、验证基线与同步纪律。
- `MANUAL.md`
  面向维护者的操作型手册；记录目录结构、权威来源、维护清单与风险。
- `README.md`
  英文对外入口；负责项目介绍、当前能力、最小运行方式、命令入口。
- `README_zh-CN.md` / `README_zh-TW.md`
  中文对外入口；内容边界应与英文 README 对齐，不得长期偏离工程现实。
- `docs/vision.md`
  项目终局方向。
- `docs/pipeline.md`
  三段式 pipeline、主链路与 connector 位置。
- `docs/i18n.md`
  locale / i18n 规则。
- `docs/outputs.md`
  Markdown / JSON 本地产物设计与输出纪律。
- `docs/connectors/*`
  connector contract、中间对象映射与桥接边界。
- `docs/frontend.md`
  桌面前端 workspace、依赖边界与演进顺序。

维护原则：

- 当某项规则已经进入 `CONSTITUTION.md`，不要再在 `MANUAL.md` 里复制整段原则
- 当某项流程已经进入 `AGENTS.md`，不要再在 `MANUAL.md` 里复制整套执行说明
- `MANUAL.md` 只保留维护者做判断时必须反复查看的操作信息

---

## 3. 仓库结构

### 3.1 顶层目录

当前主项目目录大致为：

```text
.
├─ AGENTS.md
├─ MANUAL.md
├─ README.md
├─ README_zh-CN.md
├─ README_zh-TW.md
├─ package.json
├─ tsconfig.json
├─ apps/
├─ bin/
├─ docs/
├─ skills/
├─ src/
├─ tests/
└─ references/
```

说明：

- `references/` 仅供参考，不属于主项目源码边界
- `apps/desktop/` 是 Electron 桌面前端 workspace；根 `package.json` 和根 `package-lock.json` 仍是仓库级入口

### 3.2 `src/`

`src/` 是主项目源码目录，当前包含以下主要区域：

- `src/app-cli.ts`
  顶层 CLI 分发入口
- `src/platform/`
  共享 facade 和运行时桥接
- `src/platform/auth/`
  API key、本地配置和 provider 认证信息解析
- `src/platform/providers/`
  provider catalog、runtime 和协议实现
- `src/platform/runtime/`
  共享运行时能力（如 validated-json）
- `src/dictionary-pro/`
  表达升级模块
- `src/toefl-writing/`
  写作诊断模块
- `src/content-parser/`
  内容解析模块
- `src/connectors/`
  模块间桥接和中间对象映射
- `src/studio/`
  引导式终端工作台入口，编排三模块形成完整的 session 流程
  - `session.ts` — StudioSession 类型与生命周期
  - `target-map.ts` — 用户可见学习目标 → 内部 TargetRegister 的保守映射层
  - `prompts.ts` — 终端交互（readline，无外部依赖）
  - `runner.ts` — 引导式流程编排，调用现有 runner + OutputManager
  - `index.ts` — CLI 入口，暴露 runStudioModuleCli

### 3.3 `apps/desktop/`

`apps/desktop/` 是 Electron + React 桌面端。它是应用层，不是平台层。

维护原则：

- 前端通过稳定 CLI/API/contract 接入能力，不复制 `src/` 业务逻辑
- workspace 可以保留自己的 `package.json` 描述 Electron/Vite 脚本和依赖
- 根 `package-lock.json` 是唯一 lockfile，不维护 `apps/desktop/package-lock.json`
- 根 `package.json` 暴露 `desktop:*` 脚本，避免使用者进入子目录猜命令
- Electron 构建资源属于前端源资产；`dist/`、`out/`、`node_modules/` 属于本地生成物


### 3.4 `skills/`

`skills/` 保存项目级 skill 资产，例如：

- `skills/dictionary-pro/SKILL.md`
- `skills/toefl-writing/SKILL.md`
- `skills/content-parser/SKILL.md`

说明：

- `skills/` 是项目资产，不等于运行时代码
- 不应把 `skills/` 内容和 `src/` 业务实现混在一起

### 3.5 `references/`

`references/` 仅存放外部参考材料和外部项目本地挂载点。

原则：

- 不把 `references/` 当主项目代码边界
- 参考其思想可以，但不要直接以其中实现作为主项目源码修改目标

### 3.6 `tests/`

当前测试基线仍很薄，说明项目还处于早期工程化阶段。  
后续新增结构性改动时，应逐步补齐：

- CLI / command surface
- provider resolution
- connector mapping
- schema / validator
- docs sync

---

## 4. 维护者视角下的模块地图

模块定位和不变量以 `CONSTITUTION.md` 为准；本节只保留维护者需要快速定位的权威来源。

### 4.1 `Content Parser`

- 代码边界：`src/content-parser/`
- 相关专题：`docs/pipeline.md`
- 输出纪律：`docs/outputs.md`
- 维护关注点：素材读取、结构化摘要、表达候选、下游可消费性

### 4.2 `Dictionary Pro`

- 代码边界：`src/dictionary-pro/`
- 相关专题：`docs/pipeline.md`
- 输出纪律：`docs/outputs.md`
- 维护关注点：表达升级、稳定词卡对象、Markdown / JSON sidecar 一致性

### 4.3 `TOEFL Coach`

- 代码边界：`src/toefl-writing/`
- 相关专题：`docs/pipeline.md`
- 输出纪律：`docs/outputs.md`
- 维护关注点：结构化诊断、弱表达提取、下游桥接输入稳定性

### 4.4 `connectors`

- 代码边界：`src/connectors/`
- 文档边界：`docs/connectors/*`
- 维护关注点：映射规则、桥接边界、不要过早平台化

---

## 5. 维护检查清单

当你修改某一类内容时，优先检查这些权威来源是否需要一起调整：

### 5.1 如果改动模块边界或主链路

- `CONSTITUTION.md`
- `docs/pipeline.md`
- `docs/connectors/*`
- 对应模块代码与测试

### 5.2 如果改动中间对象 / schema / validator

- `CONSTITUTION.md`
- `src/platform/contracts.ts`
- 对应模块 `schema` / `types` / `validator`
- connector mapping
- tests

### 5.3 如果改动 locale / i18n

- `docs/i18n.md`
- 对应 CLI、prompt、render
- README 帮助说明
- tests

### 5.4 如果改动 Markdown / JSON 输出

- `docs/outputs.md`
- `src/platform/output-manager.ts`
- 对应 render / exporter / pipeline
- tests

### 5.5 如果改动 CLI / scripts / provider 配置

- `package.json`
- `README*.md`
- `.github/workflows/ci.yml`
- CLI tests

### 5.6 如果改动桌面前端

- `apps/desktop/package.json`
- 根 `package.json`
- 根 `package-lock.json`
- `docs/frontend.md`
- README 的桌面端说明
- 必要时检查 web API / contract / provider runtime

---

## 6. 主链路与调试入口

主链路的定义以 `docs/pipeline.md` 为准；本节只保留维护调试时最常用的入口。

### 6.1 输入型学习链路

```text
source file / text
-> Content Parser
-> candidates / digest
-> Dictionary Pro
-> ExpressionCard
-> Markdown / JSON artifacts
```

### 6.2 输出型纠偏链路

```text
essay / paragraph / sentence
-> TOEFL Coach
-> WritingDiagnosis / WeakExpressionSet
-> connector mapping
-> ExpressionCardSeed
-> Dictionary Pro
-> ExpressionCard
-> Markdown / JSON artifacts
```

### 6.3 调试时优先看的位置

- 业务链路：对应模块 `runner` / `index` / `render`
- 中间对象：`src/platform/contracts.ts`
- 桥接映射：`src/connectors/*` + `docs/connectors/*`
- 输出纪律：`src/platform/output-manager.ts` + `docs/outputs.md`

---

## 7. provider runtime 与共享底盘

### 7.1 当前模式

当前项目已经具备 OpenClaw-style 的 provider runtime 雏形：

- `src/platform/client.ts`
- `src/platform/providers/runtime.ts`
- `src/platform/providers/catalog.ts`
- `src/platform/auth/manager.ts`

当前模式大致是：

```text
query
-> ToeflSlangClient
-> provider resolution
-> protocol runtime
-> model text generation
-> validated-json
-> schema / validator
-> markdown render
```

### 7.2 使用原则

后续任何模块都应遵守以下原则：

1. 不为每个模块重复实现自己的 API client
2. provider 差异不应污染业务 contract
3. query 负责表达业务输入
4. runtime 负责解析 provider / model / baseUrl / apiKey
5. 业务模块只关心：
   - query
   - structured response
   - markdown output

补充约定：

- `provider` 默认表示接入网关 / provider runtime，不等于模型家族名
- `model` 表示实际调用的模型 ID
- 对于托管模型场景，优先用网关 provider，例如 `siliconflow`
- 如果需要保留高频预设，可提供少量 preset provider，例如 `siliconflow-minimax`
- 不要再把“模型来源”和“接入网关”混成同一个默认概念

### 7.3 配置优先级

当前 provider 配置优先级应保持为：

1. CLI 显式参数
2. 环境变量
3. 本地 config
4. 必要时 legacy fallback

如果后续修改认证或 provider 逻辑，应同步更新：

- `README.md`
- `README_zh-CN.md`
- `README_zh-TW.md`
- 对应 docs
- CI / test surface

---

## 8. locale / i18n 维护说明

locale 的根本规则以 `docs/i18n.md` 和 `CONSTITUTION.md` 为准。

维护时重点检查：

- locale 是否只影响展示层而未污染 schema / enum / connector mapping
- CLI 帮助、prompt 注入、render 文案是否一致
- `zh-Hans` / `zh-Hant` 是否只做展示差异，而没有长出业务逻辑分叉
- 新增 locale 时是否同步 README 与对应说明文档

---

## 9. 输出资产维护说明

输出规则的规范定义以 `docs/outputs.md` 为准，运行时事实来源以 `src/platform/output-manager.ts` 为准。

维护时重点检查：

- 是否同时落地 Markdown 与 JSON sidecar
- 文件名与目录是否收口在 `OutputManager`
- pipeline / connector / experimental 代码是否绕开了统一输出管理
- 新增输出是否与现有 `outputs/content|coach|dict` 结构兼容

---

## 10. 命令面与脚本

### 10.1 当前主要入口

当前项目以 `spark` 为顶层 CLI，辅以模块级 bin：

- `spark`
- `dictpro`
- `coachpro`
- `contentpro`

### 10.2 `package.json` 的角色

根 `package.json` 当前是：

- 依赖来源
- scripts 来源
- bin 注册来源
- workspace 声明来源

因此：

- 新增入口必须同步 `package.json`
- 不能让 README、bin、scripts、源码入口长期漂移
- workspace 子包不维护第二份 lockfile；依赖锁定统一在根 `package-lock.json`

### 10.3 当前工程现实

当前项目仍处于早期阶段。  
因此维护时必须特别关注：

- scripts 是否真实可跑
- CI 是否与 scripts 对齐
- tests 是否与当前源码结构对齐

如果出现“CI 有、但脚本名漂了”或“tests 有、但引用路径漂了”的情况，应优先收口，而不是继续堆功能。

---

## 11. 测试与 CI

当前项目已经有最小 CI 和少量 tests，但还不成熟。  
这意味着：

- 工程底座已经起步
- 但还远不到可以无脑高速重构的程度

后续应优先补的测试包括：

- CLI / command surface
- provider resolution
- validated-json runtime
- connector mapping
- schema / validator
- docs sync

维护原则：

1. 结构性变更优先补守卫测试
2. 如果 CI 与 scripts 漂移，优先收口
3. 如果 tests 和源码结构漂移，先修测试边界，再扩功能

---

## 12. 已知风险 / 未完成事项

当前应明确承认以下现实：

- 平台层概念已经出现，但部分 facade 仍偏薄
- 三模块结构已成型，但 CLI / validator / render 仍有重复继续膨胀的风险
- docs 已经有方向，但工程护栏仍不够密
- 当前 CI / tests / scripts 还未完全像成熟仓库那样严格同步
- locale 规则已经写出，但还未全面进入运行时 contract

这意味着：

- 本项目已经不是 prompt 杂堆
- 但也还不是可放心高速重构的成熟工程

---

## 13. 后续演进顺序建议

后续推荐顺序如下：

1. 先稳文档和工程规范
   - `AGENTS.md`
   - `MANUAL.md`
   - `docs/vision.md`
   - `docs/pipeline.md`
   - `docs/i18n.md`
2. 再稳中间对象
   - `SourceDigest`
   - `ExpressionCandidates`
   - `ExpressionCard`
   - `WritingDiagnosis`
   - `WeakExpressionSet`
   - `ExpressionCardSeed`
3. 再稳本地产物
   - Markdown
   - JSON sidecar
   - 输出目录
4. 再稳 tests / CI / scripts
5. 最后才继续扩大 connector 或 UI

---

## 14. 维护者判断一个改动是否正确的标准

最终判断标准以 `CONSTITUTION.md` 为准；维护层面可快速使用以下检查：

- 是否让权威来源更清楚，而不是新增一个平行说明文件
- 是否让 docs / tests / scripts / CI 更一致，而不是更分散
- 是否把规则收口到已有 authoritative source，而不是到处复制
- 是否减少跨模块重复，而不是制造新的 facade 或万能 util
- 是否让 README 更接近工程现实，而不是继续超前描述
