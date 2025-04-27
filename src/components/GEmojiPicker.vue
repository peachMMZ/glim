<template>
  <div>
    <NPopover :trigger="trigger" placement="top-start">
      <template #trigger>
        <slot name="trigger"></slot>
      </template>
      <div>
        <NTabs class="max-h-56 max-w-48" type="line" size="small">
          <NTabPane v-for="(key, index) in Object.keys(emojiList)" :name="key" :tab="key" :key="index">
            <NScrollbar class="max-h-45">
              <NGrid :cols="8" :x-gap="4" :y-gap="4">
                <NGridItem
                  class="hover:bg-gray-200 hover:rounded-md"
                  v-for="(item, index) in emojiList[key as keyof typeof emojiList]"
                  :key="index"
                >
                  <NButton text @click="emits('pick', item.emoji)">{{ item.emoji }}</NButton>
                </NGridItem>
              </NGrid>
            </NScrollbar>
          </NTabPane>
        </NTabs>
      </div>
    </NPopover>
  </div>
</template>

<script setup lang="ts">
import {
  NPopover,
  type PopoverTrigger,
  NButton,
  NTabs,
  NTabPane,
  NGrid,
  NGridItem,
  NScrollbar
} from 'naive-ui'
import emojiList from '@/assets/emoji.json'
import {  } from '@tauri-apps/plugin-fs'

defineProps<{
  trigger?: PopoverTrigger
}>()
const emits = defineEmits<{
  (e: 'pick', emoji: string): void
}>()

</script>
<style scoped>
</style>
