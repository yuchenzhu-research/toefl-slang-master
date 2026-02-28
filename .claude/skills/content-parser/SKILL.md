---
name: content-parser
description: 内容解析工具，支持 PDF 文本提取、笔记模板生成。集成《经济学人》风格笔记模板，包含 Slang Extraction 和 Academic Transformation 对比栏。
version: 1.0.0
allowed-tools: Read, Write, Bash, Glob, NotebookEdit
---

# Content Parser & Note Generator

内容解析与学术笔记生成工具。

## 功能
1. **PDF 文本提取** (via pdf_helper.py)
2. **经济学人风格笔记模板**
3. **俚语 → 学术转换对照**
4. **托福词汇近义词对比**

## 使用场景
- 用户说 "解析这个 PDF"
- 用户说 "生成笔记模板"
- 用户说 "俚语转学术"
- 用户说 "提取生词"

## 核心流程

### PDF 处理 (pdf_helper.py)
```python
# 核心技术栈
- pypdf / pdfplumber: 文本提取
- re: 正则清理格式
- 编码检测: utf-8/gb2312
```

### 笔���模板结构

## Section 1: Slang Extraction
| 俚语/口语表达 | 地道美式例句 | 使用语境 |
|---|---|---|
| gonna | "I'm gonna go to the store." | 非正式口语 |
| kinda | "It's kinda cool." | 口语缩略 |

## Section 2: Academic Transformation
| 口语表达 | 学术替代表达 | 托福近义词 |
|---|---|---|
| get | obtain, acquire, attain | obtain |
| big | significant, substantial | significant |
| thing | factor, aspect, element | factor |

## Section 3: Vocabulary Notes
| 单词 | 英文释义 | 托福例句 | 近义词 |
|---|---|---|---|
| ubiquitous | present everywhere | Technology is now ubiquitous. | pervasive, omnipresent |

## 示例指令
- "解析这篇经济学人文章并生成笔记"
- "从 PDF 中提取所有口语表达"
- "将以下俚语转化为学术写法"
- "生成对比表格：gonna, kinda, wanna"
