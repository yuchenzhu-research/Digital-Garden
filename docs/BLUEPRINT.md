# 🏛️ Bibliotheca Vitae: The Long-Term Blueprint & Architectural Roadmap

*“Rome was not built in a day, nor is the sanctuary of a lifetime’s narrative.”*

当前版本 (v3.0.0) 已经成功实现了从纯 Web 雏形向 Local-First (本地优先) 桌面原生跨平台架构的惊险跃迁。这套 Next.js 静态化结合 Tauri v2 的体系跑通了 MVP 的核心闭环。

但作为一个有野心的“数字花园”，要真正承载数十年的生命策展，当前在架构和工程深度上仍有不少妥协。这份蓝图旨在深刻反思当前的局限，并为未来一到三年的星辰大海指明演进方向。

---

## 🚧 1. 现世代的架构妥协与不足 (Current Limitations)

### 1.1 数据引擎与检索瓶颈 (Flat File System vs. Indexing)
- **现状**：目前所有条目和元数据，都是依靠最基础的操作系统 API (`tauri-plugin-fs`) 以散装 JSON 和独立媒体文件的形式读写物理机器。
- **痛点**：这种极简的 Flat File 结构，在条目量突破 `500+` 级别时会面临“全量反序列化加载”引发的 I/O 阻塞。目前缺乏底层数据库支撑，导致我们无法实现极速的全局模糊搜索 (Full-text Search)、时间轴区间过滤，甚至连基础的分页排序逻辑都会消耗过高的计算资源。

### 1.2 数据共识与多端孤岛 (Sync Conflicts & Mobile Isolation)
- **现状**：缺乏第一方云同步或 P2P 协商机制。如果我们想在公司 Windows 电脑和家里 Mac 之间同步，只能极度依赖类似 OneDrive / iCloud 的“整包监听同步”。
- **痛点**：暴力借助网盘同步极其容易触发文件锁定报错或产出并列的**冲突副本 (Conflict Copies)**。同时，移动端目前被迫变成了一个基于浏览器的临时沙盒草稿箱（利用 IndexedDB），和桌面的主体档案割裂，缺乏全栈同步流通感。

### 1.3 前端与图形表现力的上限 (Render Performance)
- **现状**：WebGL (React Three Fiber) 和极其吃算力的 Framer Motion 视差动画，在大尺寸屏幕或低性能核显上容易出现掉帧。
- **痛点**：为了迎合 SSG (静态页导出) 打包到 Tauri，我们被迫舍弃了 Next.js 自带的服务端自动压缩（图片标记为 `unoptimized: true`）。这意味着导入动辄十几兆的高清相片，前端会被迫完整加载和渲染，引发首屏内存暴增和潜在的 OOM 崩溃。

### 1.4 分发与操作系统的对抗 (Distribution & Gatekeeper)
- **现状**：强依赖 GitHub Actions 输出的二进制包是原始的“野包”。
- **痛点**：没有任何 Apple Developer Program 和 Windows EV 证书验证，Mac 下载后系统会如临大敌（哪怕用 `xattr` 解封也极大拉高了使用门槛）。目前也没有集成自动更新器 (Tauri Auto Updater)，后续发版只能让访客手动去官网重新拉全量包。

---

## 🗺️ 2. 星辰大海：长周期演进纪元 (The Epochs of Future)

为使 Bibliotheca Vitae 成长为传世级别的策展引擎，我们需要在未来几年分阶段攻克以下核弹级的技术命题：

### Phase 1: 引入高性能知识检索库 (The SQLite / Vector Era)
- **双轨制存储系统**：在保留用户直观文件层级的同时，在 Rust 侧深度整合 `SQLite`。将物理文件夹变为“冷数据”，将数据库变为“热索引”。用纳秒级的 SQL 获取列表，彻底解放查询性能。
- **AI 赋能本地语义 (Local Vector Search)**：接入本地轻量级嵌入模型（基于 `ONNX` 或 `llama.cpp`），开启无需插网线的“向量语义搜索”。用户找图时，输入的不再是精准关键字，而是“那个阳光明媚的下午”就能调出对应时刻。

### Phase 2: 分布式流转与穿梭 (CRDT & True Sync)
- **无冲突时空同步**：剥离对 iCloud 的依赖，在底层引入 `Automerge` 或 `Yjs` 无冲突复制算法。让每一份叙事变为可追溯的独立“历史流”，只需手机和电脑处在同一局域网内，数据秒传智能合并，绝不覆盖丢失。
- **原生终端再造**：丢弃移动端 Web 沙盒，应用 Tauri Mobile 或 React Native 构建纯血客户端。真正接管系统级 Safari Share Sheet (分享菜单) 与原生级别的相册 API。

### Phase 3: 策展级动态资产治理 (The Visual Engine)
- **自适应像素金字塔 (Asset Pyramid)**：利用 Rust 拦截用户导入的高清大图，静默生成“低精度虚模、中质量预览、无损原图”三套变体。通过屏幕可视区交错加载，自动卸载屏幕外的缓存。
- **3D 宇宙图谱体系 (Galaxy Knowledge Graph)**：构建超越线性时间轴的次世代查阅模式，将所有 `Moment`、`Figure` 构建成支持鼠标无极缩放、旋绕在三维系泊中的网络星系图谱，上帝视角串联起人生的因果拓扑。

### Phase 4: 万物闭环与商业基建 (The Definite Standard)
- **合规化封印与自动化补丁**：正式打通 Apple Notarization 以及 Windows 证书生态。构建后台静默补丁推送 (Hot-update)，永劫保持最新状态且毫无打扰。
- **开源插件乌托邦 (WASM Plugin Sandbox)**：利用 WebAssembly 开启对外暴露的极客接口。让全世界的高级开发者自由编写“光影主题包”，甚至“Notion 资产全量导入脚本”，完成花园生态的最终自给自足。

---

*Est. MMXXVI · Bibliotheca Vitae · Ars Longa, Vita Brevis.*
*哪怕光影视效随着设备的兴替而衰变，但底层打下的工程根基，必将为守护这段漫长岁月提供不灭的基础。*
