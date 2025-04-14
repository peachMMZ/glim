<template>
  <div class="h-full flex flex-col gap-y-2">
    <NCard>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 左侧：服务器状态信息 -->
        <div class="space-y-6">
          <div class="flex items-center gap-x-4">
            <div class="relative">
              <NBadge :type="serverState?.running ? 'success' : 'error'" dot>
                <NIcon :component="Server" :size="56" class="text-gray-700 transition-transform duration-300 hover:scale-110" />
              </NBadge>
            </div>
            <div class="flex-1">
              <h2 class="text-xl font-bold text-gray-800">Web服务</h2>
            </div>
          </div>

          <div class="rounded-lg p-4 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-x-2">
                <NIcon :component="Activity" :size="20" class="text-gray-500" />
                <span class="text-gray-600">服务状态</span>
              </div>
              <NTag v-if="serverState?.running" class="animate-pulse" type="success" size="small">
                运行中
              </NTag>
              <NTag v-else type="error" size="small">未运行</NTag>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-x-2">
                <NIcon :component="Globe" :size="20" class="text-gray-500" />
                <span class="text-gray-600">服务地址</span>
              </div>
              <div v-if="serverState?.running" class="flex items-center gap-x-2">
                <NButton text @click="openAddress">
                  {{ address }}
                </NButton>
                <NButton text :render-icon="renderIcon(Copy)" @click="copyAddress"></NButton>
              </div>
              <span v-else class="text-sm text-gray-500">未运行</span>
            </div>
          </div>

          <div class="flex justify-end gap-x-3">
            <NButton type="error" :render-icon="renderIcon(PowerOff)" :disabled="!serverState?.running" @click="stopServer">停止服务</NButton>
            <NButton type="primary" :render-icon="renderIcon(Power)" :disabled="serverState?.running" @click="startServer">启动服务</NButton>
          </div>
        </div>

        <!-- 右侧：二维码区域 -->
        <div v-if="serverState?.running" class="flex flex-col items-center justify-center space-y-4">
          <div class="text-center">
            <p class="text-sm text-gray-500 mt-1">扫描二维码快速使用服务</p>
          </div>
          <div class="p-4 rounded-lg shadow-sm">
            <NQrCode :value="address" :size="150" icon-src="/app-icon.svg" error-correction-level="Q" />
          </div>
        </div>
        <div v-else class="min-h-64 flex items-center justify-center rounded-lg">
          <NEmpty description="服务未启动" />
        </div>
      </div>
    </NCard>
    <NCard class="flex-1">
      <NGrid :cols="4" :x-gap="20" :y-gap="20">
        <NGridItem v-for="nav in navList" :key="nav.label">
          <NCard class="rounded-lg cursor-pointer"  hoverable>
            <div class="flex flex-col items-center justify-center">
              <img :src="nav.icon" class="w-10 h-10 mb-2" />
              <NText class="text-gray-600">{{ nav.label }}</NText>
            </div>
          </NCard>
        </NGridItem>
      </NGrid>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  NCard,
  NIcon,
  NButton,
  NTag,
  NBadge,
  NQrCode,
  NEmpty,
  NGrid,
  NGridItem,
  NText,
  useMessage
} from 'naive-ui'
import ShareSpace from '@/assets/icon/ShareSpace.svg'
import HistoryRecord from '@/assets/icon/HistoryRecord.svg'
import Download from '@/assets/icon/Download.svg'
import Upload from '@/assets/icon/Upload.svg'
import Trash from '@/assets/icon/Trash.svg'
import SystemManange from '@/assets/icon/SystemManage.svg'
import ResourceManage from '@/assets/icon/ResourceManage.svg'
import { Server, Power, PowerOff, Copy, Activity, Globe } from 'lucide-vue-next'
import { serverService } from '@/service/server'
import type { ServerState } from '@/types/server'
import { renderIcon } from '@/util/render'
import { openUrl } from '@tauri-apps/plugin-opener'
import { writeText } from '@tauri-apps/plugin-clipboard-manager'

const message = useMessage()

const serverState = ref<ServerState | null>(null)
const address = computed(() => {
  if (serverState.value?.running) {
    return `http://${serverState.value.ip}:${serverState.value?.port}`
  }
})

function startServer() {
  serverService.startServer(8090).then(getServerState)
}

function stopServer() {
  serverService.stopServer().then(getServerState)
}

async function getServerState() {
  serverState.value = await serverService.getServerState()
}

function openAddress() {
  if (address.value) {
    openUrl(address.value)
  }
}

function copyAddress() {
  if (address.value) {
    writeText(address.value).then(() => {
      message.success('地址已复制到剪贴板')
    }).catch((error) => {
      console.log(error)
      message.error('复制失败')
    })
  }
}

const navList = [
  {
    label: '共享空间',
    icon: ShareSpace
  },
  {
    label: '最近文件',
    icon: HistoryRecord
  },
  {
    label: '下载任务',
    icon: Download
  },
  {
    label: '上传任务',
    icon: Upload
  },
  {
    label: '回收站',
    icon: Trash
  },
  {
    label: '设备管理',
    icon: SystemManange
  },
  {
    label: '存储管理',
    icon: ResourceManage
  }
]

onMounted(async () => {
  getServerState()
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
