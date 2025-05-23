mod controller;
mod response;
pub mod util;
pub mod websocket;

use axum::{
    extract::{ws::Message, ConnectInfo, WebSocketUpgrade},
    http::HeaderMap,
    routing::get,
    Router,
};
use serde::Serialize;
use std::{
    net::SocketAddr,
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc, OnceLock,
    },
};
use tauri::AppHandle;
use tokio::{sync::Mutex, task::JoinHandle};
use tower_http::{
    cors::{Any, CorsLayer},
    services::ServeDir,
};

pub struct AppState {
    app_handle: AppHandle,
}

#[derive(Serialize, Clone, Default)]
pub struct ServerState {
    ip: Option<String>,
    port: Option<u16>,
    running: bool,
}

static SERVER_STATE: OnceLock<Arc<Mutex<ServerState>>> = OnceLock::new();
static IS_RUNNING: OnceLock<AtomicBool> = OnceLock::new();
static SHOULD_SHUTDOWN: OnceLock<AtomicBool> = OnceLock::new();
static SERVER_HANDLE: OnceLock<Mutex<Option<JoinHandle<()>>>> = OnceLock::new();
pub static ACTIVE_WS_CONNECTIONS: OnceLock<Arc<Mutex<Vec<websocket::WebsocketConnection>>>> =
    OnceLock::new();

pub fn init_globals() -> (
    &'static AtomicBool,
    &'static Mutex<Option<JoinHandle<()>>>,
    &'static AtomicBool,
    &'static Arc<Mutex<ServerState>>,
    &'static Arc<Mutex<Vec<websocket::WebsocketConnection>>>,
) {
    (
        IS_RUNNING.get_or_init(|| AtomicBool::new(false)),
        SERVER_HANDLE.get_or_init(|| Mutex::new(None)),
        SHOULD_SHUTDOWN.get_or_init(|| AtomicBool::new(false)),
        SERVER_STATE.get_or_init(|| Arc::new(Mutex::new(ServerState::default()))),
        ACTIVE_WS_CONNECTIONS.get_or_init(|| Arc::new(Mutex::new(Vec::new()))),
    )
}

#[tauri::command]
pub async fn start_server(
    app: tauri::AppHandle,
    port: u16,
    client_path: String,
) -> Result<String, String> {
    let (is_running, handle_storage, should_shutdown, server_state_mutex, active_ws_connections) =
        init_globals();

    if is_running.load(Ordering::SeqCst) {
        return Err("Server is already running".to_string());
    }

    should_shutdown.store(false, Ordering::SeqCst);

    println!("Starting server on port {}", port);
    println!("Client path: {}", client_path);

    let state = Arc::new(AppState { app_handle: app });

    let cors = CorsLayer::new()
        .allow_methods(Any)
        .allow_origin(Any)
        .allow_headers(Any);

    let router = Router::new()
        .route(
            "/ws",
            get(
                |ws: WebSocketUpgrade,
                 state,
                 headers: HeaderMap,
                 connect_info: ConnectInfo<SocketAddr>| {
                    let connections = active_ws_connections.clone();
                    async move {
                        ws.on_upgrade(move |socket| {
                            websocket::websocket_handler(
                                headers,
                                socket,
                                connect_info,
                                connections,
                                state,
                            )
                        })
                    }
                },
            ),
        )
        .route("/api/hello", get(controller::hello_handler))
        .route("/api/resource/{resource_id}", get(controller::get_resource))
        .with_state(state)
        .layer(cors)
        .fallback_service(ServeDir::new(client_path))
        .into_make_service_with_connect_info::<SocketAddr>();

    let ip = util::get_local_ip().unwrap_or_else(|| "127.0.0.1".to_string());

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .map_err(|e| e.to_string())?;

    let server_handle = tokio::spawn(async move {
        axum::serve(listener, router)
            .with_graceful_shutdown(shutdown_signal())
            .await
            .unwrap_or_else(|e| eprintln!("Error: {}", e));
    });

    *handle_storage.lock().await = Some(server_handle);
    is_running.store(true, Ordering::SeqCst);

    let url = format!("http://{}:{}", ip, port);

    // 更新 ServerState
    let mut server_state = server_state_mutex.lock().await;
    *server_state = ServerState {
        running: true,
        ip: Some(ip),
        port: Some(port),
    };
    Ok(url)
}

#[tauri::command]
pub async fn stop_server() -> Result<String, String> {
    let (is_running, handle_storage, should_shutdown, server_state_mutex, active_ws_connections) =
        init_globals();

    if !is_running.load(Ordering::SeqCst) {
        return Err("Server is not running".to_string());
    }

    // 清空ws连接
    let mut connections = active_ws_connections.lock().await;
    for connection in connections.iter() {
        let _ = connection.tx.send(Message::Close(None));
    }
    connections.clear();

    should_shutdown.store(true, Ordering::SeqCst);

    if let Some(handle) = handle_storage.lock().await.take() {
        handle.await.map_err(|e| e.to_string())?;
    }

    is_running.store(false, Ordering::SeqCst);
    should_shutdown.store(false, Ordering::SeqCst);

    // 更新 ServerState
    let mut server_state = server_state_mutex.lock().await;
    *server_state = ServerState::default();

    println!("Server stopped");
    Ok("Server stopped".to_string())
}

async fn shutdown_signal() {
    let should_shutdown = SHOULD_SHUTDOWN.get_or_init(|| AtomicBool::new(false));
    loop {
        if should_shutdown.load(Ordering::SeqCst) {
            println!("Shutting down...");
            break;
        }
        tokio::time::sleep(tokio::time::Duration::from_millis(100)).await
    }
}

#[tauri::command]
pub async fn server_state() -> Result<ServerState, String> {
    let server_state_mutex =
        SERVER_STATE.get_or_init(|| Arc::new(Mutex::new(ServerState::default())));
    let server_state = server_state_mutex.lock().await;
    Ok(server_state.clone())
}
