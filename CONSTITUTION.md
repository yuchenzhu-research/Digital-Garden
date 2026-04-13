# CONSTITUTION.md — Bibliotheca Vitae 项目宪法

> **地位**：本文件是 Bibliotheca Vitae 仓库的最高级别治理文档。
> 所有 Agent（Codex / Claude / Gemini / Windsurf 等）在开始任何工作前 **必须** 完整阅读本文件。
> 人类贡献者在做架构级变更前也应参照本文件。
>
> **维护规则**：本文件应随项目演进持续更新。每当发现新风险、解决旧问题、或架构发生显著变化时，
> 应在本文件对应章节追加记录，而不是新建独立文档。

---

## I. 项目身份 — 不可动摇的根基

### 这是什么

Bibliotheca Vitae（生命图书馆）是一个 **本地优先的数字花园 / 个人档案馆应用**。

它将文艺复兴手稿美学与现代前端工程相结合，把原始数据提升为有策展感的生命叙事。
核心理念是：每一条记录都是一个 **时间中的瞬间（Moment in Time）**，而非数据库中的一行。

### 绝对不变量

无论未来功能怎么扩展、UI 怎么改版、技术栈怎么升级，以下原则 **永远成立**：

1. **本地优先**：数据在用户设备上，不依赖云服务器。这不是 SaaS。
2. **三个运行时表面**：桌面 Web、移动 Web、Tauri 桌面应用 — 它们是同一个产品家族。
3. **内容即灵魂**：用户的档案条目（Entries）是最重要的数据，系统的一切设计为它们服务。
4. **薄原生层**：Tauri/Rust 层只做文件系统和桌面集成，不承载产品逻辑。
5. **文档即工程**：项目的文档体系是其核心特征，不是附属品。

### 技术栈锚定（当前版本）

| 层 | 技术 |
|---|---|
| 框架 | Next.js 16 App Router, React 19, TypeScript |
| 动效 | Framer Motion, GSAP, Lenis |
| 样式 | Tailwind CSS v4, Lucide Icons |
| 3D | React Three Fiber / Drei |
| 桌面 | Tauri 2 |
| 存储 | 本地文件系统 + IndexedDB + File System Access API |

---

## II. 架构守卫 — 边界与职责

### 分层边界

```
src/app/           → 页面壳（page.tsx 必须保持薄壳，不放存储逻辑/编辑器内部状态/重动画）
src/components/
  features/        → 业务组件（Hero / Editor / Detail / Settings），不做 service 层的事
  ui/              → 通用 UI 组件，不选存储模式，不做环境判断
  visual/          → 装饰/动效组件，不获取档案数据，不持有业务规则
src/hooks/         → 控制器 hooks + 工具 hooks（Controller 模式命名应一致）
src/services/      → 存储合约 + 适配器 + Facade（项目真正的核心）
src/lib/           → 静态数据 + 领域类型 + 通用工具
src-tauri/         → 薄原生边界（commands.rs 暴露 FS 命令，不做产品编排）
```

### 存储合约体系

这是项目最关键的架构：

```
StorageRepository (接口)
  ├── WebStorageAdapter      (browser-local fallback)
  ├── WebFSStorageAdapter    (Folder Mode, File System Access API)
  └── NativeStorageAdapter   (Tauri 原生文件系统)

storage-runtime.ts  → 运行时适配器选择 + lazy proxy
entryService.ts     → 薄 Facade，不是第二个 app shell
storage-backups.ts  → 导入导出合约
mobile-draft.ts     → 移动端 IndexedDB 草稿（与主存储隔离）
```

**守卫规则**：
- 三个适配器必须完整实现 `StorageRepository` 接口，签名一致
- `entryService.ts` 只是委托层，不膨胀
- 备份导入导出必须共享同一个 entry parsing 合约
- 新增存储路径时，优先扩展已有合约，不加平行路径

### 四层仓库边界

| 层级 | 目录 | 说明 |
|---|---|---|
| 源码层 | `src/`, `src-tauri/`, `public/` | 真正参与构建的代码和资源 |
| 文档层 | `README*.md`, `CHANGELOG.md`, `DEVLOG.md`, `LICENSE`, `docs/` | 给人看的说明 |
| 产物层 | `.next/`, `out/`, `node_modules/`, `src-tauri/target/` | 构建输出，不是项目结构 |
| Agent 配置层 | `AGENTS.md`, `CLAUDE.md`, `.agents/`, `.claude/`, `.Codex/`, `.agent/` | 本地工具配置，不是产品源码 |

---

## III. 质量关卡 — 每次变更前的检查清单

### 最小验证基线

```bash
npm run lint          # ESLint
npm run test          # Node test runner + guardrails
npm run build         # Next.js 生产构建
```

Tauri/Rust 变更额外运行：
```bash
cargo fmt --check --manifest-path src-tauri/Cargo.toml
```

### 文档同步检查

