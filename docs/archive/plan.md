# SPARK Product Plan

> 这个文件不是对外 README，而是项目内部的产品蓝图。
> 目标不是解释“现在能跑什么”，而是定义“最终要做成什么”。

## 1. 产品一句话

把 `Dictionary Pro`、`TOEFL Coach`、`Content Parser` 从三个分立工具，做成一个围绕 TOEFL 学习闭环运转的 AI 学习系统：

`读材料 -> 拆表达 -> 写输出 -> 找弱点 -> 生成词卡 -> 反复训练`

这个项目最终不应该只是：

- 一个查词工具
- 一个作文批改工具
- 一个文章拆解工具

它应该是一个：

**面向 TOEFL 与学术英语提升的学习操作系统**

---

## 2. 北极星

### 北极星价值

用户读到的内容，必须能够转化为：

- 可复用表达
- 可迁移句式
- 可验证写作提升
- 可沉淀个人能力画像

### 北极星体验

理想状态下，用户完成一次完整学习流程时，不需要手动复制粘贴到三个模块里反复操作，而是：

1. 导入一篇材料
2. 自动提取高价值表达与句式
3. 生成词卡与表达升级建议
4. 基于材料写一段或一篇作文
5. 自动诊断作文中的弱表达与逻辑问题
6. 再把这些问题回流成新的训练卡
7. 形成个人长期复习系统

---

## 3. 最终产品形态

最终形态不是 CLI 工具集合，而是一个由 5 层组成的系统。

### Layer 1. Platform Layer

负责共享底盘：

- 多厂商 provider runtime
- auth / config / env
- CLI / future API / future Web
- validated JSON runtime
- benchmark / doctor / init

### Layer 2. Module Layer

三个核心模块，各自独立可运行：

- `Dictionary Pro`
- `TOEFL Coach`
- `Content Parser`

每个模块都必须做到：

- 自己有独立入口
- 自己有 schema
- 自己有 validator
- 自己有 prompt / runner / render
- 自己可被单独测试与独立演进

### Layer 3. Connector Layer

这是项目未来最关键的一层。

它的作用不是让模块互相直接调 prompt，而是定义标准化中间产物，让模块之间传递“结构化学习成果”。

### Layer 4. Memory Layer

负责长期沉淀用户学习轨迹：

- 个人表达卡库
- 弱表达画像
- 学过的材料摘要
- 复习计划
- 历史写作改进轨迹

### Layer 5. Delivery Layer

负责不同交付界面：

- CLI
- HTTP API
- Web UI
- Browser / extension / future integrations

---

## 4. 三个模块的终局定位

### 4.1 Dictionary Pro

不是通用词典。

最终定位：

**表达级语域转换与表达学习引擎**

负责：

- 口语 / 俚语 -> TOEFL / academic 表达
- 低阶词升级
- 近义表达差异
- 多义词消歧
- 词卡生成与复习材料生产

最终要有的能力：

- 结构化词卡
- 真实语境或证据层
- comparison mode
- proper noun / entity mode
- personal weak-word upgrade mode
- review pack export

### 4.2 TOEFL Coach

不是泛写作助手。

最终定位：

**TOEFL 写作与口语输出诊断引擎**

负责：

- 写作结构诊断
- 逻辑连接诊断
- 低阶表达识别
- 改写建议
- 风格风险提示

最终要有的能力：

- 稳定评分框架
- 弱表达抽取
- 按 ETS 风格输出结构化诊断
- 训练建议而不只是“重写一版”
- 将错误表达回流给 `Dictionary Pro`

### 4.3 Content Parser

不是泛 PDF 摘要器。

最终定位：

**学习素材解析与训练输入生成引擎**

负责：

- 材料提取
- 长难句与文化背景拆解
- 高价值表达筛选
- 写作素材包生成
- 为其他模块提供上游输入

最终要有的能力：

- PDF / MD / TXT ingestion
- OCR
- 长文分块
- expression candidate extraction
- source digest generation
- prompt pack / writing prompt generation

---

## 5. “胞间连丝”层的正式定义

未来真正把三个模块连起来的，不应该是“模块 A 直接调用模块 B 的 prompt”，而应该是标准中间对象。

### 5.1 核心中间对象

#### `ExpressionCard`

由 `Dictionary Pro` 产出。

包含：

- expression
- sense
- register
- academic alternatives
- slang alternatives
- collocations
- examples
- risk notes

用途：

- 复习
- 个性化词卡
- 写作升级建议

#### `WritingDiagnosis`

由 `TOEFL Coach` 产出。

包含：

- score band
- logic issues
- vocabulary issues
- structure issues
- weak expressions
- rewrite suggestions

用途：

- 写作反馈
- 生成弱表达列表
- 回流词典升级

#### `WeakExpressionSet`

由 `TOEFL Coach` 从 `WritingDiagnosis` 中额外提炼。

包含：

- weak phrase
- why weak
- target register
- severity

第一条落地链路的详细协议见：

