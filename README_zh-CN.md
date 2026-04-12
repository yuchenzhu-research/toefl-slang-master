# TOEFL Slang Master

> **打破学术英语 (TOEFL) 与地道美式表达 (Slang) 的围墙。**
> 让《经济学人》素材一鱼两吃：既能提分，又能像 Local 一样说话。

[English](README.md) | [简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Español](README_es.md) | [Français](README_fr.md) | [Deutsch](README_de.md)

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

## 🚀 快速开始

### 安装

```bash
# 安装依赖
npm install

# 注册全局 CLI 命令
npm link

# 初始化本地环境 (.env)
tsm init
```

### 核心 Pipeline

```bash
# 工作流 1：从材料中提取表达并生成词卡
tsm x pipeline:input --file article.pdf

# 工作流 2：诊断写作中的弱表达并生成对应的升级词卡
tsm x pipeline:output --text "This is a big improvement."
```

### 原子模块独立调用

```bash
# 直接查词
tsm dict "a big deal"

# 独立写作诊断
tsm coach --file ./essay.txt --json

# 独立素材提取（不调用 AI）
tsm content --file article.pdf --extract-only
```

### Provider 路由说明

`--provider` 表示接入网关 / provider runtime，`--model` 才是具体模型 ID。

```bash
# 官方 MiniMax 直连
tsm dict "gonna" --provider minimax

# 通过 SiliconFlow 承载的 MiniMax
tsm dict "gonna" --provider siliconflow-minimax
```

---

## 🧪 实验性扩展功能

可通过 `tsm x` 访问的极客能力：

- **SRS 间隔复习** (`tsm x review`)：基于 SM2 算法的闪卡记忆测试。
- **每日挑战** (`tsm x daily`)：从你的库中随机抽取 3 张卡片进行碎片化快测。
- **语义聚类** (`tsm x cluster`)：基于图算法将你的词卡网自动编织为同源义群。
- **原生 TTS** (`tsm x speak`)：调用系统语音引擎精准朗读单词与例句。
- **命令行 REPL** (`tsm x repl`)：高效率连续发问不断流。

---

## 💂 安全隐私

**纯 API 模式**：本工具不设中心化服务器。你的 API Key (OpenAI, Gemini, Anthropic, SiliconFlow) 和所有学习数据均严格保留在你的本地机器上。
