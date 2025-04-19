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
        v-for="room in roomList"
        class="p-4 device-item transition-all duration-300 hover:bg-gray-50 hover:shadow-md cursor-pointer"
        :key="room.id"
        :style="{ backgroundColor: room.id === selecedId ? themeVars.primaryColor : themeVars.actionColor }"
        @click="onSelectRoom(room.id)"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-x-2">
            <NAvatar src="/avatar.png" round></NAvatar>
            <div class="flex flex-col">
              <span>{{ room.name }}</span>
              <NText class="text-xs" :type="selecedId === room.id ? 'warning' : 'success'">{{ room.device.type }}</NText>
            </div>
          </div>
          <div>
            <span class="text-xs">
              <GTime :time="room.recentlyTime" />
            </span>
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
import GTime from '@/components/GTime.vue'

const emits = defineEmits<{
  (e: 'select', value: string): void
}>()

const themeVars = useThemeVars()
const shareSpace = useShareSpace()

const selecedId = computed(() => shareSpace.currentRoom?.id)
const filterValue = ref<string>()
const roomList = computed(() => {
  if (!filterValue.value) {
    return shareSpace.roomList
  } else {
    const filter = filterValue.value.toLowerCase()
    return shareSpace.roomList.filter((room) => {
      return room.name.toLowerCase().includes(filter) || room.device.type.toLowerCase().includes(filter)
    })
  }
})

function onSelectRoom(id: string) {
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
