# TOEFL Slang Master

<div align="center">

<!-- Hero Banner -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/TOEFL-Slang%20Master-1.0.0-FF6B6B?logo=tensorflow&logoColor=white&style=for-the-badge">
  <source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/badge/TOEFL-Slang%20Master-1.0.0-FF6B6B?logo=tensorflow&style=for-the-badge">
  <img alt="TOEFL Slang Master" src="https://img.shields.io/badge/TOEFL-Slang%20Master-1.0.0-FF6B6B?logo=tensorflow&style=for-the-badge">
</picture>

> **Bridging the gap between academic TOEFL English and authentic American slang.**
> Powered by Vibe Engineering, extract maximum value from The Economist materials: boost your scores AND speak like a local.

</div>

<div align="center">

<!-- Navigation Links -->
[**📖 中文**](README.md) | [**🇺🇸 English**](README_EN.md) | [**🚀 Quick Start**](#-quick-start) | [**📚 Docs**](https://github.com/yuchenzhu-research/toefl-slang-master)

</div>

<div align="center">

<!-- Badges -->
![Version](https://img.shields.io/badge/version-1.0.0-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Engine](https://img.shields.io/badge/Engine-Multi--Provider-412991)
![License](https://img.shields.io/badge/license-MIT-green)
![Vibe](https://img.shields.io/badge/Philosophy-Vibe%20Engineering-FF69B4)

</div>

---

## ✨ Why TOEFL Slang Master?

Have you ever been stuck in this dilemma?

| Scenario | Pain Point | Solution |
| :--- | :--- | :--- |
| TOEFL Prep | Know "gonna" is informal, but don't know what to replace it with | **Dictionary Pro** one-click academic conversion |
| Reading The Economist | Understand long sentences but can't write them | **Content Parser** templates you can directly apply |
| Writing Score | Don't know the difference between 26 and 20 points | **TOEFL Coach** precise diagnosis & optimization |

> **Core Philosophy**: No compromise — high scores AND authentic speaking.

---

## 🎯 Core Modules

Powered by an OpenClaw-style multi-provider API engine, the project now has three runnable entries:

| Module | Core Purpose | Current Status |
| :--- | :--- | :--- |
| **Dictionary Pro** | Expression-Level Register Conversion | **Runnable now**: CLI, multi-provider API, structured output, repair loop, evaluation |
| **TOEFL Coach** | Pure Academic Logic Diagnosis | **Runnable now**: CLI, multi-provider API, structured output, repair loop |
| **Content Parser** | Deep Foreign Publication Cultural Analysis | **Initial framework runnable**: PDF/MD/TXT ingestion, structured output, CLI |

### Dictionary Pro Example

| Dimension | Content |
| :--- | :--- |
| **Translation** | large, important |
| **Slang** | huge, massive, "a big deal" |
| **Alignment** | substantial, significant, considerable |
| **Frequency** | High (common in TV shows, news, and academic articles) |
| **Analysis** | "This is a **big** decision" — emphasizes importance; "The company saw **substantial** growth" — more formal for TOEFL writing. |

### TOEFL Coach Diagnosis Example

| Dimension | Content |
| :--- | :--- |
| **Score** | 16-19/30. Main issues: basic vocabulary, monotone connectors, simple sentence structures. |
| **Logic** | Connectors are monotonous (because/but/so), suggest upgrading to furthermore, nevertheless, consequently. |
| **Vocabulary** | "good", "bad", "think" are too basic. Replace with beneficial, adverse, contend/argue. |
| **Structure** | 4 simple sentences, 0 clauses, 0 passive. Suggest merging sentences and adding clause structures. |
| **Optimization** | Technology, which has fundamentally transformed communication, offers substantial benefits; however, its adverse effects warrant careful consideration. |

---

## 📌 Current Scope

### Implemented

| Capability | Current Status |
| :--- | :--- |
| **Dictionary Pro CLI query** | Ready to run directly via `npm run dict -- ...` |
| **TOEFL Coach CLI diagnosis** | Ready to run directly via `npm run coach -- ...` |
| **Content Parser initial framework** | Ready to run directly via `npm run content -- ...` |
| **Multi-provider API integration** | OpenClaw-style provider runtime with API-key-based access |
| **Structured output** | JSON contract validation with fixed 5-slot rendering |
| **Auto-repair** | Invalid first-pass output can be retried with validation feedback |
| **Regression evaluation** | `npm run dict:eval` runs case batches and generates reports |
| **Dry run debugging** | Prompt-only mode without sending a real API request |

### Not Implemented Yet

| Capability | Current Status |
| :--- | :--- |
| **PDF OCR / image-only PDFs** | Not supported yet; current framework expects extractable text PDFs |
| **Content Parser chunked deep reading** | Only a single-pass extraction + parsing skeleton exists so far |
| **Web UI or GUI** | Not available yet; the main entry is still CLI |
| **OAuth / Plus-account mode** | Not supported; API-key mode only |
| **General encyclopedic dictionary** | Not the current focus; proper nouns like `Iceland` are only partially supported |
| **Retrieval / corpus layer** | Still mostly model-generated; no external dictionary or corpus retrieval yet |

### What Dictionary Pro Handles Best Right Now

| Input Type | Current Quality |
| :--- | :--- |
| **Slang / informal expressions** | Strong, such as `gonna`, `kinda`, `tons of` |
| **Weak vocabulary upgrades** | Strong, such as `good`, `get`, `big deal` |
| **Near-synonym comparison** | Strong, such as `however vs nevertheless` |
| **Ambiguous words with context** | Usable, such as `cap` and `issue`, especially with a sentence |
| **Proper nouns / places / names** | Limited, such as `Iceland`, because they are still forced into the word-card framework |

---

## 🏗️ Technical Architecture

```
toefl-slang-master/
├── skills/                  # Canonical skills directory
│   └── dictionary-pro/      # Primary Dictionary Pro skill folder
│       ├── SKILL.md         # Skill definition
│       ├── agents/          # UI metadata
│       └── references/      # Output contract and support rules
├── .claude/
│   └── skills/              # Legacy compatibility directory
├── src/                     # TypeScript source code
│   ├── app-cli.ts           # Unified top-level entry (tsm)
│   ├── api/                 # API integration layer
│   │   └── client.ts        # Unified multi-provider client entry
│   ├── auth/                # Authentication management
│   │   └── manager.ts       # OpenClaw-style local config and key resolution
│   ├── providers/           # OpenClaw-style provider runtime
│   │   ├── catalog.ts       # Provider catalog and defaults
│   │   ├── runtime.ts       # Protocol dispatch and execution
│   │   └── protocols/       # OpenAI / Anthropic / Gemini / Ollama adapters
│   ├── content-parser/      # CLI / extractor / prompt / validator / runner
│   ├── dictionary-pro/      # CLI / prompt / validator / runner / evaluation
│   ├── toefl-writing/       # CLI / prompt / validator / runner
│   └── index.ts             # Dictionary Pro standalone entry
├── bin/                     # Global command entrypoints
│   ├── tsm.cjs             # Unified top-level command
│   ├── dictpro.cjs         # Dictionary Pro
│   ├── coachpro.cjs        # TOEFL Coach
│   └── contentpro.cjs      # Content Parser
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript configuration
└── README.md / README_EN.md # Bilingual documentation
```

| Tech Stack | Version | Purpose |
| :--- | :--- | :--- |
| **TypeScript** | ^5.9 | Type safety + rapid development |
| **Provider Runtime** | OpenClaw-style | Multi-provider protocol adapters and unified calls |
| **dotenv** | ^17.3 | Environment variable loading |
| **ts-node** | ^10.9 | Run TypeScript directly |
| **@types/node** | ^25.3 | Node.js type definitions |

---

## 💂 Security Architecture: API-Only Mode, Protecting Your Plus Account

This project uses **OpenClaw-style pure API calling mode**, keeping your Claude API key zero-risk:

```bash
# Config file (.env) example
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
# All requests directly call Anthropic API, no third-party servers involved
# Config files stored only in local ~/.claude/settings/ directory
```

| Security Feature | Description |
| :--- | :--- |
| **Local Config** | API keys stored only in local `~/.claude/settings.json` |
| **No Proxy** | Requests sent directly to Anthropic servers |
| **Transparent** | All code open source, logic fully auditable |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure API key
cp .env.example .env
# Edit .env file and add the provider key you want to use
# e.g. OPENAI_API_KEY / GEMINI_API_KEY / ANTHROPIC_API_KEY

# 3. Run the currently finished features
npm run dict -- --text "gonna"
npm run content -- --file README.md --extract-only
npm run coach -- --text "I think technology is good because it helps us communicate."

# 4. If you want a direct command like openclaw
npm link
dictpro "gonna"
coachpro "I think technology is good because it helps us communicate."
contentpro --file README.md --extract-only
tsm dict "gonna"
```

> **Note**: the runnable product entries right now are `Dictionary Pro`, `TOEFL Coach`, and `Content Parser`. All three share the same multi-provider runtime.

### Dictionary Pro CLI Examples

```bash
# Minimal query (auto mode)
npm run dict -- --text "a big deal"
dictpro "a big deal"

# List supported providers
npm run dict:providers
dictpro providers

# Explicit mode + target scenario
npm run dict -- --text "gonna" --mode conversion --target toefl-writing

# Add context for disambiguation
npm run dict -- --text "cap" --context "The proposal puts a cap on tuition increases."

# Switch provider and model
npm run dict -- --provider google --model gemini-3-pro --text "cap"
npm run dict -- --provider anthropic --model claude-sonnet-4-5 --text "gonna"

# Prompt-only run (no API call)
npm run dict:dry

# Run evaluation cases (requires a valid API key)
npm run dict:eval -- --provider openai --limit 3
dictpro eval --provider openai --limit 3

# Filter by case id and emit JSON report
npm run dict:eval -- --provider anthropic --case DP-003 --json
```

### TOEFL Coach CLI Examples

```bash
# Diagnose a TOEFL writing paragraph
npm run coach -- --text "I think technology is good because it helps us communicate. But it also has some bad effects. So we should use it carefully."
coachpro "I think technology is good because it helps us communicate. But it also has some bad effects. So we should use it carefully."

# Read a file and emit structured JSON
npm run coach -- --file ./essay.txt --json

# Prompt-only run
npm run coach:dry
```

### Recommended CLI Entry Points

```bash
# Register this repo as a local CLI first
npm link

# Unified top-level entry
tsm dict "gonna"
tsm coach "I think technology is good because it helps us communicate."
tsm content --file README.md --extract-only

# Query one slang item and render the fixed word card
dictpro "gonna" --provider openai --mode conversion --target toefl-writing

# Query an ambiguous word with context
dictpro "cap" --provider openai --context "The proposal puts a cap on tuition increases." --mode meaning --target general-academic

# Compare two near-synonyms
dictpro "obtain vs acquire" --provider openai --mode comparison --target toefl-writing

# Run evaluation
dictpro eval --provider openai --limit 3
```

### Content Parser CLI Examples

```bash
# Extraction only, no model call
npm run content -- --file README.md --extract-only
contentpro --file README.md --extract-only

# Read a PDF and generate structured notes
npm run content -- --pdf ./article.pdf --provider openai --focus full

# Prompt-only mode to inspect extracted PDF text before generation
npm run content -- --pdf ./article.pdf --focus syntax --dry-run

# Emit validated JSON
npm run content -- --file README.md --provider openai --json

# List supported providers
contentpro providers
```

**Or use Claude Code to call skills directly:**

```markdown
Please use dictionary-pro skill to query the academic alignment expression for "gonna".

Please use toefl-writing skill to diagnose the following essay...
```

---

## 🤝 Contributing

Issues and Pull Requests are welcome!

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🌟 Testimonials

> "_TOEFL Slang Master boosted my writing score from 22 to 28, and now I can finally understand my coworkers' jokes while reading The Economist._"

<div align="right">— An anonymous test prep student</div>

---

<p align="center">
  <a href="#readme-top">⬆️ Back to top</a>
</p>

<!--
  🤖 AI Developer Instructions: Self-Iteration Protocol

  When skill files in .claude/skills/ are updated, please automatically execute:

  1. Scan updates: Read all SKILL.md files, extract latest 5-dimension output definitions
  2. Sync tables: Update README.md core modules table to match SKILL.md dimensions
  3. Tech stack alignment: Read package.json, update dependency versions in "Technical Architecture"
  4. Bilingual sync: After modifying README.md, must synchronize updates to README_EN.md

  Version History:
  - v1.0.0: Initial release, integrated three core modules
-->
