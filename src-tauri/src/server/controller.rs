use std::sync::Arc;

use crate::server::response::ApiResult;
use axum::{
    body::Body,
    extract::{Path, State},
    http::{HeaderMap, StatusCode},
    response::IntoResponse,
};
use serde::{Deserialize, Serialize};
use tauri_plugin_store::StoreExt;
use tokio_util::io::ReaderStream;

use super::AppState;

pub async fn hello_handler() -> impl IntoResponse {
    ApiResult::success(Some("Hello, World!"))
}

#[derive(Debug, Serialize, Deserialize)]
struct FileInfo {
    rid: String,
    filename: String,
    path: String,
    size: usize,
}
pub async fn get_resource(
    Path(resource_id): Path<String>,
    State(state): State<Arc<AppState>>,
) -> Result<impl IntoResponse, ApiResult<()>> {
    let store = state
        .app_handle
        .store("data/resources.json")
        .map_err(|e| ApiResult::<()>::error(StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let files_value = store.get("files").ok_or_else(|| {
        ApiResult::<()>::error(StatusCode::NOT_FOUND, "Resource not found".to_string())
    })?;
    let files_list: Vec<FileInfo> = serde_json::from_value(files_value.clone())
        .map_err(|e| ApiResult::<()>::error(StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    let file_info = files_list
        .iter()
        .find(|f| f.rid == resource_id)
        .ok_or_else(|| {
            ApiResult::<()>::error(StatusCode::NOT_FOUND, "Resource not found".to_string())
        })?;

    let file = tokio::fs::File::open(&file_info.path)
        .await
        .expect("Failed to open file");

    let mut headers = HeaderMap::new();
    headers.insert(
        axum::http::header::CONTENT_TYPE,
        "application/octet-stream".parse().unwrap(),
    );
    headers.insert(
        axum::http::header::CONTENT_DISPOSITION,
        format!("attachment; filename=\"{}\"", file_info.filename)
            .parse()
            .unwrap(),
    );

    let stream = ReaderStream::new(file);
    let body = Body::from_stream(stream);

    Ok((headers, body))
}
