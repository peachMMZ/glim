import { ref } from 'vue'
import { defineStore } from 'pinia'
import { listen } from '@tauri-apps/api/event'
import { PushData } from '@/types/server'
import { ShareSpaceMessage } from '@/types/share'

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
  }

  const pushText = (text: string) => {
    textList.value.push({
      time: Date.now(),
      text,
      sendByMe: true
    })
  }

  return {
    dataList,
    textList,
    pushText,
    init
  }
})