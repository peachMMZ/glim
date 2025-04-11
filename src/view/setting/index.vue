<template>
  <div class="h-full">
    <NTabs
      class="h-full"
      type="line"
      placement="left"
      default-value="theme"
    >
      <NTabPane
        v-for="(item) in tabPaneList"
        :name="item.key"
        :tab="item.label"
      >
        <component :is="item.component" />
      </NTabPane>
    </NTabs>
  </div>
</template>

<script setup lang="ts">
import {
  NTabs,
  NTabPane,
} from 'naive-ui'
import ThemeSetting from './component/ThemeSetting.vue'
import NotificationSetting from './component/NotificationSetting.vue'
import About from './component/About.vue'

const tabPaneList = [
  { key: 'theme', label: '主题', component: ThemeSetting },
  { key: 'notification', label: '通知', component: NotificationSetting },
  { key: 'about', label: '关于', component: About },
]
</script>
<style scoped></style>
