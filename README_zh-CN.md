# SPARK

> **打破学术英语 (TOEFL) 与地道美式表达 (Slang) 的围墙。**
> 让《经济学人》素材一鱼两吃：既能提分，又能像 Local 一样说话。

[English](README.md) | [简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md) | [日本語](docs/locales/README_ja.md) | [한국어](docs/locales/README_ko.md) | [Español](docs/locales/README_es.md) | [Français](docs/locales/README_fr.md) | [Deutsch](docs/locales/README_de.md)

---

## ✨ 核心特性

| 场景 | 痛点 | 解决方案 |
| :--- | :--- | :--- |
| **备考 TOEFL** | 知道 "gonna" 不正式，但不知道替换成什么 | **Dictionary Pro**：一键学术化、语域无缝转换 |
| **读《经济学人》** | 长难句看懂但写不出来 | **Content Parser**：句式模板直接套用、背景全方位解构 |
| **写作评分** | 不知道 20 分和 26 分的差距在哪 | **TOEFL Coach**：基于官方标准精准诊断优化 |

---

## 🎯 核心模块

### 1. 深度词典 (Dictionary Pro)
专注于表达级语域转换，将口语化、随意或模糊的英语转换为标准学术风格。
*   **词汇升级**：将低阶词汇精准替换为更高级的学术对标表达。
*   **语境分析**：基于特定写作上下文进行消歧，确保用词准确。
*   **学术对标**：直接建立非正式表达与学术表达之间的稳定映射。

### 2. 托福教练 (TOEFL Coach)
专注于纯学术逻辑与结构诊断，对高阶英文写作提供全面审视。
*   **官方标准**：基于 ETS 标准的模拟评分与诊断反馈。
*   **弱表达提取**：自动识别并标记写作中的非正式用词。
*   **结构优化**：引导使用分析性的学术过渡词与复杂句式。

### 3. 素材拆解 (Content Parser)
专注于深度外刊分析与学习资料抽取。
*   **素材提炼**：自动识别高价值语法点、句式模板和文化背景。
*   **结构化笔记**：解析 PDF/MD/TXT 素材，生成标准的学习单元。
*   **语料闭环**：自动输出下游模块可直接消费的表达候选池。

---

## 🎬 Studio 引导模式

直接启动 SPARK Studio 终端：

```bash
spark studio
```

Studio 当前以**交互式 TUI（终端 UI）**运行。输入任意单词或表达，Dictionary Pro 会实时查询并返回结果。按 `Ctrl+C` 退出。

```bash
spark studio --dry-run   # 不调用 API，仅预览界面布局
```

> **注意**：完整的引导式 pipeline（文件选择 → 解析预览 → 候选筛选 → 词卡生成）
> 正在开发中（WIP）。当前 TUI 专注于 Dictionary Pro 查词功能。
> `/coach` 和 `/content` 的集成将在后续版本中加入。

## 🖥️ 前端可接入的后端 API

启动本地后端 API，供 Google Antigravity 等前端调用：

```bash
spark web --port 4173
```

当前后端接口：

- `GET /api/health`
- `POST /api/dict/lookup`：Dictionary Pro 查词，返回俚语/语域信息和学术对标；默认 `dryRun: true`
- `POST /api/style/economist`：确定性的 Economist 风格特征分析

## 🖼️ 桌面端应用

Electron 前端位于 `apps/desktop`，作为 npm workspace 管理。根 `package.json` 仍是仓库 scripts 与依赖入口的权威来源。

```bash
npm run desktop:dev
npm run desktop:build
```

前端架构与演进规则见 `docs/frontend.md`。

## 🧠 Economist 风格分析

第一版风格引擎已支持 Economist-like 分析：

```bash
spark style --text "Although markets may adapt, regulation can distort incentives."
```

这仍是**风格特征分析**，不是完整语料训练的仿写引擎。当前会检查句长节奏、转折、因果链、hedging、经济/政策词汇和压缩式标点。

---

## 🚀 快速开始

### 安装

```bash
# 安装依赖
npm install

# 注册全局 CLI 命令
npm link

# 初始化本地环境 (.env)
spark init
```

### 智能体工作空间 CLI

不带任何参数运行 `spark` 将开启交互式的智能体工作空间 CLI，提供带时间线与本地产物的统一会话：

```bash
# 进入交互式智能体工作空间 CLI
spark
```

进入工作空间后，你可以使用以下斜杠命令：
*   `/dict <phrase>` - 将非正式口语升级为学术对标表达
*   `/style <text>` - 分析文本的《经济学人》风格特征
*   `/coach <text>` - 诊断托福写作并给出模拟评分
*   `/content <file>` - 解析阅读材料以提取词汇候选
*   `/clear` - 清空终端屏幕
*   `/exit` - 退出交互会话
*   `/help` - 查看支持的命令

### 核心 Pipeline

```bash
# 工作流 1：从材料中提取表达并生成词卡
spark x pipeline:input --file article.pdf

# 工作流 2：诊断写作中的弱表达并生成对应的升级词卡
spark x pipeline:output --text "This is a big improvement."

# 不调用 API，仅预览 pipeline 执行计划
spark x pipeline:input --file article.md --dry-run
spark x pipeline:output --text "I think technology is good." --dry-run
```

### 原子模块独立调用

```bash
# 直接查词
spark dict "a big deal"

# 独立写作诊断
spark coach --file ./essay.txt --json

# 独立素材提取（不调用 AI）
spark content --file article.pdf --extract-only
```

### Provider 路由说明

`--provider` 表示接入网关 / provider runtime，`--model` 才是具体模型 ID。

```bash
# 官方 MiniMax 直连
spark dict "gonna" --provider minimax

# 通过 SiliconFlow 承载的 MiniMax
spark dict "gonna" --provider siliconflow-minimax
```

---

## 🧪 实验性扩展功能

可通过 `spark x` 访问的极客能力：

- **SRS 间隔复习** (`spark x review`)：基于 SM2 算法的闪卡记忆测试。
- **每日挑战** (`spark x daily`)：从你的库中随机抽取 3 张卡片进行碎片化快测。
- **语义聚类** (`spark x cluster`)：基于图算法将你的词卡网自动编织为同源义群。
- **原生 TTS** (`spark x speak`)：调用系统语音引擎精准朗读单词与例句。
- **命令行 REPL** (`spark x repl`)：高效率连续发问不断流。

---

## 🧭 治理文档入口

如需了解项目治理与维护，请优先阅读：

### 项目治理文件

- `CONSTITUTION.md`：最高治理文件，定义项目身份、不变量、架构守卫与质量门禁。
- `AGENTS.md`：共享 cross-agent 手册，定义读取顺序、执行流程、验证基线与文档同步纪律。
- `MANUAL.md`：维护者手册，记录仓库结构、维护检查清单与已知限制。

---

## 💂 安全和隐私

 **纯 API 模式**：本工具不设中心化服务器。你的 API Key (OpenAI, Gemini, Anthropic, SiliconFlow) 和所有学习数据均严格保留在你的本地机器上。
