//! Tauri Commands for SQLite File System Operations
//!
//! Provides commands for saving, loading, and managing entries in the SQLite database.

use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};
use crate::db::{get_db_path, open_connection};
use crate::AppError;

// Re-export service types so they remain part of commands public API if needed
pub use crate::service::{EntryPayload, SaveResult, ImageResult};

// ============================================================================
// Helpers
// ============================================================================

fn get_archive_dir(app_handle: &AppHandle) -> Result<PathBuf, AppError> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| AppError::Tauri(e.to_string()))?;
    
    let digital_garden_dir = app_data_dir.join("DigitalGarden");
    
    if !digital_garden_dir.exists() {
        fs::create_dir_all(&digital_garden_dir)?;
    }
    
    Ok(digital_garden_dir)
}

// ============================================================================
// Commands
// ============================================================================

/// Get all entries from SQLite database
#[tauri::command]
pub async fn get_all_entries(app_handle: AppHandle) -> Result<Vec<EntryPayload>, AppError> {
    let conn = open_connection(&app_handle)?;
    crate::service::get_all_entries(&conn)
}

/// Get a single entry by ID from SQLite database
#[tauri::command]
pub async fn get_entry(id: String, app_handle: AppHandle) -> Result<Option<EntryPayload>, AppError> {
    let conn = open_connection(&app_handle)?;
    crate::service::get_entry(&conn, &id)
}

/// Save a new entry to SQLite database
#[tauri::command]
pub async fn save_entry(
    payload: EntryPayload,
    app_handle: AppHandle,
) -> Result<SaveResult, AppError> {
    let conn = open_connection(&app_handle)?;
    let archive_dir = get_archive_dir(&app_handle)?;
    let db_path = get_db_path(&app_handle)?;
    crate::service::save_entry(&conn, &archive_dir, payload, &db_path)
}

/// Update an existing entry in SQLite database
#[tauri::command]
pub async fn update_entry(
    id: String,
    payload: serde_json::Value,
    app_handle: AppHandle,
) -> Result<SaveResult, AppError> {
    let conn = open_connection(&app_handle)?;
    let db_path = get_db_path(&app_handle)?;
    crate::service::update_entry(&conn, &id, payload, &db_path)
}

/// Delete an entry and its associated local image assets from disk
#[tauri::command]
pub async fn delete_entry(id: String, app_handle: AppHandle) -> Result<(), AppError> {
    let conn = open_connection(&app_handle)?;
    let archive_dir = get_archive_dir(&app_handle)?;
    crate::service::delete_entry(&conn, &archive_dir, &id)
}

/// Save an image file with extension white-list validation
#[tauri::command]
pub async fn save_image(
    data: String,
    filename: String,
    app_handle: AppHandle,
) -> Result<ImageResult, AppError> {
    let archive_dir = get_archive_dir(&app_handle)?;
    crate::service::save_image(&archive_dir, &data, &filename)
}

/// Save an image file from raw bytes with extension white-list validation
#[tauri::command]
pub async fn save_image_from_bytes(
    bytes: Vec<u8>,
    filename: String,
    app_handle: AppHandle,
) -> Result<ImageResult, AppError> {
    let archive_dir = get_archive_dir(&app_handle)?;
    crate::service::save_image_from_bytes(&archive_dir, &bytes, &filename)
}

/// Get the storage path
#[tauri::command]
pub fn get_storage_path(app_handle: AppHandle) -> Result<String, AppError> {
    Ok(get_archive_dir(&app_handle)?.to_string_lossy().to_string())
}

/// Import entries from JSON wrapped inside a single SQLite transaction
#[tauri::command]
pub async fn import_entries(json: String, app_handle: AppHandle) -> Result<(), AppError> {
    let entries: Vec<EntryPayload> = serde_json::from_str(&json)?;
    let mut conn = open_connection(&app_handle)?;
    let archive_dir = get_archive_dir(&app_handle)?;
    crate::service::import_entries(&mut conn, &archive_dir, entries)
}

#[cfg(test)]
mod tests {
    use crate::service::validate_image_extension;

    #[test]
    fn test_validate_image_extension() {
        assert_eq!(validate_image_extension("test.png").unwrap(), "png");
        assert_eq!(validate_image_extension("test.PNG").unwrap(), "png");
        assert_eq!(validate_image_extension("test.jpeg").unwrap(), "jpeg");
        assert_eq!(validate_image_extension("test.jpg").unwrap(), "jpg");
        assert_eq!(validate_image_extension("test.gif").unwrap(), "gif");
        assert_eq!(validate_image_extension("test.webp").unwrap(), "webp");
        assert_eq!(validate_image_extension("test.svg").unwrap(), "svg");

        assert!(validate_image_extension("test.txt").is_err());
        assert!(validate_image_extension("test").is_err());
        assert!(validate_image_extension("test.").is_err());
    }
}
