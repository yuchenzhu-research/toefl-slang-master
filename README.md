# SPARK

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

## 🎬 Studio Mode (Guided Session)

Instead of running standalone commands, you can start a fully guided session:

```bash
spark studio
```

The Studio walks you through six steps interactively:

1. **File selection** — pick any `.pdf`, `.md`, or `.txt` source
2. **Parse preview** — see title, type, char count, and candidate count before committing
3. **Candidate review** — view extracted expressions and choose what to study (`all`, `top 5`, `1,3,5` …)
4. **Learning target** — choose TOEFL Writing, Economist Style, or American Spoken
5. **Card generation** — Dictionary Pro runs on your selected items
6. **Summary** — see what was saved and where

```bash
# Preview the flow without making any API calls
spark studio --dry-run

# Jump straight to a file
spark studio --file ./article.md
```

> [!NOTE]
> Economist Style and American Spoken are currently mapped to the closest internal
> register (`general-academic` and `daily-english` respectively). A dedicated style
> engine for each is not yet implemented. The session will display a note when a
> fallback mapping is applied.

All outputs follow the same discipline as standalone commands (`outputs/dict/`, `outputs/content/`).

---

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Register global CLI command
npm link

# Initialize local environment (.env)
spark init
```

### Core Pipelines

```bash
# Workflow 1: Extract expressions from articles to generate flashcards
spark x pipeline:input --file article.pdf

# Workflow 2: Diagnose writing and generate upgrade cards for Dictionary Pro
spark x pipeline:output --text "This is a big improvement."
```

### Standalone Commands

```bash
# Direct dictionary lookup
spark dict "a big deal"

# Standalone writing diagnosis
spark coach --file ./essay.txt --json

# Standalone content extraction (no AI call)
spark content --file article.pdf --extract-only
```

### Provider Routing

Use `--provider` for the access gateway/runtime, and `--model` for the hosted model when needed.

```bash
# Official MiniMax direct endpoint
spark dict "gonna" --provider minimax

# MiniMax hosted on SiliconFlow
spark dict "gonna" --provider siliconflow-minimax
```

---

## 🧪 Experimental Extensions

Special features accessible via the `spark x` namespace:

- **Spaced Repetition** (`spark x review`): SM2-based flashcard memory tests.
- **Daily Challenge** (`spark x daily`): Randomized quick tests from your saved card bank.
- **Semantic Clustering** (`spark x cluster`): Graph-based mapping of synonym relationships.
- **Native TTS** (`spark x speak`): System-engine pronunciation for saved expressions.
- **REPL Mode** (`spark x repl`): High-efficiency terminal interaction loop.

---

## 💂 Security & Privacy

**API-Only Mode**: This project operates without a centralized server. Your API keys (OpenAI, Gemini, Anthropic, SiliconFlow) and learning data stay entirely on your local machine.
