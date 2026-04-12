# Connectors Layer

该目录存放连接不同独立模块的工作流适配器。

**核心准则**：
1. 不要让模块本身（如 `TOEFL Coach`）直接去调另一个模块（如 `Dictionary Pro`）。
2. `Connector` 负责解耦，充当“搬运工”。
3. `Connector` 负责把一个模块产生的领域对象（如 `WeakExpressionSet`）转化为另一个模块所需的种子对象（如 `ExpressionCardSeed`）。

## 当前 Connector

- `coach-to-dict`: 接收来自写作评估的弱表达集合（`WeakExpressionSet`），将其转化为表达卡片种子（`ExpressionCardSeed`）。
- `content-to-dict`: 接收来自内容解析的候选表达（`ExpressionCandidates`），将其映射为表达卡片种子，供 Dictionary Pro 消费。
- `dict-to-card`: 接收 Dictionary Pro 的结构化输出（`DictionaryProStructuredResponse`），将其展平为稳定的 `ExpressionCard` 合约对象。

## 使用方式

统一出口通过 namespace 导出，避免同名函数冲突：

```ts
import { coachToDictConnector, contentToDictConnector, dictToCardConnector } from "../connectors";
```
