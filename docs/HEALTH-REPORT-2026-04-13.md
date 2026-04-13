# 项目总体体检报告 — 2026-04-13

> **审计范围**：全仓库端到端审计（README → docs → 源码 → 测试 → CI → 依赖 → Tauri）
> **基线验证**：`npm run lint` ✅ | `npm run test` ✅ (19/19) | `npm run build` ✅
> **结论分级**：✅ 已确认 | ⚠️ 高概率推断 | ❓ 未确认/需验证

---

## 总体评级

| 维度 | 评级 | 摘要 |
|---|---|---|
| 对外认知 | 🟢 良好 | 7 语言 README 结构统一，但存在信息差异 |
| 文档体系 | 🟢 良好 | 9 个 docs + 根级文档形成完整治理，CONSTITUTION.md 已就位 |
| 目录结构 | 🟢 良好 | 四层边界清晰，命名基本一致 |
| 存储架构 | 🟡 需关注 | 合约设计优秀，但适配器冗余大、缺 contract tests |
| 组件边界 | 🟢 良好 | Controller hooks 模式落地扎实 |
| 设计系统 | 🟡 需关注 | Token 已定义但落地率有差距，hardcoded 颜色散布 |
| 测试覆盖 | 🟡 需关注 | Guardrail 测试有效但覆盖面薄 |
| Tauri 层 | 🟡 需关注 | 功能完整但存在多处可改进点 |
| 依赖健康度 | 🟢 良好 | 核心依赖前沿但合理，有小问题 |

**综合判断**：项目已从"原型堆砌"演进为"有意识治理的早期系统"。核心架构决策（存储合约、Controller hooks、薄页面壳）都是正确的。主要技术债集中在存储适配器冗余和测试覆盖不足上。

---

## I. 对外认知层（README）

### ✅ 已确认的优点
- 7 个语言版本（EN / zh-CN / zh-TW / ja / ko / es / la）结构统一
- 多语言切换导航栏在每个版本中保持一致
- 技术栈列表、平台支持声明、安装注意事项完整
- macOS 解除隔离和 Windows SmartScreen 提示在中英文版本中都有说明
- Linux 桌面应用未过度声称（正确标注为"桌面网页版运行平台"）

### ⚠️ 多语言 README 信息差异

| 差异项 | README_zh-CN | 其他语言版本 |
|---|---|---|
| 快速开始步骤 | 包含第 3 步 `npm run lint && npm run test` 基线校验 | ja / ko / es / la / zh-TW 缺失此步骤 |
| 工程文档链接 | 包含 ENGINEERING-GUARDRAILS / TESTING-CI / RELEASE 链接 | ja / ko / es / la / zh-TW 仅链接 PROJECT-STRUCTURE |
| macOS/Windows 安装提示 | 有详细说明 | ja / ko / es / la / zh-TW 无此段落 |
| 下载与安装章节 | 有完整的 Release 链接和 Linux 说明 | ja / ko / es / la / zh-TW 缺失 |

**结论**：`README.md`（英文）和 `README_zh-CN.md` 是最完整的两个版本。其余 5 个版本信息量明显少于这两个。

### 📋 建议
- Phase 0 级别：补齐 ja / ko / es / la / zh-TW 缺失的安装说明和工程文档链接
- 考虑在非主语言 README 中添加"更多信息请参见英文版"的提示

---

## II. 文档体系一致性

### ✅ 已确认
- 文档体系完整度高：`ARCHITECTURE.md` / `ENGINEERING-GUARDRAILS.md` / `TESTING-CI.md` / `RELEASE.md` / `PROJECT-STRUCTURE.md` / `LOCAL-AGENT-ASSETS.md` / `DESIGN-FOUNDATION.md` / `UI-OVERHAUL-PLAN.md` / `BLUEPRINT.md` 共 9 个 docs
- `CONSTITUTION.md` 作为根级宪法已建立，AGENTS.md / CLAUDE.md 已引用
- Guardrail 测试验证了文档与代码的关键一致性（架构边界、发布声明、Agent 资产定义等）
- 版本号三处同步：`package.json` = `tauri.conf.json` = `Cargo.toml` = `3.0.0` ✅

