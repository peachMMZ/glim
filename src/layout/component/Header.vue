<template>
  <div class="h-full flex justify-between items-center px-4">
    <NFlex justify="start">
      <NButton
        text
        :render-icon="renderIcon(collapseIcon)"
        @click="toggleCollapse"
      >
      </NButton>
    </NFlex>
    <div class="flex-1 h-full w-full flex justify-center items-center" data-tauri-drag-region>
    </div>
    <NFlex justify="end">
      <NButton text :render-icon="renderIcon(CircleMinus, { color: themeVars.warningColor })" @click="appWindow.minimize()"></NButton>
      <NButton text :render-icon="renderIcon(Circle, { color: themeVars.successColor })" @click="appWindow.toggleMaximize()"></NButton>
      <NButton text :render-icon="renderIcon(CircleX, { color: themeVars.errorColor })" @click="appWindow.close()"></NButton>
    </NFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NButton, NFlex, useThemeVars } from 'naive-ui'
import { CircleMinus, Circle, CircleX } from 'lucide-vue-next'
import { IndentIncrease, IndentDecrease } from 'lucide-vue-next'
import { renderIcon } from '@/util/render'
import { Window } from '@tauri-apps/api/window'

const appWindow = new Window('main')
const themeVars = useThemeVars()

const collapsed = ref(true)

const emits = defineEmits<{
  (e: 'collapsed', value: boolean): void
}>()

const collapseIcon = computed(() => {
  return collapsed.value ? IndentIncrease : IndentDecrease
})

function toggleCollapse() {
  collapsed.value = !collapsed.value
  emits('collapsed', collapsed.value)
}
</script>
<style scoped></style>
