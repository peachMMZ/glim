<template>
  <div class="h-full">
    <div class="h-12 flex justify-between items-center px-4" :style="toolbarStyle">
      <div class="flex justify-start items-center gap-x-2">
        <span class="text-lg">Device 1</span>
        <div class="h-3 w-3 rounded-full bg-green-500"></div>
      </div>
      <div>
        <NButton text :render-icon="renderIcon(Ellipsis)"></NButton>
      </div>
    </div>
    <NScrollbar ref="scrollbar" class="max-h-[calc(100%-25px)]">
      <div ref="scrollContent" class="flex flex-col p-2 gap-y-4">
        <Bubble
          v-for="(item, index) in shareSpace.textList"
          :key="index"
          :text="item.text"
          :time="item.time"
          :reversed="item.sendByMe"
        />
      </div>
    </NScrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef, watchEffect, nextTick } from 'vue'
import {
  NScrollbar,
  ScrollbarInst,
  NButton
} from 'naive-ui'
import { useShareSpace } from '@/store/share'
import { useSystemStore } from '@/store/system'
import Bubble from './Bubble.vue'
import { Ellipsis } from 'lucide-vue-next'
import { renderIcon } from '@/util/render'

const shareSpace = useShareSpace()
const systemStore = useSystemStore()
const toolbarStyle = computed(() => ({
  borderBottom: `1px solid ${systemStore.theme === 'light' ? '#E0E0E6' : '#49494C'}`
}))

const scrollbarRef = useTemplateRef<ScrollbarInst>('scrollbar')
const scrollContent = useTemplateRef<HTMLDivElement>('scrollContent')
watchEffect(() => {
  if (scrollbarRef.value && scrollContent.value && shareSpace.textList.length > 0) {
    nextTick(() => {
      scrollbarRef.value?.scrollTo(
        {
          top: scrollContent.value?.clientHeight || 0,
          behavior: 'smooth'
        }
      )
    })
  }
})
</script>
<style scoped></style>
