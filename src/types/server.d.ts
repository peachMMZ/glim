export interface ServerState {
  running: boolean
  ip?: string
  port?: number
}

export interface ServerSetting {
  port: number
}

export interface PushData<T = unknown> {
  time: number,
  pushType: 'Text' | 'Image' | 'Audio',
  payload: T
}

export interface WebSocketMessage {
  text?: string,
  binary?: Uint8Array,
  messageType: 'Text' | 'Binary' | 'Ping' | 'Pong' | 'Close'
}