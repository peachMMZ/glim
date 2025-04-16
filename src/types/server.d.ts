export interface ServerState {
  running: boolean
  ip?: string
  port?: number
}

export interface ServerSetting {
  port: number
}

export interface PushData<T> {
  time: number,
  pushType: 'Text' | 'Image' | 'Audio',
  payload: T
}