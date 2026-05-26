# Rust 后端架构缺陷与安全漏洞审计报告 — Bibliotheca Vitae

本报告对数字花园（Digital Garden）桌面应用本地后端（位于 `src-tauri/` 目录）进行了深度的架构缺陷与安全漏洞审计。重点审查了 `commands.rs`、`db.rs`、`lib.rs` 中涉及的生命周期、SQLite 数据库连接管理、迁移机制、指令绑定以及文件安全控制。

---

## 1. 执行摘要 (Executive Summary)

当前本地后端在由早期“纯本地文件 JSON 读写模式”向“SQLite 数据库模式”演进的过程中，遗留了大量的接口冗余、松散的类型验证以及未妥善保护的并发文件写入机制。
审计发现，后端存在 **SQLite 并发锁定导致写入丢失**、**任意可执行文件后缀写入**、**关键启动迁移失败静默屏蔽** 以及 **大文件 Base64 传输引起的 IPC 内存分配瓶颈** 等中高危架构和安全缺陷。本报告在后文针对这些缺陷提供了详细的成因分析与重构修复方案。

---

## 2. Rust 后端架构缺陷与设计不一致性

### 2.1 哑占位状态与无害冗余代码
- **缺陷表现**：
  在 `src-tauri/src/lib.rs` 中注册了全局状态 `AppState`：
  ```rust
  .manage(AppState {
      entries: std::sync::Mutex::new(Vec::new()),
  })
  ```
  但在实际的数据库操作中，所有的 CRUD 指令均已经直接读写 SQLite，没有任何指令在读写或修改这个内存中的 `entries`。
  另外，在 `src-tauri/src/commands.rs` 中，暴露给前端的 `init_app_state` 亦为空占位逻辑：
  ```rust
  #[tauri::command]
  pub fn init_app_state(_state: State<AppState>, _app_handle: AppHandle) -> Result<(), String> {
      Ok(())
  }
  ```
- **影响评估**：
  这种“遗留痕迹”造成了对项目全局状态管理机制的误导，增加了后续开发者的阅读与维护心智负担，属于中等程度的架构冗余。

### 2.2 内存瓶颈与无分页大表加载模式
- **缺陷表现**：
  指令 `get_all_entries` 采用全量查询：
  ```rust
  let mut stmt = conn.prepare("SELECT id, title, figure, moment, narrative, image_url, keywords, date_created, date_modified FROM entries")?;
  ```
  该操作会在一次性把表内所有条目的 Markdown 长文本叙事（`narrative`）全量拉取到内存中，构建 `EntryPayload` 结构体并通过 JSON 序列化传回前端。
- **影响评估**：
  当用户瞬间抓取的 Moment 条目数据量增长（例如 >500 条）时，由于缺乏 SQL `LIMIT / OFFSET` 分页或字段级按需加载（Metadata-only List），该操作极易导致桌面端在启动渲染列表时出现长时间 IPC 卡顿、CPU 暴涨，并可能在极高负荷下触发 OOM。

### 2.3 IPC 通道下的 Base64 大文件处理缺陷
- **缺陷表现**：
  指令 `save_entry` 与 `import_entries` 的 `EntryPayload` 定义中依然保留了 `image_base64: Option<String>`，并在 Rust 端进行解码存盘：
  ```rust
  fn base64_decode(s: &str) -> Result<Vec<u8>, String> {
      let s = s.trim_start_matches("data:image/png;base64,");
      ...
      base64::Engine::decode(&base64::engine::general_purpose::STANDARD, s)
  }
  ```
- **影响评估**：
  Base64 编码引入了额外的 33% 体积。在多图或超大图片场景下，通过 JSON 的 IPC 通道传输大体积的 Base64 字符串会导致前端序列化阻塞和 Rust 反序列化的双重开销。虽然存在专门的 `save_image_from_bytes` 指令，但混合的传输路径没有完全切断，增大了高内存占用的风险。

---

## 3. SQLite 连接处理与迁移机制健壮性问题

### 3.1 SQLite 并发写冲突与 `database is locked` 风险 (忙等超时缺失)
- **缺陷表现**：
  在 `commands.rs` 中，大多数写入指令被定义为异步执行：
  ```rust
  pub async fn save_entry(...) -> Result<SaveResult, String>
  pub async fn update_entry(...) -> Result<SaveResult, String>
  pub async fn delete_entry(...) -> Result<(), String>
  ```
  但每个指令在执行时都采取“一开一闭”的瞬时连接模式：
  ```rust
  let conn = Connection::open(&db_path).map_err(|e| format!("Failed to open database: {}", e))?;
  ```
  Tauri 的后台异步线程池会并发处理上述命令。当某一瞬间用户触发多次写入（如自动保存、连续导入），由于 SQLite 引擎在写操作时会加写锁，而新打开的 `conn` 连接**默认忙等超时（Busy Timeout）为 0 毫秒**，这导致其他线程的连接会被数据库直接拒绝并报错返回 `database is locked`（即 `SQLITE_BUSY` 错误）。
