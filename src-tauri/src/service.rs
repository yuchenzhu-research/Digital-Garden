use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use rusqlite::{Connection, params};

// ============================================================================
// Types
// ============================================================================

/// Main entry payload matching the frontend Entry interface
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct EntryPayload {
    pub id: Option<String>,
    pub title: String,
    pub figure: String,
    pub moment: String,
    pub narrative: String,
    pub keywords: Vec<String>,
    pub image_base64: Option<String>,
    pub date_created: String,
    pub date_modified: Option<String>,
    pub image_url: Option<String>,
}

/// Result types for commands
#[derive(Serialize, Deserialize)]
pub struct SaveResult {
    pub success: bool,
    pub entry_id: Option<String>,
    pub file_path: Option<String>,
    pub error: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct ImageResult {
    pub success: bool,
    pub url: Option<String>,
    pub error: Option<String>,
}

// ============================================================================
// Decoupled Service Functions
// ============================================================================

/// Get all entries from SQLite database
pub fn get_all_entries(conn: &Connection) -> Result<Vec<EntryPayload>, String> {
    let mut stmt = conn
        .prepare("SELECT id, title, figure, moment, narrative, image_url, keywords, date_created, date_modified FROM entries")
        .map_err(|e| format!("Failed to prepare query: {}", e))?;

    let entry_iter = stmt
        .query_map((), |row| {
            let keywords_str: String = row.get(6)?;
            let keywords: Vec<String> = serde_json::from_str(&keywords_str).unwrap_or_default();
            Ok(EntryPayload {
                id: Some(row.get(0)?),
                title: row.get(1)?,
                figure: row.get(2)?,
                moment: row.get(3)?,
                narrative: row.get(4)?,
                image_url: row.get(5)?,
                keywords,
                image_base64: None,
                date_created: row.get(7)?,
                date_modified: row.get(8)?,
            })
        })
        .map_err(|e| format!("Failed to query database: {}", e))?;

    let mut entries = Vec::new();
    for entry in entry_iter {
        if let Ok(item) = entry {
            entries.push(item);
        }
    }

    Ok(entries)
}

/// Get a single entry by ID from SQLite database
pub fn get_entry(conn: &Connection, id: &str) -> Result<Option<EntryPayload>, String> {
    let mut stmt = conn
        .prepare("SELECT id, title, figure, moment, narrative, image_url, keywords, date_created, date_modified FROM entries WHERE id = ?1")
        .map_err(|e| format!("Failed to prepare query: {}", e))?;

    let mut rows = stmt
        .query_map([id], |row| {
            let keywords_str: String = row.get(6)?;
            let keywords: Vec<String> = serde_json::from_str(&keywords_str).unwrap_or_default();
            Ok(EntryPayload {
                id: Some(row.get(0)?),
                title: row.get(1)?,
                figure: row.get(2)?,
                moment: row.get(3)?,
                narrative: row.get(4)?,
                image_url: row.get(5)?,
                keywords,
                image_base64: None,
                date_created: row.get(7)?,
                date_modified: row.get(8)?,
            })
        })
        .map_err(|e| format!("Failed to query database: {}", e))?;

    if let Some(Ok(entry)) = rows.next() {
        Ok(Some(entry))
    } else {
        Ok(None)
    }
}

/// Save a new entry to SQLite database
pub fn save_entry(
    conn: &Connection,
    archive_dir: &Path,
    payload: EntryPayload,
    db_path: &Path,
) -> Result<SaveResult, String> {
    let id = payload
        .id
        .clone()
        .unwrap_or_else(|| uuid::Uuid::new_v4().to_string());

    let mut final_image_url = payload.image_url.clone();

    // Process embedded base64 image if present
    if let Some(base64) = &payload.image_base64 {
        match write_embedded_image(archive_dir, &id, base64) {
            Ok(url) => final_image_url = Some(url),
            Err(e) => {
                return Ok(SaveResult {
                    success: false,
                    entry_id: None,
                    file_path: None,
                    error: Some(format!("Failed to save image: {}", e)),
                });
            }
        }
    }

    let keywords_json = serde_json::to_string(&payload.keywords).unwrap_or_else(|_| "[]".to_string());
    let date_created = if payload.date_created.is_empty() {
        chrono::Utc::now().to_rfc3339()
    } else {
        payload.date_created.clone()
    };
    let date_modified = chrono::Utc::now().to_rfc3339();

    match conn.execute(
        "INSERT INTO entries (id, title, figure, moment, narrative, image_url, keywords, date_created, date_modified)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
        params![
            id,
            payload.title,
            payload.figure,
            payload.moment,
            payload.narrative,
            final_image_url,
            keywords_json,
            date_created,
            date_modified
        ],
    ) {
        Ok(_) => Ok(SaveResult {
            success: true,
            entry_id: Some(id),
            file_path: Some(db_path.to_string_lossy().to_string()),
            error: None,
        }),
        Err(e) => Ok(SaveResult {
            success: false,
            entry_id: None,
            file_path: None,
            error: Some(format!("Database insert failed: {}", e)),
        }),
    }
}

/// Update an existing entry in SQLite database
pub fn update_entry(
    conn: &Connection,
    id: &str,
    payload: serde_json::Value,
    db_path: &Path,
) -> Result<SaveResult, String> {
    // Verify entry exists
    let existing: Option<EntryPayload> = get_entry(conn, id)?;
    let Some(current) = existing else {
        return Ok(SaveResult {
            success: false,
            entry_id: None,
            file_path: None,
            error: Some("Entry not found".to_string()),
        });
    };

    let title = payload
        .get("title")
        .and_then(|v| v.as_str())
        .unwrap_or(&current.title)
        .to_string();

    let figure = payload
        .get("figure")
        .and_then(|v| v.as_str())
        .unwrap_or(&current.figure)
        .to_string();

    let moment = payload
        .get("moment")
        .and_then(|v| v.as_str())
        .unwrap_or(&current.moment)
        .to_string();

    let narrative = payload
        .get("narrative")
        .and_then(|v| v.as_str())
        .unwrap_or(&current.narrative)
        .to_string();

    let keywords_json = if let Some(keywords_val) = payload.get("keywords") {
        serde_json::to_string(keywords_val).unwrap_or_else(|_| "[]".to_string())
    } else {
        serde_json::to_string(&current.keywords).unwrap_or_else(|_| "[]".to_string())
    };

    let image_url = if let Some(url_val) = payload.get("imageUrl").or_else(|| payload.get("image_url")) {
        url_val.as_str().map(|s| s.to_string())
    } else {
        current.image_url
    };

    let date_modified = chrono::Utc::now().to_rfc3339();

    match conn.execute(
        "UPDATE entries SET title = ?1, figure = ?2, moment = ?3, narrative = ?4, keywords = ?5, image_url = ?6, date_modified = ?7 WHERE id = ?8",
        params![
            title,
            figure,
            moment,
            narrative,
            keywords_json,
            image_url,
            date_modified,
            id
        ],
    ) {
        Ok(_) => Ok(SaveResult {
            success: true,
            entry_id: Some(id.to_string()),
            file_path: Some(db_path.to_string_lossy().to_string()),
            error: None,
        }),
        Err(e) => Ok(SaveResult {
            success: false,
            entry_id: None,
            file_path: None,
            error: Some(format!("Database update failed: {}", e)),
        }),
    }
}

/// Delete an entry and its associated local image assets from disk
pub fn delete_entry(
    conn: &Connection,
    archive_dir: &Path,
    id: &str,
) -> Result<(), String> {
    // 1. Fetch image URL before deleting database record
    let entry_data = get_entry(conn, id)?;

    // 2. Delete from database
    conn.execute("DELETE FROM entries WHERE id = ?1", [id])
        .map_err(|e| format!("Failed to delete entry: {}", e))?;

    // 3. Delete physical image asset from disk
    if let Some(current) = entry_data {
        if let Some(image_url) = current.image_url {
            if let Some(image_name) = std::path::Path::new(&image_url).file_name() {
                let image_path = archive_dir.join("images").join(image_name);
                if image_path.exists() {
                    let _ = fs::remove_file(&image_path);
                }
            }
        }
    }

    Ok(())
}

/// Save an image file with extension white-list validation
pub fn save_image(
    archive_dir: &Path,
    data: &str,
    filename: &str,
) -> Result<ImageResult, String> {
    let image_dir = archive_dir.join("images");

    fs::create_dir_all(&image_dir)
        .map_err(|e| format!("Failed to create image directory: {}", e))?;

    // Security validation of file extension
    let ext = validate_image_extension(filename)?;
    let safe_filename = format!("{}.{}", uuid::Uuid::new_v4(), ext);
    let image_path = image_dir.join(&safe_filename);

    let bytes = base64_decode(data).map_err(|e| format!("Failed to decode base64: {}", e))?;

    fs::write(&image_path, bytes).map_err(|e| format!("Failed to write image: {}", e))?;

    Ok(ImageResult {
        success: true,
        url: Some(format!("images/{}", safe_filename)),
        error: None,
    })
}

/// Save an image file from raw bytes with extension white-list validation
pub fn save_image_from_bytes(
    archive_dir: &Path,
    bytes: &[u8],
    filename: &str,
) -> Result<ImageResult, String> {
    let image_dir = archive_dir.join("images");

    fs::create_dir_all(&image_dir)
        .map_err(|e| format!("Failed to create image directory: {}", e))?;

    // Security validation of file extension
    let ext = validate_image_extension(filename)?;
    let safe_filename = format!("{}.{}", uuid::Uuid::new_v4(), ext);
    let image_path = image_dir.join(&safe_filename);

    fs::write(&image_path, bytes).map_err(|e| format!("Failed to write image: {}", e))?;

    Ok(ImageResult {
        success: true,
        url: Some(format!("images/{}", safe_filename)),
        error: None,
    })
}

/// Import entries from JSON wrapped inside a single SQLite transaction
pub fn import_entries(
    conn: &mut Connection,
    archive_dir: &Path,
    entries: Vec<EntryPayload>,
) -> Result<(), String> {
    let tx = conn.transaction().map_err(|e| format!("Failed to start transaction: {}", e))?;

    for mut entry in entries {
        let entry_id = entry
            .id
            .clone()
            .unwrap_or_else(|| uuid::Uuid::new_v4().to_string());

        // Check if exists
        let exists: bool = tx
            .query_row(
                "SELECT 1 FROM entries WHERE id = ?1",
                [&entry_id],
                |_| Ok(true),
            )
            .unwrap_or(false);

        if exists {
            continue;
        }

        entry.id = Some(entry_id.clone());

        let mut final_image_url = entry.image_url.clone();
        if let Some(base64) = entry.image_base64.as_ref() {
            if let Ok(url) = write_embedded_image(archive_dir, &entry_id, base64) {
                final_image_url = Some(url);
            }
        }

        let keywords_json = serde_json::to_string(&entry.keywords).unwrap_or_else(|_| "[]".to_string());

        match tx.execute(
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
        ) {
            Ok(_) => {}
            Err(e) => {
                eprintln!("Failed to insert entry {}: {}", entry_id, e);
            }
        }
    }

    tx.commit().map_err(|e| format!("Failed to commit import transaction: {}", e))?;
    Ok(())
}

// ============================================================================
// Helpers
// ============================================================================

pub fn image_extension_from_data(data: &str) -> &'static str {
    if data.starts_with("data:image/jpeg;base64,") {
        "jpg"
    } else if data.starts_with("data:image/gif;base64,") {
        "gif"
    } else if data.starts_with("data:image/webp;base64,") {
        "webp"
    } else if data.starts_with("data:image/svg+xml;base64,") {
        "svg"
    } else {
        "png"
    }
}

