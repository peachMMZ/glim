import { fetch } from '@tauri-apps/plugin-http'
import { toCamelCaseKeys } from 'es-toolkit'

class GlimClientService {
  async getReleaseList() {
    const res = await fetch(import.meta.env.VITE_CLIENT_RELEASE_URL)
    if (!res.ok) {
      throw new Error(`Failed to fetch client list: ${res.status}(${res.statusText})`)
    }
    const data = await res.json()
    return toCamelCaseKeys(data)
  }
}

export const glimClientService = new GlimClientService()