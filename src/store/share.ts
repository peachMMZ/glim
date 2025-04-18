import { ref } from 'vue'
import { defineStore } from 'pinia'
import { listen } from '@tauri-apps/api/event'
import { PushData, WebSocketMessage } from '@/types/server'
import { ShareSpaceMessage } from '@/types/share'
import { invoke } from '@tauri-apps/api/core'

export const useShareSpace = defineStore('share', () => {
  const dataList = ref<PushData[]>([])
  const textList = ref<ShareSpaceMessage[]>([])

  const init = async () => {
    listen<PushData>('glim://push-data', (event) => {
      const data = event.payload
      dataList.value.push(data)
      switch (data.pushType) {
        case 'Text':
          textList.value.push({
            time: data.time,
            text: data.payload as string
          })
          break
        default:
          break
      }
    })
    listen<WebSocketMessage>('glim://ws-recv', (event) => {
      console.log(event.payload)
      switch (event.payload.messageType) {
        case 'Text':
          if (event.payload.text) {
            textList.value.push({
              time: Date.now(),
              text: event.payload.text,
              sendByMe: false
            })
          }
          break
        default:
          break
      }
    })
  }

  const pushText = (text: string) => {
    textList.value.push({
      time: Date.now(),
      text,
      sendByMe: true
    })
    invoke('send_ws_message', { message: text }).then((res) => {
      console.log(res)
    })
  }

  return {
    dataList,
    textList,
    pushText,
    init
  }
})