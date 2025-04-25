import { invoke } from '@tauri-apps/api/core'

export function uuid() {
  return invoke<string>('uuid')
}