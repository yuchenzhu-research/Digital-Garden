use serde::ser::SerializeStruct;
use serde::{Serialize, Serializer};

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("Database error: {0}")]
    Database(#[from] rusqlite::Error),

    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),

    #[error("Invalid image extension: {0}")]
    InvalidExtension(String),

    #[error("Entity not found: {0}")]
    NotFound(String),

    #[error("Tauri path resolution error: {0}")]
    Tauri(String),

    #[error("Base64 decoding error: {0}")]
    Base64(#[from] base64::DecodeError),

    #[error("Generic error: {0}")]
    Generic(String),
}

impl Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut state = serializer.serialize_struct("AppError", 2)?;
        let code = match self {
            AppError::Database(_) => "DATABASE_ERROR",
            AppError::Io(_) => "IO_ERROR",
            AppError::Serialization(_) => "SERIALIZATION_ERROR",
            AppError::InvalidExtension(_) => "INVALID_EXTENSION",
            AppError::NotFound(_) => "NOT_FOUND",
            AppError::Tauri(_) => "TAURI_ERROR",
            AppError::Base64(_) => "BASE64_ERROR",
            AppError::Generic(_) => "GENERIC_ERROR",
        };
        state.serialize_field("code", code)?;
        state.serialize_field("message", &self.to_string())?;
        state.end()
    }
}

impl From<String> for AppError {
    fn from(err: String) -> Self {
        AppError::Generic(err)
    }
}

impl From<&str> for AppError {
    fn from(err: &str) -> Self {
        AppError::Generic(err.to_string())
    }
}
