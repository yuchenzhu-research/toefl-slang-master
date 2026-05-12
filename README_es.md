# SPARK

> **Rompiendo el muro entre el inglés académico (TOEFL) y el argot estadounidense (Slang).**
> Maximiza el rendimiento de tus lecturas: mejora tu puntaje Y habla como un nativo.

[English](README.md) | [简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Español](README_es.md) | [Français](README_fr.md) | [Deutsch](README_de.md)

---

## ✨ Características Principales

| Escenario | Desafíos | Soluciones |
| :--- | :--- | :--- |
| **Preparación TOEFL** | "gonna" es informal, ¿cuál es la alternativa académica? | **Dictionary Pro**: Conversión de registro académico. |
| **Lectura Avanzada** | Entiendo The Economist pero no puedo replicar el estilo. | **Content Parser**: Extrae plantillas de oraciones. |
| **Escritura** | Palabras de baja precisión bajan tu puntaje. | **TOEFL Coach**: Diagnóstico preciso basado en estándares de ETS. |

---

## 🎯 Módulos

### 1. Dictionary Pro
Convierte inglés coloquial o vago en estilos académicos estándar.
*   **Mejora de Vocabulario**: Cambia palabras de baja precisión por alternativas académicas sofisticadas.
*   **Análisis de Contexto**: Desambiguación basada en tu contexto de escritura.
*   **Alineación Académica**: Mapeo directo entre términos informales y académicos.

### 2. TOEFL Coach
Enfoque en lógica académica y diagnóstico estructural para escritura de alto nivel.
*   **Estándares ETS**: Puntuación simulada y retroalimentación diagnóstica.
*   **Extracción de Expresiones Débiles**: Identifica automáticamente el lenguaje informal.

### 3. Content Parser
Analiza publicaciones extranjeras para extraer notas de aprendizaje estructuradas.
*   **Extracción de Fragmentos**: Identifica las expresiones más valiosas.
*   **Notas Estructuradas**: Genera artefactos en Markdown y JSON.

---

## 🖥️ Backend API para Frontends

Inicia la API local para un frontend separado como Google Antigravity:

```bash
spark web --port 4173
```

Endpoints actuales:

- `GET /api/health`
- `POST /api/dict/lookup` — Dictionary Pro con salida de slang/registro y alineación académica. Por defecto usa `dryRun: true`.
- `POST /api/style/economist` — análisis determinista de rasgos estilo Economist.

## 🧠 Análisis de Estilo Economist

```bash
spark style --text "Although markets may adapt, regulation can distort incentives."
```

Esto es análisis de rasgos, no un motor completo de imitación entrenado con corpus.

---

## 🚀 Inicio Rápido

### Instalación

```bash
# Instalar dependencias
npm install

# Registrar comando CLI global
npm link

# Inicializar entorno local (.env)
spark init
```

### Pipelines Principales

```bash
# Workflow 1: Extraer frases de artículos y generar flashcards
spark x pipeline:input --file article.pdf

# Workflow 2: Diagnosticar escritura y generar tarjetas de mejora
spark x pipeline:output --text "This is a big improvement."

# Previsualizar sin llamadas API
spark x pipeline:input --file article.md --dry-run
spark x pipeline:output --text "I think technology is good." --dry-run
```

---

## 🧪 Extensiones Experimentales

Accesibles vía `spark x`:
- **Repetición Espaciada** (`spark x review`)
- **Reto Diario** (`spark x daily`)
- **Clúster Semántico** (`spark x cluster`)
- **TTS Nativo** (`spark x speak`)
- **Modo REPL** (`spark x repl`)

---

## 🧭 Documentos de Gobernanza

Para la gobernanza y el mantenimiento del proyecto, empieza aquí:

- `CONSTITUTION.md`: archivo de gobernanza superior para identidad del proyecto, invariantes, guardrails de arquitectura y puertas de calidad.
- `AGENTS.md`: manual compartido cross-agent para orden de lectura, flujo de ejecución, línea base de verificación y disciplina de sincronización documental.
- `MANUAL.md`: manual de mantenimiento para estructura del repositorio, listas operativas y limitaciones conocidas.

---

## 💂 Seguridad y Privacidad

**Modo Solo API**: Sin servidor central. Tus claves API y datos permanecen en tu máquina local.
