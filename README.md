# TOEFL Slang Master

> **Bridging the gap between academic TOEFL English and authentic American slang.**
> Extract maximum value from reading materials: boost your scores AND speak like a local.

[English](README.md) | [简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Español](README_es.md) | [Français](README_fr.md) | [Deutsch](README_de.md)

---

## ✨ Core Features

| Scenario | Challenges | Solutions |
| :--- | :--- | :--- |
| **TOEFL Prep** | "gonna" is too informal, but what's the academic alternative? | **Dictionary Pro**: One-click academic register conversion. |
| **Advanced Reading** | Can understand The Economist but can't replicate the style. | **Content Parser**: Extract reusable sentence templates and cultural context. |
| **Writing Bloat** | Low precision words dragging down scores. | **TOEFL Coach**: Precise diagnosis based on official ETS standards. |

---

## 🎯 Modules

### 1. Dictionary Pro
Converts colloquial or vague English into standard academic styles.
*   **Vocabulary Upgrades**: Swap low-precision words for sophisticated academic alternatives.
*   **Contextual Analysis**: Disambiguate terms based on your specific writing context.
*   **Academic Alignment**: Direct mappings between informal and academic counterparts.

### 2. TOEFL Coach
Focuses on academic logic and structural diagnosis for high-stakes writing.
*   **ETS Standards**: Simulated scoring and diagnostic feedback.
*   **Weak Expression Extraction**: Automatically identifies and flags informal language.
*   **Structural Optimization**: Suggestions for analytical transitions and complex sentence structures.

### 3. Content Parser
Analyzes high-quality foreign publications (PDF/MD/TXT) to extract structured learning notes.
*   **Snippet Extraction**: Automatically identifies the most valuable expressions to learn.
*   **Cultural Background**: Connects idioms and slang to their cultural roots.
*   **Standardized Notes**: Outputs formatted markdown and JSON artifacts.

---

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Register global CLI command
npm link

# Initialize local environment (.env)
tsm init
```

### Core Pipelines

```bash
# Workflow 1: Extract expressions from articles to generate flashcards
tsm x pipeline:input --file article.pdf

# Workflow 2: Diagnose writing and generate upgrade cards for Dictionary Pro
tsm x pipeline:output --text "This is a big improvement."
```

### Standalone Commands

```bash
# Direct dictionary lookup
tsm dict "a big deal"

# Standalone writing diagnosis
tsm coach --file ./essay.txt --json

# Standalone content extraction (no AI call)
tsm content --file article.pdf --extract-only
```

### Provider Routing

Use `--provider` for the access gateway/runtime, and `--model` for the hosted model when needed.

```bash
# Official MiniMax direct endpoint
tsm dict "gonna" --provider minimax

# MiniMax hosted on SiliconFlow
tsm dict "gonna" --provider siliconflow-minimax
```

---

## 🧪 Experimental Extensions

Special features accessible via the `tsm x` namespace:

- **Spaced Repetition** (`tsm x review`): SM2-based flashcard memory tests.
- **Daily Challenge** (`tsm x daily`): Randomized quick tests from your saved card bank.
- **Semantic Clustering** (`tsm x cluster`): Graph-based mapping of synonym relationships.
- **Native TTS** (`tsm x speak`): System-engine pronunciation for saved expressions.
- **REPL Mode** (`tsm x repl`): High-efficiency terminal interaction loop.

---

## 💂 Security & Privacy

**API-Only Mode**: This project operates without a centralized server. Your API keys (OpenAI, Gemini, Anthropic, SiliconFlow) and learning data stay entirely on your local machine.
