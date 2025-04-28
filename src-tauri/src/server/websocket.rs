use std::{net::SocketAddr, sync::Arc, time::Duration};

use axum::{
    body::Bytes,
    extract::{
        ws::{Message, Utf8Bytes, WebSocket},
        ConnectInfo, State,
    },
    http::HeaderMap,
};
use futures::{sink::SinkExt, stream::StreamExt};
use serde::{Deserialize, Serialize};
use tauri::Emitter;
use tokio::{
    sync::{mpsc, Mutex},
    time::interval,
};

use super::AppState;

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct WebsocketConnection {
    pub id: String,
    pub user_agent: Option<String>,
    pub ip: Option<String>,
    #[serde(skip)]
    pub tx: mpsc::UnboundedSender<Message>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum WebSocketMessageType {
    Text,
    Binary,
    Ping,
    Pong,
    Close,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct WebSocketMessage {
    pub text: Option<String>,
    pub binary: Option<Vec<u8>>,
    pub message_type: WebSocketMessageType,
    pub from: Option<String>,
    pub to: Option<String>,
    timestamp: u128,
}

impl From<Message> for WebSocketMessage {
    fn from(msg: Message) -> Self {
        match msg {
            Message::Text(text) => Self {
                text: Some(text.to_string()),
                binary: None,
                message_type: WebSocketMessageType::Text,
                from: None,
                to: None,
                timestamp: std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .unwrap()
                    .as_millis(),
            },
            Message::Binary(data) => Self {
                text: None,
                binary: Some(data.to_vec()),
                message_type: WebSocketMessageType::Binary,
                from: None,
                to: None,
                timestamp: std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .unwrap()
                    .as_millis(),
            },
            Message::Ping(_) => Self {
                text: None,
                binary: None,
                message_type: WebSocketMessageType::Ping,
                from: None,
                to: None,
                timestamp: std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .unwrap()
                    .as_millis(),
            },
            Message::Pong(_) => Self {
                text: None,
                binary: None,
                message_type: WebSocketMessageType::Pong,
                from: None,
                to: None,
                timestamp: std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .unwrap()
                    .as_millis(),
            },
            Message::Close(_) => Self {
                text: None,
                binary: None,
                message_type: WebSocketMessageType::Close,
                from: None,
                to: None,
                timestamp: std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .unwrap()
                    .as_millis(),
            },
        }
    }
}

impl From<WebSocketMessage> for Message {
    fn from(msg: WebSocketMessage) -> Self {
        match msg.message_type {
            WebSocketMessageType::Text => Self::Text(Utf8Bytes::from(msg.text.unwrap())),
            WebSocketMessageType::Binary => Self::Binary(Bytes::from(msg.binary.unwrap())),
            WebSocketMessageType::Ping => Self::Ping(Bytes::new()),
            WebSocketMessageType::Pong => Self::Pong(Bytes::new()),
            WebSocketMessageType::Close => Self::Close(None),
        }
    }
}

pub async fn websocket_handler(
    headers: HeaderMap,
    socket: WebSocket,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    connections: Arc<Mutex<Vec<WebsocketConnection>>>,
    State(state): State<Arc<AppState>>,
) {
    // Get the user agent from the headers
    let user_agent = headers.get("User-Agent").and_then(|h| h.to_str().ok());

    // Generate a unique connection ID
    let connection_id = uuid::Uuid::new_v4().to_string();

    let (tx, mut rx) = mpsc::unbounded_channel();

    let new_connection = WebsocketConnection {
        id: connection_id.clone(),
        user_agent: user_agent.map(|s| s.to_string()),
        ip: Some(addr.ip().to_string()),
        tx: tx.clone(),
    };
    let new_connection_clone = new_connection.clone();
    connections.lock().await.push(new_connection);

    let _ = state
        .app_handle
        .emit("glim://ws-connect", &new_connection_clone);

    let tx_clone = tx.clone();

    let (mut sender, mut receiver) = socket.split();

    let recv_connection_id = connection_id.clone();

    let send_task = tokio::spawn(async move {
        let mut interval = interval(Duration::from_secs(5));
        loop {
            tokio::select! {
                _ = interval.tick() => {
                    if sender.send(Message::Ping(vec![].into())).await.is_err() {
                        break;
                    }
                }
                Some(msg) = rx.recv() => {
                    match msg {
                        Message::Close(_) => {
                            let _ = sender.send(Message::Close(None)).await;
                            break;
                        }
                        _ => {
                            if let Err(_) = sender.send(msg).await {
                                break;
                            }
                        }
                    }
                }
            }
        }
    });

    let emit_recv_app = state.app_handle.clone();
    let recv_task = tokio::spawn(async move {
        while let Some(Ok(msg)) = receiver.next().await {
            match msg {
                Message::Pong(_) => {}
                _ => {
                    let mut ws_message = WebSocketMessage::from(msg);
                    ws_message.from = Some(recv_connection_id.clone());
                    println!("Received WebSocket message: {:?}", ws_message);
                    if emit_recv_app.emit("glim://ws-recv", &ws_message).is_err() {
                        let _ = tx_clone.send(Message::Close(None));
                        break;
                    }
                }
            }
        }
    });

    tokio::select! {
        _ = send_task => {},
        _ = recv_task => {}
    }

    let mut connections = connections.lock().await;
    connections.retain(|c| c.id != connection_id);
    let _ = state
        .app_handle
        .emit("glim://ws-disconnect", &connection_id);
}

#[tauri::command]
pub async fn send_ws_message(ws_message: WebSocketMessage) -> Result<(), String> {
    let (_, _, _, _, active_ws_connections) = super::init_globals();
    let connections = active_ws_connections.lock().await;
    if connections.is_empty() {
        return Err("No active connections".to_string());
    }
    let message = Message::from(ws_message.clone());
    println!("Sending WebSocket message: {:?}", ws_message);
    // 如果有目标ID，则只发送给目标连接
    if let Some(target_id) = ws_message.to {
        if let Some(connection) = connections.iter().find(|c| c.id == target_id) {
            if (connection.tx.send(message)).is_err() {
                return Err("Failed to send message".to_string());
            }
        } else {
            return Err("Target connection not found".to_string());
        }
    } else {
        // 如果没有目标ID，则发送给所有连接
        for connection in connections.iter() {
            if (connection.tx.send(message.clone())).is_err() {
                return Err("Failed to send message".to_string());
            }
        }
    }

    Ok(())
}

#[tauri::command]
pub async fn get_ws_connections() -> Result<Vec<WebsocketConnection>, String> {
    let (_, _, _, _, active_ws_connections) = super::init_globals();
    let connections = active_ws_connections.lock().await;
    Ok(connections.clone())
}
