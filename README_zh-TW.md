# SPARK

> **打破學術英語 (TOEFL) 與道地美式表達 (Slang) 的高牆。**
> 讓《經濟學人》等閱讀素材一魚兩吃：既能提分，又能像 Local 一樣說話。

[English](README.md) | [简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md) | [日本語](docs/locales/README_ja.md) | [한국어](docs/locales/README_ko.md) | [Español](docs/locales/README_es.md) | [Français](docs/locales/README_fr.md) | [Deutsch](docs/locales/README_de.md)

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
*   **語料閉環**：自動輸出下游模組可直接消費的表達候選池。

---

## 🎬 Studio 引導模式

直接啟動 SPARK Studio 終端：

```bash
spark studio
```

Studio 當前以**交互式 TUI（終端 UI）**運行。輸入任意單詞或表達，Dictionary Pro 會即時查詢並返回結果。按 `Ctrl+C` 退出。

```bash
spark studio --dry-run   # 不調用 API，僅預覽界面佈局
```

> [!NOTE]
> 完整的引導式 pipeline（文件選擇 → 解析預覽 → 候選篩選 → 詞卡生成）
> 正在開發中（WIP）。當前 TUI 專注於 Dictionary Pro 查詞功能。
> `/coach` 和 `/content` 的集成將在後續版本中加入。

## 🖥️ 前端可接入的後端 API

啟動本地後端 API，供 Google Antigravity 等前端調用：

```bash
spark web --port 4173
```

目前後端接口：

- `GET /api/health`
- `POST /api/dict/lookup`：Dictionary Pro 查詞，返回俚語/語域資訊和學術對照；預設 `dryRun: true`
- `POST /api/style/economist`：確定性的 Economist 風格特徵分析

## 🖼️ 桌面端應用

Electron 前端位於 `apps/desktop`，作為 npm workspace 管理。根 `package.json` 仍是倉庫 scripts 與依賴入口的權威來源。

```bash
npm run desktop:dev
npm run desktop:build
```

前端架構與演進規則見 `docs/frontend.md`。

## 🧠 Economist 風格分析

第一版風格引擎已支援 Economist-like 分析：

```bash
spark style --text "Although markets may adapt, regulation can distort incentives."
```

這仍是**風格特徵分析**，不是完整語料訓練的仿寫引擎。當前會檢查句長節奏、轉折、因果鏈、hedging、經濟/政策詞彙和壓縮式標點。

---

## 🚀 快速開始

### 安裝

```bash
# 安裝依賴
npm install

# 註冊全域 CLI 指令
npm link

# 初始化本地環境 (.env)
spark init
```

### 核心 Pipeline

```bash
# 工作流 1：從材料中提取表達並生成詞卡
spark x pipeline:input --file article.pdf

# 工作流 2：診斷寫作中的弱表達並生成對應的升級詞卡
spark x pipeline:output --text "This is a big improvement."

# 不調用 API，僅預覽 pipeline 執行計畫
spark x pipeline:input --file article.md --dry-run
spark x pipeline:output --text "I think technology is good." --dry-run
```

### 原子模組獨立調用

```bash
# 直接查詞
spark dict "a big deal"

# 獨立寫作診斷
spark coach --file ./essay.txt --json

# 獨立素材提取（不調用 AI）
spark content --file article.pdf --extract-only
```

### Provider 路由說明

`--provider` 表示接入網關 / provider runtime，`--model` 才是具體模型 ID。

```bash
# 官方 MiniMax 直連
spark dict "gonna" --provider minimax

# 透過 SiliconFlow 承載的 MiniMax
spark dict "gonna" --provider siliconflow-minimax
```

---

## 🧪 實驗性擴展功能

可透過 `spark x` 訪問的極客能力：

- **SRS 間隔複習** (`spark x review`)：基於 SM2 算法的閃卡記憶測試。
- **每日挑戰** (`spark x daily`)：從你的庫中隨機抽取 3 張卡片進行碎片化快測。
- **語義聚類** (`spark x cluster`)：基於圖算法將你的詞卡網自動編織為同源義群。
- **原生 TTS** (`spark x speak`)：調用系統語音引擎精準朗讀單詞與例句。
- **命令行 REPL** (`spark x repl`)：高效率連續發問不斷流。

---

## 🧭 治理文件入口

如需了解專案治理與維護，請優先閱讀：

- `CONSTITUTION.md`：最高治理文件，定義專案身份、不變量、架構守衛與品質門禁。
- `AGENTS.md`：共享 cross-agent 手冊，定義讀取順序、執行流程、驗證基線與文件同步紀律。
- `MANUAL.md`：維護者手冊，記錄倉庫結構、維護檢查清單與已知限制。

---

## 💂 安全與隱私

**純 API 模式**：本工具不設中心化伺服器。你的 API Key (OpenAI, Gemini, Anthropic, SiliconFlow) 和所有學習數據均嚴格保留在你的本地機器上。