### ⚠️ 信息漂移风险
- **`AGENTS.md` vs `CLAUDE.md`**：这两个文件内容近乎相同（77 行 vs 77 行），仅第一行标题和个别措辞不同。维护两份几乎相同的文件增加了漂移风险。建议让 `CLAUDE.md` 明确声明"本文件继承 `AGENTS.md`，以下仅列出 Claude 特有配置"。
- **`docs/ENGINEERING-GUARDRAILS.md` vs `CONSTITUTION.md`**：这两份文档的架构守卫段落存在重叠。需要明确分工：CONSTITUTION 是宪法级治理，ENGINEERING-GUARDRAILS 是工程实操细则。

### ✅ `CONSTITUTION.md` 需要追加一项
- 应将 `CONSTITUTION.md` 加入 `tests/guardrails.test.mjs` 的 `core engineering docs exist` 检查列表。

---

## III. 目录结构与命名

### ✅ 已确认
- 四层边界（源码 / 文档 / 产物 / Agent 配置）清晰，`.gitignore` 正确排除 Agent 目录
- `src/components/` 三分法（features / ui / visual）落地一致
- `src/hooks/` 命名规范：Controller hooks 统一使用 `use...Controller` 后缀
- `src/services/` 文件命名合理（`storage-repository.ts` / `storage-runtime.ts` / `storage-backups.ts`）

### ⚠️ 小问题
- `src/components/ui/` 中混合了两种命名风格：
  - PascalCase 文件：`CustomCursor.tsx`, `DataManagement.tsx`, `FilterBar.tsx`, `Toast.tsx`
  - kebab-case 文件：`badge.tsx`, `bento-card.tsx`, `button.tsx`, `dialog.tsx`
  - 推测 kebab-case 文件来自 shadcn/ui 自动生成，PascalCase 是手写组件
  - 不影响功能但命名风格不统一
- `src/utils/env.ts` 是唯一的 utils 文件，可考虑在后续有更多 utils 时规范化

---

## IV. 存储架构

### ✅ 架构设计的优点
- `StorageRepository` 接口设计清晰，13 个方法覆盖完整 CRUD + 图片 + 草稿 + 导入导出
- 三个适配器都完整实现了接口：
  - `WebStorageAdapter` (497 行) — localStorage
  - `WebFSStorageAdapter` (625 行) — File System Access API
  - `NativeStorageAdapter` (521 行) — Tauri invoke
- `storage-runtime.ts` 的 lazy proxy + singleton 模式是正确的选择
- `storage-backups.ts` 和 `portable-images.ts` 作为共享合约被三个适配器统一引用 ✅
- `mobile-draft.ts` 独立于主存储链路，使用 idb-keyval，设计干净

### 🔴 主要问题

**1. 适配器冗余（最大技术债）**

三个适配器总计约 1,643 行代码，其中以下逻辑被重复实现：
- `generateId()` — WebStorage 和 WebFS 各自实现了一遍
- `sanitizeFilename()` — WebFS (TS) 和 Rust commands.rs 各实现一遍
- `getEntrySummaries()` — 三个适配器的实现几乎相同
- `uploadImage()` 对字符串 URL 直传的处理 — 三处完全相同
- `exportData()` / `importData()` 的 JSON 序列化模式 — 高度相似

**建议**：提取 `AbstractStorageAdapter` 基类或 shared mixin，将 `getEntrySummaries`, `generateId`, URL passthrough 等公共逻辑集中。

**2. Rust 端与 TS 端数据模型冗余**

- `EntryPayload` 在 `commands.rs:22-33` 和 `RustEntryPayload` 在 `native-storage.ts:29-40` 是手动对齐的
- 字段命名风格不同（Rust: `snake_case` → TS: `camelCase`），每次修改需要两端同步
- 无自动化 schema 验证

**3. `WebStorageAdapter` 额外导出了非合约函数**

- `web-storage.ts` 导出了 `exportToFile`, `importFromFile`, `hasUserEntries`, `getUserEntryCount` 等函数（第 382-497 行），这些不在 `StorageRepository` 接口中
- 这些函数直接操作 localStorage，绕过了适配器的实例方法
- 虽然可能是历史遗留，但违反了"通过统一合约操作存储"的原则

