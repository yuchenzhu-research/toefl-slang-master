# TOEFL Slang Master

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

### 2. TOEFL Coach
学術的な論理と構成の診断に焦点を当てたライティングレビュー。

### 3. Content Parser
海外出版物や学習資料の深い分析。

---

## 🚀 クイックスタート

### インストール

```bash
npm install
npm link
tsm init   # APIキーの設定 (OpenAI, Gemini, Anthropic等に対応)
tsm doctor # 環境チェック
```

### 核心 Pipeline

```bash
# Workflow 1: 記事から表現を抽出し、単語カードを自動生成
tsm pipeline:input --file article.pdf

# Workflow 2: 作文を診断し、アップグレードカードを生成
tsm pipeline:output --text "This is a big improvement."
```

---

## 🧪 実験的な機能

`tsm x` コマンドでアクセス可能：
- **SRS 復習** (`tsm x review`)
- **デイリーチャレンジ** (`tsm x daily`)
- **意味のクラスタリング** (`tsm x cluster`)
- **ネイティブ音声** (`tsm x speak`)

---

## 💂 セキュリティとプライバシー

**完全APIモード**: 中央サーバーなし。APIキーとデータはすべてローカルに保存されます。

---

## 📄 ライセンス

MIT License.
