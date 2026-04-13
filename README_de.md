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
spark pipeline:input --file article.pdf

# Workflow 2: Schreiben diagnostizieren und Upgrade-Karten generieren
spark pipeline:output --text "This is a big improvement."
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