**4. `WebStorageAdapter.saveEntry()` 忽略了入参 `entry.id`**

```typescript
// web-storage.ts:116 — 总是生成新 ID，忽略了可能已有的 entry.id
const id = generateId();
```

而 `WebFSStorageAdapter.saveEntry()` 正确处理了这个情况：
```typescript
// web-fs-storage.ts:317 — 有 entry.id 就用它
const id = entry.id || generateId();
```

这是一个**已确认的行为不一致** ✅。

### ⚠️ Lazy Proxy 边界条件

`storage-runtime.ts` 的 `createLazyRepositoryProxy` 在 SSR 环境下返回一个 proxy，每次调用都会先 `getRepository()`。如果 `getRepository()` 在服务端被调用会怎样？当前代码通过 `typeof window === 'undefined'` 检查避免了这个问题，但没有显式的 SSR fallback adapter。

---

## V. 组件架构与边界

### ✅ 已确认的优点
- **Controller hooks 模式** 落地非常扎实：
  - `useHomePageController` — 首页编排
  - `useEntryEditorFormState` + `useEntryEditorDraftBridge` — 编辑器状态
  - `useSettingsPanelController` — 设置面板
  - `useDataManagementController` — 数据管理
- **Guardrail 测试强制执行边界**：
  - `page.tsx` 不允许直接 import services ✅
  - `SettingsPanel.tsx` 不允许直接调用 `getWebFS` / `requestDirectoryAccess` ✅
  - `DataManagement.tsx` 不允许直接调用 `exportToFile` / `importFromFile` ✅
  - `EntryEditor.tsx` 不允许内嵌 `AutoResizeTextarea` 等子组件定义 ✅

### ⚠️ 轻微边界违规

**`EntryEditor.tsx` 直接 import 了 services**：

```typescript
// EntryEditor.tsx:14-15
import entryService from '@/services/entryService';
import type { Entry } from '@/services/storage-repository';
```

`type` import 是合理的（只引入类型不引入运行时依赖），但 `entryService` 的运行时 import 意味着这个 feature 组件直接依赖了 service 层。根据 AGENTS.md 的架构守卫，`features/` 组件应通过 controller hooks 操作。不过考虑到 EntryEditor 是需要直接 save/update 的核心组件，这可能是有意的设计选择。

**`PersonalCollectionSection.tsx` import 了 `type { Entry }`**：
- 只是类型 import，不违规

---

## VI. 样式与设计系统

### ✅ 已确认
- `globals.css` 定义了完整的双层 token 系统：
  - **ShadCN UI 层**：`--background`, `--foreground`, `--card`, `--primary` 等标准 token
  - **语义基础层**：`--canvas-base`, `--surface-1`, `--ink-strong`, `--accent-strong`, `--line-subtle` 等
  - **Motion 基础层**：`--motion-duration-fast/base/slow/drift`, `--motion-ease-standard/emphasized/drift`
- Utility classes 使用语义 token：`.surface-panel`, `.surface-card`, `.bg-warm-paper`, `.btn-minimal` 等
- Guardrail 测试验证了 token 的存在 ✅

### ⚠️ Token 落地差距

**硬编码颜色散布**：
- `Toast.tsx`：5 处 `rgba()` 硬编码（glassmorphism 效果）
- `TitleBar.tsx`：2 处 `rgba()`
- `Hero.tsx`：1 处 `rgba()`
- `FilterBar.tsx`：1 处 `rgba()`
- `featured-card.tsx`：1 处 `rgba()`
- `Canvas3D.tsx`：1 处硬编码 hex（在注释中，已移除实际使用）
- `globals.css` 的 `.decoration-red-circle::before`：硬编码 `oklch(0.55 0.18 20)` 而非引用 `var(--accent-strong)`

**总计**：10+ 处组件内 `rgba()` 硬编码，主要用于 glassmorphism / shadow / scrim 效果。这些应迁移到 CSS token 或 utility class。

### ⚠️ GSAP 已不再使用

