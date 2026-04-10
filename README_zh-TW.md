# TOEFL Slang Master

> **打破學術英語 (TOEFL) 與道地美式表達 (Slang) 的高牆。**
> 讓《經濟學人》等閱讀素材一魚兩吃：既能提分，又能像 Local 一樣說話。

[English](README.md) | [简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Español](README_es.md) | [Français](README_fr.md) | [Deutsch](README_de.md)

---

## ✨ 核心特性

| 場景 | 痛點 | 解決方案 |
| :--- | :--- | :--- |
| **備考 TOEFL** | 知道 "gonna" 不正式，但不知道替換成什麼 | **Dictionary Pro**：一鍵學術化、語域無縫轉換 |
| **讀《經濟學人》** | 長難句看懂但寫不出來 | **Content Parser**：句式模板直接套用、全方位解構 |
| **寫作評分** | 不知道 20 分和 26 分的差距在哪 | **TOEFL Coach**：精準診斷優化、道地學術對標 |

---

## 🎯 核心模組

### 1. 深度詞典 (Dictionary Pro)
專注於表達級語域轉換，將口語化、隨意或模糊的英語轉換為標準學術風格。
* **功能**：詞彙升級、多義詞消歧、近義詞深度對比。
* **特性**：附帶語境分析、多維頻次統計和精準的中英學術對標。

### 2. 托福教練 (TOEFL Coach)
專注於純學術邏輯與結構診斷，對高階英文寫作提供全面審視。

### 3. 素材拆解 (Content Parser)
專注於深度外刊分析與學習資料抽取。

---

## 🚀 快速開始

### 安裝

```bash
npm install
npm link
tsm init   # 配置 API Key
tsm doctor # 環境體檢
```

### 核心 Pipeline

```bash
# Workflow 1: 從文本/外刊中提取表達並生成詞卡
tsm pipeline:input --file article.pdf

# Workflow 2: 從寫作中診斷弱表達並生成升級詞卡
tsm pipeline:output --text "This is a big improvement."
```

---

## 🧪 實驗性功能

可透過 `tsm x` 訪問：
- **SRS 複習** (`tsm x review`)
- **每日挑戰** (`tsm x daily`)
- **語義聚類** (`tsm x cluster`)
- **原生 TTS** (`tsm x speak`)

---

## 💂 安全隱私

**純 API 模式**：無中心化服務器，你的 API Key 和數據僅留在本地。

---

## 📄 開源協議

MIT License.
