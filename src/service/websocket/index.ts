import { WebsocketConnection, WebSocketMessage } from '@/types/websocket'
import { invoke } from '@tauri-apps/api/core'

class WebSocketService {
  getConnections() {
    return invoke<WebsocketConnection[]>('get_ws_connections')
  }
  sendMessage(message: WebSocketMessage) {
    return invoke<string>('send_ws_message', { wsMessage: message })
  }
}

export const websocketService = new WebSocketService()