pub fn validate_image_extension(filename: &str) -> Result<String, String> {
    let ext = std::path::Path::new(filename)
        .extension()
        .and_then(|e| e.to_str())
        .map(|s| s.to_lowercase())
        .ok_or_else(|| "Missing file extension".to_string())?;

    let allowed = ["png", "jpg", "jpeg", "gif", "webp", "svg"];
    if !allowed.contains(&ext.as_str()) {
        return Err(format!("Forbidden file extension: .{}", ext));
    }
    Ok(ext)
}

pub fn write_embedded_image(
    archive_dir: &Path,
    entry_id: &str,
    image_data: &str,
) -> Result<String, String> {
    let image_dir = archive_dir.join("images");
    fs::create_dir_all(&image_dir)
        .map_err(|e| format!("Failed to create image directory: {}", e))?;

    let ext = image_extension_from_data(image_data);
    let image_filename = format!("{}.{}", entry_id, ext);
    let image_path = image_dir.join(&image_filename);
    let bytes = base64_decode(image_data)?;

    fs::write(&image_path, bytes).map_err(|e| format!("Failed to save image: {}", e))?;

    Ok(format!("images/{}", image_filename))
}

pub fn base64_decode(s: &str) -> Result<Vec<u8>, String> {
    let s = s.trim_start_matches("data:image/png;base64,");
    let s = s.trim_start_matches("data:image/jpeg;base64,");
    let s = s.trim_start_matches("data:image/gif;base64,");
    let s = s.trim_start_matches("data:image/webp;base64,");
    let s = s.trim_start_matches("data:image/svg+xml;base64,");

    base64::Engine::decode(&base64::engine::general_purpose::STANDARD, s).map_err(|e| e.to_string())
}
