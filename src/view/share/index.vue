<template>
  <div class="h-full">
    <NSplit
      class="h-full"
      direction="horizontal"
      :default-size="0.25"
      :max="0.5"
      :min="0.2"
      :resize-trigger-size="2"
    >
      <template #1>
        <DeviceList />
      </template>
      <template #2>
        <NSplit
          direction="vertical"
          :default-size="0.65"
          :resize-trigger-size="2"
          :max="0.8"
          :min="0.5"
        >
          <template #1>
            <ChatPanel />
          </template>
          <template #2>
            <Editor />
          </template>
        </NSplit>
      </template>
    </NSplit>
  </div>
</template>

<script setup lang="ts">
import {
  NSplit
} from 'naive-ui'
import DeviceList from './component/DeviceList.vue'
import ChatPanel from './component/ChatPanel.vue'
import Editor from './component/Editor.vue'
</script>
