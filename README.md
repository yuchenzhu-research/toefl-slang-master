# TOEFL Slang Master

[![Version](https://img.shields.io/badge/version-1.0.0-orange)](https://github.com/yuchenzhu-research/toefl-slang-master)
[![Language](https://img.shields.io/badge/language-TypeScript-blue)](https://www.typescriptlang.org/)
[![Vibe](https://img.shields.io/badge/Philosophy-Vibe%20Engineering-FF69B4)](https://github.com/yuchenzhu-research/toefl-slang-master)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

[English](README_EN.md) | **中文**

> **打破学术英语 (TOEFL) 与地道美式表达 (Slang) 的围墙。**
> 借助 Vibe Engineering 的力量，让《经济学人》素材一鱼两吃：既能提分，又能像 Local 一样说话。

---

## 核心模块

本项目基于 **OpenClaw** 架构提取的 API 引擎驱动，通过 `.claude/skills/` 目录下的指令集实现以下三大核心功能：

| 模块名称 | 核心定位 | 关键特征 (五维输出) |
| :--- | :--- | :--- |
| **深度词典 (Dictionary Pro)** | 极简双向对标 | **翻译、俚语、对标、频次、例析** |
| **托福教练 (TOEFL Coach)** | 纯学术逻辑诊断 | **评分、逻辑、用词、句式、优化** |
| **素材拆解 (Content Parser)** | 深度外刊文化分析 | **导读、拆解、俚语、文化、转化** |

---

## 技术架构

| 层级 | 技术选型 | 说明 |
| :--- | :--- | :--- |
| **运行时** | TypeScript + ts-node | 类型安全与快速开发 |
| **API 集成** | openai (^6.25.0) | OpenAI API 原生客户端 |
| **配置管理** | dotenv (^17.3.1) | 环境变量加载 |
| **类型支持** | @types/node (^25.3.2) | Node.js 类型定义 |

---

## 给 AI 开发者的指令

如果你是正在协助开发此项目的 AI，请遵循以下流程来补充此文档：

### 全库扫描 (Scan & Sync)

1. 每次新增或修改 `.claude/skills/` 下的技能文件后：
   - 读取该技能的 `SKILL.md`
   - 提取 `## Output Format` 章节中的维度定义
   - 更新 README.md 中的"核心模块"表格

2. 检查维度变更原则：
   - 确认每个模块的维度数量（通常为 5 个）
   - 保持维度名称与 SKILL.md 严格一致

### 技术栈自动对齐 (Tech Stack Sync)

读取 `package.json` 并更新"技术架构"章节：

- **dependencies**: 核心运行时依赖
- **devDependencies**: 开发工具链

### 中英文双语补全 (Bilingual Completion)

- 修改 `README.md` 后，**必须**同步更新 `README_EN.md`
- 保持术语一致性（如 "俚语" → "Slang"，"对标" → "Academic Alignment"）

### Shields 徽章动态更新

根据 `package.json` 版本号更新顶部徽章：
- `version` → `img.shields.io/badge/version-X.X.X`

---

## 项目结构

```
toefl-slang-master/
├── .claude/
│   ├── skills/              # 技能指令集（逻辑与代码分离）
│   │   ├── dictionary-pro/  # 深度词典模块
│   │   ├── toefl-writing/   # 托福教练模块
│   │   ├── content-parser/  # 素材拆解模块
│   │   └── skill-creator/   # 技能创建器
│   └── notes/               # 用户笔记存储
├── src/                     # TypeScript 源代码
│   ├── api/client.ts        # OpenAI API 客户端
│   ├── auth/manager.ts      # 鉴权管理
│   └── index.ts             # 入口文件
├── package.json             # 依赖配置
├── tsconfig.json            # TypeScript 配置
└── README.md / README_EN.md # 双语文档
```

---

## 快速开始

```bash
# 安装依赖
npm install

# 运行项目
npm start
```

---

## License

MIT