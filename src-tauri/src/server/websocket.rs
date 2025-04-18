use std::{sync::Arc, time::Duration};

use axum::extract::{ws::{Message, WebSocket}, State};
use serde::Serialize;
use tauri::Emitter;
use tokio::{sync::{broadcast, Mutex}, time::interval};
use futures::{sink::SinkExt, stream::StreamExt};

use super::AppState;

#[derive(Serialize, Debug)]
enum WebSocketMessageType {
    Text,
    Binary,
    Ping,
    Pong,
    Close,
}

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
struct WebSocketMessage {
    text: Option<String>,
    binary: Option<Vec<u8>>,
    message_type: WebSocketMessageType
}

impl From<Message> for WebSocketMessage {
    fn from(msg: Message) -> Self {
        match msg {
            Message::Text(text) => Self {
                text: Some(text.to_string()),
                binary: None,
                message_type: WebSocketMessageType::Text,
            },
            Message::Binary(data) => Self {
                text: None,
                binary: Some(data.to_vec()),
                message_type: WebSocketMessageType::Binary,
            },
            Message::Ping(_) => Self {
                text: None,
                binary: None,
                message_type: WebSocketMessageType::Ping,
            },
            Message::Pong(_) => Self {
                text: None,
                binary: None,
                message_type: WebSocketMessageType::Pong,
            },
            Message::Close(_) => Self {
                text: None,
                binary: None,
                message_type: WebSocketMessageType::Close,
            },
        }
    }
}

pub async fn websocket_handler(
    socket: WebSocket, 
    tx: broadcast::Sender<Message>, 
    connections: Arc<Mutex<Vec<broadcast::Sender<Message>>>>,
    State(state): State<Arc<AppState>>,
) {
    let mut rx = tx.subscribe();
    let tx_clone = tx.clone();

    let (mut sender, mut receiver) = socket.split();

    let send_task = tokio::spawn(async move {
        let mut interval = interval(Duration::from_secs(5));
        loop {
            tokio::select! {
                _ = interval.tick() => {
                    if sender.send(Message::Ping(vec![].into())).await.is_err() {
                        break;
                    }
                }
                Ok(msg) = rx.recv() => {
                    if matches!(msg, Message::Close(_)) {
                        let _ = sender.send(Message::Close(None)).await;
                        break;
                    }
                    if sender.send(msg).await.is_err() {
                        break;
                    }
                }
            }
        }
    });

    let recv_task = tokio::spawn(async move {
        while let Some(Ok(msg)) = receiver.next().await {
            match msg {
                Message::Pong(_) => {}
                _ => {
                    let ws_message = WebSocketMessage::from(msg);
                    println!("Received WebSocket message: {:?}", ws_message);
                    if state.app_handle.emit("glim://ws-recv", &ws_message).is_err() {
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
    if let Some(pos) = connections.iter().position(|c| c.same_channel(&tx)) {
        connections.remove(pos);
    }
}
