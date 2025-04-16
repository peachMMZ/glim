<template>
  <div class="h-full">
    <div
      v-for="device in devices"
      class="p-4 device-item transition-all duration-300 hover:bg-gray-50 hover:shadow-md cursor-pointer"
      :key="device.id"
      :style="{ backgroundColor: device.id === selecedId ? themeVars.primaryColor : 'transparent' }"
      @click="selecedId = device.id"
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  NAvatar,
  NText,
  useThemeVars
} from 'naive-ui'

const themeVars = useThemeVars()

const selecedId = ref(1)
const devices = ref([
  { id: 1, name: 'Device 1', type: 'Android', recentTime: '16:30' },
  { id: 2, name: 'Device 2', type: 'iOS', recentTime: '16:30' },
  { id: 3, name: 'Device 3', type: 'Windows', recentTime: '16:30' },
  { id: 4, name: 'Device 4', type: 'MacOS', recentTime: '16:30' },
])
</script>
<style scoped>
.device-item:hover {
  border-color: #eeeeee;
  transform: translateY(-1px);
}
</style>
