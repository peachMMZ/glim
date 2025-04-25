<template>
  <div class="h-full m-2">
    <NScrollbar class="max-h-[calc(100%-1rem)]">
      <NSpin :show="loading">
        <NList class="min-h-24" hoverable>
          <NListItem v-for="item in clientList" :key="item.id">
            <NThing :title="item.name">
              <template #avatar>
                <NAvatar :src="item.author.avatarUrl" :size="48" />
              </template>
              <template #description>
                <div>{{ item.author.login }}</div>
              </template>
              <template #header-extra>
                <NTime :time="new Date(item.publishedAt)"></NTime>
              </template>
              <div class="m-y-1" v-for="asset in item.assets">
                <div class="flex justify-between items-center">
                  <NText type="info" size="small">{{ asset.name }}</NText>
                  <NButton
                    type="info"
                    size="small"
                    text
                    :render-icon="renderIcon(Download)"
                    @click="downloadAsset(asset.browserDownloadUrl, asset.name)"
                  >
                    <NText type="info" size="small">{{ formatSize(asset.size) }}</NText>
                  </NButton>
                </div>
              </div>
            </NThing>
          </NListItem>
        </NList>
      </NSpin>
    </NScrollbar>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  NScrollbar,
  NSpin,
  NList,
  NListItem,
  NThing,
  NAvatar,
  NTime,
  NButton,
  NText,
  useMessage
} from 'naive-ui'
import { Download } from 'lucide-vue-next'
import { glimClientService } from '@/service/client'
import { Client } from '@/types/client'
import { renderIcon } from '@/util/render'
import { download } from '@tauri-apps/plugin-upload'
import { appDataDir, join } from '@tauri-apps/api/path'
import { formatSize } from '@/util/format'
import { useTaskStore } from '@/store/task'

const message = useMessage()
const taskStore = useTaskStore()

const clientList = ref<Client[]>([])
const loading = ref(false)
function fetchData() {
  loading.value = true
  glimClientService.getClientList().then((data) => {
    clientList.value = data
  }).finally(() => {
    loading.value = false
  })
}

async function downloadAsset(url: string, filename: string) {
  const output = await join(await appDataDir(), filename)
  const taskId = await taskStore.newDownloadTask({ url, output, name: filename })
  await download(url, output, (progressPayload) => {
    console.log(progressPayload)
    taskStore.updateTask(taskId, {
      done: progressPayload.progressTotal,
      total: progressPayload.total,
      speed: progressPayload.transferSpeed,
    })
  })
  message.success(`Download ${filename} success`)
}

onMounted(() => {
  fetchData()
})
</script>
<style scoped></style>
