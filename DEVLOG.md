# DEVLOG

---

## 2026-04-09 / 第二阶段完成：Editor 与存储相关 UI 收口

### 相关 commits
- `5b0cf31` Extract EntryEditor draft and form hooks
- `a02fec6` Split EntryEditor into section components
- `43c2d36` Extract SettingsPanel storage controller
- `e83e36c` Extract DataManagement controller hook

### 本次修改
- 第二阶段完整收口了三块高风险 UI：
  - `src/components/features/EntryEditor.tsx`
  - `src/components/features/SettingsPanel.tsx`
  - `src/components/ui/DataManagement.tsx`
- `EntryEditor` 现在分成两层：
  - 状态/草稿桥接 hook：
    - `src/hooks/useEntryEditorFormState.ts`
    - `src/hooks/useEntryEditorDraftBridge.ts`
  - editor section 组件：
    - `src/components/features/editor/AutoResizeTextarea.tsx`
    - `src/components/features/editor/EntryEditorImageStage.tsx`
    - `src/components/features/editor/EntryEditorHero.tsx`
    - `src/components/features/editor/EntryEditorSidebar.tsx`
    - `src/components/features/editor/EntryEditorBody.tsx`
    - `src/components/features/editor/EntryEditorActions.tsx`
- `SettingsPanel` 新增 `src/hooks/useSettingsPanelController.ts`：
  - 承接 environment gating
  - 承接 Folder Mode 连接行为
  - 承接连接中状态与 reload 策略
- `DataManagement` 新增 `src/hooks/useDataManagementController.ts`：
  - 承接 export/import 动作
  - 承接 storage state refresh
  - 承接消息状态和 timeout 清理
  - 承接 file input ref 与 dropdown state
- 收口后主文件体积变化：
  - `EntryEditor.tsx`: `631 -> 250`
  - `SettingsPanel.tsx`: `138 -> 131`
  - `DataManagement.tsx`: `271 -> 181`

### 解决的问题
- 解决了 `EntryEditor.tsx` 同时持有状态、autosave、draft hydrate、发布动作和大段渲染结构的问题。
- 解决了 `SettingsPanel.tsx` 直接持有环境判断、Folder Mode 连接和页面 reload 策略的问题。
- 解决了 `DataManagement.tsx` 直接持有导入导出 orchestration、storage refresh 和 timeout 生命周期的问题。
- 把第二阶段的目标真正落成了“UI 组件负责展示，controller hook 负责 orchestration”的结构，而不是只把 helper 换了个地方继续堆。

### 影响范围
- `src/components/features/EntryEditor.tsx`
- `src/components/features/editor/`
- `src/hooks/useEntryEditorFormState.ts`
- `src/hooks/useEntryEditorDraftBridge.ts`
- `src/components/features/SettingsPanel.tsx`
- `src/hooks/useSettingsPanelController.ts`
- `src/components/ui/DataManagement.tsx`
- `src/hooks/useDataManagementController.ts`
- `CHANGELOG.md`
- `DEVLOG.md`

### 风险 / 未完成事项
- `EntryEditor` 虽然已经不是大总管，但 publish action 和图片上传仍在主组件壳层里，后续还有继续收口空间。
- `SettingsPanel` 和 `DataManagement` 目前只做到 controller 抽离，还没有统一成更高层级的 storage surface contract。
- 这轮还没有补 UI/controller 的专项 smoke tests；目前仍主要依赖 lint、build 和仓库级 guardrails。

### 下一步
- 第三阶段进入 `src/services/entryService.ts` 与 storage adapters，把 facade 和 contract 真正对齐。
- 优先检查 `src/services/web-fs-storage.ts`、`src/services/native-storage.ts`、`src/services/mobile-draft.ts` 的重复表达和环境切换逻辑。

---

## 2026-04-09 / 第二阶段第一批：EntryEditor 草稿桥接与表单状态抽离

### 相关 commits
- `5b0cf31` Extract EntryEditor draft and form hooks

### 本次修改
- 从 `src/components/features/EntryEditor.tsx` 中抽出两个专用 hook：
  - `src/hooks/useEntryEditorFormState.ts`
  - `src/hooks/useEntryEditorDraftBridge.ts`
- `useEntryEditorFormState.ts` 现在承载：
  - 标题、figure、moment、narrative、keywords、image 的表单状态
  - keyword add/remove 行为
  - draft snapshot 生成
- `useEntryEditorDraftBridge.ts` 现在承载：
  - mobile draft / desktop draft adapter 选择
  - draft hydrate
  - autosave
  - discard
  - close 时持久化
  - `lastSaved` 管理
- `src/components/features/EntryEditor.tsx` 收口为：
  - 图片上传/移除
  - publish/update 调用
  - toast
  - 编辑器布局与交互渲染
- 拆分后，`EntryEditor.tsx` 从 631 行降到 521 行。

### 解决的问题
- 解决了 `EntryEditor.tsx` 同时持有表单状态、draft storage bridge 和渲染层的问题。
- 解决了 mobile draft 与 desktop draft 逻辑直接内联在组件主体里、继续扩大单文件复杂度的问题。
- 为下一批继续拆 editor sub-sections 或 image/meta/publish actions 提供了更稳定的状态入口。

