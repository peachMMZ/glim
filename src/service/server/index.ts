import { invoke } from '@tauri-apps/api/core'
import { join, appDataDir } from '@tauri-apps/api/path'
import { exists, BaseDirectory } from '@tauri-apps/plugin-fs'
import type { ServerState } from '@/types/server'

class ServerService {
  async startServer(port: number) {
    const clientExists = await exists('client', { baseDir: BaseDirectory.AppData })
    if (!clientExists) {
      const appDataDirPath = await appDataDir()
      const path = await join(appDataDirPath, 'client')
      throw new Error(`(${path}) does not exists`)
    }
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