任何涉及架构、发布、平台支持、工作流变更的代码修改，**必须** 同步更新以下文档中的对应内容：

- `README.md` + 对应语言版本
- `docs/ARCHITECTURE.md`
- `docs/RELEASE.md`
- `docs/TESTING-CI.md`
- `docs/ENGINEERING-GUARDRAILS.md`
- `CHANGELOG.md`（追加到 [Unreleased]）

### 版本号同步

以下三处版本号必须保持一致：
- `package.json` → `version`
- `src-tauri/tauri.conf.json` → `version`
- `src-tauri/Cargo.toml` → `version`

### 发布纪律

- Git tag 是版本锚点，不自动触发发布
- Release workflow 只能手动触发，产出 draft release
- 不要声称 Linux 桌面应用已发布（release workflow 当前只覆盖 macOS + Windows）

---

## IV. 已知风险登记簿 — 持续追踪的技术债

> 每当发现新风险或解决旧风险时，在此追加或标记。格式：`[状态] 描述 — 首次记录日期`
> 状态：🔴 活跃风险 / 🟡 已缓解 / 🟢 已解决

### 存储层
- 🔴 **三个存储适配器（51KB+）存在公共逻辑重复** — 2026-04-13
  - `web-storage.ts` (14KB) / `web-fs-storage.ts` (22KB) / `native-storage.ts` (15KB)
  - 应评估提取 base adapter 或 shared mixins 的可行性
- 🔴 **适配器无运行时 contract tests** — 2026-04-13
  - 当前测试只有 guardrail（文件存在性 + 导出检查），缺少对 `saveEntry`→`getEntry` 往返的实际验证
- 🟡 **`storage-runtime.ts` lazy proxy 的边界条件** — 2026-04-13
  - SSR 环境、HMR 热切换、adapter 不存在时的行为需要进一步验证
- 🔴 **全量加载瓶颈** — 2026-04-13
  - 当前 `getEntries()` 全量反序列化，条目量 >500 时可能成为性能瓶颈
  - 长期方案见 `docs/BLUEPRINT.md` Phase 1（SQLite 热索引）

### 样式与设计系统
- 🔴 **语义 token 落地率不明** — 2026-04-13
  - `globals.css` 已定义 canvas/surface/ink/accent 等 token
  - 但组件可能仍大量硬编码颜色值，token 实际引用率需审计
- 🟡 **Motion 碎片化** — 2026-04-13
  - 组件中可能散布大量 inline Framer Motion 配置
  - `docs/DESIGN-FOUNDATION.md` 定义了 motion semantics 但代码中落地程度未确认
- 🔴 **UI Overhaul 方向切换准备** — 2026-04-13
  - `docs/UI-OVERHAUL-PLAN.md` 计划从 warm editorial → dark Apple Glass
  - 当前 token 层是否足够支撑这个切换需要评估

### 测试与 CI
- 🔴 **测试覆盖薄弱** — 2026-04-13
  - 4 个测试文件（guardrails + backups），无组件测试、无适配器 contract tests
  - `npm run test` 使用 `--experimental-strip-types`（Node 实验性功能）
- 🟡 **CI build 只跑 Ubuntu** — 2026-04-13
  - lint + test 跨三平台，但 `npm run build` 只在 ubuntu-latest 跑
  - 如果有平台特定的构建问题可能被遗漏

### 依赖
- 🟡 **`@types/three` 在 dependencies 而非 devDependencies** — 2026-04-13
- 🟡 **三套动画库共存** — 2026-04-13
  - `framer-motion` + `gsap` + `lenis`，是否全部在用、是否有合并空间需确认
- 🟡 **Next.js 16 + React 19 前沿版本** — 2026-04-13
  - 兼容性问题需要持续关注

### 文档同步
- 🟡 **7 个语言版本的 README 同步风险** — 2026-04-13
  - 英 / 中 / 繁中 / 日 / 韩 / 西 / 拉丁 — 每次功能变更需要同步 7 个文件
  - 各语言版本可能已存在信息差异
- 🟡 **`AGENTS.md` vs `CLAUDE.md` 近乎相同** — 2026-04-13
  - 两个文件维护成本高，漂移风险已存在

### Tauri 层
- 🟡 **Tauri capabilities 权限最小化未确认** — 2026-04-13
- 🟡 **`tauri.conf.json` 版本号与 `package.json` 同步状态未确认** — 2026-04-13

---

## V. 架构弹性评估 — 未来增长的预留空间

### 当前状态判断

项目已经从"逐步堆起来的原型"演进到了"有意识治理的早期系统"：
- 存储合约抽象已建立（`StorageRepository` 接口）
- Controller hooks 模式已落地（页面壳与业务逻辑分离）
- 文档体系已形成（9 个 docs + AGENTS.md/CLAUDE.md）
- CI 多平台 + Desktop Smoke 已搭建

但距离"可稳定演化的系统"还差：
- 适配器公共逻辑未提取
- 设计 token 未实质落地到组件
- 测试保护网过薄
- 长期方向（SQLite / CRDT / 插件）的架构预留尚未开始

