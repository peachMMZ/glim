import { invoke } from '@tauri-apps/api/core'

export function uuid() {
  return invoke<string>('uuid')
}

export function getLocalIP() {
  return invoke<string | undefined>('get_local_ip')
}