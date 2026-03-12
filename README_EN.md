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
![Engine](https://img.shields.io/badge/OpenAI-API-412991)
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

Powered by the OpenClaw architecture's API engine, three core functions cover your entire English learning journey:

| Module | Core Purpose | 5-D Output |
| :--- | :--- | :--- |
| **Dictionary Pro** | Expression-Level Register Conversion | **Translation · Slang · Alignment · Frequency · Analysis** |
| **TOEFL Coach** | Pure Academic Logic Diagnosis | **Score · Logic · Vocabulary · Structure · Optimization** |
| **Content Parser** | Deep Foreign Publication Cultural Analysis | **Overview · Breakdown · Slang · Culture · Conversion** |

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
│   ├── api/                 # API integration layer
│   │   └── client.ts        # OpenAI API client
│   ├── auth/                # Authentication management
│   │   └── manager.ts       # OpenClaw-style config management
│   └── index.ts             # Entry point (reads skills/dictionary-pro)
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript configuration
└── README.md / README_EN.md # Bilingual documentation
```

| Tech Stack | Version | Purpose |
| :--- | :--- | :--- |
| **TypeScript** | ^5.9 | Type safety + rapid development |
| **OpenAI SDK** | ^6.25 | Native API client |
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
# Edit .env file, fill in your Anthropic API Key

# 3. Run the project
npm start
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
