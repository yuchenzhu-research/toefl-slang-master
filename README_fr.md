# SPARK

> **Briser le mur entre l'anglais académique (TOEFL) et l'argot authentique (Slang).**
> Maximisez l'efficacité de vos lectures : boostez votre score ET parlez comme un nativo.

[English](README.md) | [简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Español](README_es.md) | [Français](README_fr.md) | [Deutsch](README_de.md)

---

## ✨ Caractéristiques Principales

| Scénario | Défis | Solutions |
| :--- | :--- | :--- |
| **Préparation TOEFL** | "gonna" est familier, quelle est l'alternative académique ? | **Dictionary Pro** : Conversion de registre académique. |
| **Lecture Avancée** | Je comprends The Economist mais je n'arrive pas à répliquer le style. | **Content Parser** : Extraction de modèles de phrases. |
| **Écriture** | Le vocabulaire imprécis fait baisser votre score. | **TOEFL Coach** : Diagnostic et alignement académique basés sur les standards ETS. |

---

## 🎯 Modules

### 1. Dictionary Pro
Transforme l'anglais familier ou vague en styles académiques standards.
*   **Amélioration du Vocabulaire** : Remplacez les mots imprécis par des alternatives académiques sophistiquées.
*   **Alignement Académique** : Correspondance directe entre expressions informelles et académiques.

### 2. TOEFL Coach
Accent sur la logique académique et le diagnostic structurel pour l'écriture de haut niveau.
*   **Standards ETS** : Scoring simulé et retours diagnostiques.
*   **Extraction d'Expressions Faibles** : Identifie automatiquement le langage informel.

### 3. Content Parser
Analyse les publications étrangères pour extraire des notes d'apprentissage structurées.
*   **Extraction de Fragments** : Identifie les expressions les plus précieuses.
*   **Notes Structurées** : Génère des artefacts en Markdown et JSON.

---

## 🚀 Démarrage Rapide

### Installation

```bash
# Installer les dépendances
npm install

# Enregistrer la commande CLI globale
npm link

# Initialiser l'environnement local (.env)
spark init
```

### Pipelines Principaux

```bash
# Workflow 1 : Extraire des phrases d'articles et générer des cartes
spark pipeline:input --file article.pdf

# Workflow 2 : Diagnostiquer l'écriture et générer des cartes d'amélioration
spark pipeline:output --text "This is a big improvement."
```

---

## 🧪 Extensions Expérimentales

Accessibles via `spark x` :
- **Répétition Espacée** (`spark x review`)
- **Défi Quotidien** (`spark x daily`)
- **Clustering Sémantique** (`spark x cluster`)
- **TTS Nativo** (`spark x speak`)
- **Mode REPL** (`spark x repl`)

---

## 💂 Sécurité et Confidentialité

**Mode API Uniquement** : Pas de serveur central. Vos clés API et vos données restent sur votre machine locale.
