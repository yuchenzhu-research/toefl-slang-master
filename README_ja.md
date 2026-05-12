# SPARK

> **アカデミックな英語（TOEFL）と本場のアメリカ英語（Slang）の壁を打ち破る。**
> 『エコノミスト』などの素材をフル活用。スコアアップとネイティブのような表現力、どちらも妥協しない！

[English](README.md) | [简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Español](README_es.md) | [Français](README_fr.md) | [Deutsch](README_de.md)

---

## ✨ 主な機能

| シーン | 課題 | 解決策 |
| :--- | :--- | :--- |
| **TOEFL対策** | "gonna" がカジュアル過ぎるが、何に置き換えればいいかわからない | **Dictionary Pro**: アカデミックな表現に一括変換 |
| **海外記事読解** | 内容はわかるが、自分では書けない | **Content Parser**: そのまま使える構文テンプレートを抽出 |
| **ライティング** | 20点と26点の違いがどこにあるかわからない | **TOEFL Coach**: 的確な診断と最適化の提案 |

---

## 🎯 核心モジュール

### 1. Dictionary Pro
表現レベルでの文体シフトに特化。口語をアカデミックな表現に変換。
*   **語彙のアップグレード**：初歩的な単語を洗練されたアカデミックな表現に置換。
*   **文脈分析**：特定の文脈に基づいて多義語の曖昧さを解消。
*   **アカデミック・アライメント**：非正規な表現と標準的なアカデミック表現を直接マッピング。

### 2. TOEFL Coach
学術的な論理と構成の診断に焦点を当てたライティングレビュー。
*   **公式基準**：ETS基準に基づく模擬スコアリングとフィードバック。
*   **弱点表現の抽出**：作文内のインフォーマルな表現を自動検出。
*   **構成の最適化**：分析的なアカデミックな遷移語や複雑な文式の使用をガイド。

### 3. Content Parser
海外出版物や学習資料の深い分析。
*   **素材の抽出**：価値の高い文法、構文テンプレート、文化的背景を特定。
*   **構造化ノート**：PDF/MD/TXTを解析し、学習ユニットを生成。
*   **語彙のループ**：後続モジュールで直接利用可能な表現候補を自動出力。

---

## 🎬 Studio 導入モード

SPARK Studio ターミナルを直接起動：

```bash
spark studio
```

Studio は現在、**対話型 TUI (Terminal UI)** として動作します。単語や表現を入力すると、Dictionary Pro がリアルタイムで検索結果を返します。`Ctrl+C` で終了します。

```bash
spark studio --dry-run   # APIを呼び出さず、レイアウトのみプレビュー
```

> [!NOTE]
> 完全なガイド付きパイプライン（ファイル選択 → 解析プレビュー → 候補選択 → カード生成）は
> **開発中 (WIP)** です。現在の TUI は Dictionary Pro の検索機能に焦点を当てています。
> `/coach` と `/content` の統合は今後のリリースで追加予定です。

## 🖥️ フロントエンド向け Backend API

Google Antigravity などの外部フロントエンド向けにローカル API を起動します。

```bash
spark web --port 4173
```

現在のエンドポイント：

- `GET /api/health`
- `POST /api/dict/lookup` — slang/レジスター情報とアカデミック対照を返す Dictionary Pro API。既定は `dryRun: true`
- `POST /api/style/economist` — Economist 風の特徴を決定的に分析

## 🧠 Economist Style Analysis

第一弾のスタイルエンジンは Economist-like な分析をサポートしています：

```bash
spark style --text "Although markets may adapt, regulation can distort incentives."
```

これは**特徴分析**であり、コーパス学習済みの完全な模倣エンジンではありません。文の長さのリズム、転換点、因果関係、ヘッジング、経済/政策用語、圧縮された句読点などをチェックします。

---

## 🚀 クイックスタート

### インストール

```bash
# 依存関係のインストール
npm install

# グローバルCLIコマンドの登録
npm link

# ローカル環境の初期化 (.env)
spark init
```

### 核心 Pipeline

```bash
# Workflow 1: 記事から表現を抽出し、単語カードを自動生成
spark x pipeline:input --file article.pdf

# Workflow 2: 作文を診断し、アップグレードカードを生成
spark x pipeline:output --text "This is a big improvement."

# API呼び出しなしでプレビュー
spark x pipeline:input --file article.md --dry-run
spark x pipeline:output --text "I think technology is good." --dry-run
```

### 原子モジュールの個別呼び出し

```bash
# 直接検索
spark dict "a big deal"

# ライティング診断
spark coach --file ./essay.txt --json

# 素材抽出（AI呼び出しなし）
spark content --file article.pdf --extract-only
```

### Provider ルーティング

`--provider` はアクセスゲートウェイ / ランタイム、`--model` は具体的なモデル ID を指します。

```bash
# MiniMax 公式直連
spark dict "gonna" --provider minimax

# SiliconFlow 経由の MiniMax
spark dict "gonna" --provider siliconflow-minimax
```

---

## 🧪 実験的な機能

`spark x` 名前空間でアクセス可能な高度な機能：

- **SRS 復習** (`spark x review`)：SM2アルゴリズムに基づくフラッシュカード記憶テスト。
- **デイリーチャレンジ** (`spark x daily`)：保存されたカードバンクからランダムに3枚をクイックテスト。
- **意味のクラスタリング** (`spark x cluster`)：グラフアルゴリズムを用いて類義語関係を自動マップ。
- **ネイティブ音声** (`spark x speak`)：システムエンジンによる保存済み表現の読み上げ。
- **REPLモード** (`spark x repl`)：効率的な対話ループ。

---

## 🧭 ガバナンス文書

プロジェクトのガバナンスと保守については、まず以下を確認してください。

- `CONSTITUTION.md`：プロジェクトのアイデンティティ、不変条件、アーキテクチャ上のガードレール、品質ゲートを定義する最上位ガバナンス文書。
- `AGENTS.md`：読み順、実行フロー、検証ベースライン、ドキュメント同期規律を定義する共有 cross-agent ハンドブック。
- `MANUAL.md`：リポジトリ構成、運用チェックリスト、既知の制約をまとめたメンテナ向け手引き。

---

## 💂 セキュリティとプライバシー

**完全APIモード**: 本プロジェクトは中央サーバーなしで動作します。APIキー（OpenAI, Gemini, Anthropic, SiliconFlow）と学習データはすべてローカルに保存されます。
