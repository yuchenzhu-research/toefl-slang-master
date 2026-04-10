# TOEFL Slang Master

> **Rompiendo el muro entre el inglés académico (TOEFL) y el argot estadounidense (Slang).**
> Maximiza el rendimiento de tus lecturas: mejora tu puntaje Y habla como un nativo.

[English](README.md) | [简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Español](README_es.md) | [Français](README_fr.md) | [Deutsch](README_de.md)

---

## ✨ Características Principales

| Escenario | Desafíos | Soluciones |
| :--- | :--- | :--- |
| **Preparación TOEFL** | "gonna" es informal, ¿cuál es la alternativa académica? | **Dictionary Pro**: Conversión de registro académico. |
| **Lectura Avanzada** | Entiendo The Economist pero no puedo replicar el estilo. | **Content Parser**: Extrae plantillas de oraciones. |
| **Escritura** | Palabras de baja precisión (good, bad) bajan tu puntaje. | **TOEFL Coach**: Diagnóstico preciso y alineación académica. |

---

## 🎯 Módulos

### 1. Dictionary Pro
Convierte inglés coloquial o vago en estilos académicos estándar.

### 2. TOEFL Coach
Enfoque en lógica académica y diagnóstico estructural para escritura de alto nivel.

### 3. Content Parser
Analiza publicaciones extranjeras para extraer notas de aprendizaje estructuradas.

---

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
npm link
tsm init   # Configura tus API Keys (OpenAI, Gemini, Anthropic, etc.)
tsm doctor # Verificación de salud
```

### Pipelines Principales

```bash
# Workflow 1: Extraer frases de artículos y generar flashcards
tsm pipeline:input --file article.pdf

# Workflow 2: Diagnosticar escritura y generar tarjetas de mejora
tsm pipeline:output --text "This is a big improvement."
```

---

## 🧪 Extensiones Experimentales

Accesibles vía `tsm x`:
- **Repetición Espaciada** (`tsm x review`)
- **Reto Diario** (`tsm x daily`)
- **Clúster Semántico** (`tsm x cluster`)
- **TTS Nativo** (`tsm x speak`)

---

## 💂 Seguridad y Privacidad

**Modo Solo API**: Sin servidor central. Tus claves API y datos permanecen en tu máquina.

---

## 📄 Licencia

MIT License.
