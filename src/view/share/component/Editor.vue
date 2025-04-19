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
    <div ref="editor" class="flex-1 p-x-4" contenteditable="plaintext-only" @keydown.enter="handleEnter">

    </div>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import {
  NButton
} from 'naive-ui'
import { Smile, Image, Clock } from 'lucide-vue-next'
import { renderIcon } from '@/util/render'
import { useShareSpace } from '@/store/share'

const shareSpace = useShareSpace()

const editor = useTemplateRef('editor')
function handleEnter(event: KeyboardEvent) {
  event.preventDefault()
  const text = editor.value?.textContent
  if (text) {
    shareSpace.sendWsMessage(text)
    editor.value.textContent = ''
  }
}
</script>
<style scoped>
[contenteditable] {
  outline: none;
}
</style>
