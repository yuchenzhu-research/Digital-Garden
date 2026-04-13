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
Engineering and delivery guardrails live in [docs/ENGINEERING-GUARDRAILS.md](docs/ENGINEERING-GUARDRAILS.md), [docs/TESTING-CI.md](docs/TESTING-CI.md), and [docs/RELEASE.md](docs/RELEASE.md).

## 🏛️ Vision: Living Narrative

In an age of fragmented information, Context is the Soul. Traditional databases treat history as rows in a table, whereas Bibliotheca Vitae views every record as a **Moment in Time**, a visual and textual vessel worthy of deep perception.

* **Immersion**: Physics-based interactive motion gives digital objects a true sense of weight and presence.
* **Aesthetics**: Expressive typography with Inter and Playfair Display meets warm, museum-style minimalism.
* **Curator Experience**: We replace forms with a canvas.

## ✨ Core Features

### 🖼️ The Gallery
An Apple-style Sticky Horizontal Scroll allows users to traverse the long river of history. Each archive card features subtle parallax effects.

### 📖 The Narrative Experience
Clicking any entry opens a seamless overlay. Users can explore the **Moment in Time**, perceive the **Figure** involved, and read **The Narrative** belonging to that instant.

### 🖋️ Append Moment Editor
The heart of the project is a Visual-First Editor.
1.  **Visual Anchor**: Upload an artifact image to establish the visual background.
2.  **In-place Editing**: Revise titles, figures, keywords, moments, and narratives in a single flowing view.
3.  **Drafts and Archive Updates**: New moments autosave locally before publication, and personal archive entries can be reopened and edited on desktop.

## 🛠️ Tech Stack

Built as a shared **Web + Tauri desktop application**:

-   **Core**: Next.js 16 App Router, React 19, TypeScript
-   **Motion**: Framer Motion, Lenis
-   **Visual**: Tailwind CSS v4, Lucide Icons
-   **Graphics**: React Three Fiber / Drei WebGL Particle System
-   **Desktop**: Tauri 2

## 💾 Data Storage & Cross-Platform Support

### 🖥️ Desktop Web (Windows / macOS / Linux)
- Recommended mode: connect a local folder and write each entry directly as a `.json` file on your disk
- Desktop web features: **Browse, Create, Edit, Export & Import**
- Folder Mode keeps your archive in files you can inspect, back up, and sync yourself
- If folder access is unavailable, the app falls back to browser-local storage as a compatibility mode
- Works completely offline - no server storage required

### 🪟 Desktop App (Tauri)
- Uses the same archive model through native file-system access
- Stores entries locally inside your Bibliotheca Vitae archive folder on disk
- Best for a full offline desktop workflow with direct archive management

### 📱 Mobile (iOS / Android)
- **Browse + Local Drafts**: review archives and capture draft text, metadata, and images in the current device/browser
- Mobile drafts stay in on-device browser storage, making them suitable for quick capture rather than final archiving
- Publishing to a connected folder, importing/exporting, and full archive management remain desktop workflows
- Use a desktop browser or the desktop app for final archive management

## 📥 Download & Install

You can download the pre-compiled desktop application for macOS and Windows from the [GitHub Releases](https://github.com/yuchenzhu-research/Digital-Garden/releases) page.

Linux remains a supported **desktop web** platform. Linux desktop app release automation is not yet documented as active in the current workflow. See [docs/RELEASE.md](docs/RELEASE.md).

### 🍎 macOS Users
Because the current MVP release is built via GitHub Actions without an Apple Developer certificate, macOS will trigger its quarantine mechanism and prompt that the app is "damaged". 
**To fix this and run the app:**
1. Drag the `.dmg` application into your `/Applications` folder.
2. Open your Terminal and run the following command to remove the quarantine flag:
```bash
xattr -cr "/Applications/Bibliotheca Vitae.app"
```
3. You can now open the app normally.

### 🪟 Windows Users
Windows SmartScreen might flag the `.exe` as an unrecognized app. Click **"More info"** and then **"Run anyway"** to proceed.

## 🚀 Quick Start

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Validate the baseline: `npm run lint && npm run test`
4.  Start the web development server: `npm run dev`
5.  Open `http://localhost:4321`
6.  Optional desktop shell: `npm run app:dev`
7.  Optional production web build: `npm run build`

---
*Est. MMXXVI · Bibliotheca Vitae · Ars Longa, Vita Brevis.*
