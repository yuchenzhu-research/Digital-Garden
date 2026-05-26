# Frontend Code Complexity & Architecture Audit Report

本报告对项目前端代码 (`src/`) 下的 React 组件、Hooks 架构和状态管理进行了全方位的混乱度审计，旨在发现影响项目健壮性与后续迭代的设计硬伤。

---

## 1. 核心架构缺陷与混乱清单

### A. 全能胖控制器异味 (God Controller Smell)
* **定位**: `src/hooks/useHomePageController.ts`
* **问题**: 
  * 该 Hook 充当了主页的所有状态大本营，向 `page.tsx` 暴露了多达 **24 个状态变量和操作回调**。
  * 里面混合了完全不相干的业务域：WebGL 粒子滚动的弹簧状态 (`scrollProgress`)、当前展示条目的浮层切换 (`selectedDocId`)、条目编辑器弹层状态 (`editorEntry`)、纯本地的专注遮罩设置 (`dimmingIntensity`)、全文模糊搜索的状态同步 (`searchQuery`) 以及数据刷新生命周期。
  * 任何一个微小状态（如搜索文字变化或专注条调节）的改变，都会强行触发 `useHomePageController` 的重新求值，进而导致 `page.tsx` 下所有非 Memorized 子组件（包括重度的 Three.js Canvas3D 容器）进行无意义的重渲染（Re-render）。

### B. UI 组件与存储适配器的逻辑泄露 (Leakage of Storage Concerns)
* **定位**: `src/components/features/SettingsPanel.tsx` 与 `src/components/features/EntryEditor.tsx`
* **问题**:
  * 界面层组件（如设置面板和编辑器）强行绑定并依赖了存储路由细节。编辑器必须接收 `mobileDraftMode` 以决策是否读写 `idb-keyval`，设置面板也直接注入了 `connectFolderMode` 逻辑。
  * 这导致 UI 组件知晓了底层数据库和目录连接的具体实现细节（WebFS 还是 Tauri Native），完全违背了“依赖倒置”和“界面与状态隔离”的软件设计原则。

### C. 双搜索输入框冲突与状态混乱
* **定位**: `src/components/features/home/MuseumHero.tsx` 与 `src/components/ui/FilterBar.tsx`
* **问题**:
  * 顶部 Hero 区域设计了一个搜索框，底部 Browser 区域的 FilterBar 又设计了一个搜索框。两者的 `onChange` 回调均连接到全局 `setSearchQuery` 触发联动。
  * 这种“双重单向流同步”使得在任意一个搜索框输入字符时，整个页面需要进行多次重排，容易导致长页面滚轮定位抖动和输入字符明显迟滞。

---

## 2. MVP 简化与收束重构方案 (Refactoring Roadmap)

为确保项目地基牢固，我们将通过以下三个阶段对前端和 API 层进行极限收束：

### 阶段一：消灭 God Controller，实现状态域细分
* **具体做法**:
  * 将 `dimmingIntensity` (专注控制) 及 `connectFolderMode` (文件夹连接) 从主页大 Hook 中完全剥离，收缩到 `SettingsPanel.tsx` 及其独立的 Hook 内自治管理。
  * `page.tsx` 只作为大包裹层，不再感知琐碎的 UI 控制细节。

### 阶段二：封装统一的数据获取与草稿抽象层
* **具体做法**:
  * 改造 `entryService.ts`，为上层暴露统一的 `saveDraft` 和 `getDraft` 接口。Service 自动在内部根据当前设备和存储模式（Tauri/WebFS/Mobile）分流，让前端编辑器 `EntryEditor.tsx` 彻底摆脱对 `mobileDraftMode` 等环境参数的判断。

### 阶段三：清理无用文件和无用状态
* **具体做法**:
  * 清理多余语言 README 并归档至 `locales/`，清理不必要的中间设计文档，收束技能包目录。
