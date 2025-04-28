export interface ServerState {
  running: boolean
  ip?: string
  port?: number
}

export interface ServerSetting {
  port: number
  clientPath: string
}

export interface PushData<T = unknown> {
  time: number
  pushType: 'Text' | 'Image' | 'Audio'
  payload: T
}
