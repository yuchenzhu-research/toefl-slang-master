---
name: content-parser
description: 素材拆解工具，支持 PDF/MD 外刊深度解析。输出 5 维度笔记：导读/拆解/俚语/文化/转化。长难句语法分析 + 美式文化背景关联。
version: 2.0.0
allowed-tools: Read, Write, Bash, Glob, NotebookEdit
---

# 素材拆解 (Content Parser)

支持处理 PDF/MD 素材，深度拆解外刊长难句，并解析美式俚语与文化背景。

## When to Use

- 用户提供素材（文件路径或文本内容）请求解析
- 用户说 "解析这个 PDF"、"拆解这篇文章"
- 用户要求 "长难句分析"、"俚语提取"
- 用户需要 "文化背景介绍"、"素材笔记生成"
- 用户说 "经济学人解析"、"美国文化背景"

## Instructions

当用户提供素材（文件路径或文本内容）时，调用相关工具提取文字，并进行深度解析。重点在于识别地道表达、拆解学术句式并关联美国文化背景。

## Output Format

请使用 Markdown 表格输出以下五个维度：

| 维度 | 内容说明 |
| :--- | :--- |
| **导读** | 简要概述素材的主题、立场及作者的修辞意图。 |
| **拆解** | 选取文中的长难句进行语法结构分析，指出可借鉴的托福写作句式。 |
| **俚语** | 提取文中的地道短语或俚语，并解释其在美式口语中的实际语感。 |
| **文化** | 介绍素材涉及的美国社会常识、历史背景、法律或流行文化细节。 |
| **转化** | 将文中的俚语表达转化为对应的托福学术表达，实现素材的"双向内化"。 |

## Rules

1. **深度优先**：内容不受字数限制，以解析清楚文化内涵和语法细节为准。
2. **工具联动**：如果输入是 PDF，需引导用户或自动调用 `pdf_helper.py` 进行文本提取。
3. **格式兼容**：输出的笔记应方便用户直接复制到 GitHub 的 MD 文档中长期存储。

## PDF 处理

### 使用 pdf_helper.py
```bash
# 安装依赖
pip install pypdf pdfplumber

# 提取 PDF 文本
python .Codex/skills/content-parser/pdf_helper.py <pdf文件路径>

# 输出笔记模板
python .Codex/skills/content-parser/pdf_helper.py <pdf文件路径> --template
```

### 核心技术栈
- **pypdf / pdfplumber**: PDF 文本提取
- **re (正则)**: 清理格式，分句分段
- **编码检测**: utf-8/gb2312 自动识别

## 核心解析规则

### 1. 导读要点
- 提炼文章核心论点
- 识别作者立场（支持/反对/中立）
- 分析修辞手法（类比、排比、反讽）
- 评估素材难度等级（初级/进阶/高阶）

### 2. 长难句拆解
**分析维度**：
- 主谓结构识别
- 从句类型（定语/状语/名词性）
- 分词结构（现在分词/过去分词）
- 倒装句识别
- 固定搭配提取

**句式模板**：
```
[Original Sentence]

[Grammar Analysis]
- 主句主语: S1
- 主句谓语: V1
-从句类型: Noun/Adj/Adv Clause
- 高级结构: Participle / Inversion

[TOEFL Writing Template]
Similar structure can be used for: X type of arguments
```

### 3. 俚语提取
| 俚语 | 字面含义 | 实际语感 | 适用场景 |
|---|---|---|---|
| gonna | going to | 计划、确定会发生 | 非正式口语 |
| kinda | kind of | 有点、某种程度上 | 委婉表达 |
| pro/con | professional/contrary | 优缺点分析 | 讨论常用 |
| perks | benefits | 额外福利 | 职场话题 |

### 4. 美国文化背景
**常见话题**：
- American Dream（美国梦）≈ "成功叙事"
- First Amendment（第一修正案）≈ 言论自由
- Ivy League（常春藤）≈ 精英教育
- Medicare/Medicaid ≈ 医疗保险制度
- Red State / Blue State ≈ 政治立场
- Suburbia ≈ 郊区中产阶级生活方式

### 5. 俚语 → 学术转化
| 原文俚语 | 托福学术表达 | 适用场景 |
|---|---|---|
| big deal | significant/imperative | 强调重要性 |
| get | obtain/acquire/grasp | 正式获得 |
| tons of | a substantial number of | 强调数量 |
| mess up | complicate/vitiate | 搞砸/损害 |
| flip out | react passionately | 强烈反应 |
| beat around the bush | sidestep the issue | 回避问题 |

## 示例输出

**输入**: 一篇关于美国医疗体系的《经济学人》文章

| 维度 | 内容 |
| :--- | :--- |
| **导读** | 文章聚焦美国医疗费用高涨问题，指出 Medicare 与 Medicaid 的财政困境。作者采用数据驱动论证，立场偏向改革派，修辞上通过对比其他发达国家医疗体系来强化论点。难度等级：进阶。 |
| **拆解** | **原句**: "The Medicare program, which was originally designed to provide health coverage for elderly Americans, has evolved into an unsustainable fiscal burden that threatens to devour an increasingly large share of the federal budget." <br><br> **分析**: <br> - 主句主语: The Medicare program <br> - 主句谓语: has evolved into <br> - 定语从句: which was originally designed... <br> - 高级结构: 现在分词 threatening... <br><br> **TOEFL 模板**: "X, which was originally designed to Y, has evolved into Z that threatens to..." 适用于论述政策变迁的负面后果。 |
| **俚语** | **on the hook** (被套牢): "Hospitals are on the hook for unpaid bills." — 指医院被迫承担未付账单，有一种被束缚、无法脱身的语感。 |
| **文化** | **Medicare & Medicaid**: 1965 年林登·约翰逊总统签署建立。Medicare 面向 65+ 老年人，Medicaid 面向低收入群体。两者是美国社会保障体系的核心组成部分，也是历年政治辩论的焦点。"Medicare for All"（全民医保）是近年来热门政治话题。 |
| **转化** | - "on the hook" → "held accountable for" 或 "burdened with" <br> - "fork over" (支付) → "allocate" 或 "disburse" <br> - "messy" (混乱的) → "complicated and fragmented" |

## GitHub MD 格式兼容

输出笔记应直接支持 GitHub Flavored Markdown：

```markdown
# 素材拆解笔记: [标题]

## 导读
[概述]

## 拆解
### 长难句
> 原文
...
```

这样用户可以直接复制到项目的 `.Codex/notes/` 目录长期存储。