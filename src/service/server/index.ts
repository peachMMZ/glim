import { invoke } from '@tauri-apps/api/core'
import type { ServerState } from '@/types/server'

class ServerService {
  startServer(port: number) {
    return invoke<string>('start_server', { port })
  }

  stopServer() {
    return invoke<string>('stop_server')
  }

  getServerState() {
    return invoke<ServerState>('server_state')
  }
}

export const serverService = new ServerService()