- `docs/connectors/coach-to-dict.md`

用途：

- 自动喂给 `Dictionary Pro`

#### `SourceDigest`

由 `Content Parser` 产出。

包含：

- source metadata
- key ideas
- key expressions
- sentence patterns
- cultural notes
- reusable writing angles

用途：

- 文章复习
- 作文素材生成
- 句式迁移

#### `ExpressionCandidates`

由 `Content Parser` 产出。

包含：

- candidate expression
- local sentence context
- why it is worth learning
- likely register

用途：

- 批量进入 `Dictionary Pro`

### 5.2 第一批串联链路

#### Chain 1. `TOEFL Coach -> Dictionary Pro`

这是最优先要做的第一条链。

作用：

- 从作文中自动抽出弱表达
- 直接生成表达升级卡
- 把“作文诊断”变成“可复习行动”

#### Chain 2. `Content Parser -> Dictionary Pro`

作用：

- 从文章中提取高价值表达
- 批量生成词卡
- 把阅读变成可积累表达资产

#### Chain 3. `Content Parser -> TOEFL Coach`

作用：

- 把阅读素材转成写作训练输入
- 建立“读写联动”

---

## 6. 最终产品工作流

### Workflow A. 读文章学习

1. 用户导入文章 / PDF
2. `Content Parser` 提取 `SourceDigest`
3. 抽出 `ExpressionCandidates`
4. `Dictionary Pro` 生成 `ExpressionCard`
5. 保存到个人复习库

### Workflow B. 写作提升

1. 用户提交作文
2. `TOEFL Coach` 输出 `WritingDiagnosis`
3. 抽出 `WeakExpressionSet`
4. `Dictionary Pro` 输出升级卡
5. 生成改写建议与复习任务

### Workflow C. 闭环训练

1. 用户从文章中学到表达
2. 系统生成词卡
3. 用户写作文时再次使用
4. `TOEFL Coach` 判断是否仍有低阶表达
5. 系统更新用户画像与复习队列

---

## 7. 产品护城河

这个项目的护城河不应该建立在：

- 单一 prompt
- 单一模型
- 单一 provider

真正的护城河应该建立在：

### 7.1 工作流闭环

不是单点功能，而是：

- 阅读
- 表达升级
- 写作输出
- 诊断
- 再学习

### 7.2 结构化学习对象

一旦 `ExpressionCard / WritingDiagnosis / SourceDigest` 形成，后续所有界面和功能都可以复用。

### 7.3 个人化记忆

长期最值钱的数据不是模型输出本身，而是：

- 这个用户总在犯什么表达问题
- 学过什么词卡
- 哪些表达已经掌握
- 哪些文章给过高价值输入

---

## 8. 规划顺序

### Phase 0. 架构隔离

目标：

- 平台层抽离
- 三个模块独立入口
- README 和内部认知对齐

状态：

- 已完成

### Phase 1. 第一条串联链

目标：

- 实现 `TOEFL Coach -> Dictionary Pro`

交付：

- `WritingDiagnosis`
- `WeakExpressionSet`
- `ExpressionCard`
- 一个 bridge 命令或桥接 runner

这是下一个必须执行的阶段。

### Phase 2. 内容到表达

目标：

- 实现 `Content Parser -> Dictionary Pro`

交付：

- `SourceDigest`
- `ExpressionCandidates`
- 批量词卡生成

### Phase 3. 内容到输出

目标：

- 实现 `Content Parser -> TOEFL Coach`

交付：

- 文章驱动写作练习
- 基于材料的写作 prompt pack

### Phase 4. 记忆层

目标：

- 建立用户长期复习与画像

交付：

- card history
- weak expression history
- source history
- review queue

### Phase 5. UI 产品化

目标：

- 从 CLI 工具进化为真正产品原型

交付：

- 最小 Web UI
- 查询 / 阅读 / 写作 / 复习四个主面板

---

## 9. 暂不优先做的事

以下内容可以做，但不是当前主线：

- 更多 provider
- 更多营销页或 README 包装
- 移动端
- OAuth
- 通用百科词典
- 社区功能
- 花哨的 UI

当前最重要的是：

**先把模块串起来，再把记忆层做出来。**

---

## 10. 执行原则

### 原则 1

先做标准中间对象，再做模块联动。

### 原则 2

先打通一条链路，再扩第二条、第三条。

### 原则 3

每一个新增能力都要问：

它是否能进入学习闭环？

如果不能，只是局部增强，就降低优先级。

### 原则 4

始终让平台层保持中立，让模块层独立演进，让 connector 层承载协同。

---

## 11. 当前结论

这个项目当前最正确的方向，不是继续扩模块，也不是继续堆 provider。

最正确的方向是：

1. 保持三条线独立
2. 定义 connector contracts
3. 先打通 `TOEFL Coach -> Dictionary Pro`
4. 再做 `Content Parser -> Dictionary Pro`
5. 最后补 memory layer 和 UI

这就是当前版本的最终产品宏图。