### 影响范围
- `src/components/features/EntryEditor.tsx`
- `src/hooks/useEntryEditorFormState.ts`
- `src/hooks/useEntryEditorDraftBridge.ts`
- `CHANGELOG.md`
- `DEVLOG.md`

### 风险 / 未完成事项
- `EntryEditor.tsx` 仍然保留了大量渲染结构、图片上传行为和 publish action，离最终目标还有距离。
- `AutoResizeTextarea` 仍然内联在 Editor 文件里。
- 这批还没有收 `SettingsPanel.tsx` 和 `DataManagement.tsx` 的 storage mode/fallback 逻辑。

### 下一步
- 继续拆 `EntryEditor.tsx` 的 render sections，把 image stage、metadata/sidebar、narrative body、floating actions 分离。
- 再进入 `SettingsPanel.tsx` 与 `DataManagement.tsx`，把 UI 层里的 storage 切换和刷新逻辑继续收紧。

---

## 2026-04-09 / 第一阶段：首页 orchestration 拆薄

### 相关 commits
- `45d7a10` Extract home page controller hook
- `d0a7c43` Extract home page sections

### 本次修改
- 把首页主控制逻辑从 `src/app/page.tsx` 抽到新的 `src/hooks/useHomePageController.ts`。
- controller 现在集中承载这些职责：
  - 用户条目加载
  - mobile draft 状态刷新
  - 搜索与分类筛选
  - editor / detail overlay 状态
  - dimming intensity 偏好
  - 页面动作，如 create/edit/delete/clearFilters
- 把首页中三块大 section 和 footer 从 `page.tsx` 中拆出，新增：
  - `src/components/features/home/FeaturedArchiveSection.tsx`
  - `src/components/features/home/PersonalCollectionSection.tsx`
  - `src/components/features/home/ArchiveBrowserSection.tsx`
  - `src/components/features/home/HomeFooter.tsx`
- 拆分后，`src/app/page.tsx` 的职责收口为：
  - 动态加载重型组件
  - 消费 home controller
  - 组装 section、overlay 与 editor

### 解决的问题
- 解决了首页文件同时持有大量状态编排和大段 section JSX 的问题。
- 解决了“页面壳层”和“内容 section”没有明确边界，导致 `page.tsx` 持续增长的问题。
- 为下一阶段继续拆 Editor 和 settings/data UI 打下了更稳定的页面层边界。

### 影响范围
- `src/app/page.tsx`
- `src/hooks/useHomePageController.ts`
- `src/components/features/home/`
- `CHANGELOG.md`
- `DEVLOG.md`

### 风险 / 未完成事项
- 这轮还没有触及 `EntryEditor.tsx`、`SettingsPanel.tsx`、`DataManagement.tsx` 的职责收口。
- `useHomePageController.ts` 目前仍然偏大，它是一个中间收口点，不是最终形态。
- 搜索/filter、personal collection、archive browser 虽然已经拆成 section，但还没有进入更细的动作与 view-model 分层。

### 下一步
- 第二阶段进入 `EntryEditor.tsx` 与存储相关 UI。
- 后续要继续把 `useHomePageController.ts` 内的部分逻辑沿 controller / selector / action 边界继续拆开。

---

## 2026-04-09 / 工程守卫、CI 基线与日志体系建立

### 相关 commits
- `6b8b8c4` Establish engineering guardrails and CI baseline

### 本次修改
- 为当前仓库正式建立了工程守卫文档体系：
  - `docs/ENGINEERING-GUARDRAILS.md`
  - `docs/TESTING-CI.md`
  - `docs/RELEASE.md`
- 升级了 `AGENTS.md` 和 `CLAUDE.md`，把它们从“通用命令提示”提升为正式协作入口：
  - 明确运行面：Desktop Web / Mobile Web / Tauri Desktop App
  - 明确层级边界：App Shell / Feature / UI / Visual / Services / Tauri Native
  - 明确 Agent pipeline：先审计、再改动、再验证、再同步文档
- 给仓库补上了真正的日常 CI：
  - 新增 `.github/workflows/ci.yml`
  - 将 `lint`、`guardrail tests`、`web build`、`cargo fmt --check` 串成最小工程验证链路
- 给当前工程补上了轻量级仓库守卫测试：
  - 新增 `tests/guardrails.test.mjs`
  - 用 `node --test` 守卫关键文档、平台承诺和 Tauri 元数据
- 给根目录补上 `CHANGELOG.md` 和 `DEVLOG.md`，以后不再让历史变更只散落在 commit message 里。
- 更新了 `README.md`、`README_zh-CN.md`、`docs/PROJECT-STRUCTURE.md`、`package.json`、`src-tauri/Cargo.toml`，让工程约束、发布表述和验证命令对齐到当前现实。

