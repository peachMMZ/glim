import { Asset, Client, Release } from '@/types/client'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { sep } from '@tauri-apps/api/path'
import { LazyStore } from '@tauri-apps/plugin-store'

export const useClientStore = defineStore('client', () => {

  const localClientStore = new LazyStore(`conf${sep()}client.json`)

  const localClientList = ref<Client[]>([])

  async function init() {
    const local = await localClientStore.get<Client[]>('clients')
    if (local) {
      localClientList.value = local
    } else {
      save()
    }
  }

  async function save() {
    localClientStore.set('clients', localClientList.value)
    localClientStore.save()
  }

  function isAssetExists(assetId: number) {
    for (const client of localClientList.value) {
      for (const asset of client.assets) {
        if (asset.id === assetId) {
          return true
        }
      }
    }
    return false
  }

  function updateClient(release: Release, asset: Asset) {
    let client = localClientList.value.find(c => c.id === release.id)
    if (!client) {
      client = release
      localClientList.value.push(client)
    } else {
      const assetExits = client.assets.find(a => a.id === asset.id)
      if (!assetExits) {
        client.assets.push(asset)
      }
    }
    save()
  }

  return {
    localClientList,
    init,
    save,
    updateClient,
    isAssetExists
  }
})