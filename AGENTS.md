# AGENTS.md

本文件是 `TOEFL Slang Master` 的项目级执行规范。  
后续任何代码代理、自动化协作者或子代理进入本仓库后，都应优先阅读本文件，再执行具体任务。

---

## 1. 默认执行流程

所有代理在开始任务前，默认按以下顺序建立上下文：

1. 先阅读 `AGENTS.md`
2. 再阅读：
   - `MANUAL.md`
   - `README.md`
   - `README_EN.md`
   - `docs/vision.md`
   - `docs/pipeline.md`
   - `docs/i18n.md`
   - `docs/outputs.md`
   - `package.json`
   - `tsconfig.json`
3. 再检查与本次任务直接相关的：
   - `src/` 下对应模块
   - `docs/` 下对应专题文档
   - `tests/` 下对应测试
   - `.github/workflows/ci.yml`
4. 再实施修改
5. 如果任务形成了新的相关 Git commits，汇报中必须明确说明 commit 情况

说明：

- 如果某份文档还不完整，不要假设项目没有这类约束；应基于现有文档与代码继续审计
- 即使任务只涉及文档、测试、CLI 或配置，也不跳过该流程

---

## 2. 项目目标

本项目的长期目标，不是做几个分散的 prompt 工具，而是逐步演化为一个：

**面向华语学习者的、CLI-first、Markdown-first、contract-first 的英语学习 pipeline 平台**

当前主线由三个部分组成：

1. `Content Parser`
2. `Dictionary Pro`
3. `TOEFL Coach`

这三者的目标不是长期并排孤立运行，而是逐步形成两条主链路：

- 输入型学习链路：
  `Content Parser -> Dictionary Pro`
- 输出型纠偏链路：
  `TOEFL Coach -> Dictionary Pro`

默认优先级：

1. 保持三模块边界清楚
2. 让中间对象稳定
3. 让 Markdown / JSON 本地产物稳定
4. 让 locale 设计统一
5. 再考虑更复杂的 connector、review、UI

---

## 3. 当前架构意图

### 3.1 三模块定位

- `Content Parser`
  上游素材入口，负责把 PDF / Markdown / TXT / 文本 转成结构化学习素材
- `Dictionary Pro`
  表达升级核心，负责把词、短语、弱表达、候选表达变成可复习的学习单元
- `TOEFL Coach`
  输出诊断核心，负责把用户写作或输出转成结构化诊断与弱表达集合

### 3.2 当前最重要的中间对象

后续设计和重构时，应优先围绕以下对象继续推进：

- `SourceDigest`
- `ExpressionCandidates`
- `ExpressionCard`
- `WritingDiagnosis`
- `WeakExpressionSet`
- `ExpressionCardSeed`

说明：

- 不要让模块之间直接通过 prompt 字符串耦合
- 优先通过稳定中间对象连接模块
- connector 的存在价值，必须建立在稳定对象之上

### 3.3 当前非目标

以下内容不属于当前第一优先级：

- GUI / Web UI
- SaaS / 在线平台
- 用户系统 / 账号体系
- 复杂记忆系统
- 花哨卡片系统
- 先做大量 provider 扩展
- 先做多 agent 自动链路

---

## 4. locale / i18n 规则

本项目面向华语用户，默认支持并规划以下展示语言：

- `zh-Hans`
- `zh-Hant`
- `en`

必须遵守以下规则：

1. JSON keys、schema 字段名、enum、内部 ID 一律使用英文
2. 仅用户可见的说明文字、标签、提示语、Markdown 解释允许随 locale 切换
3. 不允许为简体和繁体复制两套业务逻辑
4. 不允许因为 locale 产生两套不同 contract
5. `targetRegister` 等内部标识保持英文，例如：
   - `toefl-writing`
   - `toefl-speaking`
   - `general-academic`
   - `daily-english`

如果新增繁体中文支持，默认做法是：

- 增加展示层 locale
- 不复制模块逻辑
- 不复制 schema
- 不复制 connector mapping

---

## 5. 代码边界原则

### 5.1 顶层入口

- `src/app-cli.ts`
  负责顶层 CLI 分发
- `bin/`
  负责可执行入口包装
- 顶层入口应尽量薄，不要持续堆业务逻辑

### 5.2 平台层

- `src/platform/`
- `src/api/`
- `src/auth/`
- `src/providers/`

这些目录共同构成共享底盘。处理原则：

- provider 解析、认证、统一调用逻辑应尽量收口在平台层
- 业务模块不要各自重写 provider 接入逻辑
- facade 必须有真实职责，避免空壳转发层不断增加

### 5.3 业务模块

- `src/dictionary-pro/`
- `src/toefl-writing/`
- `src/content-parser/`

处理原则：

- 模块应优先保持内部结构一致
- 允许共用运行范式，但不鼓励复制粘贴式重复
- 每个模块应逐步具备：
  - `cli`
  - `runner`
  - `schema`
  - `types`
  - `validator`
  - `render`
  - `prompt`
- 如出现跨模块重复，应优先判断是否能抽成共享 contract 或共享 runtime，而不是先抽“万能 util”

### 5.4 connector 层

