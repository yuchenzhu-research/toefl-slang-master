# TOEFL Slang Master

> **Briser le mur entre l'anglais académique (TOEFL) et l'argot authentique (Slang).**
> Maximisez l'efficacité de vos lectures : boostez votre score ET parlez comme un nativo.

[English](README.md) | [简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Español](README_es.md) | [Français](README_fr.md) | [Deutsch](README_de.md)

---

## ✨ Caractéristiques Principales

| Scénario | Défis | Solutions |
| :--- | :--- | :--- |
| **Préparation TOEFL** | "gonna" est familier, quelle est l'alternative académique ? | **Dictionary Pro** : Conversion de registre académique. |
| **Lecture Avancée** | Je comprends The Economist mais je n'arrive pas à répliquer le style. | **Content Parser** : Extraction de modèles de phrases. |
| **Écriture** | Le vocabulaire imprécis (good, bad) fait baisser votre score. | **TOEFL Coach** : Diagnostic et alignement académique. |

---

## 🎯 Modules

### 1. Dictionary Pro
Transforme l'anglais familier ou vague en styles académiques standards.

### 2. TOEFL Coach
Accent sur la logique académique et le diagnostic structurel pour l'écriture de haut niveau.

### 3. Content Parser
Analyse les publications étrangères pour extraire des notes d'apprentissage structurées.

---

## 🚀 Démarrage Rapide

### Installation

```bash
npm install
npm link
tsm init   # Configurez vos clés API (OpenAI, Gemini, Anthropic, etc.)
tsm doctor # Vérification de santé
```

### Pipelines Principaux

```bash
# Workflow 1 : Extraire des phrases d'articles et générer des cartes
tsm pipeline:input --file article.pdf

# Workflow 2 : Diagnostiquer l'écriture et générer des cartes d'amélioration
tsm pipeline:output --text "This is a big improvement."
```

---

## 🧪 Extensions Expérimentales

Accessibles via `tsm x` :
- **Répétition Espacée** (`tsm x review`)
- **Défi Quotidien** (`tsm x daily`)
- **Clustering Sémantique** (`tsm x cluster`)
- **TTS Natif** (`tsm x speak`)

---

## 💂 Sécurité et Confidentialité

**Mode API Uniquement** : Pas de serveur central. Vos clés API et vos données restent sur votre machine.

---

## 📄 Licence

MIT License.
