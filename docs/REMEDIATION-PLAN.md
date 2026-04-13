# 审计修复计划 — Remediation Plan

> 基于 2026-04-13 全仓库审计（`docs/HEALTH-REPORT-2026-04-13.md`）产出的行动清单。
> 风险登记簿在 `CONSTITUTION.md` §IV 中维护，本文件只跟踪修复任务的进度。

---

## P0 — 立即修复（影响正确性）

- [ ] **修复 `WebStorageAdapter.saveEntry()` 忽略入参 ID**
  - 文件：`src/services/web-storage.ts:116`
  - 问题：总是 `generateId()`，应改为 `entry.id || generateId()`
  - 对齐 WebFS 和 Native 适配器的行为

- [ ] **修复 Rust `get_archive_dir()` Windows 兼容性**
  - 文件：`src-tauri/src/commands.rs:106-112`
  - 问题：使用 `std::env::var("HOME")`，Windows 上可能不存在
  - 方案：改用已有依赖 `dirs::document_dir()`

---

## P1 — 近期处理（减少维护负担）

- [ ] **移除 `gsap` 废弃依赖**
  - `package.json` 中 `gsap: "^3.12.7"` 存在但 `src/` 中 0 处 import

- [ ] **`@types/three` 移到 devDependencies**
  - 类型包不应出现在 production dependencies

- [ ] **将 `CONSTITUTION.md` 加入 guardrail 测试**
  - 文件：`tests/guardrails.test.mjs` 的 `core engineering docs exist` 检查列表

- [ ] **补齐多语言 README 缺失内容**
  - ja / ko / es / la / zh-TW 缺失：基线校验步骤、macOS/Windows 安装提示、工程文档链接、下载与安装章节
  - 至少添加"更多信息请参见英文版"的提示

---

## P2 — 中期改进（提升架构弹性）

- [ ] **提取存储适配器公共逻辑**
  - 目标：`getEntrySummaries()`, `generateId()`, URL passthrough 等重复代码
  - 方案：base adapter 抽象类或 shared mixin 模块

- [ ] **组件中 `rgba()` 硬编码迁移到 CSS token**
  - Toast(5) / TitleBar(2) / Hero(1) / FilterBar(1) / featured-card(1) 共 10+ 处
  - 新增 glassmorphism / scrim / shadow token 到 `globals.css`

- [ ] **评估并清理 Tauri legacy commands**
  - `backup_to_documents` / `get_backup_path` / `LegacyPayload`
  - 确认前端无调用点后可移除

- [ ] **让 `CLAUDE.md` 继承 `AGENTS.md` 减少重复**
  - 当前 77 行 vs 77 行近乎相同
  - 方案：CLAUDE.md 只保留差异项，开头声明继承 AGENTS.md

- [ ] **为存储适配器添加 contract tests**
  - fixture-driven，至少覆盖 `saveEntry`→`getEntry` 往返
  - 可先从 `WebStorageAdapter`（内存中可运行）开始

---

## P3 — 远期准备（架构预留）

- [ ] 在 `StorageRepository` 中预留分页查询接口
- [ ] 为 SQLite 热索引设计 migration path
- [ ] 为 CRDT 同步在 Entry 类型中预留 vector clock
- [ ] 评估 Tauri Mobile 或 React Native 移动端方案
