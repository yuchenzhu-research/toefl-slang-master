# MANUAL.md

本文件是 `TOEFL Slang Master` 的内部维护说明书，面向维护者、未来协作者和后续重构任务。  
它不替代 `README.md`，而是负责记录项目定位、架构边界、模块职责、运行方式、文档层级、已知风险和后续演进方向。

---

## 1. 项目定位

### 1.1 目标

本项目的长期目标，是逐步演化为一个：

**面向华语学习者的、CLI-first、Markdown-first、contract-first 的英语学习 pipeline 平台**

当前主线不是 GUI，不是 SaaS，也不是 prompt 集合，而是三个逐步收口的业务模块：

1. `Content Parser`
2. `Dictionary Pro`
3. `TOEFL Coach`

这三个模块最终应形成两条主链路：

- 输入型学习链路：
  `Content Parser -> Dictionary Pro`
- 输出型纠偏链路：
  `TOEFL Coach -> Dictionary Pro`

### 1.2 非目标

以下内容不属于当前第一优先级：

- Web UI / GUI-first 产品
- 移动端 App
- 用户系统 / 登录体系
- 云端数据库 / SaaS 化
- 复杂复习算法
- 长期记忆系统
- 大量 provider 扩张
- 多 agent 自动化编排

---

## 2. README、MANUAL、docs 的分工

- `README.md`
  英文对外入口。负责项目介绍、当前能力、最小运行方式、命令入口。
- `README_zh-CN.md`
  简体中文对外入口。内容边界应与英文 README 对齐。
- `README_zh-TW.md`
  繁体中文对外入口。内容边界应与英文 README 对齐。
- `MANUAL.md`
  内部维护说明书。负责记录架构、边界、运行方式、文档职责、已知限制和维护规则。
- `AGENTS.md`
  代码代理执行规范。所有代理在执行任务前优先阅读。
- `docs/vision.md`
  记录项目终局方向。
- `docs/pipeline.md`
  记录三段式 pipeline 和主链路关系。
- `docs/i18n.md`
  记录 locale / i18n 规则。
- `docs/outputs.md`
  记录 Markdown / JSON 本地产物设计。
