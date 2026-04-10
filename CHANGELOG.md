# CHANGELOG

> 记录项目对外发布版本的可读变更。  
> 不机械罗列所有 commits，只总结对用户、协作者、维护者真正重要的变化。

---

## [Unreleased]

### 新增
- 暂时保留该节点，从 2026-04-11 起，后续新版本和新工作请从这一节继续累积。

### 变更
- 无

### 修复
- 无

### 移除
- 无

### 迁移提示
- 无

---

## [2026-04-10：三段式 Pipeline 架构成型与知识落盘闭环] - 2026-04-10

### 新增
- 新增 **Pipeline 1 (输入型学习管线)**：将生肉外刊或阅读物智能解析并自动提取具有迁移潜力的知识候选集，送入 Dictionary Pro 造卡。
- 新增 **Pipeline 2 (输出型纠偏管线)**：能够让 TOEFL Coach 诊断用户作文，并深挖其中不足的低水平表述直连 Dictionary Pro 改造为高分复习卡。
- 新增 **Pipeline 3 (知识资产库)**：增加了对 `data/` 的管理单元 `OutputManager`，以及轻量级的 `indexer.ts` 数据统计索引引擎。
- 新增测试安全网 `tests/connectors.test.ts`，彻底跑通了本地 Node --test 集成以及 `.github/workflows/ci.yml` 自动化单元测。
- 新增 CLI 暴露层：直接开启 `tsm pipeline:input`, `tsm pipeline:output` 指令和 `tsm kb:status` 控制面板。

### 变更
- 对底层的 `contracts.ts` 契约体系进行了全面补强，引入了可以溯源回父级文案和文章的 `relatedSourceSlug` 和 `relatedDiagnosisSlug` 属相。
- TOEFL Coach 输出报告自动追加 `WeakExpressionSet`（弱词替换池）独立表格总结块。

### 修复
- 修复了原 `ci.yml` 只有 TS 编译无实际运行保护体系的真空薄弱环节。
- 修复了因为旧架构隔离导致卡片缺乏情境依托（无法告知这张卡来源于我的哪一次练习和批改）的问题。

### 兼容性影响
- `data/` 已自动加入了 `.gitignore` 保护，之前的本地数据落盘如果散乱在根目录，需要人工平移向新约定的层级机制。

### 迁移提示
- 目前所有的终端操作请逐步从原始单命令如 `tsm dict` 向以 `pipeline:xx` 为导向的情景体系过渡。

---

## [历史基线：项目启动至原子模块确立] - 2026-04-09

### 新增
- 设立了 Dictionary Pro、Content Parser、TOEFL Writing 三大主力模型推演能力单元架构。
- 建立 `runValidatedJsonGeneration` 核心组件实现“生成+强制 Schema 校验”模型双保底体系。
- 增加终端基础执行层：`tsm dict` / `tsm content` / `tsm coach`。
- 多供应商引擎对接完成，支持环境变量安全驱动。

### 变更
- 项目主定位确立为“CLI-first, Markdown-first”，放弃所有可能带来的重度 Web GUI 和 SaaS 数据库负担。

### 缺陷与不足
- 数据资产无法沉淀、管线分离且人工协同成本极高，没有串连成“线”只停留在“点”上。

### 迁移提示
- 建议将未来的迭代目标由单个字典工具，进化为整体自动化管线框架。
