<template>
  <NConfigProvider
    :locale="zhCN"
    :theme="systemStore.naiveTheme"
    :theme-overrides="systemStore.naiveThemeOverride"
  >
    <NMessageProvider>
      <NModalProvider>
        <RouterView />
      </NModalProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import {
  NConfigProvider,
  NMessageProvider,
  NModalProvider,
  zhCN
} from 'naive-ui'
import { useSystemStore } from '@/store/system'

const systemStore = useSystemStore()

</script>
<style>
.body {
  overflow: hidden;
}
</style>