- **影响评估**：
  这会导致在高并发场景（如后台自动同步或快速点击编辑）下出现部分写入指令静默失败，从而导致数据更新丢失。

### 3.2 数据库迁移失败时的错误屏蔽行为 (启动后静默失效)
- **缺陷表现**：
  在 `src-tauri/src/lib.rs` 的应用初始化生命周期（setup）中：
  ```rust
  // Run SQLite database migrations on startup
  if let Err(e) = db::run_migrations(app.handle()) {
      eprintln!("Failed to run database migrations: {}", e);
  }
  ```
  数据库初始化失败后，其致命错误仅通过终端的 `eprintln!` 输出，且应用依然装作无事发生继续运行。
- **影响评估**：
  因为 Release 发布版本中无标准控制台输出，用户根本无法察觉迁移已失败。一旦应用继续运行，前端发起查询操作，将会面临一连串由表结构缺失导致的“找不到表”异常，最终导致前端白屏或用户操作无故失效，造成严重的数据不可逆风险。

### 3.3 `initialize_database` 指令的多线程竞态
- **缺陷表现**：
  在 `db.rs` 中，`initialize_database` 作为一个 Tauri 指令暴露给了前端，并且其内部同样是无锁、多连接的去调用 `run_migrations`。
- **影响评估**：
  如果前端在页面加载时重复调用此指令，并发的迁移事务会相互锁死，并在 `create_dir_all` 或 `schema_migrations` 创建时产生竞争失败。

---

## 4. Tauri 指令绑定与文件系统安全漏洞

### 4.1 `import_entries` 中的盲目 `unwrap()` 及静默写入失败风险
- **缺陷表现**：
  在 `import_entries` 批量导入数据中：
  ```rust
  // 1. 致命 unwrap() 崩溃风险
  let mut check_stmt = conn.prepare("SELECT 1 FROM entries WHERE id = ?1").unwrap();
  let exists = check_stmt.exists([&entry_id]).unwrap_or(false);
  
  // 2. 忽略语句执行结果
  let _ = conn.execute(
      "INSERT INTO entries ...",
      params![...]
  );
  ```
  在检查数据是否存在时，如果数据库由于并发写入暂时锁定，调用 `unwrap()` 会直接使当前的工作线程 panic。
  而执行批量插入时，直接用 `let _ =` 静默吞掉了所有的 SQL 写入错误。此外，这个批量操作并没有处于数据库事务中，100 条条目的导入将引发 100 次独立的磁盘 I/O 提交。
- **影响评估**：
  - 中途断电或崩溃会导致数据库留下半完成的脏数据，不符合 ACID 事务的一致性保证。
  - 单次错误无法感知，用户界面误以为成功导入，造成潜在的数据静默丢失（Silent Data Loss）。

### 4.2 任意文件扩展名写入漏洞 (Arbitrary File Extension Upload)
- **缺陷表现**：
  在图片保存函数 `save_image` 和 `save_image_from_bytes` 中：
  ```rust
  let ext = std::path::Path::new(&filename)
      .extension()
      .and_then(|e| e.to_str())
      .unwrap_or("png");
  let safe_filename = format!("{}.{}", uuid::Uuid::new_v4(), ext);
  let image_path = image_dir.join(&safe_filename);
  fs::write(&image_path, bytes)?;
  ```
  后端虽通过生成 UUID 规避了“目录遍历覆盖漏洞”（Directory Traversal），但提取扩展名 `ext` 时**完全没有进行任何白名单检验**。
- **影响评估**：
  如果用户或恶意数据源向后端传递具有 `exe`、`sh`、`php` , `bat` 等后缀的文件，后端会照单全收并将文件写入到用户本地存储的 `images/` 目录下。虽然本地环境无脚本执行器触发 RCE，但这极易被黑客用来在本地磁盘投放木马文件、绕过杀毒软件静态扫描，进而配合本地钓鱼等手段在设备上执行恶意代码。

### 4.3 `update_entry` 松散的数据类型验证缺陷
- **缺陷表现**：
  在 `update_entry` 中，输入参数 payload 是弱类型的 `serde_json::Value`：
  ```rust
  pub async fn update_entry(id: String, payload: serde_json::Value, app_handle: AppHandle) -> Result<SaveResult, String>
  ```
  对于 `keywords` 字段的二次反序列化：
  ```rust
  let keywords_json = if let Some(keywords_val) = payload.get("keywords") {
      serde_json::to_string(keywords_val).unwrap_or_else(|_| "[]".to_string())
  } ...
  ```
  因为缺乏强类型保障，如果传入非预期的 JSON 数据（例如数字、嵌套对象），序列化虽成功但在读取还原为 `Vec<String>` 时由于类型不兼容会落入 `unwrap_or_default`，丢失用户设定的标签。

