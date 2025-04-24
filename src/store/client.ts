import { Client } from '@/types/client'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useClientStore = defineStore('client', () => {

  const current = ref<Client | null>(null)
  const localClientList = ref<Client[]>([])

  return {
    current,
    localClientList
  }
})