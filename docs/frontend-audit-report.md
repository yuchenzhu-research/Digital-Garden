# Frontend Code Complexity & Architecture Audit Report
# 前端代码混乱度与架构设计缺陷审计报告

本报告对项目前端代码 (`src/`) 下的 React 组件、Hooks 架构、状态同步与样式组织进行了全方位的混乱度审计，旨在发现影响项目健壮性、运行时性能与后续迭代的架构缺陷。

---

## 1. 滚动触发的全局高频重绘循环 (Render Loop & State Sync Bottleneck)

### 问题分析
在 `src/app/page.tsx` 中，页面的滚动状态是通过 React 的 Local State 驱动的：
* [page.tsx#L40-L68](file:///Users/yuchenzhu/Desktop/github/Bibliotheca%20Vitae/src/app/page.tsx#L40-L68): 解构了 `scrollProgress` 并将其传递给 `<Canvas3D>` 和遮罩层的 `style.opacity`。
* [FeaturedArchiveSection.tsx#L19](file:///Users/yuchenzhu/Desktop/github/Bibliotheca%20Vitae/src/components/features/home/FeaturedArchiveSection.tsx#L19): 将滚动监听传递给子组件 `<HorizontalScrollSection onScrollProgress={onScrollProgressChange}>`。
* [HorizontalScrollSection.tsx#L30-L34](file:///Users/yuchenzhu/Desktop/github/Bibliotheca%20Vitae/src/components/ui/HorizontalScrollSection.tsx#L30-L34): 使用 Framer Motion 的 `useMotionValueEvent` 监听 `scrollYProgress` 的改变，并在每次变化时立即触发 `onScrollProgress(latest)`，进而回调 `setScrollProgress(latest)`。

> [!WARNING]
> 由于滚动事件的触发频率是像素级的（在快速滚动时，一秒内可产生数百次 `change` 事件），这导致 React 状态 `scrollProgress` 在极短时间内进行超高频的更新。
> 这种模式会强行触发整个主页树 `page.tsx` 及其所有非 Memorized 子组件（如 `MuseumHero`, `ArchiveBrowserSection`, `PersonalCollectionSection`, `HomeFooter` 等）的全量 React 重新渲染（Re-render）。这极大地消耗了 CPU 资源，并会在 Tauri 桌面端上造成明显的滚动顿挫（Lag/Stuttering）。

### 修改建议
1. **消除 React State**：将 `scrollProgress` 从 `useHomePageController` 的 React 状态中移除，改用 Framer Motion 的 `MotionValue`（即直接使用 `scrollYProgress`）。
2. **底层直连更新**：
   * 将遮罩层的 `style={{ opacity: scrollProgress * dimmingIntensity }}` 更改为 `<motion.div style={{ opacity: maskOpacity }} />`，其中 `maskOpacity` 是通过 `useTransform(scrollYProgress, ...)` 生成的 MotionValue，这样它的改变只会直接改变 DOM，而不会触发 React 调度与组件树重新渲染。
   * 粒子系统 `<Canvas3D>` 可以通过 React Context 或者直接在 R3F 的 `useFrame` 渲染循环中直接读取 scroll 物理量，从而摆脱 React 的 State 传参机制。

---

## 2. 界面组件与存储/服务编排的职责泄漏 (Leakage of Storage Concerns)

### 问题分析
根据 [CONSTITUTION.md:II](file:///Users/yuchenzhu/Desktop/github/Bibliotheca%20Vitae/CONSTITUTION.md#L67-L80) 的分层边界规范，`src/components/features/` 不做 Service 层的事；`src/components/ui/` 则是通用 UI 组件，不选存储模式，不做环境判断。但当前代码中存在多处严重泄漏：

1. **编辑器直连 Service**：
   * [EntryEditor.tsx#L14](file:///Users/yuchenzhu/Desktop/github/Bibliotheca%20Vitae/src/components/features/EntryEditor.tsx#L14) 与 [EntryEditor.tsx#L97-L160](file:///Users/yuchenzhu/Desktop/github/Bibliotheca%20Vitae/src/components/features/EntryEditor.tsx#L97-L160): 编辑器组件直接导入了业务服务单例 `entryService`，并在组件内部自行处理 `uploadImage`、`updateEntry`、`saveEntry` 等具体的文件 IO / 存储服务调用。
   * [useEntryEditorDraftBridge.ts#L4](file:///Users/yuchenzhu/Desktop/github/Bibliotheca%20Vitae/src/hooks/useEntryEditorDraftBridge.ts#L4): 直接导入 `entryService` 以及 `mobile-draft` 等特定适配器方法，并依据 `mobileDraftMode` 进行手动的存储流控制分流。
2. **通用 UI 容器的职责倒置与环境硬编码**：
   * `src/components/ui/DataManagement.tsx` 承载了高度具体的导入/导出备份 `.json` 文件并嵌入图片的业务。它不仅依赖了业务 Hook `useDataManagementController`，而且被错误地分类到了通用 `ui/` 目录中。
   * [TitleBar.tsx#L11](file:///Users/yuchenzhu/Desktop/github/Bibliotheca%20Vitae/src/components/ui/TitleBar.tsx#L11): 基础 UI 的标题栏中直接导入了 `useDesktopWindow` 进行系统窗口操作。
   * [useDesktopWindow.ts#L4](file:///Users/yuchenzhu/Desktop/github/Bibliotheca%20Vitae/src/hooks/useDesktopWindow.ts#L4): 窗口控制 Hook 直接从 `entryService` 中导入了 `isRunningInTauri`，将底层平台环境判定手段塞进了一个特定的业务层单例里。

### 修改建议
* **提取回调接口 (Inversion of Control)**：将 `EntryEditor` 与 `entryService` 解耦，改为通过 Props 暴露 `onPublish`、`onImageUpload` 回调，将数据交互逻辑提升至主页 Page/Orchestrator 中。
* **重构目录边界**：将 `DataManagement` 移至 `components/features/` 目录中，因为它带有明显的强业务属性；同理将 `TitleBar` 移入 `components/features/` 或者是专有的布局套件内。
* **隔离环境判定**：将 `isRunningInTauri` 的检测从 `entryService` 中移除，直接引用 `src/utils/env.ts` 中的 `isTauri` 函数，消除循环依赖。

---

## 3. 功能缺失与死控制器逻辑 (Dead Controller Logic & Missing Features)

### 问题分析
在 `useHomePageController` 中，我们为用户条目的编辑和删除提供了完整的状态 and 回调封装：
* [useHomePageController.ts#L144-L183](file:///Users/yuchenzhu/Desktop/github/Bibliotheca%20Vitae/src/hooks/useHomePageController.ts#L144-L183): 实现了 `handleDeleteEntry` 和 `handleEditEntry`。
* [useHomePageController.ts#L207-L208](file:///Users/yuchenzhu/Desktop/github/Bibliotheca%20Vitae/src/hooks/useHomePageController.ts#L207-L208): 将这两个方法在 Controller Hook 的返回值中暴露。

> [!IMPORTANT]
> 然而，这两个方法在 `src/app/page.tsx` 中根本没有被解构，整个组件树中也完全没有将它们传给任何底层交互组件（如 `ExhibitDetail` 或 `PersonalCollectionSection`），导致了**完全的多余/死代码**。
> 其直接后果是，当用户点击自己创建的 personal moments 时，弹出的 `ExhibitDetail` 浮层没有“编辑”和“删除”的 UI 按钮，用户**根本无法修改或删除自己本地的档案条目**。

### 修改建议
1. **修改 ExhibitDetail 的 UI**：增加 “Edit Moment” 和 “Delete Moment” 的按钮，仅当对应的文档属于用户创建的数据（以 `user-` 开头或通过类型守卫判定为用户文档）时渲染。
2. **桥接控制器回调**：在 `page.tsx` 中将 `handleEditEntry` 和 `handleDeleteEntry` 传给 `ExhibitDetail` 并在按钮触发时调用。

---

## 4. UI 冗余与高频并行异步加载 (UI/Feature Redundancy)

### 问题分析
目前在主页的整个视图结构中，有 **三处完全不同的地方** 提供了 Backup JSON 导出/导入的控制面板与按钮：
1. `PersonalCollectionSection` 里的 `DataManagement` 按钮触发的悬浮菜单：[PersonalCollectionSection.tsx#L37](file:///Users/yuchenzhu/Desktop/github/Bibliotheca%20Vitae/src/components/features/home/PersonalCollectionSection.tsx#L37)。
2. `HomeFooter` 底部的导出/导入按钮：[HomeFooter.tsx#L56-L71](file:///Users/yuchenzhu/Desktop/github/Bibliotheca%20Vitae/src/components/features/home/HomeFooter.tsx#L56-L71)。
3. 左下角 `SettingsPanel` 内部的 JSON 备份选项：[SettingsPanel.tsx#L142-L191](file:///Users/yuchenzhu/Desktop/github/Bibliotheca%20Vitae/src/components/features/SettingsPanel.tsx#L142-L191)。

这三个组件各自在内部实例挂载了 `useDataManagementController` 这个 Hook。
每当组件挂载或页面重新渲染时，这些 Hook 都会独立、并行发起底层 IO 查询：
* [useDataManagementController.ts#L46-L58](file:///Users/yuchenzhu/Desktop/github/Bibliotheca%20Vitae/src/hooks/useDataManagementController.ts#L46-L58): 每次 mount 都会触发 `getUserEntryCount()` 和 `getStorageLocation()` 以获取文件量和路径。

这造成了**极高的交互冗余性**和**重复的底层 IO / 异步网络查询**。

### 修改建议
* **收拢 UI 交互**：移除 `HomeFooter` 和 `PersonalCollectionSection` 里的导入/导出功能，仅在 `SettingsPanel` 中保留一个统一的“数据中心/备份管理”选项。
* **状态提升 (Lifting State Up)**：如果确实需要多处展示条目数量 and 存储路径，应将这些状态提升到 `useHomePageController` 中，只运行一次查询，再分发给各个子组件，消除冗余的 Hook 实例化。

---

## 5. 废弃的 Hook、服务与多余代码 (Dead Hooks & Dead Services)

### 审计发现

1. **废弃 Hook**：
   * `src/hooks/useArchiveStats.ts`：该 Hook 暴露了 `useArchiveStats` 用于读取实时档案统计。但经过全局检索，**没有一处组件或代码引用了该 Hook**。
2. **废弃 Service**：
   * `src/services/archive-stats.ts`：该服务被用来计算各类目下的文章数量。全局检索表明，它**仅在废弃的 `useArchiveStats.ts` 中被导入使用**，没有任何其他活代码依赖它。
3. **废弃的全局 Toast 机制**：
   * `src/components/ui/Toast.tsx` 中的全局事件订阅 `toastListeners`、`showToast` 以及全局 Hook `useToast` 属于**完全未使用的死代码**。
   * 这是因为 `EntryEditor.tsx` 在自己组件内部通过 React Local State (`toastVisible`, `toastMessage`) 和自定义 callback 实现了一套独立的 Toast 逻辑，完全没有与全局的 `showToast` 对接。

### 修改建议
* 安全删除 `src/hooks/useArchiveStats.ts` 和 `src/services/archive-stats.ts` 文件，减少打包体积。
* 清理 `Toast.tsx` 中导出的多余 API，或者将 `EntryEditor.tsx` 改为导入使用全局 `showToast`，从而实现全局 Toast 的单例复用。

---

## 6. 样式语义 Token 落地率不足 (Token Adherence Issue)

### 审计发现
尽管在 `globals.css` 中已经为项目定义了非常高雅且完善的 Digital Renaissance 语义 tokens（如 `var(--primary)`, `var(--glass-border)`, `var(--glass-bg)` 等），但许多通用 UI / Feature 组件中依然在使用硬编码的颜色配置，这为将来向 `docs/UI-OVERHAUL-PLAN.md` 描述的 Dark Apple Glass 迁移带来了极高昂的替换成本：

1. **`Toast.tsx`**：
   * [Toast.tsx#L50](file:///Users/yuchenzhu/Desktop/github/Bibliotheca%20Vitae/src/components/ui/Toast.tsx#L50): 成功指示器背景硬编码为 `oklch(0.55 0.18 20)` 和 `oklch(0.45 0.12 25)` 渐变，而不是引用主色或成功色 token。
   * [Toast.tsx#L77](file:///Users/yuchenzhu/Desktop/github/Bibliotheca%20Vitae/src/components/ui/Toast.tsx#L77): 文本颜色硬编码为 `oklch(0.25 0.02 30)`，无法适应未来的主题切换。
2. **`FilterBar.tsx`**：
   * [FilterBar.tsx#L33](file:///Users/yuchenzhu/Desktop/github/Bibliotheca%20Vitae/src/components/ui/FilterBar.tsx#L33): 聚焦阴影硬编码使用了 `rgba(219, 184, 102, 0.32)` 和 `rgba(219, 184, 102, 0.08)`，而不是调用 `var(--primary)` 的透明通道变体。
3. **`featured-card.tsx`**：
   * [featured-card.tsx#L33](file:///Users/yuchenzhu/Desktop/github/Bibliotheca%20Vitae/src/components/ui/featured-card.tsx#L33): 边框与阴影使用了 `border-slate-200/60` 与 `shadow-blue-100/30` 纯 Tailwind 特色颜色，并未适配项目主轴的 Renaissance 调色盘。

### 修改建议
* 使用 `var(--primary)`，`var(--ink-strong)`，`var(--glass-shadow)` 等已有的全局变量彻底替换这些组件内的硬编码 `oklch()` 与 Tailwind 具体调色板 class，确保整个应用能一键跟随 `globals.css` 中声明的主题风格进行平滑切换。
