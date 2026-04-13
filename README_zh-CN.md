<div align="center">
  <h1 align="center">🌿 Digital Garden</h1>
  <p align="center">
    <strong>Bibliotheca Vitae</strong>
  </p>
  <p align="center">
    <em>策展生命之灵，筑造数字圣所</em>
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
      简体中文 | 
      <a href="README_zh-TW.md">繁体中文</a> | 
      <a href="README_la.md">Latin</a> | 
      <a href="README_ja.md">日本語</a> | 
      <a href="README_ko.md">한국어</a> | 
      <a href="README_es.md">Español</a>
    </strong>
  </p>
</div>
<br/>

**Bibliotheca Vitae** 超越了博客的定义。这是一座数字花园，15 世纪手抄本美学与 21 世纪工程技艺在此交汇，将原始数据升华为被策展的生命叙事。

仓库分层与目录约定见 [docs/PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md)。
工程守卫、测试/CI 与发布现状见 [docs/ENGINEERING-GUARDRAILS.md](docs/ENGINEERING-GUARDRAILS.md)、[docs/TESTING-CI.md](docs/TESTING-CI.md)、[docs/RELEASE.md](docs/RELEASE.md)。

## 🏛️ 项目愿景：生命叙事

在碎片化的数码时代，脉络即灵魂。Bibliotheca Vitae 摒弃冷峻的行列式数据库思维，将每一次记录镌刻为 **Moment in Time**，一个受物理律驱动、值得被深度感知的视觉与文字实体。

* **感官沉浸**：藉由物理仿真动效，赋予数字资产以真实的质量与存在感。
* **古典美学**：Inter 与 Playfair Display 的组合，配合温暖克制的博物馆式极简界面。
* **策展礼致**：摈弃传统的表单逻辑，还归以画布的创作自由。

## ✨ 核心特性

### 🖼️ 动态画廊 The Gallery
受 Apple 极简主义启发的横向视差卷轴。用户能于时光长河中游弋，感知每一张卡片呼吸般的动态张力。

### 📖 深度叙事 The Narrative Experience
轻触条目，即可唤起无缝的深层遮罩。在此，你将探寻 **Moment in Time** 背后交织的 **Figure** 关键人物与随笔 **The Narrative**。

### 🖋️ 瞬间追加 Append Moment Editor
本项目的工程核心是视觉先行的一站式编辑器。
1.  **视觉锚点**：上传图像，为条目建立视觉背景。
2.  **原位镌刻**：在同一条编辑流里修改标题、人物、关键词、时刻与叙事。
3.  **草稿与归档更新**：新条目会先在本地自动保存草稿，桌面端也可重新打开并编辑已有个人条目。

## 🛠️ 技术底座 Tech Stack

基于共享的 Web + Tauri 桌面应用架构：

-   **核心**: Next.js 16 App Router, React 19, TypeScript
-   **动效**: Framer Motion, Lenis
-   **视觉**: Tailwind CSS v4, Lucide Icons
-   **图形**: React Three Fiber / Drei WebGL Particle System
-   **桌面端**: Tauri 2

## 💾 数据存储与跨平台支持

### 🖥️ 桌面网页版 (Windows / macOS / Linux)
- 推荐模式：连接本地文件夹，将每个条目直接写入磁盘中的 `.json` 文件
- 桌面网页功能：**浏览、创建、编辑、导出与导入**
- 在文件夹模式下，档案以文件形式存在，便于你自行查看、备份与同步
- 如果当前浏览器暂不支持或尚未授权文件夹访问，应用会回退到浏览器本地存储，作为兼容模式
- 完全离线运行，无需服务器存储

### 🪟 桌面应用 (Tauri)
- 通过原生文件系统访问使用同一套归档模型
- 条目会保存在磁盘上的 Bibliotheca Vitae 本地档案目录中
- 适合完整离线的桌面归档工作流

### 📱 移动端 (iOS / Android)
- **浏览 + 本地草稿**：可查看档案，也可在当前设备/浏览器中记录文字、元数据与图片草稿
- 移动端草稿仅保存在该设备上的浏览器本地存储中，更适合快速记录，不作为正式归档
- 发布到已连接文件夹、导入/导出以及完整档案管理，仍建议在桌面端完成
- 如需完整归档流程，请使用桌面浏览器或桌面应用

## 📥 下载与安装

你可以前往 [GitHub Releases](https://github.com/yuchenzhu-research/Digital-Garden/releases) 页面下载适用于 macOS 和 Windows 的预编译桌面端客户端。

Linux 目前仍是受支持的 **桌面网页版** 运行平台；但当前 workflow 尚未明确声明 Linux 桌面 App 发布自动化已启用。详见 [docs/RELEASE.md](docs/RELEASE.md)。

### 🍎 macOS 用户请注意
由于目前的 MVP 版本是直接通过 GitHub Actions 构建的，未配置 Apple 开发者证书签名，苹果系统的安全隔离机制会拦截它，并在首次打开时提示 **“文件已损坏，你应该将它移到废纸篓”**。
**这并非文件真的损坏，请按以下步骤解除隔离即可正常使用：**
1. 将下载的 `.dmg` 挂载后，将 App 拖入你的 `/Applications` (应用程序) 文件夹。
2. 打开「终端 (Terminal)」，运行以下命令移除隔离属性：
```bash
xattr -cr "/Applications/Bibliotheca Vitae.app"
```
3. 随后即可正常双击打开应用。

### 🪟 Windows 用户请注意
安装 `.exe` 时如果被 Windows Defender (安全中心/SmartScreen) 提示“Windows 已保护你的电脑”，请点击 **“更多信息”** -> **“仍要运行”** 即可。

## 🚀 快速开始

1.  克隆仓库。
2.  执行 `npm install` 安装依赖。
3.  先执行基线校验：`npm run lint && npm run test`
4.  通过 `npm run dev` 启动网页开发环境。
5.  打开 `http://localhost:4321`
6.  如需桌面壳体，执行 `npm run app:dev`
7.  如需网页生产构建，执行 `npm run build`

---
*Est. MMXXVI · Bibliotheca Vitae · Ars Longa, Vita Brevis.*