---

## 5. 结构化重构与安全防御优化建议

为了消除上述安全与架构隐患，建议后端采用以下最佳实践进行架构调整：

### 5.1 引入 `r2d2` 数据库连接池与配置忙等超时
推荐废弃频繁临时创建连接的机制。在 `AppState` 中初始化并配置 `r2d2::Pool`，设定 `busy_timeout` 为 5 秒，或者统一用 Mutex 包裹唯一连接：

```rust
// 示例方案：在 AppState 中加入持久化的 Connection 线程池
pub struct AppState {
    pub db_pool: r2d2::Pool<r2d2_sqlite::SqliteConnectionManager>,
}

// 在 run_migrations / 连接时设置合理的 busy_timeout
// conn.busy_timeout(std::time::Duration::from_secs(5))?;
```

### 5.2 规范化应用启动生命周期错误处理
必须阻止启动致命错误被屏蔽。在 `lib.rs` 中，应当向 Tauri `setup` 宏返回 Error 并抛出：

```rust
.setup(|app| {
    // 强制迁移失败退出，保证数据一致性
    db::run_migrations(app.handle())
        .map_err(|e| format!("Fatal database migration failure: {}", e))?;
    
    // 后续初始化
    Ok(())
})
```

### 5.3 严格限制文件扩展名白名单
在 `save_image` 中引入扩展名后缀的强白名单验证，阻止保存非静态资源的执行文件：

```rust
const ALLOWED_IMAGES: &[&str] = &["png", "jpg", "jpeg", "gif", "webp", "svg"];

let ext = std::path::Path::new(&filename)
    .extension()
    .and_then(|e| e.to_str())
    .map(|s| s.to_lowercase())
    .unwrap_or_else(|| "png".to_string());

if !ALLOWED_IMAGES.contains(&ext.as_str()) {
    return Err("Security Violation: File extension not allowed.".to_string());
}
```

### 5.4 引入数据库事务保障大批量导入的原子性
重构 `import_entries` 指令，使用 SQLite 的 `transaction` 包裹大循环以优化写入性能，并将 `unwrap` 换为安全的类型传播：

```rust
#[tauri::command]
pub async fn import_entries(json: String, app_handle: AppHandle) -> Result<(), String> {
    let entries: Vec<EntryPayload> = serde_json::from_str(&json)
        .map_err(|e| format!("JSON Parse error: {}", e))?;

    let db_path = get_db_path(&app_handle)?;
    let mut conn = Connection::open(&db_path)
        .map_err(|e| format!("DB Open error: {}", e))?;
    
    // 设置忙等超时，避免在此被其他写入锁死
    conn.busy_timeout(std::time::Duration::from_secs(5))
        .map_err(|e| e.to_string())?;

    let tx = conn.transaction().map_err(|e| format!("Transaction begin error: {}", e))?;

    for mut entry in entries {
        let entry_id = entry.id.clone().unwrap_or_else(|| uuid::Uuid::new_v4().to_string());
        
        // 使用 tx 安全的 prepare，并向上抛出 Error，不要 unwrap()
        let mut check_stmt = tx.prepare("SELECT 1 FROM entries WHERE id = ?1")
            .map_err(|e| e.to_string())?;
        
        let exists = check_stmt.exists([&entry_id]).map_err(|e| e.to_string())?;
        if exists {
            continue;
        }

        entry.id = Some(entry_id.clone());
        let mut final_image_url = entry.image_url.clone();
        if let Some(base64) = entry.image_base64.as_ref() {
            if let Ok(url) = write_embedded_image(&app_handle, &entry_id, base64) {
                final_image_url = Some(url);
            }
        }

        let keywords_json = serde_json::to_string(&entry.keywords).unwrap_or_default();
        
        // 捕获每一个 insert 失败，保证事务健壮
        tx.execute(
            "INSERT INTO entries (id, title, figure, moment, narrative, image_url, keywords, date_created, date_modified)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
            params![
                entry_id,
                entry.title,
                entry.figure,
                entry.moment,
                entry.narrative,
                final_image_url,
                keywords_json,
                entry.date_created,
                entry.date_modified
            ],
        ).map_err(|e| format!("Insert failure: {}", e))?;
    }

    tx.commit().map_err(|e| format!("Transaction commit failure: {}", e))?;
    Ok(())
}
```
