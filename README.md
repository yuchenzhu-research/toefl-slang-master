# TOEFL Slang Master

<div align="center">

<!-- Hero Banner -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/TOEFL-Slang%20Master-1.0.0-FF6B6B?logo=tensorflow&logoColor=white&style=for-the-badge">
  <source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/badge/TOEFL-Slang%20Master-1.0.0-FF6B6B?logo=tensorflow&style=for-the-badge">
  <img alt="TOEFL Slang Master" src="https://img.shields.io/badge/TOEFL-Slang%20Master-1.0.0-FF6B6B?logo=tensorflow&style=for-the-badge">
</picture>

> **打破学术英语 (TOEFL) 与地道美式表达 (Slang) 的围墙。**
> 借助 Vibe Engineering 的力量，让《经济学人》素材一鱼两吃：既能提分，又能像 Local 一样说话。

</div>

<div align="center">

<!-- Navigation Links -->
[**📖 中文**](README.md) | [**🇺🇸 English**](README_EN.md) | [**🚀 快速开始**](#-快速开始) | [**📚 文档**](https://github.com/yuchenzhu-research/toefl-slang-master)

</div>

<div align="center">

<!-- Badges -->
![Version](https://img.shields.io/badge/version-1.0.0-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Engine](https://img.shields.io/badge/Engine-Multi--Provider-412991)
![License](https://img.shields.io/badge/license-MIT-green)
![Vibe](https://img.shields.io/badge/Philosophy-Vibe%20Engineering-FF69B4)

</div>

---

## ✨ 为什么选择 TOEFL Slang Master？

你是否也曾陷入这样的困境？

| 场景 | 痛点 | 解决方案 |
| :--- | :--- | :--- |
| 备考 TOEFL | 知道 "gonna" 不正式，但不知道替换成什么 | **深度词典** 一键学术化 |
| 读《经济学人》 | 长难句看懂但写不出来 | **素材拆解** 句式模板直接套用 |
| 写作评分 | 不知道26分和20分的差距在哪 | **托福教练** 精准诊断优化 |

> **核心理念**：不妥协——既要高分，也要地道。

---

## 🎯 核心模块

基于 OpenClaw 架构的多厂商 API 引擎驱动，项目当前以 `Dictionary Pro` 为主入口，其他模块仍处于技能设计阶段：

| 模块名称 | 核心定位 | 当前状态 |
| :--- | :--- | :--- |
| **深度词典 (Dictionary Pro)** | 表达级语域转换 | **已可运行**：CLI、多厂商 API、结构化输出、自动修复、评测 |
| **托福教练 (TOEFL Coach)** | 纯学术逻辑诊断 | **未接入运行时**：目前只有技能方向与文档草案 |
| **素材拆解 (Content Parser)** | 深度外刊文化分析 | **初始框架已可运行**：PDF/MD/TXT 读取、结构化输出、CLI |

### Dictionary Pro 示例

| 维度 | 内容 |
| :--- | :--- |
| **翻译** | 大的、重要的 |
| **俚语** | huge, massive, "a big deal" |
| **对标** | substantial, significant, considerable |
| **频次** | 高（美剧、新闻、学术文章均常见） |
| **例析** | "This is a **big** decision" — 强调重要性；"The company saw **substantial** growth" — 正式书面语更适合托福写作。 |

### TOEFL Coach 诊断示例

| 维度 | 内容 |
| :--- | :--- |
| **评分** | 16-19/30。主要问题：词汇基础、逻辑连接词单一、句式简单。 |
| **逻辑** | 连接词使用单调 (because/but/so)，建议升级为 furthermore, nevertheless, consequently。 |
| **用词** | "good", "bad", "think" 过于基础。替换为 beneficial, adverse, contend/argue。 |
| **句式** | 4 个简单句，0 从句，0 被动。建议合并句子，增加从句结构。 |
| **优化** | Technology, which has fundamentally transformed communication, offers substantial benefits; however, its adverse effects warrant careful consideration. |

---

## 📌 当前可用范围

### 已可实施

| 能力 | 当前状态 |
| :--- | :--- |
| **Dictionary Pro 命令行查询** | 已可直接运行，入口是 `npm run dict -- ...` |
| **Content Parser 初始框架** | 已可直接运行，入口是 `npm run content -- ...` |
| **多厂商 API 接入** | 已接入 OpenClaw-style provider runtime，支持 API key 模式 |
| **结构化输出** | 已支持 JSON contract 校验，并可渲染为固定 5 维词卡 |
| **自动修复** | 首轮输出不合法时，会按校验错误自动重试 |
| **回归评测** | 已支持 `npm run dict:eval` 批量跑 case 并生成报告 |
| **Dry Run 调试** | 已支持只看 prompt，不发真实 API 请求 |

### 暂未实施

| 能力 | 当前状态 |
| :--- | :--- |
| **TOEFL Coach 运行时** | 尚未提供可执行 CLI / API |
| **PDF OCR / 图片型 PDF** | 尚未支持，当前只处理可提取文本的 PDF |
| **Content Parser 分块深读** | 目前只有单次抽取 + 单次解析骨架，长文分块还没做 |
| **Web 页面或 GUI** | 目前没有，当前主入口是命令行 |
| **OAuth / Plus 账号模式** | 不做，当前只支持 API key 模式 |
| **通用百科词典** | 不是当前重点，专有名词如 `Iceland` 这类输入支持有限 |
| **语料 / 词典检索层** | 目前主要依赖模型生成，还未接入外部词典或 corpus 检索 |

### Dictionary Pro 最适合处理什么输入？

| 输入类型 | 当前表现 |
| :--- | :--- |
| **口语词 / 俚语** | 最强，例如 `gonna`、`kinda`、`tons of` |
| **低阶词升级** | 较强，例如 `good`、`get`、`big deal` |
| **近义词比较** | 较强，例如 `however vs nevertheless` |
| **多义词消歧** | 可用，例如 `cap`、`issue`，但最好带上下文 |
| **专有名词 / 地名 / 人名** | 一般，例如 `Iceland`，目前会被硬套进词卡框架 |

---

## 🏗️ 技术架构

```
toefl-slang-master/
├── skills/                  # Canonical skills 目录
│   └── dictionary-pro/      # 深度词典主技能目录
│       ├── SKILL.md         # 技能定义
│       ├── agents/          # UI 元数据
│       └── references/      # 输出契约与补充规则
├── .claude/
│   └── skills/              # 兼容旧工具链的历史目录
├── src/                     # TypeScript 源代码
│   ├── api/                 # API 集成层
│   │   └── client.ts        # 多厂商统一客户端入口
│   ├── auth/                # 鉴权管理层
│   │   └── manager.ts       # OpenClaw-style 本地配置与密钥解析
│   ├── providers/           # OpenClaw-style provider runtime
│   │   ├── catalog.ts       # 厂商目录与默认配置
│   │   ├── runtime.ts       # 协议分发与执行
│   │   └── protocols/       # OpenAI / Anthropic / Gemini / Ollama 适配器
│   ├── content-parser/      # CLI / extractor / prompt / validator / runner
│   ├── dictionary-pro/      # CLI / prompt / validator / runner / evaluation
│   └── index.ts             # 入口文件（当前默认进入 Dictionary Pro）
├── package.json             # 依赖配置
├── tsconfig.json            # TypeScript 配置
└── README.md / README_EN.md # 双语文档
```

| 技术栈 | 版本 | 用途 |
| :--- | :--- | :--- |
| **TypeScript** | ^5.9 | 类型安全与快速开发 |
| **Provider Runtime** | OpenClaw-style | 多厂商协议适配与统一调用 |
| **dotenv** | ^17.3 | 环境变量加载 |
| **ts-node** | ^10.9 | 直接运行 TypeScript |
| **@types/node** | ^25.3 | Node.js 类型定义 |

---

## 💂 安全架构：API-Only 模式，保护你的 Plus 账号

本项目采用 **OpenClaw-style 纯 API 调用模式**，让你的 Claude API 密钥零风险：

```bash
# 配置文件 (.env) 示例
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
# 所有请求直接调用 Anthropic API，不经过任何第三方服务器
# 配置文件仅保存在本地 .claude/settings/ 目录
```

| 安全特性 | 说明 |
| :--- | :--- |
| **本地配置** | API 密钥仅存储在本地 `~/.claude/settings.json` |
| **无代理中转** | 请求直接发送至 Anthropic 服务器 |
| **透明可审计** | 所有代码开源，逻辑完全透明 |

---

## 🚀 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 配置 API 密钥
cp .env.example .env
# 编辑 .env 文件，填入你要用的厂商 API key
# 例如 OPENAI_API_KEY / GEMINI_API_KEY / ANTHROPIC_API_KEY

# 3. 运行当前已完成的功能
npm run dict -- --text "gonna"
npm run content -- --file README.md --extract-only

# 4. 如果你想像 openclaw 一样直接输入命令
npm link
dictpro --text "gonna"
```

> **说明**：当前可直接运行的是 `Dictionary Pro` 和 `Content Parser` 初始框架。`TOEFL Coach` 还没有接成可执行入口。

### Dictionary Pro 操作示例

```bash
# 最简查询（自动模式）
npm run dict -- --text "a big deal"

# 查看当前支持的 provider
npm run dict:providers

# 指定模式 + 目标场景
npm run dict -- --text "gonna" --mode conversion --target toefl-writing

# 加上下文做消歧
npm run dict -- --text "cap" --context "The proposal puts a cap on tuition increases."

# 切换厂商与模型
npm run dict -- --provider google --model gemini-3-pro --text "cap"
npm run dict -- --provider anthropic --model claude-sonnet-4-5 --text "gonna"

# 只看 prompt，不发 API（回归调试用）
npm run dict:dry

# 跑评测集（需要可用 API key）
npm run dict:eval -- --provider openai --limit 3

# 按 case 过滤并输出 JSON 报告
npm run dict:eval -- --provider anthropic --case DP-003 --json
```

### 当前最推荐的命令行入口

```bash
# 先把当前仓库注册为本地 CLI
npm link

# 查一个口语词，输出固定词卡
dictpro --provider openai --text "gonna" --mode conversion --target toefl-writing

# 查一个多义词，并给上下文
dictpro --provider openai --text "cap" --context "The proposal puts a cap on tuition increases." --mode meaning --target general-academic

# 对比两个近义表达
dictpro --provider openai --text "obtain vs acquire" --mode comparison --target toefl-writing

# 跑评测
dictpro-eval --provider openai --limit 3
```

### Content Parser 操作示例

```bash
# 只做 PDF / 文本抽取，不发模型
npm run content -- --file README.md --extract-only

# 读取 PDF 并生成结构化笔记
npm run content -- --pdf ./article.pdf --provider openai --focus full

# 只看 prompt，检查 PDF 提取后的素材如何进入模型
npm run content -- --pdf ./article.pdf --focus syntax --dry-run

# 输出 JSON
npm run content -- --file README.md --provider openai --json
```

**或者使用 Claude Code 直接调用技能：**

```markdown
请使用 dictionary-pro 技能查询 "gonna" 的学术对标表达。

请使用 toefl-writing 技能诊断以下作文...
```

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 License

本项目采用 MIT License 开源协议。

---

## 🌟 项目背书

> "_TOEFL Slang Master 让我的写作从 22 分提升到 28 分，同时我在追《经济学人》时终于能听懂同事的骚话了。_"

<div align="right">— 某不愿透露姓名的备考党</div>

---

<p align="center">
  <a href="#readme-top">⬆️ 返回顶部</a>
</p>

<!--
  🤖 AI 开发者指令：自我迭代协议

  当 .claude/skills/ 目录下的技能文件发生更新时，请自动执行以下流程：

  1. 扫描更新：读取所有 SKILL.md 文件，提取最新的五维输出定义
  2. 同步表格：更新 README.md 核心模块表格与 SKILL.md 维度一致
  3. 技术栈对齐：读取 package.json，更新"技术架构"章节的依赖版本
  4. 双语同步：修改 README.md 后，必须同步更新 README_EN.md

  版本历史：
  - v1.0.0: 初始版本，集成三大核心模块
-->
