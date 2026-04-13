<div align="center">
  <h1 align="center">🌿 Digital Garden</h1>
  <p align="center">
    <strong>Bibliotheca Vitae</strong>
  </p>
  <p align="center">
    <em>Santuario digital para curar los artefactos de tu vida</em>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-708090?style=flat-square" alt="Platform" />
    <img src="https://img.shields.io/badge/framework-Next.js%2016-000000?style=flat-square&logo=next.js" alt="Framework" />
    <img src="https://img.shields.io/badge/built%20with-Tailwind%20CSS%20v4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/animation-Framer%20Motion-E10098?style=flat-square&logo=framer" alt="Framer Motion" />
    <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
  </p>

  <p align="center">
    <strong>
      <a href="README.md">English</a> | 
      <a href="README_zh-CN.md">简体中文</a> | 
      <a href="README_zh-TW.md">繁体中文</a> | 
      <a href="README_la.md">Latin</a> | 
      <a href="README_ja.md">日本語</a> | 
      <a href="README_ko.md">한국어</a> | 
      Español
    </strong>
  </p>
</div>
<br/>

**Bibliotheca Vitae** trasciende el concepto de blog personal. Es un Jardín Digital donde la estética de los manuscritos del siglo XV se fusiona con la ingeniería del siglo XXI, elevando datos mundanos a una narrativa curada.

La estructura del repositorio y las reglas de directorios están en [docs/PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md).

## 🏛️ Visión: Narrativa Viva

En una era de información fragmentada, el Contexto es el Alma. Las bases de datos tradicionales tratan la historia como filas en una tabla, mientras que Bibliotheca Vitae percibe cada registro como un **Moment in Time**, un receptáculo visual y textual digno de profunda percepción.

*   **Inmersión**: El movimiento interactivo basado en física otorga a los objetos digitales peso y presencia real.
*   **Estética**: La combinación de Inter y Playfair Display se une a un minimalismo cálido, de tono museístico.
*   **Experiencia del Curador**: Reemplazamos los formularios con un lienzo.

## ✨ Características Principales

### 🖼️ La Galería
Un desplazamiento horizontal pegajoso al estilo Apple permite a los usuarios atravesar el largo río de la historia. Cada tarjeta de archivo presenta efectos de paralaje sutiles.

### 📖 La Experiencia Narrativa
Al hacer clic en cualquier entrada se abre una superposición fluida. Los usuarios pueden explorar el **Moment in Time**, percibir a la **Figure** involucrada y leer **The Narrative** perteneciente a ese instante.

### 🖋️ Editor Append Moment
El corazón del proyecto es un Editor Visual-First.
1.  **Ancla Visual**: Sube una imagen para establecer el fondo visual de la entrada.
2.  **Edición In-situ**: Ajusta títulos, figuras, palabras clave, momentos y narrativas dentro de un mismo flujo.
3.  **Borradores y Actualización del Archivo**: Las nuevas entradas se guardan localmente antes de publicarse y, en escritorio, las entradas personales pueden reabrirse y editarse.

## 🛠️ Stack Tecnológico

Construido como una aplicación compartida **Web + Tauri de escritorio**:

-   **Núcleo**: Next.js 16 App Router, React 19, TypeScript
-   **Movimiento**: Framer Motion, Lenis
-   **Visual**: Tailwind CSS v4, Lucide Icons
-   **Gráficos**: React Three Fiber / Drei WebGL Particle System
-   **Escritorio**: Tauri 2

## 💾 Almacenamiento de Datos y Compatibilidad Multiplataforma

### 🖥️ Web Escritorio (Windows / macOS / Linux)
- Modo recomendado: conecta una carpeta local y escribe cada entrada directamente como archivo `.json` en tu disco
- Funciones en web de escritorio: **Navegar, Crear, Editar, Exportar e Importar**
- En el modo carpeta, tu archivo queda en ficheros que puedes inspeccionar, respaldar y sincronizar por tu cuenta
- Si el acceso a carpetas no está disponible, la aplicación vuelve al almacenamiento local del navegador como modo de compatibilidad
- Funciona completamente sin conexión - no requiere almacenamiento en servidor

### 🪟 Aplicación de Escritorio (Tauri)
- Usa el mismo modelo de archivo mediante acceso nativo al sistema de archivos
- Guarda las entradas localmente en tu carpeta de archivo Bibliotheca Vitae en disco
- Es la mejor opción para un flujo de archivo completamente offline en escritorio

### 📱 Móvil (iOS / Android)
- **Exploración + borradores locales**: revisa archivos y guarda borradores de texto, metadatos e imágenes en el dispositivo/navegador actual
- Los borradores móviles permanecen en el almacenamiento local del navegador de ese dispositivo, por lo que sirven mejor para captura rápida que para archivado final
- Publicar en una carpeta conectada, importar/exportar y la gestión completa del archivo siguen siendo flujos de escritorio
- Para el flujo archivístico completo, usa un navegador de escritorio o la aplicación de escritorio

## 📥 Descarga e Instalación

Puedes descargar la aplicación de escritorio precompilada para macOS y Windows desde la página de [GitHub Releases](https://github.com/yuchenzhu-research/Digital-Garden/releases).

Linux sigue siendo una plataforma de **escritorio web** compatible. La automatización de lanzamiento de la app de escritorio para Linux aún no está confirmada. Consulta [docs/RELEASE.md](docs/RELEASE.md).

### 🍎 Usuarios de macOS
La versión MVP actual se compila mediante GitHub Actions sin certificado de desarrollador de Apple, por lo que macOS puede mostrar que la app "está dañada".
**Solución:**
1. Arrastra la aplicación `.dmg` a tu carpeta `/Applications`.
2. Abre la Terminal y ejecuta el siguiente comando para eliminar la marca de cuarentena:
```bash
xattr -cr "/Applications/Bibliotheca Vitae.app"
```
3. Ahora puedes abrir la app normalmente.

### 🪟 Usuarios de Windows
Windows SmartScreen puede marcar el `.exe` como una app no reconocida. Haz clic en **"Más información"** y luego en **"Ejecutar de todos modos"**.

## 🚀 Inicio Rápido

1.  Clona el repositorio.
2.  Instala dependencias: `npm install`
3.  Valida la línea base: `npm run lint && npm run test`
4.  Inicia el servidor web de desarrollo: `npm run dev`
5.  Abre `http://localhost:4321`
6.  Shell de escritorio opcional: `npm run app:dev`
7.  Build web opcional de producción: `npm run build`

Guías de ingeniería detalladas: [docs/ENGINEERING-GUARDRAILS.md](docs/ENGINEERING-GUARDRAILS.md) · [docs/TESTING-CI.md](docs/TESTING-CI.md) · [docs/RELEASE.md](docs/RELEASE.md)

---
*Est. MMXXVI · Bibliotheca Vitae · Ars Longa, Vita Brevis.*
