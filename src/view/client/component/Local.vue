<template>
  <div class="h-full m-2">
    <NScrollbar class="max-h-[calc(100%-1rem)]">
      <NList class="min-h-24" hoverable>
          <NListItem v-for="item in clientStore.localClientList" :key="item.id">
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
                <div v-if="asset.localPath" class="flex justify-between items-center">
                  <NButton type="info" text @click="openPath(asset.localPath)">{{ asset.localPath }}</NButton>
                  <NButton
                    type="info"
                    size="small"
                    text
                    :render-icon="renderIcon(Settings)"
                    @click=""
                  >
                    <NText type="info" size="small" @click="setClientPath(asset)">设为客户端</NText>
                  </NButton>
                </div>
              </div>
            </NThing>
          </NListItem>
        </NList>
    </NScrollbar>
  </div>
</template>

<script setup lang="ts">
import {
  NScrollbar,
  NList,
  NListItem,
  NThing,
  NAvatar,
  NTime,
  NButton,
  NText,
  useMessage
} from 'naive-ui'
import { Settings, Link } from 'lucide-vue-next'
import { renderIcon } from '@/util/render'
import { openUrl, openPath } from '@tauri-apps/plugin-opener'
import { useClientStore } from '@/store/client'
import { useSystemStore } from '@/store/system'
import { Asset } from '@/types/client'
import { serverService } from '@/service/server'

const message = useMessage()
const clientStore = useClientStore()
const systemStore = useSystemStore()

async function setClientPath(asset: Asset) {
  if (!asset.localPath) {
    message.error('无法获取客户端路径')
    return
  }
  const state = await serverService.getServerState()
  if (state.running) {
    message.warning('服务正在运行中，请先停止服务')
    return
  }
  systemStore.serverSetting.clientPath = asset.localPath
  await systemStore.saveSetting()
  message.success('设置成功')
}

</script>
<style scoped></style>
