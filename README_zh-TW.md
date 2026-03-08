<div align="center">
  <h1 align="center">🌿 Digital Garden | Bibliotheca Vitae</h1>
  <p align="center">
    <em>策展生命之靈，築造數位聖所</em>
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
      繁体中文 | 
      <a href="README_la.md">Latin</a> | 
      <a href="README_ja.md">日本語</a> | 
      <a href="README_ko.md">한국어</a> | 
      <a href="README_es.md">Español</a>
    </strong>
  </p>
</div>
<br/>

**Bibliotheca Vitae** 超越了部落格的定義。這是一座數位花園，15 世紀手抄本美學與 21 世紀工程技藝在此交匯，將原始數據昇華為被策展的生命敘事。

倉庫分層與目錄約定見 [docs/PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md)。

## 🏛️ 專案願景：生命敘事

在碎片化的數位時代，脈絡即靈魂。Bibliotheca Vitae 摒棄冷峻的行列式資料庫思維，將每一次記錄鐫刻為 **Moment in Time**，一個受物理律驅動、值得被深度感知的視覺與文字實體。

* **感官沉浸**：藉由物理模擬動效，賦予數位資產以真實的質量與存在感。
* **古典美學**：古典字體 Cinzel 與 EB Garamond 在此同現代極簡主義交織，重構博物館級別的閱讀體驗。
* **策展禮致**：摒棄傳統的表單邏輯，還歸以畫布的創作自由。

## ✨ 核心特性

### 🖼️ 動態畫廊 The Gallery
受 Apple 極簡主義啟發的橫向視差卷軸。用戶能於時光長河中遊弋，感知每一張卡片呼吸般的動態張力。

### 📖 深度敘事 The Narrative Experience
輕觸條目，即可喚起無縫的深層遮罩。在此，你將探尋 **Moment in Time** 背後交織的 **Figure** 關鍵人物與隨筆 **The Narrative**。

### 🖋️ 瞬間追加 Append Moment Editor
本專案的工程核心是視覺先行的一站式編輯器。
1.  **視覺錨點**：拖入影像，即刻將其化為創作基底。
2.  **原位鐫刻**：直接在預覽位置敲擊文字，省去一切多餘的表單跳轉。
3.  **粒子之變**：集成 Alet-style 粒子系統，支持 **Linear** 線性拉伸與 **Random** 隨機碎裂兩種解構模式。

## 🛠️ 技術底座 Tech Stack

基於單頁應用 SPA 架構，為未來的 Electron 原生化做準備：

-   **核心**: Next.js 16 App Router, React 19, TypeScript
-   **動效**: Framer Motion, GSAP, React Lenis Smooth Scroll
-   **視覺**: Tailwind CSS v4 Oklch, Lucide Icons
-   **圖形**: React Three Fiber / Drei WebGL Particle System

## 💾 資料儲存與跨平台支援

### 🖥️ 桌面網頁版 (Windows / macOS / Linux)
- 完整功能：**瀏覽、建立、編輯、匯出與匯入**
- 您建立的項目儲存在瀏覽器本地
- **匯出**：將資料下載為 `.json` 檔案備份
- **匯入**：從已匯出的檔案恢復資料
- 完全離線運行，無需伺服器儲存

### 📱 行動端 (iOS / Android)
- **唯讀模式**：瀏覽現有檔案和瞬間
- 檔案上傳/匯出功能需使用桌面瀏覽器
- 建立和管理項目請在電腦上存取

## 🚀 快速開始

1.  克隆倉庫。
2.  執行 `npm install` 安裝依賴。
3.  通過 `npm run dev` 啟動本地開發環境。
4.  訪問地址：`https://bibliotheca-vitae.vercel.app` 或 `http://localhost:4321`。

---
*Est. MMXXVI · Digital Garden | Bibliotheca Vitae · Ars Longa, Vita Brevis.*
