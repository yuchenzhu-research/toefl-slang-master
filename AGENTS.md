# AGENTS.md

本文件是 `SPARK` 的共享 cross-agent 运行手册。  
最高治理文件是 `CONSTITUTION.md`；如与其他文档冲突，以 `CONSTITUTION.md` 为准。

`AGENTS.md` 只负责：

- 默认读取顺序
- 执行流程
- 验证基线
- 文档同步纪律
- 汇报要求

它不再重复项目宪法层内容，也不替代 `MANUAL.md`。

---

## 1. Default Read Order

所有代理在开始任务前，默认按以下顺序建立上下文：

1. 先读 `CONSTITUTION.md`
2. 再读 `AGENTS.md`
3. 再读：
   - `MANUAL.md`
   - `README.md`
   - `README_zh-CN.md`
   - `README_zh-TW.md`
   - `package.json`
   - `tsconfig.json`
4. 再检查与当前任务直接相关的：
   - `src/` 下对应模块
   - `apps/desktop/` 下的桌面前端
   - `tests/` 下对应测试
   - `.github/workflows/ci.yml`
5. 完成审计后，再实施修改

说明：
- 如果某份文档还不完整，不要假设项目没有这类约束
- 即使任务只涉及文档、测试、CLI 或配置，也不跳过该流程

---

## 2. Execution Workflow

代理执行任务时，默认遵守以下顺序：

1. 先审计现状，再修改，不先假设
2. 先确认 authoritative source，再决定改动范围
3. 优先做最小闭环修改，不顺手做大重构
4. 优先修正 tests / CI / scripts 的漂移，再扩功能
5. 完成后明确说明验证情况、风险与后续建议

默认问题分流：

- **治理与边界问题**：先看 `CONSTITUTION.md`、`AGENTS.md`、`MANUAL.md`
- **locale 规则**：`src/platform/locale.ts`
- **脚本 / 入口 / 依赖**：先看 `package.json`
- **CI 基线**：先看 `.github/workflows/ci.yml`

---

## 3. Repository Boundaries for Agents

代理工作时，默认按以下边界理解仓库：

- `src/`
  主项目源码边界
- `apps/desktop/`
  Electron 桌面前端 workspace
- `docs/`
  专题设计与约束说明
- `tests/`
  最小守卫测试边界
- `skills/`
  项目资产，不等于运行时代码
- `references/`
  外部参考与归档材料，不属于主项目源码边界

执行时还应注意：

- `src/app-cli.ts` 和 `bin/` 应保持薄入口
- provider runtime 相关逻辑优先收口在平台层
- 业务模块内如有跨模块重复，优先考虑共享 contract 或共享 runtime
- connector 是桥接层，不是新的平台核心
- 前端只消费稳定 CLI/API/contract，不直接复制业务模块逻辑

---

## 4. Verification Baseline

当前项目仍处于早期工程化阶段，因此所有结构性修改都应先考虑最小验证。

如果改动涉及以下内容，应优先补或检查对应验证：

- CLI / command surface
- provider resolution
- connector mapping
- locale contract
- schema / validator
- docs sync
- CI / scripts 对齐

默认验证原则：

1. 不允许长期依赖“README 说明正确但 CI 不可运行”的状态
2. 如果 tests 与当前源码结构漂移，先修测试边界，再扩功能
3. 如果 CI 失败，不要把它当成“后面再说”

---

## 5. Documentation Sync Discipline

当以下内容发生变化时，必须检查文档同步：

- 治理结构
- 架构边界
- 主链路 / connector contract
- locale 规则
- 输出规则
- 命令面 / CLI 帮助文本
- provider 配置与路由
- tests / CI 基线

默认同步范围：

- `CONSTITUTION.md`
- `AGENTS.md`
- `MANUAL.md`
- `README.md`
- `README_zh-CN.md`
- `README_zh-TW.md`
- 对应 `docs/`
- 必要的 tests / CI

说明：

- `README*.md` 面向用户，不能长期偏离工程现实
- `docs/*` 负责专题细节，不应承载第二套顶层治理
- 工具 shim 文件若未来出现，只能做薄兼容层，不能复制整套规则

---

## 6. Package / Script / CI Rules

- `package.json` 是 npm scripts、bin 注册和依赖声明的唯一事实来源
- 根 `package-lock.json` 是依赖锁定的唯一事实来源；workspace 内不维护第二份 lockfile
- 不要默默增加新的运行入口而不同步 `package.json`
- 不要让 README、bin、scripts、实际入口长期漂移
- `.github/workflows/ci.yml` 应与当前 scripts 和测试集保持一致

---

## 7. Completion Report Requirements

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

---

## 8. Prohibitions

- 不要把 `references/` 当主项目源码直接改造
- 不要先做 GUI，再补 contract
- 不要为了繁体中文复制整套业务逻辑
- 不要让 schema key 本地化
- 不要把 connector 过早膨胀成平台核心
- 不要让 facade 文件无限增加但没有真实职责
- 不要让模块通过复制粘贴继续长大
- 不要把 README 写成内部维护手册全集
- 不要在 tests / CI / scripts 漂移时继续加大功能
- 不要把 `AGENTS.md` 继续写成第二本 `CONSTITUTION.md`

---

## 9. Long-Term Maintenance Convention

后续若项目结构发生明显变化，应同步检查：

- `CONSTITUTION.md`
- `AGENTS.md`
- `MANUAL.md`
- `README.md`
- `README_zh-CN.md`
- `README_zh-TW.md`
- 对应 `docs/`
- `.github/workflows/ci.yml`

如果未来新增 `CLAUDE.md`、`CURSOR.md` 或其他工具入口文件：

- 它们必须显式继承本仓库治理栈
- 它们只能保留工具特定说明
- 它们不能复制 `AGENTS.md` 或 `CONSTITUTION.md` 的主体内容