- `package.json` 中 `gsap: "^3.12.7"` 作为依赖存在
- 但 `src/` 目录中 **0 处** `gsap` import
- Lenis 仅在 `SmoothScrollWrapper.tsx` 中使用
- Framer Motion 在 22 个文件中使用（主力动效库）

**结论**：GSAP 是废弃依赖，可以安全移除。

---

## VII. 测试与 CI

### ✅ 已确认
- 19 个测试全部通过
- 测试分为 4 个文件，覆盖不同关注点：
  - `guardrails.test.mjs` (136 行) — 文档存在性、Agent 配置一致性、发布声明准确性
  - `controller-guardrails.test.mjs` (84 行) — Controller hooks 边界、组件不越界
  - `services-guardrails.test.mjs` (45 行) — 存储运行时合约、entryService 委托模式
  - `storage-backups.test.mjs` (72 行) — 备份合约的实际行为测试
- CI 跨平台：lint+test 在 Ubuntu/macOS/Windows 三平台跑
- Desktop smoke test 覆盖三平台 `npm run app:build -- --no-bundle`

### 🔴 覆盖缺口

| 缺失 | 影响 |
|---|---|
| 存储适配器 contract tests | 无法验证 saveEntry→getEntry 往返、updateEntry 合并、deleteEntry 清理等实际行为 |
| 组件渲染测试 | 无 React Testing Library 或 Playwright 组件测试 |
| E2E 测试 | 无端到端用户流程测试 |
| `storage-runtime.ts` 的模式选择测试 | lazy proxy、环境检测、adapter 切换逻辑无覆盖 |

### ⚠️ 测试基础设施
- 使用 Node 内置 test runner + `--experimental-strip-types`（实验性功能）
- 无 Jest / Vitest 配置，无测试覆盖率报告
- 当前测试本质上是"结构守卫"（检查文件存在和 import 模式），不是行为测试

### 📋 建议
- 优先添加存储适配器 contract tests（fixture-driven，在内存中运行 WebStorageAdapter）
- 将 `CONSTITUTION.md` 加入 `guardrails.test.mjs` 的文件存在性检查

---

## VIII. Tauri 原生层

### ✅ 已确认
- `commands.rs` (560 行) 实现了完整的 CRUD + 图片 + 导入命令
- `lib.rs` 正确注册了所有命令，包含 system tray、global shortcut、window vibrancy
- 版本号同步 ✅：`tauri.conf.json` = `Cargo.toml` = `3.0.0`
- CSP 设置为 null（允许 localhost dev），`macOSPrivateApi` 已启用（用于 vibrancy）
- 桌面 smoke test 覆盖三平台

### ⚠️ 需关注的问题

**1. `commands.rs` 中 `initialize_entries` 的 `_state` 参数未使用**
```rust
fn initialize_entries(_state: &State<AppState>) -> Vec<EntryPayload> {
```
函数签名接受 State 参数但不使用它，直接从磁盘读取。这不是 bug 但可能造成误解。

**2. `get_archive_dir()` 硬编码路径**
```rust
fn get_archive_dir() -> PathBuf {
    let home = std::env::var("HOME").unwrap_or_else(|_| ".".to_string());
    PathBuf::from(home)
        .join("Documents")
        .join("DigitalGarden")
        .join("Archive")
}
```
- 在 Windows 上 `HOME` 环境变量可能不存在（应使用 `dirs::document_dir()` 或 `USERPROFILE`）
- 已引入 `dirs = "6"` 依赖但未使用
- **这是一个潜在的 Windows 兼容性 bug** ⚠️

**3. Legacy commands 仍存在**
- `backup_to_documents` 和 `get_backup_path` 标记为 legacy 但仍注册在 invoke_handler 中
- `LegacyPayload` 类型仍被保留
- 建议评估是否还有前端调用点，如无则可以移除

**4. Capabilities 权限范围**
```json
{ "identifier": "fs:scope", "allow": [{ "path": "$APPDATA/**" }, { "path": "$DOCUMENT/**" }] }
```
- 允许访问整个 `$DOCUMENT` 目录，范围较大。但考虑到应用需要在 Documents 下创建 Archive 目录，这是合理的
- 未使用 `global-shortcut:default` capability，但 `lib.rs` 注册了 global shortcut 插件。⚠️ 需确认是否需要额外 capability 声明

