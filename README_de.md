# TOEFL Slang Master

> **Die Barriere zwischen akademischem Englisch (TOEFL) und authentischem amerikanischen Slang überwinden.**
> Holen Sie das Maximum aus Lesematerialien heraus: Erhöhen Sie Ihren Score UND sprechen Sie wie ein Local.

[English](README.md) | [简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Español](README_es.md) | [Français](README_fr.md) | [Deutsch](README_de.md)

---

## ✨ Kernfunktionen

| Szenario | Herausforderungen | Lösungen |
| :--- | :--- | :--- |
| **TOEFL Vorbereitung** | "gonna" ist zu informell, was ist die akademische Alternative? | **Dictionary Pro**: Akademische Registerkonvertierung per Klick. |
| **Anspruchsvolles Lesen** | Verstehe The Economist, kann den Stil aber nicht replizieren. | **Content Parser**: Extrahieren Sie Satzschablonen. |
| **Schreiben** | Präzisionsarme Wörter (good, bad) ziehen Ihre Punktzahl nach unten. | **TOEFL Coach**: Präzise Diagnose und akademische Ausrichtung. |

---

## 🎯 Module

### 1. Dictionary Pro
Wandelt umgangssprachliches oder ungenaues Englisch in akademische Standards um.

### 2. TOEFL Coach
Fokus auf akademische Logik und strukturelle Diagnose für anspruchsvolles Schreiben.

### 3. Content Parser
Analysiert PDF/MD/TXT, um strukturierte Lernnotizen zu extrahieren.

---

## 🚀 Schnellstart

### Installation

```bash
npm install
npm link
tsm init   # API-Keys einrichten (OpenAI, Gemini, Anthropic usw.)
tsm doctor # Systemcheck
```

### Kern-Pipelines

```bash
# Workflow 1: Sätze aus Artikeln extrahieren und Flashcards generieren
tsm pipeline:input --file article.pdf

# Workflow 2: Schreiben diagnostizieren und Upgrade-Karten generieren
tsm pipeline:output --text "This is a big improvement."
```

---

## 🧪 Experimentelle Erweiterungen

Erreichbar über `tsm x`:
- **Spaced Repetition** (`tsm x review`)
- **Tägliche Herausforderung** (`tsm x daily`)
- **Semantische Cluster** (`tsm x cluster`)
- **Native Sprachaubgabe** (`tsm x speak`)

---

## 💂 Sicherheit & Datenschutz

**API-Only Modus**: Kein zentraler Server. Ihre API-Keys und Daten bleiben lokal.

---

## 📄 Lizenz

MIT License.
