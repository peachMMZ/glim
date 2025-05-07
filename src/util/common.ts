import { invoke } from '@tauri-apps/api/core'

export function uuid() {
  return invoke<string>('uuid')
}

export function getLocalIP() {
  return invoke<string | undefined>('get_local_ip')
}

export async function copyImage(src: string) {
  const res = await fetch(src)
  if (!res.ok) {
    throw new Error(`Failed to fetch image: ${res.status}(${res.statusText})`)
  }
  const blob = await res.blob()
  if (blob.size === 0) {
    throw new Error('图片为空')
  }
  const img = document.createElement('img')
  img.onload = () => {
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    canvas.toBlob((pngBlob) => {
      if (!pngBlob) {
        throw new Error('Failed to convert image to blob')
      }
      const clipboardItem = new ClipboardItem({ [pngBlob.type]: pngBlob })
      navigator.clipboard.write([clipboardItem]).then(() => {
        URL.revokeObjectURL(img.src)
      })
    }, 'image/png')
  }
  img.src = URL.createObjectURL(blob)
}