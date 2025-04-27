<template>
  <div class="h-full flex flex-col">
    <div class="h-8 flex justify-between items-center p-x-5 p-y-2">
      <div class="flex justify-start items-center gap-x-4">
        <GEmojiPicker trigger="click" @pick="pushEmoji">
          <template #trigger>
            <div class="flex items-center">
              <NButton text :render-icon="renderIcon(Smile, { size: 24 })"></NButton>
            </div>
          </template>
        </GEmojiPicker>
        <NButton text :render-icon="renderIcon(Image, { size: 24 })" @click="sendImage"></NButton>
      </div>
      <div class="flex justify-end items-center gap-x-4">
        <NButton text :render-icon="renderIcon(Clock, { size: 24 })"></NButton>
      </div>
    </div>
    <div class="h-[calc(100%-6rem)] p-x-4">
      <NScrollbar class="h-full" content-class="h-full">
        <div
          ref="editor"
          class="h-full"
          contenteditable="plaintext-only"
          @keydown="handleKeydown"
          @input="handleInput"
        >
        </div>
      </NScrollbar>
    </div>
    <div class="h-8 flex justify-end items-center p-x-5 p-y-2">
      <NButton
        class="text-white"
        type="primary"
        size="small"
        :disabled="sendDisabled"
        :render-icon="renderIcon(Send)"
        @click="send"
      >
        发送
      </NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import {
  NButton,
  NScrollbar
} from 'naive-ui'
import { Smile, Image, Clock, Send } from 'lucide-vue-next'
import { renderIcon } from '@/util/render'
import { useShareSpace } from '@/store/share'
import GEmojiPicker from '@/components/GEmojiPicker.vue'

const shareSpace = useShareSpace()

const editor = useTemplateRef('editor')
function handleKeydown(event: KeyboardEvent) {
  if (event.key == 'Enter') {
    event.preventDefault()
    if (event.altKey) {
      newLine()
    } else {
      send()
    }
  }
}

function newLine() {
  if (!editor.value) return
  editor.value.focus()
  const selection = window.getSelection()
  if (!selection) return
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    const br = document.createElement('br')
    range.deleteContents()
    range.insertNode(br)
    range.setStartAfter(br)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
  }
}

const sendDisabled = ref(true)
function handleInput() {
  const text = editor.value?.textContent
  sendDisabled.value = !text
}
function pushEmoji(emoji: string) {
  if (!editor.value) return
  editor.value.focus()
  const selection = window.getSelection()
  if (!selection || !editor.value) return
  
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    range.deleteContents()
    range.insertNode(document.createTextNode(emoji))
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
    
    // 触发 input 事件以更新发送按钮状态
    editor.value.dispatchEvent(new Event('input'))
  }
  
  // 保持编辑器焦点
  editor.value.focus()
}
function send() {
  const text = editor.value?.textContent
  if (text) {
    shareSpace.sendWsMessage(text)
    editor.value.textContent = ''
  }
  editor.value?.focus()  
}

function sendImage() {
  const filePath = "" // TODO get file path
  shareSpace.sendWsFile(filePath).then(() => {
    console.log("send image success")
  })
}

</script>
<style scoped>
[contenteditable] {
  outline: none;
}
</style>