### 未来扩展点评估

| 未来方向 | 来源 | 当前合约是否够用 | 需要的准备 |
|---|---|---|---|
| SQLite 热索引 | BLUEPRINT Phase 1 | 合约接口可兼容，但 `getEntries()` 全量加载需改为分页 | 添加分页/查询参数到 `StorageRepository` |
| CRDT 同步 | BLUEPRINT Phase 2 | 合约不够用，缺少版本向量/冲突解决 | 需在 Entry 类型中预留 vector clock 字段 |
| Dark Apple Glass UI | UI-OVERHAUL-PLAN | 取决于 token 落地率 | 确保组件全部通过 token 引用颜色 |
| WASM 插件系统 | BLUEPRINT Phase 4 | 当前无扩展点设计 | 远期考虑 |

---

## VI. 持续审计维度 — Agent 每次工作前的心智模型

以下 9 个维度是项目健康度的持续监测点。每次做重要变更时，应评估变更对这些维度的影响：

1. **对外表达**：README 是否清晰、多语言是否同步、安装说明是否准确
2. **文档体系**：docs/ 与代码是否一致、CHANGELOG 是否及时更新
3. **目录结构**：各层边界是否清晰、命名是否一致
4. **存储架构**：合约完整性、适配器一致性、Facade 薄度
5. **组件边界**：features / ui / visual 是否各司其职
6. **设计系统**：token 引用率、motion 是否收敛
7. **测试覆盖**：关键路径是否有保护
8. **Tauri 层**：是否保持薄边界、权限是否最小化
9. **依赖健康度**：是否有废弃依赖、版本冲突、安全问题

---

## VII. 反模式清单 — 绝对不能做的事

1. ❌ **用 SaaS/云优先思维改造项目** — 这是本地优先应用
2. ❌ **在 `page.tsx` 中堆积存储逻辑、编辑器状态、复杂动画** — 它是薄壳
3. ❌ **让 UI 组件选择存储模式或做环境判断** — 那是 services 层的事
4. ❌ **让 Tauri/Rust 层承载产品编排逻辑** — 它只做 FS 和桌面集成
5. ❌ **在不更新文档的情况下改变架构或发布行为**
6. ❌ **声称 Linux 桌面应用已发布**（当前 release workflow 只有 macOS + Windows）
7. ❌ **混淆 Agent 配置层和产品源码层**（`.agents/` ≠ `src/`）
8. ❌ **在 `node_modules/` 或 `src-tauri/target/` 中找到的文件当作项目结构**
9. ❌ **未经验证就推送大规模重构** — 先 `npm run lint && npm run test && npm run build`
10. ❌ **删除 `DEVLOG.md` 或 `BLUEPRINT.md`** — 它们是项目记忆和愿景

---

## VIII. 整顿路线图 — 推荐的演进顺序

### Phase 0：零风险高收益（随时可做）
- 检查并修复多语言 README 信息差异
- 确认 `package.json` / `tauri.conf.json` / `Cargo.toml` 版本号一致
- 确认 `AGENTS.md` 与 `CLAUDE.md` 内容一致，考虑让一个引用另一个
- 清理 `CHANGELOG.md` [Unreleased] 中已过时的条目

### Phase 1：加固基础（近期冲刺）
- 为存储适配器添加 contract tests（fixture-driven）
- 审计 `globals.css` token 的组件引用率，推进实际落地
- 评估三个适配器的公共逻辑提取空间
- 补充 `docs/PROJECT-STRUCTURE.md` 中"后续可做的事"的完成状态

### Phase 2：结构收敛（中期演进）
- 提取适配器 base adapter 或 shared mixins
- 归拢 Framer Motion 配置为共享 motion primitives
- 在 `StorageRepository` 中预留分页查询接口
- 推进 `docs/DESIGN-FOUNDATION.md` 中的设计系统实质建设

### Phase 3：架构预留（远期准备）
- 为 SQLite 热索引设计 migration path
- 为 CRDT 同步在 Entry 类型中预留 vector clock
- 评估 Tauri Mobile 或 React Native 移动端方案

---

## IX. 本文件的维护规则

1. **谁维护**：任何对项目架构有影响的变更，负责人应同步更新本文件
2. **怎么更新**：
   - 新风险 → 追加到 §IV 风险登记簿
   - 风险解决 → 将状态从 🔴 改为 🟢 并注明日期
   - 架构变更 → 更新 §II 对应段落
   - 新的不变量 → 追加到 §I
3. **不要另起炉灶**：不要为同类信息创建新的根级 .md 文件，在本文件对应章节追加
4. **版本追踪**：重大变更在文件末尾的变更日志中记录

---

## 变更日志

| 日期 | 变更 |
|---|---|
| 2026-04-13 | 初始版本：基于全仓库审计创建，覆盖项目身份、架构守卫、风险登记、演进路线 |
