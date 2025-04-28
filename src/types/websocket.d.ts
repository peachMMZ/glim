export interface WebsocketConnection {
  id: string
  userAgent: string
  ip?: string
}

export interface WebSocketMessage {
  text?: string
  binary?: Uint8Array
  messageType: 'Text' | 'Binary' | 'Ping' | 'Pong' | 'Close'
  from?: string
  to?: string
  timestamp: number
}