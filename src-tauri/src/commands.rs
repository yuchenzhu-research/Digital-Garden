//! Tauri Commands for File System Operations
//!
//! Provides commands for saving, loading, and managing entries in the native app.

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::State;

// ============================================================================
// Types
// ============================================================================

/// In-memory storage for entries (until we implement proper DB)
pub struct AppState {
    pub entries: Mutex<Vec<EntryPayload>>,
}

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
// Initialization
// ============================================================================

/// Initialize the app state with existing entries from disk
fn initialize_entries(_state: &State<AppState>) -> Vec<EntryPayload> {
    let archive_dir = get_archive_dir();
    let mut entries = Vec::new();

    if let Ok(read_dir) = fs::read_dir(&archive_dir) {
        for entry in read_dir.flatten() {
            if entry
                .path()
                .extension()
                .map(|e| e == "json")
                .unwrap_or(false)
            {
                if let Ok(content) = fs::read_to_string(entry.path()) {
                    if let Ok(entry_data) = serde_json::from_str::<serde_json::Value>(&content) {
                        let payload = EntryPayload {
                            id: entry_data["id"].as_str().map(|s| s.to_string()),
                            title: entry_data["title"].as_str().unwrap_or("").to_string(),
                            figure: entry_data["figure"].as_str().unwrap_or("").to_string(),
                            moment: entry_data["moment"].as_str().unwrap_or("").to_string(),
                            narrative: entry_data["narrative"].as_str().unwrap_or("").to_string(),
                            keywords: entry_data["keywords"]
                                .as_array()
                                .map(|arr| {
                                    arr.iter()
                                        .filter_map(|v| v.as_str().map(|s| s.to_string()))
                                        .collect()
                                })
                                .unwrap_or_default(),
                            image_base64: None,
                            date_created: entry_data["date_created"]
                                .as_str()
                                .unwrap_or(&entry_data["created_at"].as_str().unwrap_or(""))
                                .to_string(),
                            date_modified: None,
                            image_url: entry_data["image_url"].as_str().map(|s| s.to_string()),
                        };
                        entries.push(payload);
                    }
                }
            }
        }
    }

    entries
}

// ============================================================================
// Path Helpers
// ============================================================================

fn get_archive_dir() -> PathBuf {
    dirs::document_dir()
        .unwrap_or_else(|| {
            let home = std::env::var("HOME").unwrap_or_else(|_| ".".to_string());
            PathBuf::from(home).join("Documents")
        })
        .join("DigitalGarden")
        .join("Archive")
}

fn sanitize_filename(title: &str) -> String {
    title
        .chars()
        .take(30)
        .map(|c| {
            if c.is_alphanumeric() || c == '-' || c == '_' {
                c
            } else {
                '_'
            }
        })
        .collect()
}

fn build_entry_file_path(archive_dir: &PathBuf, title: &str, id: &str) -> PathBuf {
    let short_id: String = id.chars().take(8).collect();
    archive_dir.join(format!("{}_{}.json", sanitize_filename(title), short_id))
}

fn write_entry_to_disk(file_path: &PathBuf, payload: &EntryPayload) -> Result<(), String> {
    let json_content =
        serde_json::to_string_pretty(payload).map_err(|e| format!("Failed to serialize: {}", e))?;

    fs::write(file_path, json_content).map_err(|e| format!("Failed to write file: {}", e))
}

fn image_extension_from_data(data: &str) -> &'static str {
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

