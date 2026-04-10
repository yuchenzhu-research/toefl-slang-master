# Connectors Layer

该目录存放连接不同独立模块的工作流适配器。

**核心准则**：
1. 不要让模块本身（如 `TOEFL Coach`）直接去调另一个模块（如 `Dictionary Pro`）。
2. `Connector` 负责解耦，充当“搬运工”。
3. `Connector` 负责把一个模块产生的领域对象（如 `WeakExpressionSet`）转化为另一个模块所需的种子对象（如 `ExpressionCardSeed`）。

## 当前 Connector

- `coach-to-dict`: 接收来自写作评估的弱表达集合，将其转化为表达卡片种子，从而打通输入到复习卡片的闭环。
