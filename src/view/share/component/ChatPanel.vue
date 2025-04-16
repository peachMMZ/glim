<template>
  <div class="h-full">
    <div class="h-1/12 flex justify-between items-center px-4">
      <div>
      </div>
      <div>
        <NButton text :render-icon="renderIcon(Ellipsis)"></NButton>
      </div>
    </div>
    <NScrollbar class="h-11/12">
      <div class="flex flex-col gap-2">
        <Bubble v-for="(item, index) in shareSpace.textDataList" :key="index" :data="item" />
      </div>
    </NScrollbar>
  </div>
</template>

<script setup lang="ts">
import {
  NScrollbar,
  NButton
} from 'naive-ui'
import { useShareSpace } from '@/store/share'
import Bubble from './Bubble.vue'
import { Ellipsis } from 'lucide-vue-next'
import { renderIcon } from '@/util/render'

const shareSpace = useShareSpace()
</script>
<style scoped></style>
