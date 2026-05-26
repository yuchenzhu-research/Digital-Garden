use rusqlite::Connection;
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

/// Get the path to the SQLite database, creating the parent directories if necessary.
pub fn get_db_path(app_handle: &AppHandle) -> Result<PathBuf, String> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;
    
    let digital_garden_dir = app_data_dir.join("DigitalGarden");
    
    if !digital_garden_dir.exists() {
        fs::create_dir_all(&digital_garden_dir)
            .map_err(|e| format!("Failed to create DigitalGarden directory: {}", e))?;
    }
    
    Ok(digital_garden_dir.join("archive.db"))
}

/// Run SQLite database migrations.
pub fn run_migrations(app_handle: &AppHandle) -> Result<(), String> {
    let db_path = get_db_path(app_handle)?;
    let mut conn = Connection::open(&db_path)
        .map_err(|e| format!("Failed to open SQLite database at {:?}: {}", db_path, e))?;

    // Create schema_migrations table if not exists to track version changes
    conn.execute(
        "CREATE TABLE IF NOT EXISTS schema_migrations (
            version INTEGER PRIMARY KEY
        );",
        (),
    )
    .map_err(|e| format!("Failed to create schema_migrations table: {}", e))?;

    // Define migration scripts in order. Add new migrations at the end of the vector.
    let migrations = vec![
        // Migration 1: Create the entries table
        "CREATE TABLE IF NOT EXISTS entries (
            id TEXT PRIMARY KEY,
            title TEXT,
            figure TEXT,
            moment TEXT,
            narrative TEXT,
            image_url TEXT,
            keywords TEXT,
            date_created TEXT,
            date_modified TEXT
        );",
    ];

    // Fetch previously applied migrations
    let mut stmt = conn
        .prepare("SELECT version FROM schema_migrations")
        .map_err(|e| format!("Failed to prepare query: {}", e))?;
    
    let executed_versions: std::collections::HashSet<i32> = stmt
        .query_map((), |row| row.get(0))
        .map_err(|e| format!("Failed to fetch executed migrations: {}", e))?
        .filter_map(|r| r.ok())
        .collect();

    drop(stmt);

    // Apply any missing migrations inside a transaction
    let tx = conn
        .transaction()
        .map_err(|e| format!("Failed to begin transaction: {}", e))?;

    for (idx, migration_sql) in migrations.iter().enumerate() {
        let version = (idx + 1) as i32;
        if !executed_versions.contains(&version) {
            tx.execute(migration_sql, ())
                .map_err(|e| format!("Failed to execute migration version {}: {}", version, e))?;
            
            tx.execute(
                "INSERT INTO schema_migrations (version) VALUES (?1)",
                rusqlite::params![version],
            )
            .map_err(|e| format!("Failed to record migration version {}: {}", version, e))?;
            
            println!("SQLite Migration version {} applied successfully.", version);
        }
    }

    tx.commit()
        .map_err(|e| format!("Failed to commit database migrations: {}", e))?;

    Ok(())
}

/// Tauri command to manually trigger database initialization and run migrations.
#[tauri::command]
pub fn initialize_database(app_handle: AppHandle) -> Result<String, String> {
    run_migrations(&app_handle)?;
    let db_path = get_db_path(&app_handle)?;
    Ok(db_path.to_string_lossy().to_string())
}
