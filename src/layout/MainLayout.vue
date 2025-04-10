<template>
  <div class="h-screen w-screen">
    <NLayout class="h-full" has-sider>
      <NLayoutSider
        width="160"
        bordered
        :collapsed="collapsed"
        collapse-mode="width"
      >
        <Menu :collapsed="collapsed" />
      </NLayoutSider>
      <NLayout ref="main" class="h-full">
        <NLayoutHeader ref="header" class="h-12" bordered>
          <Header @collapsed="handleCollapsed" />
        </NLayoutHeader>
        <NLayoutContent class="h-[calc(100%-5rem)]" content-style="padding: 5px;overflow-y: hidden">
          <RouterView>
            <template #default="{ Component, route }">
              <Transition name="fade" mode="out-in">
                <KeepAlive v-if="route.meta.keepAlive">
                  <component :is="Component" />
                </KeepAlive>
                <component v-else :is="Component" />
              </Transition>
            </template>
          </RouterView>
        </NLayoutContent>
        <NLayoutFooter ref="footer" class="h-8" bordered></NLayoutFooter>
      </NLayout>
    </NLayout>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  NLayout,
  NLayoutSider,
  NLayoutHeader,
  NLayoutFooter,
  NLayoutContent,
} from 'naive-ui'
import Header from './component/Header.vue'
import Menu from './component/Menu.vue'

const collapsed = ref(true)
function handleCollapsed(value: boolean) {
  collapsed.value = value
}
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  filter: blur(5px);
}
</style>
