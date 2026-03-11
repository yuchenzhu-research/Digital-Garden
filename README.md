<div align="center">
  <h1 align="center">🌿 Digital Garden</h1>
  <p align="center">
    <strong>Bibliotheca Vitae</strong>
  </p>
  <p align="center">
    <em>"A digital sanctuary to curate the artifacts of your life."</em>
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
      English | 
      <a href="README_zh-CN.md">简体中文</a> | 
      <a href="README_zh-TW.md">繁体中文</a> | 
      <a href="README_la.md">Latin</a> | 
      <a href="README_ja.md">日本語</a> | 
      <a href="README_ko.md">한국어</a> | 
      <a href="README_es.md">Español</a>
    </strong>
  </p>
</div>
<br/>

**Bibliotheca Vitae** transcends the concept of a blog. It is a Digital Garden where 15th-century manuscript aesthetics merge with 21st-century engineering, elevating raw data into a curated narrative.

Repository layout and boundary rules live in [docs/PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md).

## 🏛️ Vision: Living Narrative

In an age of fragmented information, Context is the Soul. Traditional databases treat history as rows in a table, whereas Bibliotheca Vitae views every record as a **Moment in Time**, a visual and textual vessel worthy of deep perception.

* **Immersion**: Physics-based interactive motion gives digital objects a true sense of weight and presence.
* **Aesthetics**: Classical typography like Cinzel and EB Garamond meets modern minimalism to create a museum-grade reading experience.
* **Curator Experience**: We replace forms with a canvas.

## ✨ Core Features

### 🖼️ The Gallery
An Apple-style Sticky Horizontal Scroll allows users to traverse the long river of history. Each archive card features subtle parallax effects.

### 📖 The Narrative Experience
Clicking any entry opens a seamless overlay. Users can explore the **Moment in Time**, perceive the **Figure** involved, and read **The Narrative** belonging to that instant.

### 🖋️ Append Moment Editor
The heart of the project is a Visual-First Editor.
1.  **Visual Anchor**: Drag photos directly onto the canvas as a background.
2.  **In-place Editing**: Type directly on the page—edit titles, figures, and narratives exactly where they will appear.
3.  **Dual-Mode Particles**: Integrated Alet-style particle deconstruction with **Linear** and **Random** visual modes.

## 🛠️ Tech Stack

Built as a **Single Page Application** for future native portability:

-   **Core**: Next.js 16 App Router, React 19, TypeScript
-   **Motion**: Framer Motion, GSAP, React Lenis
-   **Visual**: Tailwind CSS v4 Oklch, Lucide Icons
-   **Graphics**: React Three Fiber / Drei WebGL Particle System

## 💾 Data Storage & Cross-Platform Support

### 🖥️ Desktop Web (Windows / macOS / Linux)
- Full features: **Browse, Create, Edit, Export & Import**
- Your created entries are stored locally in your browser
- **Export**: Download your data as a `.json` file for backup
- **Import**: Restore your data from a previously exported file
- Works completely offline - no server storage required

### 📱 Mobile (iOS / Android)
- **Read-only mode**: Browse existing archives and moments
- File upload/export features require a desktop browser
- Simply visit on a computer to create and manage your entries

## 🚀 Quick Start

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Start development server: `npm run dev`
4.  Visit: `https://bibliotheca-vitae.vercel.app` or `http://localhost:4321`.

---
*Est. MMXXVI · Bibliotheca Vitae · Ars Longa, Vita Brevis.*
