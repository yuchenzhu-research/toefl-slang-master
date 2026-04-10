# TOEFL Slang Master

> **Bridging the gap between academic TOEFL English and authentic American slang.**
> Extract maximum value from reading materials: boost your scores AND speak like a local.

[English](README.md) | [简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Español](README_es.md) | [Français](README_fr.md) | [Deutsch](README_de.md)

---

## ✨ Core Features

| Scenario | Challenges | Solutions |
| :--- | :--- | :--- |
| **TOEFL Prep** | "gonna" is too informal, but what's the academic alternative? | **Dictionary Pro**: One-click academic register conversion. |
| **Advanced Reading** | Can understand The Economist but can't replicate the style. | **Content Parser**: Extract reusable sentence templates. |
| **Writing Bloat** | Low precision words (good, bad, think) dragging down scores. | **TOEFL Coach**: Precise diagnosis and academic alignment. |

---

## 🎯 Modules

### 1. Dictionary Pro
Converts colloquial or vague English into standard academic styles.
* **Capabilities**: Vocabulary upgrades, word disambiguation, near-synonym comparison.
* **Features**: Contextual analysis, frequency stats, and precise academic alignment.

### 2. TOEFL Coach
Focuses on academic logic and structural diagnosis for high-level writing.
* **Capabilities**: ETS-standard simulated scoring, weak expression extraction, and revision suggestions.

### 3. Content Parser
Analyzes foreign publications to extract structured learning notes.
* **Capabilities**: Parses PDF/MD/TXT. Extracts grammar, sentence templates, and cultural context.

---

## 🚀 Quick Start

### Installation

```bash
npm install
npm link
tsm init   # Set up your API Keys (OpenAI, Gemini, Anthropic, etc.)
tsm doctor # Health check
```

### Core Pipelines

```bash
# Workflow 1: Extract phrases from articles to generate flashcards
tsm pipeline:input --file article.pdf

# Workflow 2: Diagnose writing and generate upgrade cards
tsm pipeline:output --text "This is a big improvement."
```

### Standalone Commands

```bash
tsm dict "a big deal"
tsm coach --file ./essay.txt --json
tsm content --file article.pdf --extract-only
```

---

## 🧪 Experimental Extensions

Accessible via `tsm x`:
- **Spaced Repetition** (`tsm x review`): SM2-based flashcard memory tests.
- **Daily Challenge** (`tsm x daily`): Randomized 3-card quick tests.
- **Semantic Clustering** (`tsm x cluster`): Graph-based synonym root mapping.
- **Native TTS** (`tsm x speak`): System-engine pronunciation.

---

## 💂 Security & Privacy

**API-Only Mode**: No centralized server. Your API Keys and data stay on your machine.

---

## 📄 License

MIT License.
