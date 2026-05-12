# SPARK

> **Combler le fossé entre l'anglais académique du TOEFL et l'argot américain authentique.**
> Tirez le meilleur parti de vos lectures : boostez vos scores ET parlez comme un local.

[English](README.md) | [简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Español](README_es.md) | [Français](README_fr.md) | [Deutsch](README_de.md)

---

## ✨ Caractéristiques Principales

| Scénario | Défis | Solutions |
| :--- | :--- | :--- |
| **Prép. TOEFL** | "gonna" est trop informel, mais quelle est l'alternative académique ? | **Dictionary Pro** : Conversion de registre académique en un clic. |
| **Lecture Avancée** | Comprend The Economist mais ne peut pas reproduire le style. | **Content Parser** : Extrait des modèles de phrases réutilisables et le contexte culturel. |
| **Écriture** | Les mots peu précis font baisser les scores. | **TOEFL Coach** : Diagnostic précis basé sur les normes officielles d'ETS. |

---

## 🎯 Modules

### 1. Dictionary Pro
Convertit l'anglais familier ou vague en styles académiques standard.
*   **Amélioration du Vocabulaire** : Remplace les mots peu précis par des alternatives académiques sophistiquées.
*   **Analyse Contextuelle** : Lève l'ambiguïté des termes en fonction de votre contexte d'écriture spécifique.
*   **Alignement Académique** : Mise en correspondance directe entre les équivalents informels et académiques.

### 2. TOEFL Coach
Se concentre sur le diagnostic logique et structurel académique pour l'écriture de haut niveau.
*   **Normes ETS** : Score simulé et retour diagnostique.
*   **Extraction d'Expressions Faibles** : Identifie et signale automatiquement le langage informel.
*   **Optimisation Structurelle** : Suggestions pour des transitions analytiques et des structures de phrases complexes.

### 3. Content Parser
Analyse les publications étrangères de haute qualité (PDF/MD/TXT) pour extraire des notes d'étude structurées.
*   **Extraction de Fragments** : Identifie automatiquement les expressions les plus précieuses à apprendre.
*   **Contexte Culturel** : Relie les idiomes et l'argot à leurs racines culturelles.
*   **Notes Standardisées** : Génère des fichiers markdown et JSON formatés.
*   **Boucle d'Expressions** : Sortie automatique de candidats pour les modules suivants.

---

## 🎬 Mode Studio (Session Guidée)

Lancez le terminal SPARK Studio directement :

```bash
spark studio
```

Studio fonctionne actuellement comme une **TUI (Interface utilisateur textuelle) interactive**. Tapez n'importe quel mot ou expression et Dictionary Pro le recherchera en temps réel. Appuyez sur `Ctrl+C` pour quitter.

```bash
spark studio --dry-run   # lancer sans appels API (aperçu de la mise en page)
```

> [!NOTE]
> Le pipeline guidé complet (sélection de fichiers → aperçu de l'analyse → révision des candidats → génération de cartes)
> est **en cours de développement (WIP)**. La TUI actuelle se concentre sur les recherches Dictionary Pro.
> Les intégrations `/coach` et `/content` seront ajoutées dans une future version.

## 🖥️ API Backend pour Frontends

Lancez l'API backend locale pour un frontend externe tel que Google Antigravity :

```bash
spark web --port 4173
```

Endpoints actuels du backend :

- `GET /api/health`
- `POST /api/dict/lookup` — Recherche Dictionary Pro avec informations d'argot/registre et alignement académique. Par défaut `dryRun: true`.
- `POST /api/style/economist` — Analyse des caractéristiques de style déterminé d'Economist.

## 🧠 Analyse de Style d'Economist

SPARK inclut désormais un premier moteur de style pour la prose analytique de type Economist :

```bash
spark style --text "Although markets may adapt, regulation can distort incentives."
```

Il s'agit d'une **analyse de caractéristiques**, pas encore d'un moteur d'imitation complet entraîné sur corpus. Il évalue le rythme des phrases, les pivots de contraste, la logique causale, les nuances (hedging), le vocabulaire économique/politique et la ponctuation des propositions compressées.

---

## 🚀 Démarrage Rapide

### Installation

```bash
# Installer les dépendances
npm install

# Enregistrer la commande CLI globale
npm link

# Initialiser l'environnement local (.env)
spark init
```

### Pipelines Principaux

```bash
# Flux 1 : Extraire des expressions d'articles pour générer des flashcards
spark x pipeline:input --file article.pdf

# Flux 2 : Diagnostiquer l'écriture et générer des cartes d'amélioration pour Dictionary Pro
spark x pipeline:output --text "This is a big improvement."

# Aperçu d'un pipeline sans appels API
spark x pipeline:input --file article.md --dry-run
spark x pipeline:output --text "I think technology is good." --dry-run
```

### Commandes Indépendantes

```bash
# Recherche directe dans le dictionnaire
spark dict "a big deal"

# Diagnostic d'écriture indépendant
spark coach --file ./essay.txt --json

# Extraction de contenu indépendante (sans appel IA)
spark content --file article.pdf --extract-only
```

### Routage des Fournisseurs

Utilisez `--provider` pour la passerelle/runtime, et `--model` pour le modèle hébergé si nécessaire.

```bash
# Point de terminaison direct officiel de MiniMax
spark dict "gonna" --provider minimax

# MiniMax hébergé sur SiliconFlow
spark dict "gonna" --provider siliconflow-minimax
```

---

## 🧪 Extensions Expérimentales

Fonctionnalités spéciales accessibles via l'espace de noms `spark x` :

- **Répétition Espacée** (`spark x review`) : Tests de mémoire de flashcards basés sur SM2.
- **Défi Quotidien** (`spark x daily`) : Tests rapides aléatoires à partir de votre banque de cartes enregistrées.
- **Regroupement Sémantique** (`spark x cluster`) : Cartographie basée sur les graphes des relations de synonymes.
- **TTS Natif** (`spark x speak`) : Prononciation par le moteur système pour les expressions enregistrées.
- **Mode REPL** (`spark x repl`)：Boucle d'interaction terminal à haute efficacité.

---

## 🧭 Documents de Gouvernance

Pour la gouvernance et la maintenance du projet, commencez ici :

- `CONSTITUTION.md` : fichier de gouvernance de plus haut niveau pour l'identité du projet, les invariants, les garde-fous architecturaux et les jalons de qualité.
- `AGENTS.md` : manuel partagé entre agents pour l'ordre de lecture, le flux d'exécution, la ligne de base de vérification et la discipline de synchronisation des documents.
- `MANUAL.md` : manuel du mainteneur pour la structure du dépôt, les listes de contrôle opérationnelles et les limitations connues.

---

## 💂 Sécurité et Confidentialité

**Mode API uniquement** : Ce projet fonctionne sans serveur centralisé. Vos clés API (OpenAI, Gemini, Anthropic, SiliconFlow) et vos données d'apprentissage restent entièrement sur votre machine locale.