- `docs/connectors/*`
  记录 connector contract 和中间对象边界。

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
├─ CHANGELOG.md
├─ DEVLOG.md
├─ package.json
├─ tsconfig.json
├─ bin/
├─ docs/
├─ skills/
├─ src/
├─ tests/
└─ references/
```

说明：

- `CHANGELOG.md` / `DEVLOG.md` 当前已存在，但工程流程尚未像成熟仓库那样完全收紧
- `references/` 仅供参考，不属于主项目源码边界

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

### 3.3 `skills/`

`skills/` 保存项目级 skill 资产，例如：

- `skills/dictionary-pro/SKILL.md`
- `skills/toefl-writing/SKILL.md`
- `skills/content-parser/SKILL.md`

说明：

- `skills/` 是项目资产，不等于运行时代码
- 不应把 `skills/` 内容和 `src/` 业务实现混在一起

### 3.4 `references/`

`references/` 仅存放外部参考材料和外部项目本地挂载点。

原则：

- 不把 `references/` 当主项目代码边界
- 参考其思想可以，但不要直接以其中实现作为主项目源码修改目标

### 3.5 `tests/`

当前测试基线仍很薄，说明项目还处于早期工程化阶段。  
后续新增结构性改动时，应逐步补齐：

- CLI / command surface
- provider resolution
- connector mapping
- schema / validator
- docs sync

---

## 4. 三模块边界

### 4.1 `Content Parser`

定位：

- 上游素材入口
- 输入型学习链路的起点

负责：

- 读取 PDF / Markdown / TXT / text
- 形成标准 `SourcePayload`
- 输出内容级结构化结果
- 输出下游可消费的表达候选

不负责：

- 直接生成最终表达卡
- 整篇作文评分
- 用户长期记忆管理

当前工程方向：

- 继续把“内容笔记结果”和“下游表达候选结果”区分开
- 未来应进一步显式化 `SourceDigest` 与 `ExpressionCandidates`

### 4.2 `Dictionary Pro`

定位：

- 表达升级核心
- 整个系统最稳定的复用层

负责：

- 词、短语、弱表达的语域转换
- 对标学术表达
- 生成表达卡
- 形成可复习 Markdown / JSON 产物

不负责：

- 解析整篇材料
- 做整篇作文评分
- 代替 connector 做桥接映射

当前工程方向：

- 继续以 `ExpressionCard` 为核心对象收口
- 避免把外部模块逻辑直接塞进 Dictionary Pro

### 4.3 `TOEFL Coach`

定位：

- 输出型纠偏链路的诊断核心

负责：

- 句子 / 段落 / 作文级诊断
- 逻辑、词汇、结构问题分析
- 生成结构化 `WritingDiagnosis`
- 额外提炼 `WeakExpressionSet`

不负责：

- 直接代替用户重写整篇作文
- 直接生成最终词卡
- 代替 `Content Parser` 做材料抽取

当前工程方向：

- 继续让 `WritingDiagnosis` 面向人读
- 继续让 `WeakExpressionSet` 面向下游消费

---

## 5. 当前最重要的中间对象

当前最值得稳定化的对象包括：

- `SourceDigest`
- `ExpressionCandidates`
- `ExpressionCard`
- `WritingDiagnosis`
- `WeakExpressionSet`
- `ExpressionCardSeed`

设计原则：

1. 这些对象优先于 prompt 耦合
2. 模块间应优先通过中间对象通信
3. connector 只在稳定对象存在时继续推进

### 5.1 `SourceDigest`

表示材料级结构化摘要。  
主要来自 `Content Parser`。

### 5.2 `ExpressionCandidates`

表示从材料中抽出的可学习表达候选。  
主要来自 `Content Parser`，供 `Dictionary Pro` 继续处理。

### 5.3 `ExpressionCard`

表示表达升级后的标准学习单元。  
主要由 `Dictionary Pro` 生成。  
它应同时拥有：

- 一个 JSON sidecar
- 一个可读 Markdown 文件

### 5.4 `WritingDiagnosis`

表示用户写作的整体诊断结果。  
主要由 `TOEFL Coach` 生成。

### 5.5 `WeakExpressionSet`

表示从写作诊断中提炼出的弱表达集合。  
这是 `TOEFL Coach -> Dictionary Pro` 的核心桥接对象之一。

### 5.6 `ExpressionCardSeed`

表示送入 `Dictionary Pro` 的稳定种子输入。  
它通常不直接给用户看，而是供 connector 和卡片引擎消费。

---

## 6. pipeline 关系

### 6.1 输入型学习链路

```text
用户输入 PDF / MD / TXT / text
-> Content Parser
-> SourceDigest
-> ExpressionCandidates
-> Dictionary Pro
-> ExpressionCard
-> Markdown / JSON 本地资产
```

说明：

- 这条链路的目标是把输入材料沉淀成学习资产
- 它不只是“读懂文章”，而是“把文章里的表达沉淀出来”

### 6.2 输出型纠偏链路

```text
用户输入句子 / 段落 / 作文
-> TOEFL Coach
-> WritingDiagnosis
-> WeakExpressionSet
-> connector mapping
-> ExpressionCardSeed
-> Dictionary Pro
-> ExpressionCard
-> Markdown / JSON 本地资产
```

说明：

- 这条链路的目标是把写作问题沉淀成可复习对象
- 它不只是“告诉用户哪里不好”，而是“把坏表达变成升级任务”

### 6.3 connector 层的真实定位

connector 当前应被视为：

- 模块间桥接层
- 中间对象映射层
- 保守演进层

不应被视为：

- 提前做大的工作流平台
- 模块逻辑汇总垃圾场
- 新的 prompt 杂糅层

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

## 8. locale / i18n 规则

本项目当前定位面向华语用户，因此支持：

- `zh-Hans`
- `zh-Hant`
- `en`

必须遵守以下规则：

1. JSON keys、schema 字段名、enum、内部标识一律英文
2. locale 只影响展示层内容
3. locale 不允许影响：
   - contract shape
   - enum
   - provider runtime
   - connector mapping
4. 简体和繁体不能各长一套业务逻辑

当前最推荐的做法是：

- 先让 query / render / markdown 支持 locale
- 后续再补专门的本地化资源层

不推荐的做法是：

- 复制三套 prompt 系统
- 复制三套 schema
- 让 `zh-Hans` 和 `zh-Hant` 在业务层分叉

---

## 9. Markdown / JSON 本地产物

本项目长期坚持：

**Markdown-first + JSON sidecar**

这意味着：

- 面向人的最终结果，优先以 Markdown 落地
- 面向系统的稳定结构，优先以 JSON 落地

### 9.1 原则

每个核心结果对象，尽量对应：

- `something.json`
- `something.md` 或 `index.md`

### 9.2 理想产物层级

未来推荐输出结构可逐步收口到：

```text
outputs/
  content/
  coach/
  dict/
```

其中：

- `content/` 存材料级输出
- `coach/` 存诊断级输出
- `dict/` 存表达卡

当前阶段不要求一步到位，但任何新增输出都应朝这个方向靠拢。

---

## 10. 命令面与脚本

### 10.1 当前主要入口

当前项目以 `tsm` 为顶层 CLI，辅以模块级 bin：

- `tsm`
- `dictpro`
- `coachpro`
- `contentpro`

### 10.2 `package.json` 的角色

`package.json` 当前是：

- 依赖来源
- scripts 来源
- bin 注册来源

因此：

- 新增入口必须同步 `package.json`
- 不能让 README、bin、scripts、源码入口长期漂移

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

一个改动通常是正确方向，如果它：

- 让三模块定位更清楚
- 让中间对象更稳定
- 让 Markdown / JSON 产物更统一
- 让 locale 处理更独立
- 让 provider runtime 更少泄漏到业务层
- 让 docs / tests / scripts / CI 更一致

一个改动通常值得警惕，如果它：

- 新增更复杂 prompt，却没有更稳定 contract
- 继续复制一份相似 CLI / validator / render 逻辑
- 让 connector 过早膨胀
- 因为繁体中文而复制业务逻辑
- 让 README 愿景继续领先于真实代码边界
