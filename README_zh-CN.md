<div align="center">
  <h1 align="center">🌿 Digital Garden | Bibliotheca Vitae</h1>
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

## 🏛️ 项目愿景：生命叙事

在碎片化的数码时代，脉络即灵魂。Bibliotheca Vitae 摒弃冷峻的行列式数据库思维，将每一次记录镌刻为 **Moment in Time**，一个受物理律驱动、值得被深度感知的视觉与文字实体。

* **感官沉浸**：藉由物理仿真动效，赋予数字资产以真实的质量与存在感。
* **古典美学**：古典字体 Cinzel 与 EB Garamond 在此同现代极简主义交织，重构博物馆级别的阅读体验。
* **策展礼致**：摈弃传统的表单逻辑，还归以画布的创作自由。

## ✨ 核心特性

### 🖼️ 动态画廊 The Gallery
受 Apple 极简主义启发的横向视差卷轴。用户能于时光长河中游弋，感知每一张卡片呼吸般的动态张力。

### 📖 深度叙事 The Narrative Experience
轻触条目，即可唤起无缝的深层遮罩。在此，你将探寻 **Moment in Time** 背后交织的 **Figure** 关键人物与随笔 **The Narrative**。

### 🖋️ 瞬间追加 Append Moment Editor
本项目的工程核心是视觉先行的一站式编辑器。
1.  **视觉锚点**：拖入影像，即刻将其化为创作基底。
2.  **原位镌刻**：直接在预览位置敲击文字，省去一切多余的表单跳转。
3.  **粒子之变**：集成 Alet-style 粒子系统，支持 **Linear** 线性拉伸与 **Random** 随机碎裂两种解构模式。

## 🛠️ 技术底座 Tech Stack

基于单页应用 SPA 架构，为未来的 Electron 原生化做准备：

-   **核心**: Next.js 16 App Router, React 19, TypeScript
-   **动效**: Framer Motion, GSAP, React Lenis Smooth Scroll
-   **视觉**: Tailwind CSS v4 Oklch, Lucide Icons
-   **图形**: React Three Fiber / Drei WebGL Particle System

## 💾 数据存储与跨平台支持

### 🖥️ 桌面网页版 (Windows / macOS / Linux)
- 完整功能：**浏览、创建、编辑、导出与导入**
- 您创建的条目存储在浏览器本地
- **导出**：将数据下载为 `.json` 文件备份
- **导入**：从已导出的文件恢复数据
- 完全离线运行，无需服务器存储

### 📱 移动端 (iOS / Android)
- **只读模式**：浏览现有档案和瞬间
- 文件上传/导出功能需使用桌面浏览器
- 创建和管理条目请在电脑上访问

## 🚀 快速开始

1.  克隆仓库。
2.  执行 `npm install` 安装依赖。
3.  通过 `npm run dev` 启动本地开发环境。
4.  访问地址：`https://bibliotheca-vitae.vercel.app` 或 `http://localhost:4321`。

---
*Est. MMXXVI · Digital Garden | Bibliotheca Vitae · Ars Longa, Vita Brevis.*
