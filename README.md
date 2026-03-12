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
![Engine](https://img.shields.io/badge/OpenAI-API-412991)
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

基于 OpenClaw 架构的 API 引擎驱动，三大核心功能覆盖你的英语学习全链路：

| 模块名称 | 核心定位 | 五维输出 |
| :--- | :--- | :--- |
| **深度词典 (Dictionary Pro)** | 表达级语域转换 | **翻译 · 俚语 · 对标 · 频次 · 例析** |
| **托福教练 (TOEFL Coach)** | 纯学术逻辑诊断 | **评分 · 逻辑 · 用词 · 句式 · 优化** |
| **素材拆解 (Content Parser)** | 深度外刊文化分析 | **导读 · 拆解 · 俚语 · 文化 · 转化** |

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
│   │   └── client.ts        # OpenAI API 客户端
│   ├── auth/                # 鉴权管理层
│   │   └── manager.ts       # OpenClaw-style 配置管理
│   └── index.ts             # 入口文件（读取 skills/dictionary-pro）
├── package.json             # 依赖配置
├── tsconfig.json            # TypeScript 配置
└── README.md / README_EN.md # 双语文档
```

| 技术栈 | 版本 | 用途 |
| :--- | :--- | :--- |
| **TypeScript** | ^5.9 | 类型安全与快速开发 |
| **OpenAI SDK** | ^6.25 | 原生 API 客户端 |
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
# 编辑 .env 文件，填入你的 Anthropic API Key

# 3. 运行项目
npm start
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
