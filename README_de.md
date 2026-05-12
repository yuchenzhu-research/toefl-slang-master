# SPARK

> **Die Barriere zwischen akademischem Englisch (TOEFL) und authentischem amerikanischen Slang überwinden.**
> Holen Sie das Maximum aus Lesematerialien heraus: Erhöhen Sie Ihren Score UND sprechen Sie wie ein Local.

[English](README.md) | [简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Español](README_es.md) | [Français](README_fr.md) | [Deutsch](README_de.md)

---

## ✨ Kernfunktionen

| Szenario | Herausforderungen | Lösungen |
| :--- | :--- | :--- |
| **TOEFL Vorbereitung** | "gonna" ist zu informell, was ist die akademische Alternative? | **Dictionary Pro**: Akademische Registerkonvertierung per Klick. |
| **Anspruchsvolles Lesen** | Verstehe The Economist, kann den Stil aber nicht replizieren. | **Content Parser**: Extrahieren Sie Satzschablonen. |
| **Schreiben** | Präzisionsarme Wörter ziehen Ihre Punktzahl nach unten. | **TOEFL Coach**: Präzise Diagnose basierend auf offiziellen ETS-Standards. |

---

## 🎯 Module

### 1. Dictionary Pro
Wandelt umgangssprachliches oder ungenaues Englisch in akademische Standards um.
*   **Vokabel-Upgrades**: Ersetzen Sie unpräzise Wörter durch anspruchsvolle akademische Alternativen.
*   **Akademische Ausrichtung**: Direkte Zuordnung zwischen informellen und akademischen Begriffen.

### 2. TOEFL Coach
Fokus auf akademische Logik und strukturelle Diagnose für anspruchsvolles Schreiben.
*   **ETS-Standards**: Simulierte Bewertung und diagnostisches Feedback.
*   **Extraktion schwacher Ausdrücke**: Erkennt automatisch informelle Sprache.

### 3. Content Parser
Analysiert PDF/MD/TXT, um strukturierte Lernnotizen zu extrahieren.
*   **Snippet-Extraktion**: Identifiziert die wertvollsten Ausdrücke zum Lernen.
*   **Strukturierte Notizen**: Erzeugt Markdown- und JSON-Artefakte.

---

## 🖥️ Backend API for Frontends

Start the local backend API for a separate frontend such as Google Antigravity:

```bash
spark web --port 4173
```

Current endpoints:

- `GET /api/health`
- `POST /api/dict/lookup` — Dictionary Pro lookup with slang/register output and academic alignment. Defaults to `dryRun: true`.
- `POST /api/style/economist` — deterministic Economist-style feature analysis.

## 🧠 Economist Style Analysis

```bash
spark style --text "Although markets may adapt, regulation can distort incentives."
```

This is feature analysis, not a full corpus-trained imitation engine yet.

---

## 🚀 Schnellstart

### Installation

```bash
# Abhängigkeiten installieren
npm install

# Globalen CLI-Befehl registrieren
npm link

# Lokale Umgebung initialisieren (.env)
spark init
```

### Kern-Pipelines

```bash
# Workflow 1: Sätze aus Artikeln extrahieren und Flashcards generieren
spark x pipeline:input --file article.pdf

# Workflow 2: Schreiben diagnostizieren und Upgrade-Karten generieren
spark x pipeline:output --text "This is a big improvement."

# Pipeline ohne API-Aufruf prüfen
spark x pipeline:input --file article.md --dry-run
spark x pipeline:output --text "I think technology is good." --dry-run
```

---

## 🧪 Experimentelle Erweiterungen

Erreichbar über `spark x`:
- **Spaced Repetition** (`spark x review`)
- **Tägliche Herausforderung** (`spark x daily`)
- **Semantische Cluster** (`spark x cluster`)
- **Native Sprachausgabe** (`spark x speak`)
- **REPL-Modus** (`spark x repl`)

---

## 🧭 Governance-Dokumente

Für Projekt-Governance und Wartung beginnen Sie hier:

- `CONSTITUTION.md`: höchste Governance-Datei für Projektidentität, Invarianten, Architektur-Leitplanken und Qualitätsgrenzen.
- `AGENTS.md`: gemeinsames Cross-Agent-Handbuch für Lesereihenfolge, Ausführungsablauf, Verifikationsbasis und Dokumentationssynchronisation.
- `MANUAL.md`: Wartungshandbuch für Repository-Struktur, operative Checklisten und bekannte Einschränkungen.

---

## 💂 Sicherheit & Datenschutz

**API-Only Modus**: Kein zentraler Server. Ihre API-Keys und Daten bleiben lokal auf Ihrem Rechner.
