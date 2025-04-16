use std::{sync::Arc, time::{SystemTime, UNIX_EPOCH}};

use axum::{extract::State, response::IntoResponse, Json};
use serde::{Deserialize, Serialize};
use tauri::Emitter;
use crate::server::response::ApiResult;

use super::AppState;

pub async fn hello_handler() -> impl IntoResponse {
    ApiResult::success(Some("Hello, World!"))
}

#[derive(Debug, Deserialize, Serialize)]
pub enum PushType {
    Text,
    Image,
    Audio,
    Video,
    File,
    Location,
    Card,
    Custom,
    Unknown
}
#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PushData {
    #[serde(default = "current_time")]
    time: u128,
    push_type: PushType,
    payload: String
}
fn current_time() -> u128 {
    SystemTime::now().duration_since(UNIX_EPOCH).expect("Time went backwards").as_millis()
}
pub async fn push_message_handler(
    State(state): State<Arc<AppState>>,
    Json(data): Json<PushData>
) -> impl IntoResponse {
    println!("[{:?}] Push data [type: {:?}] [payload: {:?}]", data.time, data.push_type, data.payload);
    match state.app_handle.emit("glim://push-data", &data) {
        Ok(_) => ApiResult::<()>::success(None),
        Err(_) => ApiResult::<()>::error("emit error".to_string()),
    }
}
