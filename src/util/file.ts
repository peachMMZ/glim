import { invoke } from '@tauri-apps/api/core'

interface UnzipOptions {
  zipPath: string
  extractPath: string
}
export async function unzip(options: UnzipOptions) {
  return invoke<void>('unzip', { ...options })
}