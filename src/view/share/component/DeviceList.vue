<template>
  <div class="h-full">
    <div class="h-12" :style="{ backgroundColor: themeVars.actionColor }">
      <div class="flex items-center justify-between h-full gap-x-2 px-4">
        <NInput v-model:value="filterValue" placeholder="搜索" size="small" />
        <NButton
          text
          :render-icon="renderIcon(RefreshCw)"
          :loading="refreshing"
          @click="refreshDeviceList"
        ></NButton>
      </div>
    </div>
    <NScrollbar class="h-[calc(100%-12rem)]">
      <div
        v-for="device in devices"
        class="p-4 device-item transition-all duration-300 hover:bg-gray-50 hover:shadow-md cursor-pointer"
        :key="device.id"
        :style="{ backgroundColor: device.id === selecedId ? themeVars.primaryColor : themeVars.actionColor }"
        @click="onSelectDevice(device.id)"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-x-2">
            <NAvatar src="/avatar.png" round></NAvatar>
            <div class="flex flex-col">
              <span>{{ device.name }}</span>
              <NText class="text-xs" :type="selecedId === device.id ? 'warning' : 'success'">{{ device.type }}</NText>
            </div>
          </div>
          <div>
            <span class="text-xs text-gray">{{ device.recentTime }}</span>
          </div>
        </div>
      </div>
    </NScrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  NScrollbar,
  NAvatar,
  NText,
  NInput,
  NButton,
  useThemeVars
} from 'naive-ui'
import { RefreshCw } from 'lucide-vue-next'
import { useShareSpace } from '@/store/share'
import { renderIcon } from '@/util/render'

const emits = defineEmits<{
  (e: 'select', value: string): void
}>()

const themeVars = useThemeVars()
const shareSpace = useShareSpace()

const selecedId = computed(() => shareSpace.currentRoom?.id)
const filterValue = ref<string>()
const devices = computed(() => {
  if (!filterValue.value) {
    return shareSpace.deviceList
  } else {
    const filter = filterValue.value.toLowerCase()
    return shareSpace.deviceList.filter((device) => {
      return device.name.toLowerCase().includes(filter) || device.type.toLowerCase().includes(filter)
    })
  }
})

function onSelectDevice(id: string) {
  shareSpace.setCurrentRoom(id)
  emits('select', id)
}

const refreshing = ref(false)
function refreshDeviceList() {
  refreshing.value = true
  shareSpace.getDeviceList().finally(() => {
    refreshing.value = false
  })
}

onMounted(() => {
})
</script>
<style scoped>
.device-item:hover {
  border-color: #eeeeee;
  transform: translateY(-1px);
}
</style>