**5. `save_entry` 的 ID 重复问题**
- `save_entry` 在条目有 id 时直接使用它，但同时 push 到 in-memory state 时不检查是否已存在相同 ID
- 可能导致内存中出现重复条目

---

## IX. 依赖健康度

### ✅ 版本状态
- `package.json` version: `3.0.0`
- `tauri.conf.json` version: `3.0.0`
- `Cargo.toml` version: `3.0.0`
- 三处一致 ✅

### 核心依赖评估

| 依赖 | 版本 | 状态 |
|---|---|---|
| next | 16.1.6 | 🟢 前沿但稳定 |
| react / react-dom | 19.1.0 | 🟢 前沿但稳定 |
| tailwindcss | ^4.1.3 | 🟢 v4 新版 |
| framer-motion | ^12.6.3 | 🟢 主力动效库 |
| @tauri-apps/api | ^2.5.0 | 🟢 Tauri 2 |
| three / @react-three/fiber | ^0.175.0 / ^9.1.2 | 🟢 3D 渲染 |
| lenis | ^1.3.3 | 🟡 仅 1 处使用 |
| gsap | ^3.12.7 | 🔴 **0 处使用，废弃依赖** |
| idb-keyval | ^6.2.1 | 🟢 轻量 IndexedDB 封装 |

### ⚠️ 问题
- **`gsap` 应从 dependencies 移除**：全项目 0 处 import
- **`@types/three` 在 dependencies 而非 devDependencies**：类型包应放在 devDependencies
- **`lenis` 使用面窄**：仅 `SmoothScrollWrapper.tsx` 一处使用，值得评估是否值得保留

---

## 风险矩阵总览

| 风险 | 严重度 | 确信度 | 来源 |
|---|---|---|---|
| 存储适配器冗余（1,643 行，大量重复逻辑） | 🔴 高 | ✅ 已确认 | §IV |
| `WebStorageAdapter.saveEntry()` 忽略入参 ID | 🔴 高 | ✅ 已确认 | §IV |
| Rust `get_archive_dir()` Windows 兼容性 | 🔴 高 | ⚠️ 高概率 | §VIII |
| 无存储适配器 contract tests | 🟡 中 | ✅ 已确认 | §VII |
| GSAP 废弃依赖残留 | 🟡 中 | ✅ 已确认 | §IX |
| 多语言 README 信息差异 | 🟡 中 | ✅ 已确认 | §I |
| 组件中 10+ 处 rgba 硬编码 | 🟡 中 | ✅ 已确认 | §VI |
| AGENTS.md vs CLAUDE.md 近乎相同 | 🟡 低 | ✅ 已确认 | §II |
| Tauri legacy commands 残留 | 🟡 低 | ✅ 已确认 | §VIII |
| `@types/three` 在错误的依赖类型中 | 🟢 低 | ✅ 已确认 | §IX |

---

## 推荐行动优先级

### 🔴 立即修复（影响正确性）
1. **修复 `WebStorageAdapter.saveEntry()` 忽略入参 ID 的问题**
2. **修复 Rust `get_archive_dir()` Windows 兼容性**（使用 `dirs::document_dir()`）

### 🟡 近期处理（减少维护负担）
3. 移除 `gsap` 依赖
4. 将 `@types/three` 移到 devDependencies
5. 为存储适配器添加 contract tests
6. 将 `CONSTITUTION.md` 加入 guardrail 测试
7. 补齐多语言 README 缺失内容

### 🟢 中期改进（提升架构弹性）
8. 提取适配器公共逻辑（base adapter 或 shared mixin）
9. 将组件中 rgba 硬编码迁移到 CSS token
10. 评估 Tauri legacy commands 移除
11. 让 `CLAUDE.md` 继承 `AGENTS.md` 减少重复

---

*报告基于 2026-04-13 的仓库快照，commit `9dd9f8d` on `visual-overhaul` 分支。*
