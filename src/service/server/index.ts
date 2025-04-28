import { invoke } from '@tauri-apps/api/core'
import { join } from '@tauri-apps/api/path'
import { exists } from '@tauri-apps/plugin-fs'
import type { ServerSetting, ServerState } from '@/types/server'

class ServerService {
  async startServer(setting: ServerSetting) {
    const indexPath = await join(setting.clientPath, 'index.html')
    const clientExists = await exists(indexPath)
    if (!clientExists) {
      throw new Error(`(${indexPath}) does not exists`)
    }
    return invoke<string>('start_server', { ...setting })
  }

  stopServer() {
    return invoke<string>('stop_server')
  }

  getServerState() {
    return invoke<ServerState>('server_state')
  }
}

export const serverService = new ServerService()
