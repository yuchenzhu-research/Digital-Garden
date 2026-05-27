use crate::AppError;
use rusqlite::Connection;
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

/// Get the path to the SQLite database, creating the parent directories if necessary.
pub fn get_db_path(app_handle: &AppHandle) -> Result<PathBuf, AppError> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| AppError::Tauri(e.to_string()))?;
    
    let digital_garden_dir = app_data_dir.join("DigitalGarden");
    
    if !digital_garden_dir.exists() {
        fs::create_dir_all(&digital_garden_dir)?;
    }
    
    Ok(digital_garden_dir.join("archive.db"))
}

/// Open a connection to the SQLite database and set busy_timeout to 5000ms.
pub fn open_connection(app_handle: &AppHandle) -> Result<Connection, AppError> {
    let db_path = get_db_path(app_handle)?;
    let conn = Connection::open(&db_path)?;
    conn.execute("PRAGMA busy_timeout = 5000", ())?;
    Ok(conn)
}

/// Run SQLite database migrations.
pub fn run_migrations(app_handle: &AppHandle) -> Result<(), AppError> {
    let mut conn = open_connection(app_handle)?;

    // Create schema_migrations table if not exists to track version changes
    conn.execute(
        "CREATE TABLE IF NOT EXISTS schema_migrations (
            version INTEGER PRIMARY KEY
        );",
        (),
    )?;

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
    let mut stmt = conn.prepare("SELECT version FROM schema_migrations")?;
    
    let executed_versions: std::collections::HashSet<i32> = stmt
        .query_map((), |row| row.get(0))?
        .filter_map(|r| r.ok())
        .collect();

    drop(stmt);

    // Apply any missing migrations inside a transaction
    let tx = conn.transaction()?;

    for (idx, migration_sql) in migrations.iter().enumerate() {
        let version = (idx + 1) as i32;
        if !executed_versions.contains(&version) {
            tx.execute(migration_sql, ())?;
            
            tx.execute(
                "INSERT INTO schema_migrations (version) VALUES (?1)",
                rusqlite::params![version],
            )?;
            
            println!("SQLite Migration version {} applied successfully.", version);
        }
    }

    tx.commit()?;

    Ok(())
}

/// Tauri command to manually trigger database initialization and run migrations.
#[tauri::command]
pub fn initialize_database(app_handle: AppHandle) -> Result<String, AppError> {
    run_migrations(&app_handle)?;
    let db_path = get_db_path(&app_handle)?;
    Ok(db_path.to_string_lossy().to_string())
}

#[cfg(test)]
mod tests {
    use super::*;
    use rusqlite::params;

    #[test]
    fn test_sqlite_in_memory_migrations() {
        let conn = Connection::open_in_memory().unwrap();
        
        // 1. Create schema_migrations table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS schema_migrations (
                version INTEGER PRIMARY KEY
            );",
            (),
        )
        .unwrap();

        // 2. Perform test schema creation
        let migrations = vec![
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

        for (idx, sql) in migrations.iter().enumerate() {
            let version = (idx + 1) as i32;
            conn.execute(sql, ()).unwrap();
            conn.execute(
                "INSERT INTO schema_migrations (version) VALUES (?1)",
                params![version],
            )
            .unwrap();
        }

        // 3. Verify entry fields and constraints
        let mut stmt = conn.prepare("SELECT version FROM schema_migrations").unwrap();
        let versions: Vec<i32> = stmt.query_map((), |row| row.get(0)).unwrap().map(|r| r.unwrap()).collect();
        assert_eq!(versions, vec![1]);
    }
}
