use axum::http::StatusCode;
use axum::{response::IntoResponse, Json};
use serde::Serialize;
use serde_json::json;

// 成功响应码和信息
const SUCCESS_CODE: i32 = StatusCode::OK.as_u16() as i32;
const SUCCESS_MESSAGE: &str = "success";
const ERROR_CODE: i32 = StatusCode::INTERNAL_SERVER_ERROR.as_u16() as i32;

/// 响应结构体
#[derive(Debug, Serialize)]
pub struct ApiResult<T> {
    code: i32,
    success: bool,
    message: String,
    data: Option<T>,
}

// 实现 `IntoResponse` trait 以将 ApiResult 转换为 Axum 响应
impl<T: Serialize> IntoResponse for ApiResult<T> {
    fn into_response(self) -> axum::response::Response {
        let val = json!(self);
        Json(val).into_response()
    }
}

impl<T> ApiResult<T> {
    pub fn success(data: Option<T>) -> Self {
        Self {
            code: SUCCESS_CODE,
            success: true,
            data,
            message: SUCCESS_MESSAGE.to_owned(),
        }
    }
    pub fn error(message: String) -> Self {
        Self {
            code: ERROR_CODE,
            success: false,
            data: None,
            message,
        }
    }
}
