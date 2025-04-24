import { fetch, ClientOptions } from '@tauri-apps/plugin-http'
import { writeFile } from '@tauri-apps/plugin-fs'

export interface Progress {
  transferred: number
  total: number
  percentage: number
}

export interface ProgressCallback {
  progress?: (progress: Progress) => void
}

export async function download(
  input: URL | Request | string, 
  output: string,
  init?: RequestInit & ClientOptions & ProgressCallback,
) {
  const response = await fetch(input, { method: 'GET', ...init })
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status}(${response.statusText})`)
  }
  const contentLength = response.headers.get('Content-Length')
  const total = contentLength ? parseInt(contentLength) : 0
  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('Failed to get reader')
  }
  const chunks: Uint8Array<ArrayBufferLike>[] = []
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    console.log(`downloaded ${value.length}/${total}`)
    if (init?.progress) {
      const transferred = chunks.reduce((acc, cur) => acc + cur.length, 0)
      const percentage = total ? transferred / total : 0
      init.progress({ transferred, total, percentage })
    }
  }
  const buffer = new Uint8Array(chunks.reduce((acc, cur) => acc + cur.length, 0))
  for (let i = 0, offset = 0; i < chunks.length; i++) {
    buffer.set(chunks[i], offset)
    offset += chunks[i].length
  }
  await writeFile(output, buffer)
}