fn write_embedded_image(
    archive_dir: &PathBuf,
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

fn find_entry_file_by_id(archive_dir: &PathBuf, id: &str) -> Result<Option<PathBuf>, String> {
    let read_dir = match fs::read_dir(archive_dir) {
        Ok(read_dir) => read_dir,
        Err(err) if err.kind() == std::io::ErrorKind::NotFound => return Ok(None),
        Err(err) => return Err(format!("Failed to read archive directory: {}", err)),
    };

    for entry in read_dir.flatten() {
        let path = entry.path();

        if path.extension().map(|ext| ext == "json").unwrap_or(false) {
            let content = match fs::read_to_string(&path) {
                Ok(content) => content,
                Err(_) => continue,
            };

            let value = match serde_json::from_str::<serde_json::Value>(&content) {
                Ok(value) => value,
                Err(_) => continue,
            };

            if value["id"].as_str() == Some(id) {
                return Ok(Some(path));
            }
        }
    }

    Ok(None)
}

// ============================================================================
// Commands
// ============================================================================

/// Initialize the app state
#[tauri::command]
pub fn init_app_state(state: State<AppState>) -> Result<(), String> {
    let entries = initialize_entries(&state);
    *state.entries.lock().map_err(|e| e.to_string())? = entries;
    Ok(())
}

/// Get all entries
#[tauri::command]
pub fn get_all_entries(state: State<AppState>) -> Result<Vec<EntryPayload>, String> {
    let entries = state.entries.lock().map_err(|e| e.to_string())?;
    Ok(entries.clone())
}

/// Get a single entry by ID
#[tauri::command]
pub fn get_entry(id: String, state: State<AppState>) -> Result<Option<EntryPayload>, String> {
    let entries = state.entries.lock().map_err(|e| e.to_string())?;
    Ok(entries.iter().find(|e| e.id.as_ref() == Some(&id)).cloned())
}

/// Save a new entry
#[tauri::command]
pub async fn save_entry(
    payload: EntryPayload,
    state: State<'_, AppState>,
) -> Result<SaveResult, String> {
    let archive_dir = get_archive_dir();

    // Create directory
    fs::create_dir_all(&archive_dir)
        .map_err(|e| format!("Failed to create archive directory: {}", e))?;

    // Generate ID and path
    let id = payload
        .id
        .clone()
        .unwrap_or_else(|| uuid::Uuid::new_v4().to_string());

    let file_path = build_entry_file_path(&archive_dir, &payload.title, &id);

    // Create saved entry with ID
    let mut saved_payload = payload.clone();
    saved_payload.id = Some(id.clone());
    saved_payload.date_modified = Some(chrono::Utc::now().to_rfc3339());

    // Save image from base64 if present (Legacy fallback)
    if let Some(base64) = &payload.image_base64 {
        saved_payload.image_url = Some(write_embedded_image(&archive_dir, &id, base64)?);
    }

    // Strip out base64 before serializing so it doesn't bloat the JSON file!
    saved_payload.image_base64 = None;

    // Serialize
    // Write to file
    write_entry_to_disk(&file_path, &saved_payload)?;

    // Update in-memory state
    {
        let mut entries = state.entries.lock().map_err(|e| e.to_string())?;
        entries.push(saved_payload.clone());
    }

    Ok(SaveResult {
        success: true,
        entry_id: Some(id),
        file_path: Some(file_path.to_string_lossy().to_string()),
        error: None,
    })
}

/// Update an existing entry
#[tauri::command]
pub async fn update_entry(
    id: String,
    payload: serde_json::Value,
    state: State<'_, AppState>,
) -> Result<SaveResult, String> {
    let updated_entry = {
        let mut entries = state.entries.lock().map_err(|e| e.to_string())?;

        if let Some(index) = entries.iter().position(|e| e.id.as_ref() == Some(&id)) {
            if let Some(title) = payload.get("title").and_then(|v| v.as_str()) {
                entries[index].title = title.to_string();
            }
            if let Some(figure) = payload.get("figure").and_then(|v| v.as_str()) {
                entries[index].figure = figure.to_string();
            }
            if let Some(moment) = payload.get("moment").and_then(|v| v.as_str()) {
                entries[index].moment = moment.to_string();
            }
            if let Some(narrative) = payload.get("narrative").and_then(|v| v.as_str()) {
                entries[index].narrative = narrative.to_string();
            }
            if let Some(keywords) = payload.get("keywords").and_then(|v| v.as_array()) {
                entries[index].keywords = keywords
                    .iter()
                    .filter_map(|v| v.as_str().map(|s| s.to_string()))
                    .collect();
            }
            if let Some(image_url) = payload.get("imageUrl").or_else(|| payload.get("image_url")) {
                entries[index].image_url = image_url.as_str().map(|value| value.to_string());
            }

            entries[index].date_modified = Some(chrono::Utc::now().to_rfc3339());
            entries[index].clone()
        } else {
            return Ok(SaveResult {
                success: false,
                entry_id: None,
                file_path: None,
                error: Some("Entry not found".to_string()),
            });
        }
    };

    let archive_dir = get_archive_dir();
    let Some(file_path) = find_entry_file_by_id(&archive_dir, &id)? else {
        return Ok(SaveResult {
            success: false,
            entry_id: None,
            file_path: None,
            error: Some("Entry file not found".to_string()),
        });
    };

    let json_content = serde_json::to_string_pretty(&updated_entry)
        .map_err(|e| format!("Failed to serialize: {}", e))?;

    fs::write(&file_path, json_content).map_err(|e| format!("Failed to write file: {}", e))?;

    Ok(SaveResult {
        success: true,
        entry_id: Some(id.clone()),
        file_path: Some(file_path.to_string_lossy().to_string()),
        error: None,
    })
}

/// Delete an entry
#[tauri::command]
pub async fn delete_entry(id: String, state: State<'_, AppState>) -> Result<(), String> {
    let mut entries = state.entries.lock().map_err(|e| e.to_string())?;

    if let Some(index) = entries.iter().position(|e| e.id.as_ref() == Some(&id)) {
        let removed_entry = entries.remove(index);

        let archive_dir = get_archive_dir();
        if let Some(file_path) = find_entry_file_by_id(&archive_dir, &id)? {
            fs::remove_file(&file_path).map_err(|e| format!("Failed to delete file: {}", e))?;
        }

        if let Some(image_url) = removed_entry.image_url.as_ref() {
            if let Some(image_name) = std::path::Path::new(image_url).file_name() {
                let image_path = archive_dir.join("images").join(image_name);
                if image_path.exists() {
                    let _ = fs::remove_file(&image_path);
                }
            }
        } else {
            let image_path = archive_dir.join("images").join(format!("{}.png", id));
            if image_path.exists() {
                let _ = fs::remove_file(&image_path);
            }
        }
    }

    Ok(())
}

/// Save an image file
#[tauri::command]
pub async fn save_image(
    data: String,
    filename: String,
    _state: State<'_, AppState>,
) -> Result<ImageResult, String> {
    let archive_dir = get_archive_dir();
    let image_dir = archive_dir.join("images");

    fs::create_dir_all(&image_dir)
        .map_err(|e| format!("Failed to create image directory: {}", e))?;

    let ext = std::path::Path::new(&filename)
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("png");
    let safe_filename = format!("{}.{}", uuid::Uuid::new_v4(), ext);
    let image_path = image_dir.join(&safe_filename);

    let bytes = base64_decode(&data).map_err(|e| format!("Failed to decode base64: {}", e))?;

    fs::write(&image_path, bytes).map_err(|e| format!("Failed to write image: {}", e))?;

    Ok(ImageResult {
        success: true,
        url: Some(format!("images/{}", safe_filename)),
        error: None,
    })
}

/// Save an image file from raw bytes (More efficient)
#[tauri::command]
pub async fn save_image_from_bytes(
    bytes: Vec<u8>,
    filename: String,
    _state: State<'_, AppState>,
) -> Result<ImageResult, String> {
    let archive_dir = get_archive_dir();
    let image_dir = archive_dir.join("images");

    fs::create_dir_all(&image_dir)
        .map_err(|e| format!("Failed to create image directory: {}", e))?;

    let ext = std::path::Path::new(&filename)
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("png");
    let safe_filename = format!("{}.{}", uuid::Uuid::new_v4(), ext);
    let image_path = image_dir.join(&safe_filename);

    fs::write(&image_path, bytes).map_err(|e| format!("Failed to write image: {}", e))?;

    Ok(ImageResult {
        success: true,
        url: Some(format!("images/{}", safe_filename)),
        error: None,
    })
}

/// Get the storage path
#[tauri::command]
pub fn get_storage_path() -> Result<String, String> {
    Ok(get_archive_dir().to_string_lossy().to_string())
}

/// Import entries from JSON
#[tauri::command]
pub async fn import_entries(json: String, state: State<'_, AppState>) -> Result<(), String> {
    let entries: Vec<EntryPayload> =
        serde_json::from_str(&json).map_err(|e| format!("Failed to parse JSON: {}", e))?;

    let archive_dir = get_archive_dir();
    fs::create_dir_all(&archive_dir)
        .map_err(|e| format!("Failed to create archive directory: {}", e))?;

    let mut state_entries = state.entries.lock().map_err(|e| e.to_string())?;

    for mut entry in entries {
        let entry_id = entry
            .id
            .clone()
            .unwrap_or_else(|| uuid::Uuid::new_v4().to_string());

        // Skip if ID already exists
        if state_entries
            .iter()
            .any(|existing| existing.id.as_deref() == Some(entry_id.as_str()))
        {
            continue;
        }

        entry.id = Some(entry_id.clone());
        if let Some(base64) = entry.image_base64.as_ref() {
            entry.image_url = Some(write_embedded_image(&archive_dir, &entry_id, base64)?);
            entry.image_base64 = None;
        }
        let file_path = build_entry_file_path(&archive_dir, &entry.title, &entry_id);
        write_entry_to_disk(&file_path, &entry)?;
        state_entries.push(entry);
    }

    Ok(())
}

// ============================================================================
// Legacy Commands (Keep for compatibility)
// ============================================================================

/// Original backup command - kept for backward compatibility
#[tauri::command]
pub async fn backup_to_documents(payload: LegacyPayload) -> Result<String, String> {
    let archive_dir = get_archive_dir();
    fs::create_dir_all(&archive_dir)
        .map_err(|e| format!("Failed to create archive directory: {}", e))?;

    let sanitized_title: String = payload
        .title
        .chars()
        .take(30)
        .map(|c| {
            if c.is_alphanumeric() || c == '-' || c == '_' {
                c
            } else {
                '_'
            }
        })
        .collect();

    let timestamp = chrono::Utc::now().format("%Y%m%d_%H%M%S");
    let filename = format!("{}_{}.json", sanitized_title, timestamp);
    let file_path = archive_dir.join(&filename);

    let payload_for_save = serde_json::json!({
        "title": payload.title,
        "figure": payload.figure,
        "moment": payload.moment,
        "narrative": payload.narrative,
        "keywords": payload.keywords,
        "date_created": payload.date_created,
    });

    let json_content = serde_json::to_string_pretty(&payload_for_save)
        .map_err(|e| format!("Failed to serialize: {}", e))?;

    fs::write(&file_path, json_content).map_err(|e| format!("Failed to write file: {}", e))?;

    Ok(file_path.to_string_lossy().to_string())
}

/// Original get backup path command
#[tauri::command]
pub fn get_backup_path() -> Result<String, String> {
    Ok(get_archive_dir().to_string_lossy().to_string())
}

/// Legacy payload type
#[derive(Serialize, Deserialize)]
pub struct LegacyPayload {
    pub image: Option<String>,
    pub title: String,
    pub figure: String,
    pub moment: String,
    pub narrative: String,
    pub keywords: Vec<String>,
    pub date_created: String,
}

// ============================================================================
// Helper Functions
// ============================================================================

fn base64_decode(s: &str) -> Result<Vec<u8>, String> {
    let s = s.trim_start_matches("data:image/png;base64,");
    let s = s.trim_start_matches("data:image/jpeg;base64,");
    let s = s.trim_start_matches("data:image/gif;base64,");
    let s = s.trim_start_matches("data:image/webp;base64,");
    let s = s.trim_start_matches("data:image/svg+xml;base64,");

    base64::Engine::decode(&base64::engine::general_purpose::STANDARD, s).map_err(|e| e.to_string())
}
