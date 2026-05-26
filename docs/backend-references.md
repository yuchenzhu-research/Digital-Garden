# Premium Local-First & SQLite Backend References

这里整理了十个在 GitHub 上优秀的本地优先（Local-First）、基于 Tauri/Electron 结合 SQLite 数据库进行数据管理、备份与迁移的开源项目，作为本项目后端存储架构、资源物理删除和同步方案的设计参考。

---

## 1. [Joplin](https://github.com/laurent22/joplin)
* **技术栈**: Electron + React Native + SQLite
* **数据存储**: 所有笔记与元数据均保存在本地 SQLite 数据库中，图片和 PDF 等大文件则以物理文件存放在独立的 `resources` 文件夹，数据库中记录其相对路径。
* **物理资源删除**: 采用垃圾回收（GC）机制：当一条笔记被删除时，数据库中关联的资源引用计数减一，当计数归零时，后台服务会安全地物理删除磁盘上的图片。
* **参考价值**: 极其成熟的“SQLite 记录 + 本地物理附件管理”的范本，也是本项目本地图片保存与物理删除逻辑的源泉。

## 2. [Trilium Notes](https://github.com/zadam/trilium)
* **技术栈**: Node.js (Backend) + Electron + SQLite
* **数据存储**: 采用单文件 SQLite 进行层级笔记、版本历史和文件附件的完整存放。
* **同步与备份**: 提供客户端与自建服务器之间的差分同步（Sync Protocol），支持每天定时生成带有时间戳的 `.db` 物理备份。
* **参考价值**: 对树状结构和图谱关系的 SQLite 表达，以及多设备秒级差分同步的算法参考。

## 3. [AppFlowy](https://github.com/AppFlowy-IO/AppFlowy)
* **技术栈**: Flutter + Rust + SQLite
* **数据存储**: 核心协同引擎和底层数据读写通过 Rust 封装 rusqlite 实现，与前端进行高度抽象的 CRUD 通信。
* **数据库迁移**: 采用 Rust 编写的自定义 Migration Manager，在应用拉起时对比 schema 版本并应用 SQL 脚本。
* **参考价值**: Rust 多线程环境下对 SQLite 的生命周期管理，以及与跨平台前端的高性能消息机制。

## 4. [Logseq](https://github.com/logseq/logseq)
* **技术栈**: ClojureScript + Datomic (目前正在向 SQLite 数据库迁移)
* **数据存储**: 采用本地 Markdown/Org-mode 文件作为主存储，同时利用本地数据库对所有双链和标签建立高性能索引。
* **同步与备份**: 利用 Git 自动在本地/云端创建版本记录，并基于本地文件目录变更进行无感差分同步。
* **参考价值**: “本地纯文本文件作为真理源，SQLite 作为查询加速缓存”的双引擎架构，是数字花园极具弹性的设计思路。

## 5. [Notesnook](https://github.com/streetwriters/notesnook)
* **技术栈**: Electron + React + SQLite (SQLCipher 加密)
* **数据存储**: 本地 SQLite 经过端到端加密，防范系统被越权访问时数据泄露。
* **同步与备份**: 支持生成 `.backup` 加密文件导出，并实现多端云端零知识同步。
* **参考价值**: 针对安全和隐私要求较高的本地-第一应用对 SQLite 的加密处理和备份协议。

## 6. [Anytype](https://github.com/anyproto/anytype-ts)
* **技术栈**: Go/JS + Anydb (基于 SQLite 封装的加密数据同步引擎)
* **数据存储**: 基于本地 graph 拓扑模型构建，由 SQLite 存储版本节点。
* **同步与备份**: 基于 P2P（Libp2p）和备份节点实现无中心同步，数据优先存在本地。
* **参考价值**: 本地优先应用在没有中心服务器时的多端冲突解决（CRDTs）与数据一致性维持。

## 7. [Notes](https://github.com/nuttyartist/notes)
* **技术栈**: C++ + Qt + SQLite
* **数据存储**: 极简本地记事本，直接使用 SQLite 对笔记进行单文件存储。
* **物理资源删除**: 纯本地操作，直接在事务中将数据库记录与相应图片清空。
* **参考价值**: 极简、单线程 SQLite CRUD 的极致开发范本，代码干净利落。

## 8. [Tauri SQLite Starter (tauri-sqlite)](https://github.com/tauri-apps/tauri)
* **技术栈**: Tauri (Rust) + React + SQLite (`rusqlite`)
* **数据存储**: Tauri 官方推荐的 SQLite 读写模版，演示了如何通过 Rust State 模式跨线程共享 rusqlite Connection。
* **数据库迁移**: 随 Rust 静态编译的 SQL 文件在应用启动 setup 阶段执行。
* **参考价值**: 纯正的 Tauri-SQLite 指南，展示了如何返回类型安全的 Result 和处理 JS-Rust 边界的数据转换。

## 9. [Midinote](https://github.com/ryume/midinote)
* **技术栈**: Tauri + React + SQLite
* **数据存储**: 轻量级个人知识管理工具，将 Markdown 和标签完全结构化地存入本地数据库。
* **同步与备份**: 提供手动导出 JSON 以及备份整个 sqlite 文件的方案。
* **参考价值**: 适合作为小型开发项目的骨架，结构简单，极易上手。

## 10. [Obsidian Dataview Plugin](https://github.com/blacksmithgu/obsidian-dataview)
* **技术栈**: JavaScript + Local Index DB (类似 SQLite 的关系索引层)
* **数据存储**: 扫描用户 Markdown 文件夹下的 YAML frontmatter，并在内存数据库中构建临时关系表供高性能 SQL 样式的查询。
* **参考价值**: 演示了如何将“非结构化 Markdown”转为“结构化 SQL 记录”以供前端做复杂关联检索的模式，对解析双向链接和属性字段具有重大参考意义。
