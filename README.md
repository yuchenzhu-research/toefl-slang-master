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

Instead of running standalone commands, you can launch the SPARK Studio terminal:

```bash
spark studio
```

Studio currently runs as an **interactive TUI (Terminal UI)**. Type any word or expression and Dictionary Pro will look it up in real time. Press `Ctrl+C` to exit.

```bash
spark studio --dry-run   # launch without making API calls (layout preview)
```

> [!NOTE]
> The full guided pipeline (file selection → parse preview → candidate review → card generation)
> is **work in progress**. The current TUI focuses on Dictionary Pro lookups.
> `/coach` and `/content` integrations will be added in a future release.

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

## 🧭 Governance Docs

For project governance and maintenance, start here:

- `CONSTITUTION.md`: highest governance file for project identity, invariants, architecture guardrails, and quality gates.
- `AGENTS.md`: shared cross-agent handbook for read order, execution workflow, verification baseline, and documentation sync discipline.
- `MANUAL.md`: maintainer handbook for repo structure, operational checklists, and known limitations.

---

## 💂 Security & Privacy

**API-Only Mode**: This project operates without a centralized server. Your API keys (OpenAI, Gemini, Anthropic, SiliconFlow) and learning data stay entirely on your local machine.
