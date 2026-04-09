# CHANGELOG

> 记录项目对外发布版本的可读变更。  
> 不机械罗列所有 commits，只总结对用户、协作者、维护者真正重要的变化。

---

## [Unreleased]

### 新增
- 新增首页 page orchestration 第一阶段收口：
  - 新增 `src/hooks/useHomePageController.ts`
  - 新增 `src/components/features/home/` 下的首页 section 组件
- 从 2026-04-09 起，后续新版本和新工作请从这一节继续累积。

### 变更
- `src/app/page.tsx` 进一步收薄，从“大页面同时持有逻辑与大段 JSX”收口为以 controller + section 组装为主的壳层。

### 修复
- 修复了首页主文件继续膨胀、页面壳体与具体 section 渲染混杂的问题。

### 移除
- 从 `src/app/page.tsx` 中移除了大块首页 section 的内联实现，改由独立 feature section 承载。

### 兼容性影响
- 无

### 迁移提示
- 后续如果继续收首页，不要再把 section 细节和页面控制逻辑重新塞回 `page.tsx`。
- 2026-04-09 之前的历史已经压缩进下方“历史基线”节点；新的版本记录建议从本节开始继续累积。

---

## [2026-04-09：工程守卫、CI 基线与 Agent 协作约束] - 2026-04-09

### 新增
- 新增 `docs/ENGINEERING-GUARDRAILS.md`，正式定义 App Shell、UI、Visual、Services、Tauri Native Boundary 的工程边界。
- 新增 `docs/TESTING-CI.md`，明确默认验证命令、CI 职责与后续测试扩展方向。
- 新增 `docs/RELEASE.md`，把 Desktop Web 与 Desktop App 的平台支持叙事拆开，避免发布说明继续混淆。
- 新增 `.github/workflows/ci.yml`，为仓库建立 lint、guardrail tests、web build、Rust formatting 的最小工程守卫。
- 新增 `tests/guardrails.test.mjs`，对关键工程文档、平台承诺与 Tauri 元数据做轻量回归保护。
- 新增 `CHANGELOG.md` / `DEVLOG.md` 作为正式工程日志入口，后续从 2026-04-09 起持续滚动记录。

### 变更
- `AGENTS.md` 与 `CLAUDE.md` 升级为正式协作约束入口，不再只保留通用命令说明。
- `README.md` / `README_zh-CN.md` 现在明确区分“Linux 桌面网页支持”与“Linux 桌面 App 发布自动化未确认”。
- `package.json` 新增 `test` 与 `check` 脚本，把 `lint + test + build` 收口为默认验证基线。
- `src-tauri/Cargo.toml` 从占位元数据调整为真实项目元数据。
- `docs/PROJECT-STRUCTURE.md` 将 changelog/devlog 和新的工程守卫文档纳入正式文档层认知。

### 修复
- 修复了当前仓库缺少常规 CI 工作流、只能依赖 release workflow 充当事实验证入口的问题。
- 修复了根目录缺少正式工程日志文件、历史演进难以按阶段追踪的问题。
- 修复了 README 对 Linux 支持的表达过于宽泛、容易让人误解为 Linux 桌面 App 已经正式进入自动发布矩阵的问题。
- 修复了 Tauri Rust 包元数据仍停留在模板默认值、容易继续对外暴露占位信息的问题。

### 移除
- 移除了“仅靠口头约定维护结构与协作规则”的状态，改由正式文档与测试守卫承载。

### 兼容性影响
- 本轮不改动运行时功能与用户数据结构，主要影响工程协作方式、发布表达和维护约束。
- Desktop Web 的 macOS / Windows / Linux 支持表达不变，但 Desktop App 发布表述比过去更严格。

### 迁移提示
- 后续工程工作应优先遵守 `AGENTS.md`、`CLAUDE.md`、`docs/ENGINEERING-GUARDRAILS.md`、`docs/TESTING-CI.md`、`docs/RELEASE.md`。
- 新的版本条目请继续累积到 `Unreleased`；详细日常过程请记录到 `DEVLOG.md`。

---

## [历史基线：项目启动至 2026-04-08] - 2026-04-08

### 新增
- 从最初的静态 Markdown / 展陈尝试，逐步建立了 Bibliotheca Vitae 作为 Digital Garden 的核心产品形态。
- 建立了基于 Next.js 16 App Router、React 19、Tailwind CSS v4、Framer Motion、GSAP、Lenis、React Three Fiber 的前端骨架。
- 建立了横向档案卷轴、详情叠层、视觉优先编辑器、搜索筛选、个人条目编辑、本地图片与备份导入导出等核心体验。
- 建立了 Tauri v2 桌面壳、本地文件系统访问、全局快捷键、托盘、窗口视觉效果等桌面能力。
- 建立了多存储模式：Browser Local、Folder Mode、Tauri Native，以及 Mobile Local Drafts。
- 建立了多语言 README、架构文档、项目结构说明与长期蓝图文档。

### 变更
- 项目从早期 `Bibliotheca Markdown Museum / Bibliotheca Academica` 方向，逐步收口为当前的 `Bibliotheca Vitae` 本地优先数字花园。
- 技术栈从 Astro/内容集合阶段切换到 Next.js SPA，再演进到共享的 Web + Tauri 桌面应用架构。
- 产品叙事从“静态展览页面”演进为“可浏览、可追加、可编辑、可备份的本地档案系统”。
- 项目结构从根目录堆叠逐步收口到 `src/`、`src-tauri/`、`docs/`、多语言 README 的分层方式。
- 版本在 2026-03-23 收口到 `v3.0.0` 桌面 MVP 架构节点。

### 修复
- 修复了图像焦点、卡片布局、滚动触发、详情页滚动锁定、编辑器叠层集成、Tauri invoke 结果处理、WebFS 类型与生产构建、Folder Mode 图片渲染等关键问题。
- 修复了文档边界、命名漂移、README 语言一致性、运行时状态和 lint 卫生、静态资源与文档素材混放等工程问题。
- 修复了本地备份与图片嵌入闭环，使导出/导入在多存储模式下更一致。

### 移除
- 移除了 Astro 时代和旧命名阶段遗留的主要结构。
- 逐步降低了历史命名、旧视觉稿和根目录杂糅布局的影响。

### 兼容性影响
- Desktop Web 一直覆盖 macOS / Windows / Linux，但 Desktop App 发布能力到 2026-04-08 为止主要仍以 macOS / Windows 为明确文档范围。
- Mobile 继续是受限运行面，重点是浏览与本地草稿，不等同于完整桌面归档工作流。

### 迁移提示
- 后续继续演进时，应优先沿 `src/services/` 的 contract 与 adapter 边界推进，而不是重新把复杂度堆回页面层。
- 视觉系统、发布说明、工程守卫与多语言 README 应保持同步，不要再出现“代码一套、文档一套、workflow 一套”的漂移。
