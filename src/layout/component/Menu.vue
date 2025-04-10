<template>
  <div class="h-full flex flex-col">
    <div class="basis-1/6 h-12 w-full flex flex-col justify-center items-center">
      <img class="w-1/2" src="/app-icon.png" />
    </div>
    <NMenu
      class="flex-1"
      :value="currentPath"
      :options="menuOptions"
      :collapsed="collapsed"
      :collapsed-width="64"
    />
    <div class="basis-1/6 w-full flex flex-col justify-center items-center">
      <NPopover class="w-full" placement="right" trigger="click" style="padding: 2px">
        <template #trigger>
          <NButton class="w-2/3" quaternary :render-icon="renderIcon(Menu, { size: 24 })"></NButton>
        </template>
        <template #default>
          <div>
            <NList clickable hoverable>
              <NListItem class="h-8 w-full" v-for="item in litterMenuOptions" :key="item.key" @click="item.onClick">
                <div class="flex justify-start items-center gap-x-2">
                  <NIcon :component="item.icon" :size="16" />
                  <span>{{ item.label }}</span>
                </div>
              </NListItem>
            </NList>
          </div>
        </template>
      </NPopover>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { RouterLink, useRouter, type RouteRecordRaw } from 'vue-router'
import { NMenu, type MenuOption, NButton, NPopover, NList, NListItem, NIcon } from 'naive-ui'
import { Menu, Settings, CircleArrowUp } from 'lucide-vue-next'
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
    key: 'update',
    label: '检查更新',
    icon: CircleArrowUp,
    onClick: () => {}
  },
  {
    key: 'setting',
    label: '设置',
    icon: Settings,
    onClick: () => {
      router.push('/setting')
    }
  }
]
</script>
<style scoped></style>
