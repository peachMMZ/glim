<template>
  <div>
    <NMenu
      :value="currentPath"
      :options="menuOptions"
      :collapsed="collapsed"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { RouterLink, useRouter, type RouteRecordRaw } from 'vue-router'
import { NMenu, type MenuOption } from 'naive-ui'
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
