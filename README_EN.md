# TOEFL Slang Master

[![Version](https://img.shields.io/badge/version-1.0.0-orange)](https://github.com/yuchenzhu-research/toefl-slang-master)
[![Language](https://img.shields.io/badge/language-TypeScript-blue)](https://www.typescriptlang.org/)
[![Vibe](https://img.shields.io/badge/Philosophy-Vibe%20Engineering-FF69B4)](https://github.com/yuchenzhu-research/toefl-slang-master)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

[**中文**](README.md) | **English**

> **Bridging the gap between academic TOEFL English and authentic American slang.**
> Powered by Vibe Engineering, extract maximum value from The Economist materials: boost your scores AND speak like a local.

---

## Core Modules

Driven by the API engine extracted from the **OpenClaw** architecture, this project implements three core functions through instruction sets in the `.claude/skills/` directory:

| Module | Core Purpose | Key Dimensions (5-Output) |
| :--- | :--- | :--- |
| **Dictionary Pro** | Minimalist Bidirectional Alignment | **Translation, Slang, Alignment, Frequency, Analysis** |
| **TOEFL Coach** | Pure Academic Logic Diagnosis | **Score, Logic, Vocabulary, Structure, Optimization** |
| **Content Parser** | Deep Foreign Publication Cultural Analysis | **Overview, Breakdown, Slang, Culture, Conversion** |

---

## Technical Architecture

| Layer | Technology Stack | Description |
| :--- | :--- | :--- |
| **Runtime** | TypeScript + ts-node | Type safety + rapid development |
| **API Integration** | openai (^6.25.0) | Native OpenAI API client |
| **Configuration** | dotenv (^17.3.1) | Environment variable loading |
| **Type Support** | @types/node (^25.3.2) | Node.js type definitions |

---

## Instructions for AI Developers

If you are an AI assisting with this project, please follow this workflow to update the documentation:

### Full Repository Scan (Scan & Sync)

1. After adding or modifying skill files in `.claude/skills/`:
   - Read the skill's `SKILL.md`
   - Extract dimension definitions from `## Output Format`
   - Update the "Core Modules" table in README.md

2. Dimension Change Principles:
   - Verify each module's dimension count (typically 5)
   - Maintain strict consistency between dimension names and SKILL.md

### Tech Stack Auto-Alignment (Tech Stack Sync)

Read `package.json` and update the "Technical Architecture" section:

- **dependencies**: Core runtime dependencies
- **devDependencies**: Development toolchain

### Bilingual Completion

- After modifying `README.md`, you **must** synchronize updates to `README_EN.md`
- Maintain terminology consistency (e.g., "俚语" → "Slang", "对标" → "Academic Alignment")

### Shields Badge Dynamic Updates

Update the top badges according to `package.json` version:
- `version` → `img.shields.io/badge/version-X.X.X`

---

## Project Structure

```
toefl-slang-master/
├── .claude/
│   ├── skills/              # Instruction sets (logic-code separation)
│   │   ├── dictionary-pro/  # Dictionary module
│   │   ├── toefl-writing/   # TOEFL coaching module
│   │   ├── content-parser/  # Content parsing module
│   │   └── skill-creator/   # Skill creator
│   └── notes/               # User notes storage
├── src/                     # TypeScript source code
│   ├── api/client.ts        # OpenAI API client
│   ├── auth/manager.ts      # Authentication manager
│   └── index.ts             # Entry point
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript configuration
└── README.md / README_EN.md # Bilingual documentation
```

---

## Quick Start

```bash
# Install dependencies
npm install

# Run the project
npm start
```

---

## License

MIT