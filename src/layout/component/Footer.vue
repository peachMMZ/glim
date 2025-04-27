<template>
  <div class="h-full w-full p-x-2 flex justify-between items-center">
    <div></div>
    <div class="w-1/3 p-x-4 flex justify-end gap-x-4">
      <div v-if="taskStore.latestTask && taskStore.latestTask.status !== 'done'" class="w-full flex items-center gap-x-2">
        <NEllipsis class="w-1/2">{{ taskStore.latestTask.name }}</NEllipsis>
        <NProgress class="w-1/2" :percentage="taskStore.latestTask.progress" />
      </div>
      <NButton text :render-icon="renderIcon(Bell, { size: 16 })"></NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NButton,
  NProgress,
  NEllipsis
} from 'naive-ui'
import { Bell } from 'lucide-vue-next'
import { useTaskStore } from '@/store/task'
import { renderIcon } from '@/util/render'

const taskStore = useTaskStore()
</script>
<style scoped></style>
