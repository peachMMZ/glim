<template>
  <div class="h-full flex flex-col">
    <div class="basis-1/6 h-12 w-full flex flex-col justify-center items-center p-y-2">
      <img class="w-1/2" src="/app-icon.svg" />
    </div>
    <NScrollbar class="h-[calc(100vh-3rem)]">
      <NMenu
        class="flex-1"
        :value="currentPath"
        :options="menuOptions"
        :collapsed="collapsed"
        :collapsed-width="64"
      />
    </NScrollbar>
    <div class="basis-1/6 w-full flex flex-col justify-center items-center">
      <NDropdown
        :options="litterMenuOptions"
        trigger="click"
        placement="right-end"
        @select="(key: string) => litterMenuOptions.find((item) => item.key === key)?.onClick()"
      >
        <NButton class="w-2/3" quaternary :render-icon="renderIcon(Menu, { size: 24 })"></NButton>
      </NDropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { RouterLink, useRouter, type RouteRecordRaw } from 'vue-router'
import { NMenu, type MenuOption, NButton, NDropdown, NScrollbar } from 'naive-ui'
import { Menu, Settings, CircleArrowUp, CircleHelp } from 'lucide-vue-next'
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

const litterMenuOptions = [
  {
    key: 'help',
    label: '帮助',
    icon: renderIcon(CircleHelp),
    onClick() {}
  },
  {
    key: 'update',
    label: '检查更新',
    icon: renderIcon(CircleArrowUp),
    onClick: () => {}
  },
  {
    key: 'setting',
    label: '设置',
    icon: renderIcon(Settings),
    onClick: () => {
      router.push('/setting')
    }
  }
]
</script>
<style scoped></style>
