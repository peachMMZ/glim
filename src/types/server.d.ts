export interface ServerState {
  running: boolean
  ip?: string
  port?: number
}

export interface ServerSetting {
  port: number
}