---
name: dictionary-pro
description: 词典增强工具，提供地道美式例句、托福近义词对比、英文释义。专为托福备考和学术写作设计。
version: 1.0.0
allowed-tools: Read, Write, Grep, Glob
---

# Dictionary Pro

专业词典工具，提供地道美式表达、托福近义词对比和学术释义。

## 功能范围
- **地道美式例句**: 提供真实语境的美式表达
- **托福近义词对比**: 同义词等级划分（初级/进阶/高分）
- **英文释义**: 精准的英英释义
- **俚语 → 学术桥接**: 口语化表达的学术替代表达

## 使用场景
- 用户说 "这个单词什么意思"
- 用户说 "gonna 的替代表达"
- 用户说 "给我一个托福高分近义词"
- 用户说 "big 的所有同义词"
- 用户说 "生成对比表格"

## 输出格式

### 单词解析
```markdown
## [单词]
**英文释义**: [韦氏/牛津释义]
**托福等级**: [初级/进阶/高分]

### 地道美式例句
> "例句上下文" — 适用场景

### 托福近义词对比
| 等级 | 词汇 | 难度 |
|---|---|---|
| 初级 | get | ★☆☆ |
| 进阶 | obtain | ★★☆ |
| 高分 | acquire | ★★★ |
```

### 俚语转换
```markdown
##俚语 → 学术对照
| 俚语表达 | 学术替代表达 | 托福词汇等级 |
|---|---|---|
| gonna | intending to | 中级 |
| kinda | somewhat | 中级 |
| big | substantial | 高分 |
```

## 核心词汇库

### 高频口语 → 学术转换
```
get → obtain, acquire, attain
big → substantial, significant, considerable
thing → factor, aspect, element
good → beneficial, advantageous, favorable
bad → detrimental, adverse, unfavorable
get → procure, secure, grasp
pretty → moderately, considerably
awesome → remarkable, exceptional
help → assist, aid, support
```

### 逻辑连接词
```
however → nevertheless, nonetheless
therefore → consequently, hence
also → furthermore, moreover
but → however, yet
so → therefore, thus
```

## 质量标准
- 所有例句来自真实语料库
- 托福近义词按官方评分标准分级
- 学术表达符合 ETS 写作要求