<div align="center">
  <h1 align="center">🌿 Digital Garden</h1>
  <p align="center">
    <strong>Bibliotheca Vitae</strong>
  </p>
  <p align="center">
    <em>Sanctuarium digitale ad curanda artificia vitae tuae cum elegantia renascentiae</em>
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
      Latin | 
      <a href="README_ja.md">日本語</a> | 
      <a href="README_ko.md">한국어</a> | 
      <a href="README_es.md">Español</a>
    </strong>
  </p>
</div>
<br/>

**Bibliotheca Vitae** ultra blog personalem transcendit. Est tabularium vitae immersivum, ubi aesthetica codicum saeculi XV cum technologia telae saeculi XXI confluit, data vulgaria in artem curationis elegantem transformans.

Structura repositorii et regulae directoriorum in [docs/PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md) servantur.

## 🏛️ Visio: Narratio Vitae

In aevo fragmentorum, Contextus est Anima. Bases datorum traditionales historiam ut lineas in tabula tractant, sed Bibliotheca Vitae quodque documentum ut **Momentum in Tempore** tractat — artificium visuale et textuale quod non solum indicandum, sed penitus sentiendum est.

*   **Immersio**: Interactiones fluidae secundum leges physicas, quae obiectis digitalibus pondus et praesentiam veram tribuunt.
*   **Aesthetica**: Typographia Inter et Playfair Display cum minimalismo calido et museali coniungitur.
*   **Experientia Curatoris**: Formulas cum linteo (canvas) substituimus.

## ✨ Proprietates

### 🖼️ Porticus The Gallery
Volutatio horizontalis inhaerens more Apple, ut in flumine historiae navigetur. Quaque charta archivi effectum parallaxis subtilem habet.

### 📖 Narratio The Narrative Experience
Cliccando in quolibet item, velamen continuum aperitur. Usor **Momentum in Tempore** explorare, **Figuram** percipere et **Narrationem** legere potest.

### 🖋️ Addere Momentum Append Moment Editor
Cor proiecti est Editor "Imago Primo".
1.  **Anchora Visualis**: Imaginem impone ut fundamentum visuale constituas.
2.  **Editio in Loco**: Titulum, figuram, verba clavium, momentum et narrationem in uno fluxu emenda.
3.  **Rudimenta et Renovatio Archivi**: Nova momenta localiter servantur ante publicationem, et documenta personalia in desktop iterum aperiri atque emendari possunt.

## 🛠️ Instrumenta Technica

Structura communis inter telam et applicationem desktopianam Tauri:

-   **Nucleus**: Next.js 16 App Router, React 19, TypeScript
-   **Motus**: Framer Motion, Lenis
-   **Visus**: Tailwind CSS v4, Lucide Icons
-   **Graphica**: React Three Fiber / Drei WebGL Particle System
-   **Desktop**: Tauri 2

## 💾 Servatio Data et Compatibilitas Multipla

### 🖥️ Usus Interretialis Desktop (Windows / macOS / Linux)
- Modus commendatus: directorium locale coniunge et singula documenta ut fasciculos `.json` directe in disco scribe
- Facultates desktopianae in tela: **Videre, Creare, Editare, Exportare et Importare**
- In modo directorii, archivum tuum ipse inspicere, reservare et synchronizare potes
- Si accessus ad directorium deest, applicatio ad servationem localem navigatoris recidit ut modus compatibilitatis
- Totum operatio sine conexione interretiali - servatio serveri non necessaria

### 🪟 Applicatio Desktopiana (Tauri)
- Eodem exemplo archivi per accessum nativum ad systema fasciculorum utitur
- Documenta localiter in directorio archivi Bibliothecae Vitae servantur
- Optima est ad plenam rationem desktopianam sine rete

### 📱 Usus Mobilis (iOS / Android)
- **Lectio + Rudimenta Localia**: archiva inspicere et rudimenta textus, metadatae atque imaginum in hoc apparatu/navigatro servare potes
- Rudimenta mobilia tantum in servatione locali navigatoris huius apparatus manent, ideo ad celerem notationem magis quam ad archivum finale apta sunt
- Publicatio in directorium connexum, importatio/exportatio, et plena administratio archivi ad usum desktop reservantur
- Ad plenam rationem archivi, navigatorem desktopum vel applicationem desktopam utere

## 📥 Deprehensio et Installatio

Applicationem desktopianam praecompilatam pro macOS et Windows e pagina [GitHub Releases](https://github.com/yuchenzhu-research/Digital-Garden/releases) deprehendere potes.

Linux ut platforma **telaris desktopiana** sustentatur. Automatizatio publicationis applicationis desktopianae pro Linux nondum confirmata est. Vide [docs/RELEASE.md](docs/RELEASE.md).

### 🍎 Usores macOS
Publicatio MVP currens sine certificato Apple constructa est per GitHub Actions, ergo macOS indicare potest applicationem "corruptam" esse.
**Solutio:**
1. Applicationem `.dmg` in directorium `/Applications` trahe.
2. In Terminali mandatum hoc exsequere ut signum quarantinae removeas:
```bash
xattr -cr "/Applications/Bibliotheca Vitae.app"
```
3. Nunc applicationem normaliter aperire potes.

### 🪟 Usores Windows
Windows SmartScreen `.exe` ut applicationem ignotam signare potest. **"More info"** clicca, deinde **"Run anyway"** elige.

## 🚀 Initium Celeriter

1.  Repositorium describe.
2.  Dependentias instala: `npm install`
3.  Basem verifica: `npm run lint && npm run test`
4.  Ambitum evolutionis telaris incipe: `npm run dev`
5.  Aperi `http://localhost:4321`
6.  Si vis crustam desktopianam, utere `npm run app:dev`
7.  Si vis constructionem telarem finalem, utere `npm run build`

Documenta technica detaliata: [docs/ENGINEERING-GUARDRAILS.md](docs/ENGINEERING-GUARDRAILS.md) · [docs/TESTING-CI.md](docs/TESTING-CI.md) · [docs/RELEASE.md](docs/RELEASE.md)

---
*Est. MMXXVI · Bibliotheca Vitae · Ars Longa, Vita Brevis.*
