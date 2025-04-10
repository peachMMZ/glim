<template>
  <div class="h-full flex flex-col">
    <div class="h-12 w-full flex flex-col justify-start items-center p-y-4">
      <img class="w-1/2" src="/tauri.svg" />
      <NDivider />
    </div>
    <NMenu
      class="flex-1"
      :value="currentPath"
      :options="menuOptions"
      :collapsed="collapsed"
      :collapsed-width="64"
    />
    <div class="basis-1/6 w-full flex flex-col justify-center items-center">
      <NPopover placement="right" trigger="hover">
        <template #trigger>
          <NButton text :render-icon="renderIcon(Menu)"></NButton>
        </template>
        <template #default>
          <div>Settings Options</div>
        </template>
      </NPopover>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { RouterLink, useRouter, type RouteRecordRaw } from 'vue-router'
import { NMenu, type MenuOption, NDivider, NButton, NPopover } from 'naive-ui'
import { Menu } from 'lucide-vue-next'
import { renderIcon } from '@/util/render'

defineProps<{
  collapsed: boolean
}>()

const router = useRouter()

const currentPath = computed(() => {
  return router.currentRoute.value.path
})

const menuOptions = computed(() => {
  const root = router.getRoutes().find((route) => route.name === 'root')
  if (!root) return []
  return root.children.filter((route) => !route.meta?.hidden).map(routeToMenuOption)
})

function routeToMenuOption(route: RouteRecordRaw): MenuOption {
  return {
    key: route.path,
    label: () => h(RouterLink, { to: route.path }, { default: () => route.meta?.title }),
    icon: renderIcon(route.meta?.icon),
  }
}
</script>
<style scoped></style>
