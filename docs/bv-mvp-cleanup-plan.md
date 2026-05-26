# Bibliotheca Vitae: MVP 混乱度清单与极简收束方案

根据最新对前端 (`src/`)、后端 (`src-tauri/`) 和数据层 (`src/services/`) 进行的深度代码审计，我们对项目的混乱程度进行评级，并制定了地基修复与代码收束的极简改造方案。

---

## 1. 混乱度评估与清单 (Complexity & Vulnerability Scorecard)

### 🔴 数据库与安全漏洞 (后端): 高度混乱 / 评分: 78/100
* **SQLite 并发写锁定**: 异步线程池一用一开 SQLite，在高频操作下没有配置 `busy_timeout`，极易导致写入静默失败。
* **批量导入无事务保证**: 导入大量数据产生数百次独立 IO，且单条失败直接静默吞噬，无原子回滚。
* **安全漏洞**: `save_image_from_bytes` 保存本地图片文件后缀未经过滤，存在任意可执行扩展名（exe, sh）写入漏洞。

### 🟡 数据路由与竞态风险 (数据层): 中度至高度混乱 / 评分: 72/100
* **异步加载竞态**: 页面初始化时，在 WebFS 连接建立的 1.5 秒空窗期内，系统默认读取了 LocalStorage，当 WebFS 初始化完成后，React UI 却完全没有通知更新机制，导致界面仍保留旧数据。
* **草稿读写不一致**: 自动保存草稿在初始化瞬间读了 LocalStorage，随后保存时却写进了本地物理文件夹，破坏了数据一致性。

### 🟡 界面控制大杂烩 (前端): 中度混乱 / 评分: 65/100
* **God Controller**: `useHomePageController.ts` 太过臃肿，混合了 3D Scroll、侧边面板、全局搜索、数据刷新，多达 24 个暴露接口，导致轻微设置调节引起大面积组件无谓重渲染。

### 🟢 技能包与多语言散落 (配置层): 中度混乱 / 评分: 50/100
* **配置重复**: `.claude/skills/` 下有大量垃圾占位文件与 `.agents/skills/` 冲突；7 国语言的 README 散落在根目录下。

---

## 2. 极简收束与大扫除方案 (Cleanup Implementation Steps)

我们不追求过渡的性能优化，只追求**地基的绝对牢固、API 接口的绝对清爽以及物理目录的极致干净**。我们将通过 3 个子任务同步完成最终的 MVP 收束：

### 任务 A：项目文件大清扫 (File System Sweep)
1. **多语言 README 归档**:
   * 新建 `locales/` 文件夹。将 `README_zh-TW.md`, `README_la.md`, `README_ja.md`, `README_ko.md`, `README_es.md` 移入。
   * 修改根目录下的 `README.md` 与 `README_zh-CN.md` 的顶部超链接，使其指向新的 `locales/...` 文件，保证链接可用。
2. **文档瘦身**:
   * 彻底删除 `docs/` 下的所有历史多余计划和旧报告，只保留 core documents。
3. **Skills 收束**:
   * 彻底删除 `.claude/skills/`，并删除 `.agents/skills/frontend-design` 空文件夹。

### 任务 B：后端 SQLite 注入安全过滤与写入加固 (Backend System Hardening)
1. **配置 busy_timeout**:
   * 在 `Connection::open()` 时一律配置 `PRAGMA busy_timeout = 5000;`，杜绝因并发写入产生的 `database is locked` 错误。
2. **批量导入事务封装**:
   * 将 `import_entries` 的循环插入包覆在 `conn.transaction()` 中，大幅减少磁盘 IO 次数并提供 ACID 原子回滚。
3. **物理图片上传安全沙盒**:
   * 在 `save_image` / `save_image_from_bytes` 写入物理文件时，对原 filename 后缀进行强类型白名单限制（只允许 png, jpg, jpeg, gif, webp, svg），直接过滤并抛出非法后缀，切断任意木马投放链路。

### 任务 C：数据加载阻断与 UI 刷新通信 (Frontend Logic Tightening)
1. **加载期 UI 阻断**:
   * 在存储模式初始化阶段在页面上提供轻量的 Loading 骨架屏阻断，防止过早触发 CRUD 交互。
2. **封装草稿适配分流**:
   * 将 mobileDraftMode 分支存取逻辑完全下沉至 `entryService.ts`，为上层 Editor 暴露无感的统一接口。
