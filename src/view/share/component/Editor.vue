<template>
  <div class="h-full flex flex-col">
    <div class="h-8 flex justify-between items-center p-x-5 p-y-1">
      <div class="flex justify-start items-center gap-x-4">
        <NButton text :render-icon="renderIcon(Smile, { size: 24 })"></NButton>
        <NButton text :render-icon="renderIcon(Image, { size: 24 })"></NButton>
      </div>
      <div class="flex justify-end items-center gap-x-4">
        <NButton text :render-icon="renderIcon(Clock, { size: 24 })"></NButton>
      </div>
    </div>
    <div class="flex-1 p-x-4" contenteditable="true">

    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NButton
} from 'naive-ui'
import { Smile, Image, Clock } from 'lucide-vue-next'
import { renderIcon } from '@/util/render'
</script>
<style scoped>
[contenteditable] {
  outline: none;
}
</style>
