# SPARK

> **Überbrückung der Lücke zwischen akademischem TOEFL-Englisch und authentischem amerikanischem Slang.**
> Holen Sie den maximalen Wert aus Ihren Lesematerialien heraus: Steigern Sie Ihre Punktzahlen UND sprechen Sie wie ein Local.

[English](README.md) | [简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Español](README_es.md) | [Français](README_fr.md) | [Deutsch](README_de.md)

---

## ✨ Hauptfunktionen

| Szenario | Herausforderungen | Lösungen |
| :--- | :--- | :--- |
| **TOEFL-Vorbereitung** | "gonna" ist zu informell, aber was ist die akademische Alternative? | **Dictionary Pro**: Akademische Registerkonvertierung mit einem Klick. |
| **Fortgeschrittenes Lesen** | Versteht The Economist, kann aber den Stil nicht replizieren. | **Content Parser**: Extrahiert wiederverwendbare Satzvorlagen und kulturellen Kontext. |
| **Schreiben** | Ungenaue Wörter ziehen die Punktzahl nach unten. | **TOEFL Coach**: Präzise Diagnose basierend auf offiziellen ETS-Standards. |

---

## 🎯 Module

### 1. Dictionary Pro
Konvertiert umgangssprachliches oder vages Englisch in standardisierte akademische Stile.
*   **Vokabular-Upgrades**: Tauschen Sie ungenaue Wörter gegen anspruchsvolle akademische Alternativen aus.
*   **Kontextbezogene Analyse**: Klärt Begriffe basierend auf Ihrem spezifischen Schreibkontext.
*   **Akademische Ausrichtung**: Direkte Zuordnung zwischen informellen und akademischen Gegenstücken.

### 2. TOEFL Coach
Konzentriert sich auf die akademische logische und strukturelle Diagnose für anspruchsvolles Schreiben.
*   **ETS-Standards**: Simulierte Bewertung und diagnostisches Feedback.
*   **Extraktion schwacher Ausdrücke**: Identifiziert und markiert automatisch informelle Sprache.
*   **Strukturelle Optimierung**: Vorschläge für analytische Übergänge und komplexe Satzstrukturen.

### 3. Content Parser
Analysiert hochwertige ausländische Publikationen (PDF/MD/TXT), um strukturierte Studiennotizen zu extrahieren.
*   **Snippet-Extraktion**: Identifiziert automatisch die wertvollsten Ausdrücke zum Lernen.
*   **Kultureller Hintergrund**: Verknüpft Redewendungen und Slang mit ihren kulturellen Wurzeln.
*   **Standardisierte Notizen**: Erstellt formatierte Markdown- und JSON-Artefakte.
*   **Ausdrucks-Loop**: Automatische Ausgabe von Kandidaten für die nachfolgenden Module.

---

## 🎬 Studio-Modus (Geführte Sitzung)

Starten Sie das SPARK Studio Terminal direkt:

```bash
spark studio
```

Studio läuft derzeit als **interaktives TUI (Terminal UI)**. Geben Sie ein beliebiges Wort oder einen Ausdruck ein und Dictionary Pro sucht in Echtzeit danach. Drücken Sie `Strg+C` zum Beenden.

```bash
spark studio --dry-run   # Start ohne API-Aufrufe (Layout-Vorschau)
```

> [!NOTE]
> Die vollständige geführte Pipeline (Dateiauswahl → Analysevorschau → Kandidatenprüfung → Karten-Generierung)
> ist **in Arbeit (WIP)**. Das aktuelle TUI konzentriert sich auf Dictionary Pro-Suchanfragen.
> Integrationen für `/coach` und `/content` werden in einer zukünftigen Version hinzugefügt.

## 🖥️ Backend-API für Frontends

Starten Sie die lokale Backend-API für ein externes Frontend wie Google Antigravity:

```bash
spark web --port 4173
```

Aktuelle Backend-Endpunkte:

- `GET /api/health`
- `POST /api/dict/lookup` — Dictionary Pro-Suche mit Slang/Register-Informationen und akademischer Ausrichtung. Standardmäßig `dryRun: true`.
- `POST /api/style/economist` — Deterministische Economist-Stil-Merkmalsanalyse.

## 🧠 Economist-Stilanalyse

SPARK enthält nun eine erste Stil-Engine für analytische Prosa im Economist-Stil:

```bash
spark style --text "Although markets may adapt, regulation can distort incentives."
```

Dies ist eine **Merkmalsanalyse**, noch kein vollständiger, auf einem Korpus trainierter Nachahmungs-Motor. Er bewertet Satzrhythmus, Kontrastwenden, kausale Logik, Hedging, Wirtschafts-/Politikvokabular und komprimierte Interpunktion in Teilsätzen.

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

### Haupt-Pipelines

```bash
# Workflow 1: Ausdrücke aus Artikeln extrahieren, um Flashcards zu generieren
spark x pipeline:input --file artikel.pdf

# Workflow 2: Schreiben diagnostizieren und Upgrade-Karten für Dictionary Pro generieren
spark x pipeline:output --text "This is a big improvement."

# Vorschau einer Pipeline ohne API-Aufrufe
spark x pipeline:input --file artikel.md --dry-run
spark x pipeline:output --text "I think technology is good." --dry-run
```

### Eigenständige Befehle

```bash
# Direkte Wörterbuchsuche
spark dict "a big deal"

# Eigenständige Schreibdiagnose
spark coach --file ./essay.txt --json

# Eigenständige Inhalts-Extraktion (kein KI-Aufruf)
spark content --file artikel.pdf --extract-only
```

### Provider-Routing

Verwenden Sie `--provider` für das Zugangs-Gateway/Runtime und `--model` für das gehostete Modell, falls erforderlich.

```bash
# Offizieller MiniMax-Direkt-Endpunkt
spark dict "gonna" --provider minimax

# MiniMax gehostet auf SiliconFlow
spark dict "gonna" --provider siliconflow-minimax
```

---

## 🧪 Experimentelle Erweiterungen

Spezielle Funktionen, die über den Namensraum `spark x` zugänglich sind:

- **Spaced Repetition** (`spark x review`): SM2-basierte Flashcard-Gedächtnistests.
- **Daily Challenge** (`spark x daily`): Zufällige Kurztests aus Ihrer gespeicherten Kartenbank.
- **Semantisches Clustering** (`spark x cluster`): Graphbasierte Zuordnung von Synonymbeziehungen.
- **Natives TTS** (`spark x speak`): Aussprache der System-Engine für gespeicherte Ausdrücke.
- **REPL-Modus** (`spark x repl`)：Hocheffiziente Terminal-Interaktionsschleife.

---

## 🧭 Governance-Dokumente

Für die Projekt-Governance und Wartung beginnen Sie hier:

- `CONSTITUTION.md`: höchste Governance-Datei für Projektidentität, Invarianten, Architektur-Schutzmaßnahmen und Qualitätsprüfungen.
- `AGENTS.md`: gemeinsames agentenübergreifendes Handbuch für Lesereihenfolge, Ausführungsworkflow, Verifizierungs-Baseline und Dokumentensynchronisationsdisziplin.
- `MANUAL.md`: Handbuch für Maintainer zur Repo-Struktur, operativen Checklisten und bekannten Einschränkungen.

---

## 💂 Sicherheit & Datenschutz

**Nur-API-Modus**: Dieses Projekt arbeitet ohne zentralen Server. Ihre API-Schlüssel (OpenAI, Gemini, Anthropic, SiliconFlow) und Lerndaten verbleiben vollständig auf Ihrem lokalen Rechner.
