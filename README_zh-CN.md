# TOEFL Slang Master

> **打破学术英语 (TOEFL) 与地道美式表达 (Slang) 的围墙。**
> 让《经济学人》素材一鱼两吃：既能提分，又能像 Local 一样说话。

[English](README.md) | [简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Español](README_es.md) | [Français](README_fr.md) | [Deutsch](README_de.md)

---

## ✨ 核心特性

| 场景 | 痛点 | 解决方案 |
| :--- | :--- | :--- |
| **备考 TOEFL** | 知道 "gonna" 不正式，但不知道替换成什么 | **Dictionary Pro**：一键学术化、语域无缝转换 |
| **读《经济学人》** | 长难句看懂但写不出来 | **Content Parser**：句式模板直接套用、全方位解构 |
| **写作评分** | 不知道26分和20分的差距在哪 | **TOEFL Coach**：精准诊断优化、地道学术对标 |

---

## 🎯 核心模块

### 1. 深度词典 (Dictionary Pro)
专注于表达级语域转换，将口语化、随意或模糊的英语转换为标准学术风格。
* **功能**：词汇升级、多义词消歧、近义词深度对比。
* **特性**：附带语境分析、多维频次统计和精准的中英学术对标。

### 2. 托福教练 (TOEFL Coach)
专注于纯学术逻辑与结构诊断，对高阶英文写作提供全面审视。
* **功能**：基于 ETS 标准的模拟评分、弱表达提取与系统性替换建议。

### 3. 素材拆解 (Content Parser)
专注于深度外刊分析与学习资料抽取。
* **功能**：解析 PDF / MD / TXT，提取语法、句式模板和文化背景。

---

## 🚀 快速开始

### 安装

```bash
npm install
npm link
tsm init   # 配置 API Key (支持 OpenAI, Gemini, Anthropic 等)
tsm doctor # 环境体检
```

### 核心 Pipeline

```bash
# Workflow 1: 从文本/外刊中提取表达并生成词卡
tsm pipeline:input --file article.pdf

# Workflow 2: 从写作中诊断弱表达并生成升级词卡
tsm pipeline:output --text "This is a big improvement."
```

### 原子模块独立调用

```bash
tsm dict "a big deal"
tsm coach --file ./essay.txt --json
tsm content --file article.pdf --extract-only
```

---

## 🧪 实验性功能

可通过 `tsm x` 访问：
- **SRS 复习** (`tsm x review`)：基于 SM2 算法的闪卡记忆测试。
- **每日挑战** (`tsm x daily`)：随机抽取 3 张卡片的碎片化快测。
- **语义聚类** (`tsm x cluster`)：基于图算法自动编织同源义群。
- **原生 TTS** (`tsm x speak`)：调用系统引擎朗读单词与例句。

---

## 💂 安全隐私

**纯 API 模式**：无中心化服务器，你的 API Key 和数据仅留在本地。

---

## 📄 开源协议

MIT License.
