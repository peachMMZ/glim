import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { listen } from '@tauri-apps/api/event'
import { PushData } from '@/types/server'

export const useShareSpace = defineStore('share', () => {
  const dataList = ref<PushData<string>[]>([])
  const textDataList = computed(() => dataList.value.filter(item => item.pushType === 'Text'))

  const init = async () => {
    listen<PushData<string>>('glim://push-data', (event) => {
      const data = event.payload
      switch (data.pushType) {
        case 'Text':
          dataList.value.push(data)
          break
        default:
          break
      }
    })
  }

  return {
    dataList,
    textDataList,
    init
  }
})