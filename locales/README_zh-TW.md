<div align="center">
  <h1 align="center">🌿 Digital Garden</h1>
  <p align="center">
    <strong>Bibliotheca Vitae</strong>
  </p>
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
      <a href="../README.md">English</a> | 
      <a href="../README_zh-CN.md">简体中文</a> | 
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

倉庫分層與目錄約定見 [docs/PROJECT-STRUCTURE.md](../docs/PROJECT-STRUCTURE.md)。

## 🏛️ 專案願景：生命敘事

在碎片化的數位時代，脈絡即靈魂。Bibliotheca Vitae 摒棄冷峻的行列式資料庫思維，將每一次記錄鐫刻為 **Moment in Time**，一個受物理律驅動、值得被深度感知的視覺與文字實體。

* **感官沉浸**：藉由物理模擬動效，賦予數位資產以真實的質量與存在感。
* **古典美學**：Inter 與 Playfair Display 的組合，配合溫暖克制的博物館式極簡介面。
* **策展禮致**：摒棄傳統的表單邏輯，還歸以畫布的創作自由。

## ✨ 核心特性

### 🖼️ 動態畫廊 The Gallery
受 Apple 極簡主義啟發的橫向視差卷軸。用戶能於時光長河中遊弋，感知每一張卡片呼吸般的動態張力。

### 📖 深度敘事 The Narrative Experience
輕觸條目，即可喚起無縫的深層遮罩。在此，你將探尋 **Moment in Time** 背後交織的 **Figure** 關鍵人物與隨筆 **The Narrative**。

### 🖋️ 瞬間追加 Append Moment Editor
本專案的工程核心是視覺先行的一站式編輯器。
1.  **視覺錨點**：上傳圖像，為條目建立視覺背景。
2.  **原位鐫刻**：在同一條編輯流裡修改標題、人物、關鍵詞、時刻與敘事。
3.  **草稿與歸檔更新**：新條目會先在本地自動保存草稿，桌面端也可重新打開並編輯既有個人條目。

## 🛠️ 技術底座 Tech Stack

基於共享的 Web + Tauri 桌面應用架構：

-   **核心**: Next.js 16 App Router, React 19, TypeScript
-   **動效**: Framer Motion, Lenis
-   **視覺**: Tailwind CSS v4, Lucide Icons
-   **圖形**: React Three Fiber / Drei WebGL Particle System
-   **桌面端**: Tauri 2

## 💾 資料儲存與跨平台支援

### 🖥️ 桌面網頁版 (Windows / macOS / Linux)
- 推薦模式：連接本地資料夾，將每個項目直接寫入磁碟中的 `.json` 檔案
- 桌面網頁功能：**瀏覽、建立、編輯、匯出與匯入**
- 在資料夾模式下，檔案以檔案形式存在，方便你自行檢視、備份與同步
- 如果目前瀏覽器暫不支援或尚未授權資料夾存取，應用會回退到瀏覽器本地儲存，作為相容模式
- 完全離線運行，無需伺服器儲存

### 🪟 桌面應用 (Tauri)
- 透過原生檔案系統存取使用同一套歸檔模型
- 條目會保存在磁碟上的 Bibliotheca Vitae 本地檔案目錄中
- 適合完整離線的桌面歸檔工作流

### 📱 行動端 (iOS / Android)
- **瀏覽 + 本地草稿**：可檢視檔案，也可在目前裝置/瀏覽器中記錄文字、元資料與圖片草稿
- 行動端草稿僅保存在該裝置上的瀏覽器本地儲存中，更適合快速記錄，不作為正式歸檔
- 發布到已連接資料夾、匯入/匯出以及完整檔案管理，仍建議在桌面端完成
- 如需完整歸檔流程，請使用桌面瀏覽器或桌面應用

## 📥 下載與安裝

可從 [GitHub Releases](https://github.com/yuchenzhu-research/Digital-Garden/releases) 頁面下載 macOS 和 Windows 版本的預編譯桌面應用程式。

Linux 作為桌面**網頁版**平台受支援。Linux 桌面應用的自動發佈尚未確認。詳見 [docs/RELEASE.md](../docs/RELEASE.md)。

### 🍎 macOS 使用者
當前 MVP 版本通過 GitHub Actions 構建，未使用 Apple 開發者證書，因此 macOS 可能顯示「應用程式已損壞」。
**解決方法：**
1. 將 `.dmg` 應用程式拖入 `/Applications` 資料夾。
2. 開啟終端機並執行以下命令以移除隔離標記：
```bash
xattr -cr "/Applications/Bibliotheca Vitae.app"
```
3. 現在可以正常開啟應用程式。

### 🪟 Windows 使用者
Windows SmartScreen 可能將 `.exe` 標記為無法識別的應用。請點擊**「詳細資訊」**，然後選擇**「仍要執行」**。

## 🚀 快速開始

1.  克隆倉庫。
2.  執行 `npm install` 安裝依賴。
3.  驗證基線：`npm run lint && npm run test`
4.  通過 `npm run dev` 啟動網頁開發環境。
5.  打開 `http://localhost:4321`
6.  如需桌面殼體，執行 `npm run app:dev`
7.  如需網頁正式構建，執行 `npm run build`

詳細工程指南：[docs/ENGINEERING-GUARDRAILS.md](../docs/ENGINEERING-GUARDRAILS.md) · [docs/TESTING-CI.md](../docs/TESTING-CI.md) · [docs/RELEASE.md](../docs/RELEASE.md)

---
*Est. MMXXVI · Bibliotheca Vitae · Ars Longa, Vita Brevis.*