### 解决的问题
- 解决了当前仓库只有 release workflow、没有常规 CI 守卫的问题。
- 解决了工程边界主要靠口头说明，没有正式文本和自动检查兜底的问题。
- 解决了 README 对 Linux 支持说法容易被误解为 Linux 桌面 App 也已自动发版的问题。
- 解决了根目录没有正式 changelog/devlog、项目演进脉络只能靠翻 git log 的问题。
- 解决了 `Cargo.toml` 仍保留模板默认元数据的问题。

### 影响范围
- `AGENTS.md`
- `CLAUDE.md`
- `README.md`
- `README_zh-CN.md`
- `docs/PROJECT-STRUCTURE.md`
- `docs/ENGINEERING-GUARDRAILS.md`
- `docs/TESTING-CI.md`
- `docs/RELEASE.md`
- `.github/workflows/ci.yml`
- `tests/guardrails.test.mjs`
- `package.json`
- `src-tauri/Cargo.toml`
- `CHANGELOG.md`
- `DEVLOG.md`

### 风险 / 未完成事项
- 这轮建立的是“仓库级 guardrails”，还没有进入页面 orchestrator、storage adapter、Tauri commands 的深层拆分。
- 当前测试仍然偏轻，主要是文档/结构/发布承诺守卫，还没有覆盖 `src/services/` contract、页面状态编排、导入导出 smoke。
- `next/font` 在受限网络环境下构建仍然依赖外部字体下载；本地验证时这一点需要区分“网络限制”与“真实构建错误”。

### 下一步
- 优先拆 `src/app/page.tsx`，把页面 orchestration 继续收薄。
- 再拆 `src/components/features/EntryEditor.tsx`，把上传、草稿、发布和布局状态分层。
- 然后收 `src/services/entryService.ts`、`src/services/web-fs-storage.ts`、`src/services/native-storage.ts`，让 facade 与 adapter 边界更稳定。

---

## 2026-04-08 / 历史基线：项目启动至正式日志体系建立前

### 相关 commits
- `2026-02-12` ~ `2026-02-15`：从早期静态档案/展陈形态转向 Next.js SPA 与 Digital Renaissance UI
- `0ba233d` feat: initialize Tauri v2 desktop app environment
- `fd45325` feat(tauri): integrate native file system, global shortcuts, and custom title bar
- `d5a9db0` feat(web): implement dual-mode storage with local file import/export
- `530a806` feat: implement native desktop visuals, system tray, global shortcuts and web file system access API parity
- `c6a899d` refactor: move source code to src/ directory
- `adb9a2c` feat: unify backup management across storage adapters
- `c9ede20` feat: add mobile local draft mode
- `5e43a07` chore: setup desktop mvp architecture and capabilities
- `176a1f5` docs: add long-term blueprint and architectural roadmap

### 本次修改
- 项目最初从静态 Markdown / 展陈方向起步，经历了多轮命名与定位变化，最终逐步收口为当前的 `Bibliotheca Vitae`。
- 早期架构经历了 Astro 内容集合、静态档案与学术展陈阶段，随后在 2026-02-14 重构到 Next.js SPA。
- 2026-02-14 至 2026-02-15 期间，项目集中完成了：
  - 横向卷轴与卡片叙事
  - 详情叠层
  - 编辑器叠层
  - 视觉主题与背景层次
  - 自定义光标与更强的画册感编排
- 2026-02-16 起，项目进入 Tauri v2 与本地存储集成阶段：
  - 原生文件系统
  - 全局快捷键
  - 桌面标题栏/窗口能力
  - Web 端 dual-mode storage
  - 搜索、筛选、图片管理
- 2026-02-22 到 2026-03-11，逐步建立了更完整的本地优先体验：
  - native desktop visuals
  - Web File System parity
  - 个人条目编辑
  - 跨 adapter 备份管理
  - 本地图片嵌入备份
  - mobile local draft mode
  - 架构文档与 repo boundary 文档
- 2026-03-23，完成 `v3.0.0` 桌面 MVP 架构节点，并补齐 Blueprint 与下载安装说明。

### 解决的问题
- 解决了项目早期定位不断变化导致命名、UI 语言和技术栈不稳定的问题，逐步收口到当前产品方向。
- 解决了“只有展陈、没有本地归档闭环”的问题，补上了编辑、存储、导入导出与桌面壳能力。
- 解决了多存储模式下图片和备份不一致的问题。
- 解决了多语言 README、架构说明、结构边界与实际代码逐步脱节的问题。

### 影响范围
- `src/app/`
- `src/components/features/`
- `src/components/ui/`
- `src/components/visual/`
- `src/services/`
- `src/lib/`
- `src-tauri/`
- `README*.md`
- `docs/`

### 风险 / 未完成事项
- 到 2026-04-08 为止，页面 orchestration、Editor 状态、storage facade 与 adapter、Tauri commands 仍然有明显大文件压力。
- 虽然视觉体验已经成型，但 motion 和 section choreography 还没有充分 primitive 化。
- Desktop Web / Mobile Web / Tauri Desktop 的能力边界虽然已有文档表达，但工程收束和测试守卫还不够完整。

### 下一步
- 从 2026-04-09 开始，后续工作不再继续追加“泛历史回顾”，而是按日把真正进行的工程工作记录在上面的新条目里。
