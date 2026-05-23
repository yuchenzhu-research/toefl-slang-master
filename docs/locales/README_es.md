# SPARK

> **Cerrando la brecha entre el inglés académico del TOEFL y el argot estadounidense auténtico.**
> Extraiga el máximo valor de sus lecturas: mejore sus puntajes Y hable como un local.

[English](../../README.md) | [简体中文](../../README_zh-CN.md) | [繁體中文](../../README_zh-TW.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Español](README_es.md) | [Français](README_fr.md) | [Deutsch](README_de.md)

---

## ✨ Características Principales

| Escenario | Desafíos | Soluciones |
| :--- | :--- | :--- |
| **Prep. TOEFL** | "gonna" es demasiado informal, ¿pero cuál es la alternativa académica? | **Dictionary Pro**: Conversión de registro académico con un clic. |
| **Lectura Avanzada** | Entiende The Economist pero no puede replicar el estilo. | **Content Parser**: Extrae plantillas de frases reutilizables y contexto cultural. |
| **Escritura** | Palabras de baja precisión bajan el puntaje. | **TOEFL Coach**: Diagnóstico preciso basado en estándares oficiales de ETS. |

---

## 🎯 Módulos

### 1. Dictionary Pro
Convierte inglés coloquial o vago en estilos académicos estándar.
*   **Mejora de Vocabulario**: Intercambia palabras de baja precisión por alternativas académicas sofisticadas.
*   **Análisis Contextual**: Desambigua términos basados en su contexto específico de escritura.
*   **Alineación Académica**: Mapeo directo entre contrapartes informales y académicas.

### 2. TOEFL Coach
Se enfoca en el diagnóstico lógico y estructural académico para escritura de alto nivel.
*   **Estándares ETS**: Puntuación simulada y retroalimentación diagnóstica.
*   **Extracción de Expresiones Débiles**: Identifica y marca automáticamente el lenguaje informal.
*   **Optimización Estructural**: Sugerencias para transiciones analíticas y estructuras de oraciones complejas.

### 3. Content Parser
Analiza publicaciones extranjeras de alta calidad (PDF/MD/TXT) para extraer notas de estudio estructuradas.
*   **Extracción de Fragmentos**: Identifica automáticamente las expresiones más valiosas para aprender.
*   **Contexto Cultural**: Conecta modismos y argot con sus raíces culturales.
*   **Notas Estandarizadas**: Genera archivos markdown y JSON formateados.
*   **Bucle de Expresiones**: Salida automática de candidatos para los módulos siguientes.

---

## 🎬 Modo Studio (Sesión Guiada)

Lance la terminal de SPARK Studio directamente:

```bash
spark studio
```

Studio funciona actualmente como una **TUI (Interfaz de Usuario de Terminal) interactiva**. Escriba cualquier palabra o expresión y Dictionary Pro la buscará en tiempo real. Presione `Ctrl+C` para salir.

```bash
spark studio --dry-run   # lanzar sin realizar llamadas a la API (vista previa del diseño)
```

> [!NOTE]
> El pipeline guiado completo (selección de archivos → vista previa de análisis → revisión de candidatos → generación de tarjetas)
> está **en desarrollo (WIP)**. La TUI actual se centra en las búsquedas de Dictionary Pro.
> Las integraciones de `/coach` y `/content` se añadirán en una futura versión.

## 🖥️ API Backend para Frontends

Lance la API backend local para un frontend externo como Google Antigravity:

```bash
spark web --port 4173
```

Endpoints actuales del backend:

- `GET /api/health`
- `POST /api/dict/lookup` — Búsqueda en Dictionary Pro con información de argot/registro y alineación académica. Por defecto `dryRun: true`.
- `POST /api/style/economist` — Análisis de características de estilo determinado de Economist.

## 🧠 Análisis de Estilo de Economist

SPARK ahora incluye un primer motor de estilo para prosa analítica tipo Economist:

```bash
spark style --text "Although markets may adapt, regulation can distort incentives."
```

Esto es un **análisis de características**, no un motor de imitación completo entrenado con un corpus todavía. Califica el ritmo de las oraciones, los giros de contraste, la lógica causal, el matiz (hedging), el vocabulario de economía/política y la puntuación de cláusulas comprimidas.

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
# Flujo 1: Extraer expresiones de artículos para generar flashcards
spark x pipeline:input --file articulo.pdf

# Flujo 2: Diagnosticar escritura y generar tarjetas de mejora para Dictionary Pro
spark x pipeline:output --text "This is a big improvement."

# Vista previa de un pipeline sin llamadas a la API
spark x pipeline:input --file articulo.md --dry-run
spark x pipeline:output --text "I think technology is good." --dry-run
```

### Comandos Independientes

```bash
# Búsqueda directa en el diccionario
spark dict "a big deal"

# Diagnóstico de escritura independiente
spark coach --file ./ensayo.txt --json

# Extracción de contenido independiente (sin llamada a IA)
spark content --file articulo.pdf --extract-only
```

### Enrutamiento de Proveedores

Use `--provider` para la puerta de enlace/ejecución, y `--model` para el modelo alojado cuando sea necesario.

```bash
# Punto de conexión directo oficial de MiniMax
spark dict "gonna" --provider minimax

# MiniMax alojado en SiliconFlow
spark dict "gonna" --provider siliconflow-minimax
```

---

## 🧪 Extensiones Experimentales

Características especiales accesibles a través del espacio de nombres `spark x`:

- **Repetición Espaciada** (`spark x review`): Pruebas de memoria de flashcards basadas en SM2.
- **Desafío Diario** (`spark x daily`): Pruebas rápidas aleatorias de su banco de tarjetas guardadas.
- **Agrupación Semántica** (`spark x cluster`): Mapeo basado en grafos de relaciones de sinónimos.
- **TTS Nativo** (`spark x speak`): Pronunciación del motor del sistema para expresiones guardadas.
- **Modo REPL** (`spark x repl`)：Bucle de interacción de terminal de alta eficiencia.

---

## 🧭 Documentos de Gobernanza

Para la gobernanza y el mantenimiento del proyecto, comience aquí:

- `CONSTITUTION.md`: archivo de gobernanza de mayor nivel para la identidad del proyecto, invariantes, protecciones de arquitectura y puertas de calidad.
- `AGENTS.md`: manual compartido entre agentes para el orden de lectura, flujo de ejecución, línea base de verificación y disciplina de sincronización de documentos.
- `MANUAL.md`: manual del mantenedor para la estructura del repositorio, listas de verificación operativas y limitaciones conocidas.

---

## 💂 Seguridad y Privacidad

**Modo Solo API**: Este proyecto opera sin un servidor centralizado. Sus claves de API (OpenAI, Gemini, Anthropic, SiliconFlow) y datos de aprendizaje permanecen completamente en su máquina local.
