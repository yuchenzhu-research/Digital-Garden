# Project Structure / 项目结构

## 目标

这个仓库先按四层边界维护，避免把产品源码、文档、构建产物、Agent 配置混在一起：

1. **源码层**：真正参与应用运行与构建的代码和资源
2. **文档层**：给人看的项目说明与设计文档
3. **本地产物层**：构建输出、缓存、依赖目录
4. **Agent 配置层**：本地 AI 工具配置、技能、缓存

## 根目录规则

- 根目录保留面向仓库入口的文件：`README*.md`、`LICENSE`、`package.json`、`next.config.ts`、`tailwind.config.ts`、`tsconfig.json`
- 多语言 `README*.md` 继续放在仓库最外层，方便 GitHub 首页与多语言切换
- 较长的内部说明文档统一收敛到 `docs/`
- 根目录不堆放构建产物，也不把本地 Agent 技能目录当成产品结构的一部分

## 四层边界

| 层级 | 当前目录 | 说明 |
| --- | --- | --- |
| 源码层 | `src/`, `src-tauri/`, `public/` | Web 前端、Tauri 桌面端、运行时静态资源 |
| 文档层 | `README*.md`, `LICENSE`, `docs/` | 对外入口文档与内部结构说明 |
| 本地产物层 | `.next/`, `out/`, `node_modules/`, `src-tauri/target/` | 构建产物、依赖、导出结果，应忽略提交 |
| Agent 配置层 | `AGENTS.md`, `CLAUDE.md`, `.agents/`, `.claude/`, `.Codex/`, `.agent/` | AI 工具入口说明与本地技能/缓存 |

## 当前建议目录认知

### 1. 源码层

- `src/app/`：Next.js App Router 入口
- `src/components/`：业务组件、UI 组件、视觉组件
- `src/services/`：Web / Tauri 存储适配与仓储抽象
- `src/lib/`：静态数据、几何与通用类型
- `src-tauri/`：桌面端原生壳、命令、窗口配置
- `public/`：运行时静态资源，例如图片、PDF、图标

### 2. 文档层

- 根目录 `README*.md`：项目首页与多语言说明
- `docs/`：放结构说明、架构说明、发布说明等长文档

建议后续逐步补充：

- `docs/ARCHITECTURE.md`
- `docs/RELEASE.md`

### 3. 本地产物层

以下目录属于本地生成，不应纳入“项目结构说明”：

- `.next/`
- `out/`
- `node_modules/`
- `src-tauri/target/`

### 4. Agent 配置层

- `AGENTS.md`、`CLAUDE.md` 是可跟踪的入口说明
- `.agents/`、`.claude/`、`.Codex/`、`.agent/` 属于本地工具目录
- 这些目录用于技能、缓存、规则或工具配置，不应视为业务源码或产品文档

## 当前整理决定

- 保留多语言 `README*.md` 在根目录
- 新增 `docs/PROJECT-STRUCTURE.md` 作为结构说明入口
- 将 `.agents/` 与 `.Codex/` 视为本地 Agent 目录并忽略提交
- 将版本说明与当前依赖对齐：README 统一为 Next.js 16

## 后续可继续做的事

- 确认 `public/docs/` 是否为运行时资源；如果只是仓库文档素材，再考虑迁移到 `docs/assets/`
- 把架构说明、数据流、发布流程分别拆到 `docs/ARCHITECTURE.md` 和 `docs/RELEASE.md`
- 继续清理根目录，只保留入口文件和工程配置
