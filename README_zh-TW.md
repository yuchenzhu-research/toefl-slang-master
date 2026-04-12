# TOEFL Slang Master

> **打破學術英語 (TOEFL) 與道地美式表達 (Slang) 的高牆。**
> 讓《經濟學人》等閱讀素材一魚兩吃：既能提分，又能像 Local 一樣說話。

[English](README.md) | [简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Español](README_es.md) | [Français](README_fr.md) | [Deutsch](README_de.md)

---

## ✨ 核心特性

| 場景 | 痛點 | 解決方案 |
| :--- | :--- | :--- |
| **備考 TOEFL** | 知道 "gonna" 不正式，但不知道替換成什麼 | **Dictionary Pro**：一鍵學術化、語域無縫轉換 |
| **讀《經濟學人》** | 長難句看懂但寫不出來 | **Content Parser**：句式模板直接套用、背景全方位解構 |
| **寫作評分** | 不知道 20 分和 26 點的差距在哪 | **TOEFL Coach**：基於官方標準精準診斷優化 |

---

## 🎯 核心模組

### 1. 深度詞典 (Dictionary Pro)
專注於表達級語域轉換，將口語化、隨意或模糊的英語轉換為標準學術風格。
*   **詞彙升級**：將低階詞彙精準替換為更高級的學術對標表達。
*   **語境分析**：基於特定寫作上下文進行消歧，確保用詞準確。
*   **學術對標**：直接建立非正式表達與學術表達之間的穩定映射。

### 2. 托福教練 (TOEFL Coach)
專注於純學術邏輯與結構診斷，對高階英文寫作提供全面審視。
*   **官方標準**：基於 ETS 標準的模擬評分與診斷回饋。
*   **弱表達提取**：自動識別並標記寫作中的非正式用詞。
*   **結構優化**：引導使用分析性的學術過渡詞與複雜句式。

### 3. 素材拆解 (Content Parser)
專注於深度外刊分析與學習資料抽取。
*   **素材提煉**：自動識別高價值語法點、句式模板和文化背景。
*   **結構化筆記**：解析 PDF/MD/TXT 素材，生成標準的學習單元。

---

## 🚀 快速開始

### 安裝

```bash
# 安裝依賴
npm install

# 註冊全域 CLI 指令
npm link

# 初始化本地環境 (.env)
tsm init
```

### 核心 Pipeline

```bash
# 工作流 1：從材料中提取表達並生成詞卡
tsm x pipeline:input --file article.pdf

# 工作流 2：診斷寫作中的弱表達並生成對應的升級詞卡
tsm x pipeline:output --text "This is a big improvement."
```

### Provider 路由說明

`--provider` 表示接入網關 / provider runtime，`--model` 才是具體模型 ID。

```bash
# 官方 MiniMax 直連
tsm dict "gonna" --provider minimax

# 透過 SiliconFlow 承載的 MiniMax
tsm dict "gonna" --provider siliconflow-minimax
```

---

## 🧪 實驗性擴展功能

可透過 `tsm x` 訪問的極客能力：

- **SRS 間隔複習** (`tsm x review`)
- **每日挑戰** (`tsm x daily`)
- **語義聚類** (`tsm x cluster`)
- **原生 TTS** (`tsm x speak`)
- **命令行 REPL** (`tsm x repl`)

---

## 💂 安全隱私

**純 API 模式**：本工具不設中心化伺服器。你的 API Key (OpenAI, Gemini, Anthropic, SiliconFlow) 和所有學習數據均嚴格保留在你的本地機器上。