- `src/connectors/`
- `docs/connectors/`

处理原则：

- connector 不是默认高级层，不要过早膨胀
- connector 只在存在稳定输入对象和稳定输出对象时才继续扩展
- 不要把 connector 变成新的杂糅点
- 如果某条 connector 只是一次性逻辑，应优先保守实现，不要先抽象成平台

### 5.5 references 与 skills

- `references/` 不属于主项目源码边界
- `skills/` 属于项目资产，但不等于运行时代码
- 不要把 `references/` 的外部参考实现直接当成本项目主实现来改写
- 不要在未经说明的情况下修改 `references/` 下的外部参考目录

---

## 6. 修改原则

默认修改原则如下：

1. 先审计现状，再修改，不先假设
2. 优先最小闭环修改，不顺手做大重构
3. 优先稳定 contract，而不是先堆功能
4. 优先让模块边界更清楚，而不是让目录名字更高级
5. 优先让 Markdown / JSON 产物稳定，而不是先做 UI
6. 避免把 README 里的愿景直接当成已实现事实
7. 不要让“平台层”只停留在命名上
8. 不要让三模块长期通过复制 CLI / validator / prompt 方式继续分叉

---

## 7. 文档职责

建议文档职责固定如下：

- `README.md`
  简体中文对外入口
- `README_EN.md`
  英文对外入口
- `README_ZH_HANT.md`
  繁体中文对外入口（未来）
- `MANUAL.md`
  面向维护者的内部说明书
- `AGENTS.md`
  面向代码代理的执行规范
- `docs/vision.md`
  项目终局方向
- `docs/pipeline.md`
  三段式 pipeline 与主链路
- `docs/i18n.md`
  locale / i18n 设计规则
- `docs/outputs.md`
  本地 Markdown / JSON 产物说明
- `docs/connectors/*`
  connector contract 与边界
- `docs/modules/*`
  模块级说明（未来）

修改代码时，默认检查以下内容是否需要同步：

- `README.md`
- `README_EN.md`
- `MANUAL.md`
- `docs/vision.md`
- `docs/pipeline.md`
- `docs/i18n.md`
- `docs/outputs.md`
- 对应模块文档

---

## 8. 依赖与脚本规则

- `package.json` 是 npm scripts 和项目依赖的唯一事实来源
- 不要默默增加新的运行入口而不同步 `package.json`
- 不要让 README、bin、scripts、实际入口长期漂移
- 新增依赖必须满足：
  - 有明确用途
  - 已在代码里真实使用
  - 文档能解释用途
  - 测试或 CI 能覆盖

---

## 9. 测试与 CI 要求

当前项目仍处于早期阶段，因此更需要最小护栏。

默认要求：

1. 新增结构性改动时，优先补最小测试
2. 不允许长期依赖“README 说明正确但 CI 不可运行”的状态
3. CLI、scripts、tests、CI 必须逐步收口一致

如果改动涉及以下内容，应优先补对应验证：

- CLI / command surface
- provider resolution
- connector mapping
- locale contract
- schema / validator
- docs sync

说明：

- 如果 CI 失败，不要把它当成“后面再说”
- 如果 tests 与当前源码结构漂移，必须在汇报中明确指出

---

## 10. 任务完成后的汇报要求

完成任务后，汇报应尽量包含：

1. 仓库原状
2. 新建文件
3. 修改文件
4. 每个文件的修改目的
5. 已验证内容
6. 未验证内容
7. 风险、歧义与后续建议

如果任务形成了 Git 提交，还应明确说明：

1. 是否形成了新的 commits
2. 当前分支
3. 是否需要更新 `DEVLOG.md` / `CHANGELOG.md`
4. 若未更新，说明原因

---

## 11. 禁止事项

- 不要把 `references/` 当主项目源码直接改造
- 不要先做 GUI，再补 contract
- 不要为了繁体中文复制整套业务逻辑
- 不要让 schema key 本地化
- 不要过早把 connector 吹成平台核心
- 不要让 facade 文件无限增加但没有真实职责
- 不要让模块通过复制粘贴继续长大
- 不要把 README 写成“项目内部说明书全集”
- 不要在测试和 CI 漂移时继续加大功能
- 不要因为模型生成快，就跳过工程收口

---

## 12. 长期维护约定

后续进入本项目时，默认顺序是：

1. 读 `AGENTS.md`
2. 读 `MANUAL.md`
3. 读 `docs/vision.md`
4. 读 `docs/pipeline.md`
5. 读 `docs/i18n.md`
6. 再进入具体模块

如果项目结构发生明显变化，应同步更新：

- `AGENTS.md`
- `MANUAL.md`
- `README.md`
- `README_EN.md`
- 对应 `docs/`

---

## 13. 核心判断标准

判断一个改动是否正确，优先看它是否：

- 让三模块定位更清楚
- 让中间对象更稳定
- 让 Markdown / JSON 产物更统一
- 让 locale 处理更独立
- 让 provider runtime 更少泄漏到业务层
- 让 docs / tests / scripts / CI 更一致

如果一个改动只是“看起来更高级”，却没有让以上几点更清楚，默认不应优先做。
