<template>
  <div class="h-full m-2">
    <NScrollbar class="max-h-[calc(100%-1rem)]">
      <NSpin :show="loading">
        <NList class="min-h-24" hoverable>
          <NListItem v-for="item in releaseList" :key="item.id">
            <NThing>
              <template #header>
                <div class="flex justify-between items-center gap-x-2">
                  <NText size="large">{{ item.name }}</NText>
                  <NButton type="info" text :render-icon="renderIcon(Link, { size: 16 })" @click="openUrl(item.htmlUrl)"></NButton>
                </div>
              </template>
              <template #avatar>
                <NAvatar :src="item.author.avatarUrl" :size="48" />
              </template>
              <template #description>
                <div>{{ item.author.login }}</div>
              </template>
              <template #header-extra>
                <div class="flex items-center gap-x-2">
                  <NText>发布日期：</NText>
                  <NTime :time="new Date(item.publishedAt)"></NTime>
                </div>
              </template>
              <div class="m-y-1" v-for="asset in item.assets">
                <div class="flex justify-between items-center">
                  <NText
                    :type="clientStore.isAssetExists(asset.id) ? 'success' : 'info'"
                    size="small"
                  >
                    {{ `${asset.name}${clientStore.isAssetExists(asset.id) ? '(已下载)' : ''}` }}
                  </NText>
                  <NButton
                    :type="clientStore.isAssetExists(asset.id) ? 'success' : 'info'"
                    size="small"
                    text
                    :disabled="clientStore.isAssetExists(asset.id)"
                    :render-icon="renderIcon(Download)"
                    @click="downloadAsset(item, asset)"
                  >
                    <span>{{ formatSize(asset.size) }}</span>
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
import { Download, Link } from 'lucide-vue-next'
import { glimClientService } from '@/service/client'
import { Release, Asset } from '@/types/client'
import { renderIcon } from '@/util/render'
import { download } from '@tauri-apps/plugin-upload'
import { appDataDir, join } from '@tauri-apps/api/path'
import { openUrl } from '@tauri-apps/plugin-opener'
import { remove } from '@tauri-apps/plugin-fs'
import { formatSize } from '@/util/format'
import { useTaskStore } from '@/store/task'
import { useClientStore } from '@/store/client'
import { unzip } from '@/util/file'

const message = useMessage()
const taskStore = useTaskStore()
const clientStore = useClientStore()

const releaseList = ref<Release[]>([])
const loading = ref(false)
function fetchData() {
  loading.value = true
  glimClientService.getReleaseList().then((data) => {
    releaseList.value = data
  }).finally(() => {
    loading.value = false
  })
}

async function downloadAsset(release: Release, asset: Asset) {
  const output = await join(await appDataDir(), 'client', asset.name)
  const taskId = await taskStore.newDownloadTask({ url: asset.browserDownloadUrl, output, name: asset.name })
  await download(asset.browserDownloadUrl, output, (progressPayload) => {
    taskStore.updateTask(taskId, {
      done: progressPayload.progressTotal,
      total: progressPayload.total,
      speed: progressPayload.transferSpeed,
    })
  })
  const extractPath = output.replace(/\.zip$/, '')
  await unzip({ zipPath: output, extractPath })
  await remove(output)
  asset.localPath = extractPath
  clientStore.updateClient(release, asset)
  message.success(`Download ${asset.name} success`)
}

onMounted(() => {
  fetchData()
})
</script>
<style scoped></style>
