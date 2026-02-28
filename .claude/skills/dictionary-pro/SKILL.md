---
name: dictionary-pro
description: 深度词典工具，专注于提供地道美式俚语与托福学术对标的极简词典模块。输出格式：翻译、俚语、对标、频次、例析 5 维度表格。
version: 2.0.0
allowed-tools: Read, Write, Grep, Glob
---

# 深度词典 (Dictionary Pro)

专注于提供地道美式俚语与托福学术对标的极简词典模块。

## When to Use

- 用户输入单词或短语查询含义
- 用户请求"俚语转学术"对照
- 用户要求"托福近义词"
- 用户需要"生成对比表格"
- 用户说"这个单词什么意思"或"gonna 的替代表达"

## Instructions

当用户输入单词或短语时，识别其在当前语境（如有）下的含义，并按照规定的表格格式进行响应。确保内容准确对标托福学术规范与美式地道口语表达。

## Output Format

请使用 Markdown 表格输出以下五个维度：

| 维度 | 内容说明 |
| --- | --- |
| **翻译** | 最符合当前语境的中文含义。 |
| **俚语** | 对应的美式地道俚语或非正式口语表达。 |
| **对标** | 对应的托福 (TOEFL) 高阶学术词汇或表达。 |
| **频次** | 该词在美剧、外刊（如《经济学人》）或新闻中的出现频率（如：高/中/低）及典型出处。 |
| **例析** | 提供地道例句并进行解析，说明其用法细节。 |

## Rules

1. **真实对标**：确保"对标"栏目中的词汇符合托福学术写作或阅读的难度要求。
2. **语境优先**：如果用户提供了上下文，所有的翻译和例析必须紧扣该语境。
3. **内容详实**：在"例析"部分，除了例句，可以增加对词汇背后细微语感差异的说明。

## 核心词汇速查

### 高频口语 → 学术转换
| 口语 | 学术对标 | 托福等级 |
|---|---|---|
| get | obtain, acquire, attain | 高分 |
| big | substantial, significant, considerable | 高分 |
| thing | factor, aspect, element | 进阶 |
| good | beneficial, advantageous, favorable | 高分 |
| bad | detrimental, adverse, unfavorable | 高分 |
| pretty | moderately, considerably | 进阶 |
| awesome | remarkable, exceptional | 高分 |
| help | assist, aid, support | 进阶 |
| gonna | intending to, about to | 中级 |
| kinda | somewhat, rather | 中级 |
| wanna | desire to, wish to | 中级 |

### 逻辑连接词
| 基础 | 托福对标 |
|---|---|
| however | nevertheless, nonetheless |
| therefore | consequently, hence |
| also | furthermore, moreover |
| but | however, yet |
| so | therefore, thus |

## 示例输出

**输入**: "big"

| 维度 | 内容 |
|---|---|
| **翻译** | 大的、重要的 |
| **俚语** | huge, massive, "a big deal" |
| **对标** | substantial, significant, considerable |
| **频次** | 高（美剧、新闻、学术文章均常见） |
| **例析** | "This is a **big** decision" — 强调重要性；"The company saw **substantial** growth" — 正式书面语更适合托福写作。 |

**输入**: "gonna"

| 维度 | 内容 |
|---|---|
| **翻译** | 将要、打算 |
| **俚语** | gonna, gonna be, "I'm gonna go" |
| **对标** | intending to, about to, going to |
| **频次** | 高（美剧《老友记》《生活大爆炸》极常见） |
| **例析** | "I'm **gonna** go to the store" — 非正式口语；"The company is **about to** announce the results" — 正式场合使用。托福写作中避免使用 gonna。 |