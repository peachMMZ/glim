export interface Task {
  id: string
  name: string
  total: number
  done: number
  progress: number
  speed: number
  eta: number
  status: 'pending' | 'running' | 'done' | 'error'
}

export interface DownloadTask extends Task {
  url: string
  output: string
}